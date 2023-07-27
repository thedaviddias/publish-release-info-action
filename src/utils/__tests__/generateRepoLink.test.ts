import { generateRepoLink } from '../generateRepoLink'

describe('generateRepoLink', () => {
  it('should generate a correct repo link', () => {
    const baseUrl = 'https://github.com'
    const owner = 'user'
    const repo = 'repo'
    const expectedLink = 'https://github.com/user/repo'

    const result = generateRepoLink(baseUrl, owner, repo)

    expect(result).toBe(expectedLink)
  })
})
