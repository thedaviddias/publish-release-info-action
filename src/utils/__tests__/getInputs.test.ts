import { getInputs, GetInputsType } from '../getInputs'
import * as core from '@actions/core'

describe('getInputs', () => {
  it('returns input options and logs warning for invalid input', () => {
    const mockGetInput = jest.spyOn(core, 'getInput')
    mockGetInput.mockImplementation((name) => {
      switch (name) {
        case 'repo':
          return 'my-repo' // Note: this is not a valid repo input in the format 'string/string'
        case 'grafana_dashboard_link':
          return 'my-dashboard-link' // Note: this is not a valid URL
        case 'sentry_project_name':
          return 'my-project-name'
        case 'sentry_project_id':
          return 'invalid-project-id' // Note: this is not a valid numeric ID
        case 'slack_webhook_urls':
          return 'invalid-webhook-url' // Note: this is not a valid URL that starts with 'https://hooks.slack.com'
        case 'jira_instance_url':
          return 'invalid-jira-ticket-link' // Note: this is not a valid URL
        case 'jira_ticket_prefix':
          return 'ABC' // Note: this is a valid prefix
        case 'contributor_replace_char':
          return '.'
        case 'contributor_replace_regex':
          return '-'
        case 'tag_regex':
          return 'my-tag-regex'
        case 'time_zone_offset':
          return 'GTM-0'
        default:
          return ''
      }
    })

    const mockWarning = jest.spyOn(core, 'warning')
    mockWarning.mockImplementation(() => {}) // prevent actual console output during testing

    const expectedInputs: GetInputsType = {
      repo: 'my-repo',
      grafanaDashboardLink: 'my-dashboard-link',
      sentryProjectName: 'my-project-name',
      sentryProjectId: 'invalid-project-id',
      slackWebhookUrls: 'invalid-webhook-url',
      jiraInstanceUrl: 'invalid-jira-ticket-link/browse/',
      jiraTicketPrefix: 'ABC',
      contributorReplaceChar: '.',
      contributorReplaceRegex: '-',
      tagRegex: 'my-tag-regex',
      timeZoneOffset: '0',
    }

    expect(getInputs()).toEqual(expectedInputs)
    expect(core.getInput).toHaveBeenCalledWith('repo')
    expect(core.getInput).toHaveBeenCalledWith('grafana_dashboard_link')
    expect(core.getInput).toHaveBeenCalledWith('sentry_project_name')
    expect(core.getInput).toHaveBeenCalledWith('sentry_project_id')
    expect(core.getInput).toHaveBeenCalledWith('slack_webhook_urls')
    expect(core.getInput).toHaveBeenCalledWith('jira_instance_url')
    expect(core.getInput).toHaveBeenCalledWith('jira_ticket_prefix')
    expect(core.getInput).toHaveBeenCalledWith('tag_regex')
    expect(core.getInput).toHaveBeenCalledWith('time_zone_offset')
    expect(core.warning).toHaveBeenCalledWith(
      "Invalid time zone offset: GTM-0. It should be a numerical value representing minutes from UTC. Positive for timezones ahead of UTC, negative for those behind. Defaulting to '0' (UTC)."
    )
    expect(core.warning).toHaveBeenCalledWith(
      "Invalid repository format: my-repo. It should be in 'owner/repo' format."
    )
    expect(core.warning).toHaveBeenCalledWith(
      'Invalid Grafana dashboard link: my-dashboard-link'
    )
    expect(core.warning).toHaveBeenCalledWith(
      'Invalid Sentry project ID: invalid-project-id. It should be a number.'
    )
    expect(core.warning).toHaveBeenCalledWith(
      'Invalid Slack webhook URL: invalid-webhook-url'
    )

    mockGetInput.mockRestore()
    mockWarning.mockRestore()
  })

  it('returns input options and does not log any warning for valid input', () => {
    const mockGetInput = jest.spyOn(core, 'getInput')
    mockGetInput.mockImplementation((name) => {
      switch (name) {
        case 'repo':
          return 'myowner/my-repo'
        case 'grafana_dashboard_link':
          return 'https://grafana.com/dashboards/my-dashboard-link'
        case 'sentry_project_name':
          return 'my-project-name'
        case 'sentry_project_id':
          return '1234'
        case 'slack_webhook_urls':
          return 'https://hooks.slack.com/services/XXXX/XXXX/XXXX,https://hooks.slack.com/services/XXXX/XXXX/XXXX'
        case 'jira_instance_url':
          return 'https://example.atlassian.net' // Note: this is a valid URL
        case 'jira_ticket_prefix':
          return 'ABC' // Note: this is a valid prefix
        case 'contributor_replace_char':
          return '.'
        case 'contributor_replace_regex':
          return '-'
        case 'tag_regex':
          return '^v[0-9]+\\.[0-9]+\\.[0-9]+$'
        case 'time_zone_offset':
          return '0'
        default:
          return ''
      }
    })

    const mockWarning = jest.spyOn(core, 'warning')
    mockWarning.mockImplementation(() => {}) // prevent actual console output during testing

    const expectedInputs: GetInputsType = {
      repo: 'myowner/my-repo',
      grafanaDashboardLink: 'https://grafana.com/dashboards/my-dashboard-link',
      sentryProjectName: 'my-project-name',
      sentryProjectId: '1234',
      slackWebhookUrls:
        'https://hooks.slack.com/services/XXXX/XXXX/XXXX,https://hooks.slack.com/services/XXXX/XXXX/XXXX',
      jiraInstanceUrl: 'https://example.atlassian.net/browse/',
      jiraTicketPrefix: 'ABC',
      contributorReplaceChar: '.',
      contributorReplaceRegex: '-',
      tagRegex: '^v[0-9]+\\.[0-9]+\\.[0-9]+$',
      timeZoneOffset: '0',
    }

    expect(getInputs()).toEqual(expectedInputs)
    expect(core.getInput).toHaveBeenCalledWith('repo')
    expect(core.getInput).toHaveBeenCalledWith('tag_regex')
    expect(core.getInput).toHaveBeenCalledWith('grafana_dashboard_link')
    expect(core.getInput).toHaveBeenCalledWith('sentry_project_name')
    expect(core.getInput).toHaveBeenCalledWith('sentry_project_id')
    expect(core.getInput).toHaveBeenCalledWith('slack_webhook_urls')
    expect(core.getInput).toHaveBeenCalledWith('jira_instance_url')
    expect(core.getInput).toHaveBeenCalledWith('jira_ticket_prefix')
    expect(core.getInput).toHaveBeenCalledWith('contributor_replace_char')
    expect(core.getInput).toHaveBeenCalledWith('contributor_replace_regex')
    expect(core.getInput).toHaveBeenCalledWith('time_zone_offset')
    expect(mockWarning).not.toHaveBeenCalled() // no warnings should be logged

    mockGetInput.mockRestore()
    mockWarning.mockRestore()
  })
})
