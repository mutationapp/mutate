const mutate = require('./mutate')
const { only, mergeDeep } = require('../shared')

const create = async overrides => {
  const { inject, payload } = mergeDeep(
    {
      payload: {
        MUTATE_API_URL: 'MUTATE_API_URL',
        MUTATE_REPOSITORY_TOKEN: 'MUTATE_REPOSITORY_TOKEN',
        MUTATE_PULL_NUMBER: 'MUTATE_PULL_NUMBER',
        MUTATE_PULL_OWNER: 'MUTATE_PULL_OWNER',
        MUTATE_FILE_PATH: 'MUTATE_FILE_PATH',
        INIT_CWD: 'INIT_CWD',
        ...overrides.payload,
      },
      inject: {
        only,
        fetch: jest.fn(async () => ({
          text: async () => 'text',
        })),
        path: {
          join: jest.fn(() => payload.MUTATE_FILE_PATH),
        },
        formData: {
          append: jest.fn(),
          getHeaders: jest.fn(),
        },
        logger: {
          info: jest.fn(),
          error: jest.fn(),
        },
        fs: {
          existsSync: jest.fn(() => true),
          createReadStream: jest.fn(value => `Stream(${value})`),
        },
      },
    },
    overrides,
  )

  await mutate(inject)(payload)

  return {
    inject,
    payload,
  }
}

test.each([
  {
    payload: {
      INIT_CWD: null,
    },
  },
  {
    payload: {
      INIT_CWD: '(▀̿Ĺ̯▀̿ ̿)',
    },
  },
  {
    payload: {
      MUTATE_FILE_PATH: 'NOT_EXIST',
    },
    options: {
      exists: false,
    },
  },
])('Mutates with %o', async overrides => {
  const options = {
    exists: true,
    response: {
      ok: true,
      json: {},
    },
    ...overrides.options,
  }

  const { payload, inject } = await create({
    payload: overrides.payload,
    inject: {
      fetch: jest.fn(async () => ({
        ok: options.response.ok,
        text: async () => JSON.stringify(options.response.json),
      })),
      fs: {
        existsSync: jest.fn(() => options.exists),
      },
    },
  })

  const { path, fs, formData, logger, fetch } = inject

  {
    const nil = only(payload, x => x == null)
    if (nil) {
      expect(logger.error).toHaveBeenCalledWith('REQUIRED:', nil)
      return
    }
  }

  {
    expect(path.join).toHaveBeenCalledWith(
      payload.INIT_CWD,
      payload.MUTATE_FILE_PATH,
    )

    if (!options.exists) {
      expect(logger.info).toHaveBeenCalledWith(
        'NO REPORT FILE FOUND IN DIRECTORY:',
        {
          MUTATE_FILE_PATH: payload.MUTATE_FILE_PATH,
        },
      )

      return
    }
  }

  {
    expect(fs.existsSync).toHaveBeenCalledWith(payload.MUTATE_FILE_PATH)
    ;[
      ['repositoryToken', payload.MUTATE_REPOSITORY_TOKEN],
      ['pullNumber', payload.MUTATE_PULL_NUMBER],
      ['pullOwner', payload.MUTATE_PULL_OWNER],
      ['escape', payload.INIT_CWD + '/'],
      ['file', `Stream(${payload.MUTATE_FILE_PATH})`],
    ].forEach(([key, value]) => {
      expect(formData.append).toHaveBeenCalledWith(key, value)
    })
  }

  {
    await expect(fetch).toHaveBeenCalledWith(payload.MUTATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    })

    expect(logger.info).toHaveBeenCalledWith('RESPONSE:', options.response.json)
  }
})
