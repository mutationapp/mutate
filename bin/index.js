#!/usr/bin/env node
const {
  MUTATE_API_URL = 'https://api.mutation.app',
  MUTATE_FILE_PATH = 'reports/mutation/html/bind-mutation-test-report.js',
  MUTATE_REPOSITORY_TOKEN,
  MUTATE_PULL_NUMBER,
  MUTATE_PULL_OWNER,
  MUTATE_LOG_LEVEL = 'debug',
  INIT_CWD = process.cwd(),
} = process.env

const { mutate } = require('../src')
const { somethingWentWrong } = require('../src/shared')

;(async () => {
  try {
    await mutate({
      MUTATE_API_URL,
      MUTATE_FILE_PATH,
      MUTATE_REPOSITORY_TOKEN,
      MUTATE_PULL_NUMBER,
      MUTATE_PULL_OWNER,
      INIT_CWD,
    })
  } catch (error) {
    console.log(
      error.message || somethingWentWrong,
      MUTATE_LOG_LEVEL === 'debug'
        ? error.data
        : `Run with MUTATE_LOG_LEVEL=true to debug`,
    )
    process.exit(error.status === 401 ? 0 : 1)
  }
})()
