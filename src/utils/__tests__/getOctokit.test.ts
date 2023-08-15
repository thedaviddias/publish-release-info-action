import { getOctokit as getOctokitOrig } from '@actions/github'
import * as core from '@actions/core'
import { getOctokit } from '../getOctokit'
import { GitHub } from '@actions/github/lib/utils'

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}))

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}))

const mockToken = '123456'

describe('getOctokit function', () => {
  it('should get a github token and return an authenticated Octokit client', () => {
    const mockOctokit = {
      repos: {
        get: jest.fn(),
      },
    }

    const getOctokitMock = getOctokitOrig as jest.MockedFunction<
      typeof getOctokitOrig
    >

    const getInputMock = core.getInput as jest.MockedFunction<typeof core.getInput>

    getInputMock.mockReturnValue(mockToken)
    getOctokitMock.mockReturnValue(
      mockOctokit as unknown as InstanceType<typeof GitHub>
    )

    const result = getOctokit()

    expect(getInputMock).toHaveBeenCalledWith('github_token', { required: true })
    expect(getOctokitMock).toHaveBeenCalledWith(mockToken)
    expect(result).toEqual(mockOctokit)
  })
})
