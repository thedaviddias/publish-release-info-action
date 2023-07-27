import { getContributorCommits } from '../getContributorCommits'
import * as core from '@actions/core'
import { GitHub } from '@actions/github/lib/utils'
import { MOCK_OWNER, MOCK_REPO } from './__mocks__/testData'

type MockOctokit = {
  rest: {
    repos: {
      listPullRequestsAssociatedWithCommit: (params: {
        owner: string
        repo: string
        commit_sha: string
      }) => Promise<any>
    }
  }
}

describe('getContributorCommits', () => {
  it('should return the array of contributor commits', async () => {
    const mockOctokit: MockOctokit = {
      rest: {
        repos: {
          listPullRequestsAssociatedWithCommit: jest.fn().mockResolvedValue({
            data: [
              {
                merge_commit_sha: '123',
                user: {
                  login: 'contributor1',
                },
                title: 'PR Title 1',
                html_url: 'https://github.com/owner/repo/pull/1',
                number: 1,
              },
            ],
          }),
        },
      },
    }

    const infoSpy = jest.spyOn(core, 'info')

    const commits = await getContributorCommits(
      mockOctokit as unknown as InstanceType<typeof GitHub>,
      MOCK_OWNER,
      MOCK_REPO,
      ['123']
    )

    expect(commits).toEqual([
      {
        contributor: 'contributor1',
        prTitle: 'PR Title 1',
        prUrl: 'https://github.com/owner/repo/pull/1',
        prNumber: 1,
      },
    ])

    expect(
      mockOctokit.rest.repos.listPullRequestsAssociatedWithCommit
    ).toHaveBeenCalledWith({
      owner: MOCK_OWNER,
      repo: MOCK_REPO,
      commit_sha: '123',
    })

    expect(infoSpy).toHaveBeenCalledWith('Retrieved 1 commit(s) between tags.')

    infoSpy.mockRestore()
  })
})
