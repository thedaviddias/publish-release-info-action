/**
 * Generate a pull request list string.
 *
 * @param {Array<{contributor: string, prTitle: string, prUrl: string, prNumber: number}>} contributorsCommits - List of contributors and their commits.
 * @param {string} jiraTicketPrefix - Prefix for JIRA ticket, e.g., 'ABC'.
 * @param {string} jiraInstanceUrl - URL for the JIRA instance, e.g., 'https://your-jira-instance.com/browse'.
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
  jiraInstanceUrl: string
): string {
  let prListString = ''

  contributorsCommits.forEach((item) => {
    const jiraTicketPattern = new RegExp(
      `${jiraTicketPrefix}-\\d+|${jiraTicketPrefix}\\d+`,
      'g'
    )
    const ticketNumbers = item.prTitle.match(jiraTicketPattern) || []
    let prTitleWithTicketLink = item.prTitle

    // Replace each JIRA ticket number with a link to the JIRA ticket
    if (jiraInstanceUrl) {
      ticketNumbers.forEach((ticketNumber) => {
        // Normalize the ticket number to have the format 'ABC-123'
        const normalizedTicketNumber = ticketNumber.includes('-')
          ? ticketNumber
          : `${jiraTicketPrefix}-${ticketNumber}`
        const jiraTicketLink = `${jiraInstanceUrl}${normalizedTicketNumber}`
        prTitleWithTicketLink = prTitleWithTicketLink.replace(
          ticketNumber,
          `<${jiraTicketLink}|${normalizedTicketNumber}>`
        )
      })
    }

    prListString += `- ${prTitleWithTicketLink} by @${item.contributor} in <${item.prUrl}|#${item.prNumber}>  \n`
  })

  return prListString
}
