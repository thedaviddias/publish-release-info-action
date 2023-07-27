import {
  MOCK_REPO_LINK,
  MOCK_RELEASE_VERSION,
  MOCK_RELEASE_LINK,
} from './__mocks__/testData'
import { generateReleaseLink } from '../generateReleaseLink'

describe('generateReleaseLink', () => {
  it('should generate a correct release link', () => {
    const result = generateReleaseLink(MOCK_REPO_LINK, MOCK_RELEASE_VERSION)

    expect(result).toBe(MOCK_RELEASE_LINK)
  })
})
