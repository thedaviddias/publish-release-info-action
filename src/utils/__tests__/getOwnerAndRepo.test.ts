import { getOwnerAndRepo } from '../getOwnerAndRepo'
import * as github from '@actions/github'
import * as core from '@actions/core'

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'owner',
      repo: 'repo',
    },
  },
}))

jest.mock('@actions/core', () => ({
  info: jest.fn(),
}))

describe('getOwnerAndRepo', () => {
  const mockInputRepo = 'owner/repo'
  const mockSplit = mockInputRepo.split('/')

  it('should return owner and repo based on input string if length is 2', () => {
    const result = getOwnerAndRepo(mockInputRepo)
    expect(result).toEqual({ owner: mockSplit[0], repo: mockSplit[1] })
    expect(core.info).toHaveBeenCalledWith(
      `Working on the repository: ${mockSplit[0]}/${mockSplit[1]}`
    )
  })

  it('should return owner and repo based on context if length is not 2', () => {
    const result = getOwnerAndRepo('owner/repo')
    expect(result).toEqual({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    })
    expect(core.info).toHaveBeenCalledWith(
      `Working on the repository: ${github.context.repo.owner}/${github.context.repo.repo}`
    )
  })
})
