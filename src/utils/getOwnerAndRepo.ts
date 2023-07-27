import * as github from '@actions/github'
import * as core from '@actions/core'

/**
 * Extracts the owner and repository name from a given string or uses the values from the current GitHub context.
 *
 * @param {string} inputRepo - The input string which can be a full GitHub repository URL or an empty string.
 *
 * @returns {{owner: string, repo: string}} - An object containing the owner and repository name.
 */
export function getOwnerAndRepo(inputRepo: string) {
  const { context } = github
  const parts = inputRepo.split('/')
  const owner = parts.length === 2 ? parts[0] : context.repo.owner
  const repo = parts.length === 2 ? parts[1] : context.repo.repo

  core.info(`Working on the repository: ${owner}/${repo}`)

  return { owner, repo }
}
