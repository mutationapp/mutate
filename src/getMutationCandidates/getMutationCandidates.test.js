const getMutationCandidates = require('./getMutationCandidates')

const {
  MATCH,
  STRATEGY,
  withMatch,
  withSearch,
  mergeDeep,
} = require('../shared')

const getOptions = overrides =>
  mergeDeep(
    {
      inject: {
        toPagedList: jest.fn(() => m => m),
        withMatch,
        withSearch,
        getInitialFiles: jest.fn(),
        logger: {
          info: jest.fn(),
        },
        MATCH,
        toMutation: jest.fn(),
        STRATEGY,
      },
      payload: {
        MUTATE_STRATEGY: STRATEGY.all,
      },
    },
    overrides,
    val => val === null,
  )

test.each([
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

  const initialFiles = Object.keys(files) || []

  const { inject, payload } = getOptions({
    ...overrides,
    inject: {
      getInitialFiles: jest.fn(() => initialFiles),
      toMutation: jest.fn(value => ({
        [value]: files[value],
      })),
    },
  })

  const { MUTATE_BRANCH, MUTATE_STRATEGY, MUTATE_MAX, MUTATE_SKIP } = payload

  const result = getMutationCandidates(inject)(payload)

  const { getInitialFiles, logger, toPagedList } = inject

  expect(logger.info).toHaveBeenCalledWith('MUTATION OPTIONS:\n', payload)
  expect(getInitialFiles).toHaveBeenCalledWith({
    branch: MUTATE_BRANCH || 'master',
    strategy: MUTATE_STRATEGY,
  })

  expect(toPagedList).toHaveBeenCalledWith({
    size: MUTATE_MAX,
    page: parseInt(MUTATE_SKIP) + 1,
  })

  expect({ result, files }).toMatchSnapshot()
})
// })
