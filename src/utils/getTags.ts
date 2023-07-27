import * as core from '@actions/core'
import * as github from '@actions/github'

import type { paths } from '@octokit/openapi-types'

/**
 * Fetches the two most recent tags of the specified repository.
 *
 * @param owner - The owner of the repository.
 * @param repo - The name of the repository.
 * @param token - The GitHub token for authentication.
 * @returns {Promise<{currentTag: string, previousTag: string}>} - A promise that resolves to an object containing the current and previous tags.
 */
export async function getTags(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string
): Promise<{
  currentTag: paths['/repos/{owner}/{repo}/tags']['get']['responses']['200']['content']['application/json'][0]
  previousTag: paths['/repos/{owner}/{repo}/tags']['get']['responses']['200']['content']['application/json'][0]
}> {
  core.info('Getting list of tags')

  const { data } = await octokit.rest.repos.listTags({ owner, repo, per_page: 2 })
  const [currentTag, previousTag] = data

  core.info(`Fetching commits between ${previousTag.name} and ${currentTag.name}`)

  return { currentTag, previousTag }
}
