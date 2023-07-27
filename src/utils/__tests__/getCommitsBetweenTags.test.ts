import { getCommitsBetweenTags } from '../getCommitsBetweenTags'

describe('getCommitsBetweenTags', () => {
  it("should return the array of commit sha's between two tags", async () => {
    const mockOctokit = {
      rest: {
        repos: {
          compareCommitsWithBasehead: jest.fn().mockResolvedValue({
            data: {
              commits: [
                { sha: '123' },
                { sha: '456' },
                { sha: '789' },
                // Include as many commits as you want for testing
              ],
            },
          }),
        },
      },
    }

    const commits = await getCommitsBetweenTags(
      mockOctokit as any,
      'owner',
      'repo',
      'v1.0.0',
      'v2.0.0'
    )

    expect(commits).toEqual(['123', '456', '789']) // Should match the sha's in the mock data

    expect(mockOctokit.rest.repos.compareCommitsWithBasehead).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      basehead: 'v1.0.0...v2.0.0',
    })
  })
})
