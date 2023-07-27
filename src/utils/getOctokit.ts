import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * Creates and returns an authenticated Octokit client.
 *
 * @returns {ReturnType<typeof github.getOctokit>} - An authenticated Octokit client.
 */
export function getOctokit() {
  const token = core.getInput('github_token', { required: true })
  return github.getOctokit(token)
}
