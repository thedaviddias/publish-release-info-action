import { generateJiraTicketLink } from '../generateJiraTicketLink'

describe('generateJiraTicketLink', () => {
  it('should generate the JIRA ticket link with the ticket number and instance URL', () => {
    const ticketNumber = 'ABC-123'
    const instanceUrl = 'https://your-jira-instance.com/browse'
    const expectedLink = 'https://your-jira-instance.com/browse/ABC-123'

    expect(generateJiraTicketLink(ticketNumber, instanceUrl)).toEqual(expectedLink)
  })

  it('should handle instance URL with a trailing slash', () => {
    const ticketNumber = 'ABC-456'
    const instanceUrl = 'https://your-jira-instance.com/browse/'
    const expectedLink = 'https://your-jira-instance.com/browse/ABC-456'

    expect(generateJiraTicketLink(ticketNumber, instanceUrl)).toEqual(expectedLink)
  })

  it('should handle instance URL without a trailing slash', () => {
    const ticketNumber = 'ABC-789'
    const instanceUrl = 'https://your-jira-instance.com'
    const expectedLink = 'https://your-jira-instance.com/ABC-789'

    expect(generateJiraTicketLink(ticketNumber, instanceUrl)).toEqual(expectedLink)
  })
})
