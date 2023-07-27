import * as github from '@actions/github'
import * as core from '@actions/core'

/**
 * Gets the commits from contributors.
 *
 * @param {ReturnType<typeof github.getOctokit>} octokit - The Octokit instance.
 * @param {string} owner - The owner of the repo.
 * @param {string} repo - The repo name.
 * @param {string[]} commits - The commits to get contributors from.
 * @returns {Promise<Array<{ contributor: string; prTitle: string; prUrl: string; prNumber: number }>>} The array of contributor commits.
 */
export async function getContributorCommits(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  commits: string[]
): Promise<
  Array<{
    contributor: string
    prTitle: string
    prUrl: string
    prNumber: number
  }>
> {
  const contributorsCommits = []

  for (const commit of commits) {
    const { data: prs } =
      await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: commit,
      })

    const pr = prs.find((p) => p.merge_commit_sha === commit)

    if (pr?.user) {
      contributorsCommits.push({
        contributor: pr.user.login,
        prTitle: pr.title,
        prUrl: pr.html_url,
        prNumber: pr.number,
      })
    }
  }

  core.info(`Retrieved ${contributorsCommits.length} commit(s) between tags.`)

  return contributorsCommits
}
