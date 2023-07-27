import { parseTicketNumberFromTitle } from '../parseTicketNumberFromTitle'

describe('parseTicketNumberFromTitle', () => {
  it('should parse the JIRA ticket number from the title with the specified prefix', () => {
    const title = 'Fix issue ABC-123: Some bug'
    const prefix = 'ABC'
    const ticketNumber = parseTicketNumberFromTitle(title, prefix)
    expect(ticketNumber).toEqual('ABC-123')
  })

  it('should retunr null if the prefix format is wrong', () => {
    const title = 'Fix issue ABC-123: Some bug'
    const prefix = 'ABC-'
    const ticketNumber = parseTicketNumberFromTitle(title, prefix)
    expect(ticketNumber).toBeNull()
  })

  it('should return null if the JIRA ticket number is not found in the title', () => {
    const title = 'Update documentation'
    const prefix = 'ABC-'
    const ticketNumber = parseTicketNumberFromTitle(title, prefix)
    expect(ticketNumber).toBeNull()
  })
})
