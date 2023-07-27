import * as core from '@actions/core'
import axios from 'axios'
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
import { generatePRListString } from './utils/generatePRListString'
import { generateSlackMessage } from './utils/generateSlackMessage'
import { parseTicketNumberFromTitle } from './utils/parseTicketNumberFromTitle'
import { generateJiraTicketLink } from './utils/generateJiraTicketLink'

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
  try {
    // Get script input options from the GitHub Action input
    const options = getInputs()

    // Extract the owner and repo from the input options
    const { owner, repo } = getOwnerAndRepo(options.repo)

    // Get authenticated GitHub API client (Octokit)
    const octokit = getOctokit()
    core.info('GitHub API client obtained.')

    // Get the current and previous git tags for the repo
    const { currentTag, previousTag } = await getTags(octokit, owner, repo)

    if (!currentTag || !previousTag) {
      core.warning('No current or previous tag found. Exiting.')
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
    const slackWebhookUrl = core.getInput('slack_webhook_url')

    if (!slackWebhookUrl) {
      // If the Slack webhook URL is not provided, skip sending the notification to Slack
      core.debug(
        'Missing slack_webhook_url input, no publication to Slack with be done but the release info will be available as output.'
      )
      // Prepare output data even if slackWebhookUrl is not present
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

    core.info('Slack Webhook URL is provided, generating Slack message.')

    const contributorsCommitsWithTicketLinks = contributorsCommits.map((commit) => {
      const ticketNumber = options.jiraTicketPrefix
        ? parseTicketNumberFromTitle(commit.prTitle, options.jiraTicketPrefix)
        : null
      const ticketLink =
        ticketNumber && options.jiraInstanceUrl
          ? generateJiraTicketLink(ticketNumber, options.jiraInstanceUrl)
          : null
      return {
        ...commit,
        jiraTicketLink: ticketLink,
        jiraTicketPrefix: options.jiraTicketPrefix,
      }
    })

    const prListString = generatePRListString(
      contributorsCommitsWithTicketLinks,
      options.jiraTicketPrefix,
      options.jiraInstanceUrl
    )

    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    const slackData = generateSlackMessage(
      repoLink,
      releaseLink,
      releaseVersion,
      currentTagCommit,
      prListString,
      options,
      repo,
      currentDate
    )

    await axios.post(slackWebhookUrl, slackData)
    core.info('Message sent to Slack.')
  } catch (error) {
    // If an error occurs during the script execution, fail the GitHub Action and output the error message
    if (error instanceof Error) {
      core.error(error)
      core.setFailed(error)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
