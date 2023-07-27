import * as github from '@actions/github'
import { getBaseUrlFromContext } from '../getBaseUrlFromContext'
import {
  MOCK_BASE_URL,
  MOCK_OWNER,
  MOCK_REPO,
  MOCK_REPO_LINK,
} from './__mocks__/testData'

jest.mock('@actions/github', () => ({
  context: {
    payload: {},
  },
}))

describe('getBaseUrlFromContext', () => {
  it('should return the base URL from context', () => {
    github.context.payload = {
      repository: {
        name: MOCK_REPO,
        owner: {
          login: MOCK_OWNER,
        },
        html_url: MOCK_REPO_LINK,
      },
    }

    const expectedBaseUrl = MOCK_BASE_URL
    const result = getBaseUrlFromContext()

    expect(result).toBe(expectedBaseUrl)
  })

  it('should return an empty string if repository html_url is not available', () => {
    github.context.payload = {}

    const expectedBaseUrl = ''
    const result = getBaseUrlFromContext()

    expect(result).toBe(expectedBaseUrl)
  })
})
