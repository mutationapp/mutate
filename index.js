const { mutate } = require('./src')
const { somethingWentWrong, dealWithIt } = require('./src/shared')

require('dotenv').config()

const {
  MUTATE_API_URL = 'https://mutationapi.herokuapp.com',
  MUTATE_FILE_PATH = 'reports/mutation/html/bind-mutation-test-report.js',
  MUTATE_REPOSITORY_TOKEN,
  MUTATE_PULL_NUMBER,
  MUTATE_PULL_OWNER,
  INIT_CWD,
} = process.env

;(async () => {
  try {
    await mutate({
      MUTATE_API_URL,
      MUTATE_FILE_PATH,
      MUTATE_REPOSITORY_TOKEN,
      MUTATE_PULL_NUMBER,
      MUTATE_PULL_OWNER,
      INIT_CWD,
      logger: console,
    })
  } catch (error) {
    console.log(dealWithIt(somethingWentWrong), { error })
  }
})()
