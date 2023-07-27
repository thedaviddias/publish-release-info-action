import { replaceContributorName } from '../replaceContributorName'

describe('replaceContributorName', () => {
  it('should replace dashes with dots in the contributor name', () => {
    const contributor = 'people-one'
    const contributorReplaceChar = '.'
    const contributorReplaceRegex = '-'

    const updatedContributor = replaceContributorName(
      contributor,
      contributorReplaceChar,
      contributorReplaceRegex
    )

    const expectedContributor = 'people.one'
    expect(updatedContributor).toEqual(expectedContributor)
  })

  it('should replace using the provided regex pattern in the contributor name', () => {
    const contributor = 'people!one'
    const contributorReplaceChar = '-'
    const contributorReplaceRegex = '!'

    const updatedContributor = replaceContributorName(
      contributor,
      contributorReplaceChar,
      contributorReplaceRegex
    )

    const expectedContributor = 'people-one'
    expect(updatedContributor).toEqual(expectedContributor)
  })

  it('should only replace dashes in the contributor name if regex pattern is not provided', () => {
    const contributor = 'people-one'
    const contributorReplaceChar = '.'
    const contributorReplaceRegex = ''

    const updatedContributor = replaceContributorName(
      contributor,
      contributorReplaceChar,
      contributorReplaceRegex
    )

    const expectedContributor = 'people.one'
    expect(updatedContributor).toEqual(expectedContributor)
  })

  it('should not replace any characters if neither replace char nor regex pattern is provided', () => {
    const contributor = 'people-one'
    const contributorReplaceChar = ''
    const contributorReplaceRegex = ''

    const updatedContributor = replaceContributorName(
      contributor,
      contributorReplaceChar,
      contributorReplaceRegex
    )

    const expectedContributor = 'people-one'
    expect(updatedContributor).toEqual(expectedContributor)
  })
})
