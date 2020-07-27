const injectMutate = require('./mutate')
const { shared, mergeDeep, only } = require('../shared')

const mutate = async overrides => {
  const { inject, payload } = mergeDeep(
    {
      payload: {
        MUTATE_API_URL: 'MUTATE_API_URL',
        MUTATE_REPOSITORY_TOKEN: 'MUTATE_REPOSITORY_TOKEN',
        MUTATE_PULL_NUMBER: 'MUTATE_PULL_NUMBER',
        MUTATE_PULL_OWNER: 'MUTATE_PULL_OWNER',
        MUTATE_FILE_PATH: 'MUTATE_FILE_PATH',
        INIT_CWD: 'INIT_CWD',
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

  await shared(injectMutate)(inject)(payload)

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
    options: {
      response: {
        ok: false,
        status: 401,
        text: JSON.stringify({ error: 'Something went wrong' }),
      },
    },
  },
  {
    payload: {
      INIT_CWD: '(▀̿Ĺ̯▀̿ ̿)',
    },
    options: {
      response: {
        text: 'invalid',
      },
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
  const options = mergeDeep(
    {
      exists: true,
      response: {
        status: 200,
        error: undefined,
        ok: true,
        text: JSON.stringify({
          info: 'info',
          url: 'url',
        }),
      },
    },
    overrides.options,
  )

  const { ok, status, text } = options.response

  const { payload, inject } = await mutate({
    payload: overrides.payload,
    inject: {
      fetch: jest.fn(async () => ({
        status,
        ok,
        text: async () => text,
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

    const json = (() => {
      try {
        return JSON.parse(text)
      } catch (error) {}
    })()

    if (!json) {
      expect(logger.error).toHaveBeenCalledWith('RESPONSE IS INVALID:', {
        result: json,
      })

      return
    }

    ok
      ? expect(logger.info).toHaveBeenCalledWith(
          'RESPONSE:',
          json.info,
          json.url,
        )
      : expect(logger.error).toHaveBeenCalledWith(status, json.error)
  }
})
