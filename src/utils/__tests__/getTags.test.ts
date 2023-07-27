import { getTags } from '../getTags'
import * as github from '@actions/github'
import * as core from '@actions/core'
import { GitHub } from '@actions/github/lib/utils'

jest.mock('@actions/core', () => ({
  info: jest.fn(),
}))

describe('getTags', () => {
  const mockTags = [
    {
      name: 'v2.0.0',
      commit: { sha: 'abc123', url: 'http://example.com' },
      zipball_url: 'http://example.com',
      tarball_url: 'http://example.com',
      node_id: 'abc123',
    },
    {
      name: 'v1.0.0',
      commit: { sha: 'def456', url: 'http://example.com' },
      zipball_url: 'http://example.com',
      tarball_url: 'http://example.com',
      node_id: 'def456',
    },
  ]

  const mockOctokit = {
    rest: {
      repos: {
        listTags: jest.fn().mockResolvedValue({ data: mockTags }),
      },
    },
  }
  it('should return the two most recent tags', async () => {
    jest
      .spyOn(github, 'getOctokit')
      .mockReturnValue(mockOctokit as unknown as InstanceType<typeof GitHub>)

    const tags = await getTags(
      mockOctokit as unknown as InstanceType<typeof GitHub>,
      'mock-owner',
      'mock-repo'
    )

    expect(tags).toEqual({
      currentTag: mockTags[0],
      previousTag: mockTags[1],
    })
    expect(core.info).toHaveBeenCalledWith('Getting list of tags')
    expect(core.info).toHaveBeenCalledWith(
      `Fetching commits between ${mockTags[1].name} and ${mockTags[0].name}`
    )
  })
})
