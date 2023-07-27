import { getCommitOfTag } from '../getCommitOfTag'
import { GitHub } from '@actions/github/lib/utils'

import {
  MOCK_OWNER,
  MOCK_RELEASE_VERSION,
  MOCK_REPO,
  MOCK_TAGS_RELEASE_VERSION,
} from './__mocks__/testData'

type MockOctokit = {
  rest: {
    git: {
      getRef: (params: { owner: string; repo: string; ref: string }) => Promise<any>
      getCommit: (params: {
        owner: string
        repo: string
        commit_sha: string
      }) => Promise<any>
    }
  }
}

describe('getCommitOfTag', () => {
  it('should return the commit data for a tag', async () => {
    const mockOctokit: MockOctokit = {
      rest: {
        git: {
          getRef: jest.fn().mockResolvedValue({
            data: {
              object: {
                sha: '123',
              },
            },
          }),
          getCommit: jest.fn().mockResolvedValue({
            data: {
              sha: '123',
              message: 'Test commit',
            },
          }),
        },
      },
    }

    const commitData = await getCommitOfTag(
      mockOctokit as unknown as InstanceType<typeof GitHub>,
      MOCK_OWNER,
      MOCK_REPO,
      MOCK_RELEASE_VERSION
    )

    expect(commitData).toEqual({
      data: {
        sha: '123',
        message: 'Test commit',
      },
    })

    expect(mockOctokit.rest.git.getRef).toHaveBeenCalledWith({
      owner: MOCK_OWNER,
      repo: MOCK_REPO,
      ref: MOCK_TAGS_RELEASE_VERSION,
    })

    expect(mockOctokit.rest.git.getCommit).toHaveBeenCalledWith({
      owner: MOCK_OWNER,
      repo: MOCK_REPO,
      commit_sha: '123',
    })
  })
})
