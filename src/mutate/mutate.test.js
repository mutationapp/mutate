const injectMutate = require('./mutate')
const { shared, defaultsDeep, only, ApiError } = require('../shared')

const mutate = async overrides => {
  const { inject, payload } = defaultsDeep(overrides, {
    payload: {
      MUTATE_API_URL: 'MUTATE_API_URL',
      MUTATE_REPOSITORY_TOKEN: 'MUTATE_REPOSITORY_TOKEN',
      MUTATE_PULL_NUMBER: 'MUTATE_PULL_NUMBER',
      MUTATE_PULL_OWNER: 'MUTATE_PULL_OWNER',
      MUTATE_FILE_PATH: 'MUTATE_FILE_PATH',
      INIT_CWD: 'INIT_CWD',
    },
    inject: {
      process: {
        exit: jest.fn(),
      },
      fetcher: jest.fn(async () => ({})),
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
  })

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
  },
  {
    options: {
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    },
  },
  {
    options: {
      response: {
        status: 403,
        data: { error: 'Forbidden' },
      },
    },
  },
  {
    payload: {
      MUTATE_FILE_PATH: 'NOT_EXIST',
    },
  },
])('Mutates with %o', async overrides => {
  const options = defaultsDeep(overrides.options, {
    response: {
      status: 200,
      data: {
        info: 'info',
        url: 'url',
      },
    },
  })

  const { status, data } = options.response
  const { error } = data

  const exists = (overrides.payload || {}).MUTATE_FILE_PATH !== 'NOT_EXIST'

  const { payload, inject } = await mutate({
    payload: overrides.payload,
    inject: {
      fetcher: jest.fn(async () => {
        if (error) {
          throw new ApiError(status, error, data)
        }

        return data
      }),
      fs: {
        existsSync: jest.fn(() => exists),
      },
    },
  })

  const {
    path,
    fs,
    formData,
    logger,
    fetcher,
    process: { exit },
  } = inject

  {
    const nil = only(payload, x => x == null)
    if (nil) {
      expect(logger.error).toHaveBeenCalledWith('REQUIRED:', nil)
      return expect(exit).toHaveBeenCalledWith(1)
    }
  }

  const {
    MUTATE_FILE_PATH,
    INIT_CWD,
    MUTATE_REPOSITORY_TOKEN,
    MUTATE_PULL_NUMBER,
    MUTATE_PULL_OWNER,
    MUTATE_API_URL,
  } = payload

  {
    expect(path.join).toHaveBeenCalledWith(INIT_CWD, MUTATE_FILE_PATH)

    if (!exists) {
      expect(logger.info).toHaveBeenCalledWith(
        'NO REPORT FILE FOUND IN DIRECTORY:',
        {
          MUTATE_FILE_PATH,
        },
      )
      return expect(exit).toHaveBeenCalledWith(1)
    }
  }

  {
    expect(fs.existsSync).toHaveBeenCalledWith(MUTATE_FILE_PATH)
    ;[
      ['repositoryToken', MUTATE_REPOSITORY_TOKEN],
      ['pullNumber', MUTATE_PULL_NUMBER],
      ['pullOwner', MUTATE_PULL_OWNER],
      ['escape', INIT_CWD + '/'],
      ['file', `Stream(${MUTATE_FILE_PATH})`],
    ].forEach(([key, value]) => {
      expect(formData.append).toHaveBeenCalledWith(key, value)
    })
  }

  expect(formData.getHeaders).toHaveBeenCalledTimes(1)

  {
    await expect(fetcher).toHaveBeenCalledWith(MUTATE_API_URL, {
      method: 'POST',
      headers: {},
      body: formData,
    })

    if (error) {
      expect(logger.error).toHaveBeenCalledWith(status, error, data)
      return expect(exit).toHaveBeenCalledWith(status === 401 ? 0 : 1)
    }

    expect(logger.info).toHaveBeenCalledWith(data.info, data.url)
  }
})
