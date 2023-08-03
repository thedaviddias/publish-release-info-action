import { appendBrowseToUrl } from '../appendBrowseToUrl'

describe('appendBrowseToUrl', () => {
  it('should append /browse/ to url without trailing slash', () => {
    const url = 'http://jira.example.com'
    const expected = 'http://jira.example.com/browse/'
    const result = appendBrowseToUrl(url)
    expect(result).toEqual(expected)
  })

  it('should append /browse/ to url with trailing slash', () => {
    const url = 'http://jira.example.com/'
    const expected = 'http://jira.example.com/browse/'
    const result = appendBrowseToUrl(url)
    expect(result).toEqual(expected)
  })

  it('should return empty string when given an empty string', () => {
    const url = ''
    const expected = ''
    const result = appendBrowseToUrl(url)
    expect(result).toEqual(expected)
  })
})
