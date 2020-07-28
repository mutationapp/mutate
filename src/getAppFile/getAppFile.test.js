const injectGetAppFile = require('./getAppFile')
const { shared } = require('../shared')

test.each([{ fileName: 'fileName', originalFileName: 'originalFileName' }])(
  'getAppFile: %o',
  ({ fileName, originalFileName }) => {
    const inject = {
      getOriginalFileName: jest.fn(() => originalFileName),
      getFileName: jest.fn(() => fileName),
    }

    const getAppFile = shared(injectGetAppFile)(inject)

    expect(getAppFile(fileName)).toBe(originalFileName)

    expect(inject.getFileName).toHaveBeenCalledWith(fileName)
    expect(inject.getOriginalFileName).toHaveBeenCalledWith(fileName)
  },
)
