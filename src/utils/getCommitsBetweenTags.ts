import * as github from '@actions/github'

/**
 * Fetches commits between two tags from the specified GitHub repository.
 *
 * @param {ReturnType<typeof github.getOctokit>} octokit - The Octokit instance to interact with GitHub API.
 * @param {string} owner - The owner of the GitHub repository.
 * @param {string} repo - The name of the GitHub repository.
 * @param {string} baseTag - The tag to compare from.
 * @param {string} headTag - The tag to compare to.
 * @returns {Promise<string[]>} - The array of commit sha's between two tags.
 */
export async function getCommitsBetweenTags(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  baseTag: string,
  headTag: string
): Promise<string[]> {
  const { data: compare } = await octokit.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${baseTag}...${headTag}`,
  })

  return compare.commits.map((commit) => commit.sha)
}
