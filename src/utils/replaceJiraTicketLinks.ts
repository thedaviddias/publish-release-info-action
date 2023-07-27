/**
 * Replace JIRA ticket numbers in the PR title with JIRA ticket links.
 *
 * @param {string} prTitle - The pull request title.
 * @param {string} jiraTicketPrefix - The prefix for JIRA ticket, e.g., 'ABC'.
 * @param {string} jiraInstanceUrl - The URL for the JIRA instance, e.g., 'https://your-jira-instance.com/browse'.
 * @returns {string} The PR title with JIRA ticket links.
 */
export function replaceJiraTicketLinks(
  prTitle: string,
  jiraTicketPrefix: string,
  jiraInstanceUrl: string
): string {
  const jiraTicketPattern = new RegExp(
    `${jiraTicketPrefix}-\\d+|${jiraTicketPrefix}\\d+`,
    'g'
  )
  const ticketNumbers = prTitle.match(jiraTicketPattern) || []

  let prTitleWithTicketLink = prTitle

  if (jiraInstanceUrl && jiraTicketPrefix) {
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

  return prTitleWithTicketLink
}
