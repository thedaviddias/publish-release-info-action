import * as core from '@actions/core'
import axios, { AxiosError } from 'axios'

import { generateJiraTicketLink } from './generateJiraTicketLink'
import { generatePRListString } from './generatePRListString'
import { generateSlackMessage } from './generateSlackMessage'
import { getCurrentDate } from './getCurrentDate'
import { GetInputsType } from './getInputs'
import { parseTicketNumberFromTitle } from './parseTicketNumberFromTitle'
import { ContributorCommits } from './getContributorCommits'
import { RestEndpointMethodTypes } from '@octokit/action'

export type SlackNotification = {
  contributorsCommits: ContributorCommits[]
  currentTagCommit: RestEndpointMethodTypes['git']['getCommit']['response']
  options: GetInputsType
  slackWebhookUrls: string[]
  repoLink: string
  releaseLink: string
  releaseVersion: string
  repo: string
}

/**
 * Handles the Slack notification process. It generates and sends a Slack message containing information about a GitHub release, including a list of pull requests that contributed to the release.
 *
 * @param contributorsCommits - The list of commits made by contributors to the GitHub repository.
 * @param currentTagCommit - The commit of the current tag of the release.
 * @param options - Configuration options for the GitHub action.
 * @param slackWebhookUrls - The list of URLs to send Slack notifications to.
 * @param repoLink - The URL to the GitHub repository.
 * @param releaseLink - The URL to the GitHub release.
 * @param releaseVersion - The version number of the GitHub release.
 * @param repo - The name of the GitHub repository.
 *
 * @returns {Promise<void>} - A promise that resolves when all Slack messages have been sent.
 *
 * @async
 */
export async function handleSlackNotification({
  contributorsCommits,
  currentTagCommit,
  options,
  slackWebhookUrls,
  repoLink,
  releaseLink,
  releaseVersion,
  repo,
}: SlackNotification) {
  core.info('Slack Webhook URL is provided, generating Slack message.')

  // Map through each commit contributed by contributors
  const contributorsCommitsWithTicketLinks = contributorsCommits.map((commit) => {
    // If a Jira ticket prefix is provided, parse the ticket number from the pull request title
    const ticketNumber = options.jiraTicketPrefix
      ? parseTicketNumberFromTitle(commit.prTitle, options.jiraTicketPrefix)
      : null
    // If a ticket number was found and a Jira instance URL is provided, generate a link to the Jira ticket
    const ticketLink =
      ticketNumber && options.jiraInstanceUrl
        ? generateJiraTicketLink(ticketNumber, options.jiraInstanceUrl)
        : null
    // Return the commit along with the potentially found Jira ticket link and prefix
    return {
      ...commit,
      jiraTicketLink: ticketLink,
      jiraTicketPrefix: options.jiraTicketPrefix,
    }
  })

  // Generate a string listing all pull requests, potentially with Jira ticket links and contributor replacements
  const prListString = generatePRListString(
    contributorsCommitsWithTicketLinks,
    options.jiraTicketPrefix,
    options.jiraInstanceUrl,
    options.contributorReplaceChar,
    options.contributorReplaceRegex
  )

  // Get the current date in the specified time zone
  const currentDate = getCurrentDate(options.timeZoneOffset, options.locale)

  // Generate the Slack message data, which includes information about the repository, the release, the commit of the current tag,
  // the list of pull requests, and the current date
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

  // Post the Slack message data to each provided Slack webhook URL
  for (const url of slackWebhookUrls) {
    try {
      await axios.post(url.trim(), slackData)
      core.info(`Message sent to Slack`)
    } catch (error) {
      const axiosError = error as AxiosError<any>
      if (axiosError.response) {
        core.error(`Error posting to Slack. URL: ${url.trim()}`)
        core.error(`Status code: ${axiosError.response.status}`)
        core.error(`Response data: ${JSON.stringify(axiosError.response.data)}`)
      } else if (axiosError.request) {
        core.error(`No response received when posting to Slack. URL: ${url.trim()}`)
        core.error(`Request: ${JSON.stringify(axiosError.request)}`)
      } else {
        core.error(axiosError.message)
      }
    }
  }
}
