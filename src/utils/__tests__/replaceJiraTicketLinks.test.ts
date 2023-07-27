import { replaceJiraTicketLinks } from '../replaceJiraTicketLinks'

describe('replaceJiraTicketLinks', () => {
  it('should replace JIRA ticket numbers with links in the PR title', () => {
    const prTitle = 'Fixing bug ABC-123 and adding feature ABC-456'
    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const updatedTitle = replaceJiraTicketLinks(
      prTitle,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const expectedTitle =
      'Fixing bug <https://your-jira-instance.com/ABC-123|ABC-123> and adding feature <https://your-jira-instance.com/ABC-456|ABC-456>'
    expect(updatedTitle).toEqual(expectedTitle)
  })

  it('should handle PR title without JIRA ticket references', () => {
    const prTitle = 'This is a regular PR title without any JIRA ticket references'
    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const updatedTitle = replaceJiraTicketLinks(
      prTitle,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    expect(updatedTitle).toEqual(prTitle)
  })

  it('should handle PR title with JIRA ticket references without jiraInstanceUrl', () => {
    const prTitle = 'Fixing bug ABC-123 and adding feature ABC-456'
    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = '' // Empty string for jiraInstanceUrl

    const updatedTitle = replaceJiraTicketLinks(
      prTitle,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    expect(updatedTitle).toEqual(prTitle)
  })

  it('should handle missing jiraTicketPrefix', () => {
    const prTitle = 'Fixing bug ABC-123 and adding feature ABC-456'
    const jiraTicketPrefix = ''
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const updatedTitle = replaceJiraTicketLinks(
      prTitle,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    expect(updatedTitle).toEqual(prTitle)
  })
})
