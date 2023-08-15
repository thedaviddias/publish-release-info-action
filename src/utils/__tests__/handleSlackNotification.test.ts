import axios from 'axios'
import {
  SlackNotification,
  handleSlackNotification,
} from '../handleSlackNotification'
import * as core from '@actions/core'
import { GetInputsType } from '../getInputs'

jest.mock('axios')
;(axios.post as jest.Mock) = jest.fn().mockResolvedValue({})

jest.mock('@actions/core', () => ({
  info: jest.fn(),
}))

export const expectedInputs: GetInputsType = {
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
  locale: 'locale',
  failOnSlackError: 'true',
}

describe('handleSlackNotification', () => {
  it('sends a Slack notification for valid input', async () => {
    const mockSlackNotification: SlackNotification = {
      contributorsCommits: [
        {
          contributor: 'David',
          prTitle: 'This is a PR title',
          prUrl: 'https://github.com',
          prNumber: 4,
        },
      ],
      currentTagCommit: {
        data: {
          sha: 'a1b2c3d4e5f6g7h8i9j0k',
          node_id: 'MDY6Q29tbWl0MTIzNDU2Nzg5',
          url: 'https://api.github.com/repos/your/repo/commits/a1b2c3d4e5f6g7h8i9j0k',
          author: {
            date: '2023-08-15T00:00:00Z',
            email: 'author@example.com',
            name: 'Author Name',
          },
          committer: {
            date: '2023-08-15T00:00:00Z',
            email: 'committer@example.com',
            name: 'Committer Name',
          },
          message: 'Commit message',
          tree: {
            sha: 'tree-sha',
            url: 'tree-url',
          },
          parents: [],
          verification: {
            verified: true,
            reason: '',
            signature: '',
            payload: '',
          },
          html_url: 'https://github.com/your/repo/commit/a1b2c3d4e5f6g7h8i9j0k',
        },
        status: 200, // HTTP status code
      },
      options: expectedInputs, // assuming this matches the GetInputsType
      slackWebhookUrls: ['https://hooks.slack.com/your-webhook-path'],
      repoLink: 'https://github.com/your/repo',
      releaseLink: 'https://github.com/your/repo/releases/tag/v1.0.0',
      releaseVersion: 'v1.0.0',
      repo: 'your-repo-name',
    }

    await handleSlackNotification(mockSlackNotification)

    // Verify that axios.post was called with the correct URL
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.post).toHaveBeenCalledWith(
      mockSlackNotification.slackWebhookUrls[0].trim(),
      expect.anything()
    )

    expect(core.info).toHaveBeenCalledWith('Message sent to Slack')
  })
})
