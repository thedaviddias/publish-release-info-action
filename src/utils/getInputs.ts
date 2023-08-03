import * as core from '@actions/core'
import { appendBrowseToUrl } from './appendBrowseToUrl'

// Simple URL validation function
function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Simple repository format validation function
function isValidRepoFormat(string: string): boolean {
  return /^[^\/]+\/[^\/]+$/.test(string)
}

function isValidTicketPrefix(string: string): boolean {
  return /^[a-zA-Z]+$/.test(string) && !string.endsWith('-')
}

export interface GetInputsType {
  repo: string
  tagRegex: string
  sentryProjectName: string
  sentryProjectId: string
  grafanaDashboardLink: string
  slackWebhookUrls: string
  jiraTicketPrefix: string
  jiraInstanceUrl: string
  contributorReplaceChar: string
  contributorReplaceRegex: string
}

/**
 * Retrieves the inputs for the GitHub Action from the workflow file.
 *
 * @returns {GetInputsType} - An object containing all inputs for the GitHub Action.
 */
export function getInputs(): GetInputsType {
  core.info('Input options obtained.')

  const repo = core.getInput('repo') || ''
  const tagRegex = core.getInput('tag_regex')
  const jiraTicketPrefix = core.getInput('jira_ticket_prefix') || ''
  const jiraInstanceUrl = core.getInput('jira_instance_url') || ''
  const grafanaDashboardLink = core.getInput('grafana_dashboard_link') || ''
  const sentryProjectName = core.getInput('sentry_project_name') || ''
  const sentryProjectId = core.getInput('sentry_project_id') || ''
  const slackWebhookUrls = core.getInput('slack_webhook_urls') || ''
  const contributorReplaceChar = core.getInput('contributor_replace_char') || ''
  const contributorReplaceRegex = core.getInput('contributor_replace_regex') || ''

  // Input value checking example for URLs
  if (grafanaDashboardLink && !isValidUrl(grafanaDashboardLink)) {
    core.warning(`Invalid Grafana dashboard link: ${grafanaDashboardLink}`)
  }

  // Now split the slackWebhookUrls and validate each one
  const slackWebhookUrlArray = slackWebhookUrls.split(',')

  for (const url of slackWebhookUrlArray) {
    const trimmedUrl = url.trim()
    if (
      !isValidUrl(trimmedUrl) ||
      !trimmedUrl.startsWith('https://hooks.slack.com')
    ) {
      core.warning(`Invalid Slack webhook URL: ${trimmedUrl}`)
    }
  }

  // Input value checking for repo format
  if (repo && !isValidRepoFormat(repo)) {
    core.warning(
      `Invalid repository format: ${repo}. It should be in 'owner/repo' format.`
    )
  }

  // Input value checking for sentryProjectId
  if (sentryProjectId && isNaN(Number(sentryProjectId))) {
    core.warning(
      `Invalid Sentry project ID: ${sentryProjectId}. It should be a number.`
    )
  }

  if (jiraTicketPrefix && !isValidTicketPrefix(jiraTicketPrefix)) {
    core.warning(
      `Invalid JIRA ticket prefix: ${jiraTicketPrefix}. It should only contain letters and not end with a dash.`
    )
  }

  // Check if both jiraTicketPrefix and jiraInstanceUrl are empty
  if (!jiraTicketPrefix && !jiraInstanceUrl) {
    core.warning(
      'Both jira_ticket_prefix and jira_instance_url are empty. JIRA ticket links will not be generated.'
    )
  }

  const jiraInstanceUrlProcessed = appendBrowseToUrl(jiraInstanceUrl)

  return {
    repo,
    tagRegex,
    grafanaDashboardLink,
    sentryProjectName,
    sentryProjectId,
    slackWebhookUrls,
    jiraTicketPrefix,
    jiraInstanceUrl: jiraInstanceUrlProcessed,
    contributorReplaceChar,
    contributorReplaceRegex,
  }
}
