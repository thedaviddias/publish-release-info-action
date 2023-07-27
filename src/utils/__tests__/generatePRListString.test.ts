import { generatePRListString } from '../generatePRListString'

describe('generatePRListString', () => {
  it('should generate a proper PR list string', () => {
    const contributorsCommits = [
      {
        contributor: 'contributor1',
        prTitle: 'PR title 1 (ABC-123)',
        prUrl: 'https://github.com/owner/repo/pull/1',
        prNumber: 1,
      },
      {
        contributor: 'contributor2',
        prTitle: 'PR title 2 ABC-456',
        prUrl: 'https://github.com/owner/repo/pull/2',
        prNumber: 2,
      },
    ]

    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const prListString = generatePRListString(
      contributorsCommits,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const expectedPrListString =
      '- PR title 1 (<https://your-jira-instance.com/ABC-123|ABC-123>) by @contributor1 in <https://github.com/owner/repo/pull/1|#1>  \n' +
      '- PR title 2 <https://your-jira-instance.com/ABC-456|ABC-456> by @contributor2 in <https://github.com/owner/repo/pull/2|#2>  \n'

    expect(prListString).toEqual(expectedPrListString)
  })

  it('should handle PR list without JIRA ticket references', () => {
    const contributorsCommits = [
      {
        contributor: 'contributor1',
        prTitle: 'PR title without JIRA ticket reference',
        prUrl: 'https://github.com/owner/repo/pull/3',
        prNumber: 3,
      },
      {
        contributor: 'contributor2',
        prTitle: 'Another PR without JIRA ticket reference',
        prUrl: 'https://github.com/owner/repo/pull/4',
        prNumber: 4,
      },
    ]

    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const prListString = generatePRListString(
      contributorsCommits,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const expectedPrListString =
      '- PR title without JIRA ticket reference by @contributor1 in <https://github.com/owner/repo/pull/3|#3>  \n' +
      '- Another PR without JIRA ticket reference by @contributor2 in <https://github.com/owner/repo/pull/4|#4>  \n'

    expect(prListString).toEqual(expectedPrListString)
  })

  it('should handle PR list with JIRA ticket references without prefix', () => {
    const contributorsCommits = [
      {
        contributor: 'contributor1',
        prTitle: 'PR title (123)',
        prUrl: 'https://github.com/owner/repo/pull/5',
        prNumber: 5,
      },
      {
        contributor: 'contributor2',
        prTitle: 'Another PR 789',
        prUrl: 'https://github.com/owner/repo/pull/6',
        prNumber: 6,
      },
    ]

    const jiraTicketPrefix = 'ABC'
    const jiraInstanceUrl = 'https://your-jira-instance.com/'

    const prListString = generatePRListString(
      contributorsCommits,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const expectedPrListString =
      '- PR title (123) by @contributor1 in <https://github.com/owner/repo/pull/5|#5>  \n' +
      '- Another PR 789 by @contributor2 in <https://github.com/owner/repo/pull/6|#6>  \n'

    expect(prListString).toEqual(expectedPrListString)
  })

  it('should handle PR list with JIRA ticket references and without prefix and jiraInstanceUrl', () => {
    const contributorsCommits = [
      {
        contributor: 'contributor1',
        prTitle: 'PR title (123)',
        prUrl: 'https://github.com/owner/repo/pull/5',
        prNumber: 5,
      },
      {
        contributor: 'contributor2',
        prTitle: 'Another PR 789',
        prUrl: 'https://github.com/owner/repo/pull/6',
        prNumber: 6,
      },
    ]

    const jiraTicketPrefix = ''
    const jiraInstanceUrl = '' // Empty string for jiraInstanceUrl

    const prListString = generatePRListString(
      contributorsCommits,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const expectedPrListString =
      '- PR title (123) by @contributor1 in <https://github.com/owner/repo/pull/5|#5>  \n' +
      '- Another PR 789 by @contributor2 in <https://github.com/owner/repo/pull/6|#6>  \n'

    expect(prListString).toEqual(expectedPrListString)
  })
})
