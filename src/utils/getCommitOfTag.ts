import * as github from '@actions/github'

import { RestEndpointMethodTypes } from '@octokit/action'

/**
 * Get the commit of a specific tag.
 *
 * @param {ReturnType<typeof github.getOctokit>} octokit - The Octokit instance.
 * @param {string} owner - The owner of the repo.
 * @param {string} repo - The repo name.
 * @param {string} tagName - The tag name.
 * @returns {Promise<RestEndpointMethodTypes['git']['getCommit']['response']>>} The commit data.
 */
export async function getCommitOfTag(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  tagName: string
): Promise<RestEndpointMethodTypes['git']['getCommit']['response']> {
  const currentTagRef = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'tags/' + tagName,
  })

  return await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: currentTagRef.data.object.sha,
  })
}
