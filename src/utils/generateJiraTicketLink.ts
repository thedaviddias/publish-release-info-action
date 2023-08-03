/**
 * Generates a JIRA ticket link by combining the ticket number with the JIRA instance URL.
 *
 * @param {string} ticketNumber - The JIRA ticket number.
 * @param {string} instanceUrl - The URL of the JIRA instance.
 * @returns {string} The link to the JIRA ticket.
 */
export function generateJiraTicketLink(
  ticketNumber: string,
  instanceUrl: string
): string {

  // Ensure instanceUrl ends with a slash
  const formattedInstanceUrl = instanceUrl.endsWith('/')
    ? instanceUrl
    : `${instanceUrl}/`
  return `${formattedInstanceUrl}${ticketNumber}`
}
