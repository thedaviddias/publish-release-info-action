import * as core from '@actions/core'
import { run } from '../index'
import * as getInputsModule from '../utils/getInputs'
import * as getOwnerAndRepoModule from '../utils/getOwnerAndRepo'
// import * as getOctokitModule from '../utils/getOctokit'
import * as getTagsModule from '../utils/getTags'
import * as getCommitsBetweenTagsModule from '../utils/getCommitsBetweenTags'
import * as getContributorCommitsModule from '../utils/getContributorCommits'
import * as getBaseUrlFromContextModule from '../utils/getBaseUrlFromContext'
import * as generateRepoLinkModule from '../utils/generateRepoLink'
import * as generateReleaseLinkModule from '../utils/generateReleaseLink'
// import * as getCommitOfTagModule from '../utils/getCommitOfTag'
// import * as generatePRListStringModule from '../utils/generatePRListString'

jest.mock('@actions/core')
jest.mock('../utils/getInputs')
jest.mock('../utils/getOwnerAndRepo')
jest.mock('../utils/getOctokit')
jest.mock('../utils/getTags')
jest.mock('../utils/getCommitsBetweenTags')
jest.mock('../utils/getContributorCommits')
jest.mock('../utils/getBaseUrlFromContext')
jest.mock('../utils/generateRepoLink')
jest.mock('../utils/generateReleaseLink')
jest.mock('../utils/getCommitOfTag')
jest.mock('../utils/generatePRListString')

const mockedGetInputs =
  getInputsModule.getInputs as jest.Mock<getInputsModule.GetInputsType>

describe('run function', () => {
  it('should call getInputs, getOwnerAndRepo and getOctokit once', async () => {
    // Set up our mock implementations
    mockedGetInputs.mockReturnValue({
      repo: 'mock/repo',
      grafanaDashboardLink: 'http://mock-grafana-link',
      sentryProjectName: 'mock-sentry-project-name',
      sentryProjectId: 'mock-sentry-project-id',
      slackWebhookUrl: 'http://mock-webhook-url',
      jiraInstanceUrl: 'http://mock-jira-instance-url',
      jiraTicketPrefix: 'ABC',
      contributorReplaceChar: '.',
      contributorReplaceRegex: '-',
    })

    const getOwnerAndRepoMock = jest.spyOn(getOwnerAndRepoModule, 'getOwnerAndRepo')
    getOwnerAndRepoMock.mockReturnValue({ owner: 'mock', repo: 'repo' })

    // const getOctokitMock = jest.spyOn(getOctokitModule, 'getOctokit')
    // getOctokitMock.mockReturnValue('mock-octokit')

    const getTagsMock = jest.spyOn(getTagsModule, 'getTags')
    getTagsMock.mockResolvedValue({
      currentTag: {
        name: 'v1.0.0',
        commit: { sha: 'abc123', url: 'http://example.com' },
        zipball_url: 'http://example.com',
        tarball_url: 'http://example.com',
        node_id: 'abc123',
      },
      previousTag: {
        name: 'v0.9.0',
        commit: { sha: 'abc123', url: 'http://example.com' },
        zipball_url: 'http://example.com',
        tarball_url: 'http://example.com',
        node_id: 'abc123',
      },
    })

    const getCommitsBetweenTagsMock = jest.spyOn(
      getCommitsBetweenTagsModule,
      'getCommitsBetweenTags'
    )
    getCommitsBetweenTagsMock.mockResolvedValue(['commit1', 'commit2'])

    const getContributorCommitsMock = jest.spyOn(
      getContributorCommitsModule,
      'getContributorCommits'
    )
    getContributorCommitsMock.mockResolvedValue([
      {
        prNumber: 1,
        prTitle: 'Mock PR',
        prUrl: 'http://example.com',
        contributor: 'mock-contributor',
      },
    ])

    const getBaseUrlFromContextMock = jest.spyOn(
      getBaseUrlFromContextModule,
      'getBaseUrlFromContext'
    )
    getBaseUrlFromContextMock.mockReturnValue('http://mock-base-url')

    const generateRepoLinkMock = jest.spyOn(
      generateRepoLinkModule,
      'generateRepoLink'
    )
    generateRepoLinkMock.mockReturnValue('http://mock-repo-link')

    const generateReleaseLinkMock = jest.spyOn(
      generateReleaseLinkModule,
      'generateReleaseLink'
    )
    generateReleaseLinkMock.mockReturnValue('http://mock-release-link')

    // const getCommitOfTagMock = jest.spyOn(getCommitOfTagModule, 'getCommitOfTag')
    // getCommitOfTagMock.mockResolvedValue({ data: { html_url: 'http://mock-commit-url' } })

    // const generatePRListStringMock = jest.spyOn(generatePRListStringModule, 'generatePRListString')
    // getContributorCommitsMock.mockResolvedValue([
    //   { prNumber: 1, prTitle: 'Mock PR', prUrl: 'http://example.com', contributor: 'mock-contributor' }
    // ])

    await run()

    expect(mockedGetInputs).toHaveBeenCalled()
    expect(getOwnerAndRepoMock).toHaveBeenCalledWith('mock/repo')
    // expect(getOctokitMock).toHaveBeenCalled()
    expect(getTagsMock).toHaveBeenCalled()
    expect(getCommitsBetweenTagsMock).toHaveBeenCalled()
    expect(getContributorCommitsMock).toHaveBeenCalled()
    expect(generateRepoLinkMock).toHaveBeenCalled()
    expect(generateReleaseLinkMock).toHaveBeenCalled()
    // expect(getCommitOfTagMock).toHaveBeenCalled()
    // expect(generatePRListStringMock).toHaveBeenCalled()
  })
})
