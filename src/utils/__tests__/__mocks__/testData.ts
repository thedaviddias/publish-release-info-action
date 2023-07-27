import { RestEndpointMethodTypes } from '@octokit/action'

export const MOCK_OWNER = 'owner'
export const MOCK_REPO = 'repo'
export const MOCK_BASE_URL = 'https://github.com'
export const MOCK_REPO_LINK = `${MOCK_BASE_URL}/${MOCK_OWNER}/${MOCK_REPO}`
export const MOCK_RELEASE_LINK = `${MOCK_REPO_LINK}/releases/tag/v1.0.0`
export const MOCK_RELEASE_VERSION = 'v1.0.0'
export const MOCK_TAGS_RELEASE_VERSION = `tags/${MOCK_RELEASE_VERSION}`
export const MOCK_BASE_TAG = 'v1.0.0'
export const MOCK_HEAD_TAG = 'v1.0.1'
export const MOCK_COMMIT_SHA = '1a2b3c4d5e6f'
export const MOCK_PR_LIST_STRING = '*PR 1\nPR 2\nPR 3*'
export const MOCK_CURRENT_TAG_COMMIT: RestEndpointMethodTypes['git']['getCommit']['response'] =
  {
    url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd',
    headers: {},
    status: 200,
    data: {
      sha: '7638417db6d59f3c431d3e1f261cc637155684cd',
      node_id: 'MDY6Q29tbWl0MTIzNzg5',
      url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd',
      html_url:
        'https://github.com/octocat/Hello-World/commit/7638417db6d59f3c431d3e1f261cc637155684cd',
      author: {
        name: 'John Doe',
        email: 'john@doe.com',
        date: '2013-07-08T16:28:01Z',
      },
      committer: {
        name: 'John Doe',
        email: 'john@doe.com',
        date: '2013-07-08T16:28:01Z',
      },
      message: 'added readme, because im a good citizen',
      tree: {
        sha: '691272480426f78a0138979dd3db3b8230363cf6',
        url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3db3b8230363cf6',
      },
      parents: [
        {
          sha: '1acc419d4d6a9ce985db7be48c6349a0475975b5',
          url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5',
          html_url: '',
        },
      ],
      verification: {
        verified: true,
        reason: 'valid',
        signature: '-----BEGIN PGP SIGNATURE-----\n...',
        payload: 'tree 691272480426f78a0138979dd3db3b8230363cf6\n...',
      },
    },
  }

export const MOCK_GET_INPUTS = {
  repo: '',
  sentryProjectName: 'myProject',
  sentryProjectId: '123',
  grafanaDashboardLink: 'https://grafana.myProject.com',
  slackWebhookUrl: 'https://hooks.slack.com/services/123/456/789',
  jiraTicketPrefix: 'ABC',
  jiraInstanceUrl: 'https://jira.myProject.com',
  contributorReplaceChar: '.',
  contributorReplaceRegex: '-',
}
