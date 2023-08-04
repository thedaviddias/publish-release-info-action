import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'

/**
 * Creates and returns an authenticated Octokit client.
 *
 * @returns - An authenticated Octokit client.
 */
export function getOctokit(): InstanceType<typeof GitHub> {
  const token = core.getInput('github_token', { required: true })
  return github.getOctokit(token)
}
