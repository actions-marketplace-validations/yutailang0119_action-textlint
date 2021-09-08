import * as core from '@actions/core'
import {TextlintResult} from '@textlint/types/src/Message/TextlintResult'
import {Annotation} from './annotation'

export const parseReport = async (json: string): Promise<Annotation[]> => {
  const files: TextlintResult[] = JSON.parse(json)
  return new Promise(resolve => {
    try {
      const annotations: Annotation[] = []
      for (const file of files) {
        for (const message of file.messages) {
          const annotation = new Annotation(
            message.severity,
            `${message.message} (${message.ruleId})`,
            file.filePath,
            message.line,
            message.column
          )
          annotations.push(annotation)
        }
      }
      resolve(annotations)
    } catch (error) {
      core.debug(`failed to read ${error}`)
    }
  })
}
