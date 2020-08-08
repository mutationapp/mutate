#!/usr/bin/env node
require('dotenv').config()

const {
  MUTATE_API_URL = 'https://api.mutation.app',
  MUTATE_FILE_PATH = 'reports/mutation/html/bind-mutation-test-report.js',
  MUTATE_REPOSITORY_TOKEN,
  MUTATE_PULL_NUMBER,
  MUTATE_PULL_OWNER,
  INIT_CWD = process.cwd(),
} = process.env

const { mutate } = require('../src')

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
    console.log(error.status, error.message, error.data)
    process.exit(1)
  }
})()
