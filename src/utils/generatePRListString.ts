import { replaceContributorName } from './replaceContributorName'
import { replaceJiraTicketLinks } from './replaceJiraTicketLinks'

/**
 * Generate a pull request list string.
 *
 * @param {Array<{contributor: string, prTitle: string, prUrl: string, prNumber: number}>} contributorsCommits - List of contributors and their commits.
 * @param {string} jiraTicketPrefix - Prefix for JIRA ticket, e.g., 'ABC'.
 * @param {string} jiraInstanceUrl - URL for the JIRA instance, e.g., 'https://your-jira-instance.com/browse'.
 * @param {string} [contributorReplaceChar='-'] - Optional character to replace in the contributor name.
 * @param {string} [contributorReplaceRegex='.'] - Optional regex pattern to identify characters to be replaced in the contributor name.
 * @returns {string} The pull request list string.
 */
export function generatePRListString(
  contributorsCommits: Array<{
    contributor: string
    prTitle: string
    prUrl: string
    prNumber: number
  }>,
  jiraTicketPrefix: string,
  jiraInstanceUrl: string,
  contributorReplaceChar = '.',
  contributorReplaceRegex = '-'
): string {
  const prListStringParts: string[] = []

  contributorsCommits.forEach((item) => {
    const contributorName = replaceContributorName(
      item.contributor,
      contributorReplaceChar,
      contributorReplaceRegex
    )
    const prTitleWithTicketLink = replaceJiraTicketLinks(
      item.prTitle,
      jiraTicketPrefix,
      jiraInstanceUrl
    )

    const prListEntry = `- ${prTitleWithTicketLink} by @${contributorName} in <${item.prUrl}|#${item.prNumber}>  \n`
    prListStringParts.push(prListEntry)
  })

  return prListStringParts.join('')
}
