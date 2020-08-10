const getMutationCandidates = require('./getMutationCandidates')

const { shared, defaultsDeep, STRATEGY } = require('../shared')

const getOptions = overrides =>
  defaultsDeep(overrides, {
    inject: {
      toPagedList: jest.fn(() => m => m),
      getInitialFiles: jest.fn(),
      logger: {
        info: jest.fn(),
      },
      toMutation: jest.fn(),
    },
    payload: {
      MUTATE_STRATEGY: STRATEGY.all,
      MUTATE_SEARCH: undefined,
    },
  })

test.each([
  {
    payload: {
      MUTATE_SKIP: 1,
      MUTATE_MAX: 200,
    },
    options: {
      files: null,
    },
  },
  {
    payload: {
      MUTATE_SKIP: 0,
      MUTATE_MAX: 20,
    },
    options: {
      files: {
        'a.js': ['a.test.js', 'a.snapshot.js'],
        'b.js': [],
        'c.ts': ['c.test.ts'],
        'd.png': ['d.test.png'],
      },
    },
  },
])('getMutationCandidates', ({ options, ...overrides }) => {
  const { files } = options

  const initialFiles = files ? Object.keys(files) : undefined

  const { inject, payload } = getOptions({
    ...overrides,
    inject: {
      getInitialFiles: jest.fn(() => initialFiles),
      toMutation: jest.fn(value => ({
        [value]: files[value],
      })),
    },
  })

  const {
    MUTATE_BRANCH = 'master',
    MUTATE_STRATEGY,
    MUTATE_MAX,
    MUTATE_SKIP,
    MUTATE_SEARCH,
  } = payload

  const defaults = {
    page: parseInt(MUTATE_SKIP) + 1,
    size: parseInt(MUTATE_MAX),
    search: MUTATE_SEARCH,
    mutate: [],
    files: [],
  }

  const result = shared(getMutationCandidates)(inject)(payload)

  const { getInitialFiles, logger, toPagedList } = inject

  expect(logger.info).toHaveBeenCalledWith('MUTATION OPTIONS:\n', {
    MUTATE_BRANCH,
    MUTATE_STRATEGY,
    MUTATE_MAX,
    MUTATE_SKIP,
  })

  expect(getInitialFiles).toHaveBeenCalledWith({
    branch: MUTATE_BRANCH,
    strategy: MUTATE_STRATEGY,
  })

  if (!initialFiles) {
    return expect(result).toEqual(defaults)
  }

  expect(toPagedList).toHaveBeenCalledWith({
    size: defaults.size,
    page: defaults.page,
  })

  expect({ result, files }).toMatchSnapshot()
})
