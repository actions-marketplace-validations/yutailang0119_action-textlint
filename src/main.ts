import fs from 'fs'
import * as core from '@actions/core'
import {echoMessages} from './command'
import {parseReport} from './parser'

async function run(): Promise<void> {
  try {
    let json: string
    const textlintOutput = core.getInput('textlint_output', {required: false})
    if (textlintOutput === '') {
      const jsonPath = core.getInput('json_path', {required: false})
      json = fs.readFileSync(jsonPath, 'utf-8')
    } else {
      json = textlintOutput
    }
    const annotations = parseReport(json)
    echoMessages(annotations)

    const errors = annotations.filter(annotation => {
      return annotation.severityLevel === 'error'
    })
    if (errors.length) {
      throw Error('There are errors via textlint')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
