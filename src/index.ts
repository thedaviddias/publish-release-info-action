import * as core from '@actions/core'

import { getOwnerAndRepo } from './utils/getOwnerAndRepo'
import { getOctokit } from './utils/getOctokit'
import { getInputs } from './utils/getInputs'
import { getContributorCommits } from './utils/getContributorCommits'
import { getTags } from './utils/getTags'
import { getCommitsBetweenTags } from './utils/getCommitsBetweenTags'
import { getBaseUrlFromContext } from './utils/getBaseUrlFromContext'
import { generateRepoLink } from './utils/generateRepoLink'
import { generateReleaseLink } from './utils/generateReleaseLink'
import { getCommitOfTag } from './utils/getCommitOfTag'
import { compareSemVer } from './utils/compareSemVer'
import { handleSlackNotification } from './utils/handleSlackNotification'

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
  // Get script input options from the GitHub Action input
  const options = getInputs()

  try {
    // Extract the owner and repo from the input options
    const { owner, repo } = getOwnerAndRepo(options.repo)

    // Get authenticated GitHub API client (Octokit)
    const octokit = getOctokit()
    core.info('GitHub API client obtained.')

    // Get the current and previous git tags for the repo
    const { currentTag, previousTag } = await getTags(octokit, owner, repo)

    if (!currentTag.name || !previousTag.name) {
      core.warning('No current or previous tag found. Exiting.')
      return
    }

    // Extract the version number from the tag using the provided regex
    const tagRegex = new RegExp(options.tagRegex)

    const currentVersionMatch = currentTag.name.match(tagRegex)
    const previousVersionMatch = previousTag.name.match(tagRegex)

    if (!currentVersionMatch || !previousVersionMatch) {
      core.error(
        'Current or previous tag does not match the provided regular expression. Exiting.'
      )
      return
    }

    const currentVersion = currentVersionMatch[0]
    const previousVersion = previousVersionMatch[0]

    const comparisonResult = compareSemVer(previousVersion, currentVersion)

    if (comparisonResult <= 0) {
      core.error('Current tag is not greater than the previous tag. Exiting.')
      return
    }

    // Get all the commits between the current and previous tags
    const commits = await getCommitsBetweenTags(
      octokit,
      owner,
      repo,
      previousTag.name,
      currentTag.name
    )

    // Get all the pull requests related to these commits, along with the contributor information
    const contributorsCommits = await getContributorCommits(
      octokit,
      owner,
      repo,
      commits
    )

    // Extract the base URL for the repository from the GitHub Action context
    const baseUrl = getBaseUrlFromContext()
    core.info(`Base URL: ${baseUrl}`)

    // Generate the URL for the repository and the release
    const repoLink = generateRepoLink(baseUrl, owner, repo)
    const releaseVersion = currentTag.name
    const releaseLink = generateReleaseLink(repoLink, releaseVersion)
    core.info(`Generated repository and release links.`)

    // Get the commit of the current tag
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const currentTagCommit = await getCommitOfTag(
      octokit,
      owner,
      repo,
      currentTag.name
    )

    // Get the Slack webhook URL from the GitHub Action input
    const slackWebhookUrls = core
      .getInput('slack_webhook_urls')
      .split(',')
      .filter(Boolean)

    if (!slackWebhookUrls.length) {
      // If the Slack webhook URL is not provided, skip sending the notification to Slack
      core.debug(
        'Missing slack_webhook_urls input, no publication to Slack with be done but the release info will be available as output.'
      )
      // Prepare output data even if slackWebhookUrls is not present
      const outputData = {
        repo,
        repoLink,
        releaseVersion,
        releaseLink,
        currentTagCommit: {
          url: currentTagCommit.data.html_url,
          author: currentTagCommit.data.author,
        },
        prList: contributorsCommits,
      }
      // Set output for other GitHub Actions to use
      core.setOutput('releaseInfo', JSON.stringify(outputData))
      return
    }

    await handleSlackNotification({
      contributorsCommits,
      currentTagCommit,
      options,
      slackWebhookUrls,
      repoLink,
      releaseLink,
      releaseVersion,
      repo,
    })
  } catch (error) {
    // If an error occurs during the script execution, fail the GitHub Action and output the error message
    if (error instanceof Error) {
      core.error(error)

      // Fail the action if the fail_on_slack_error option is true
      if (options.failOnSlackError === 'true') {
        core.setFailed(error)
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
