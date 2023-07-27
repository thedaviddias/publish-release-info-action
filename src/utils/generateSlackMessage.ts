import { RestEndpointMethodTypes } from '@octokit/action'
import { KnownBlock } from '@slack/types'
import { GetInputsType } from './getInputs'

/**
 * Generate the Slack message.
 *
 * @param {string} repoLink - The repo link.
 * @param {string} releaseLink - The release link.
 * @param {string} releaseVersion - The release version.
 * @param {RestEndpointMethodTypes['git']['getCommit']['response']} currentTagCommit - The current tag commit.
 * @param {string} prListString - The pull request list string.
 * @param {OptionsType} options - The options from getInputs.
 * @param {string} currentDate - The current date.
 * @returns {object} The Slack message.
 */
export function generateSlackMessage(
  repoLink: string,
  releaseLink: string,
  releaseVersion: string,
  currentTagCommit: RestEndpointMethodTypes['git']['getCommit']['response'],
  prListString: string,
  options: GetInputsType,
  repo: string,
  currentDate: string
): {
  blocks: KnownBlock[]
} {
  const slackData: { blocks: KnownBlock[] } = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🎉 A new release has been created!\n\n\n\n\n`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📚 Project:*\n<${repoLink}|${repo}>`,
          },
          {
            type: 'mrkdwn',
            text: `*🏷️ Version:*\n<${releaseLink}|${releaseVersion}>`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📅 When:*\n${currentDate}`,
          },
          {
            type: 'mrkdwn',
            text: `*👤 Created by:*\n${currentTagCommit.data.author.name}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📜 Changelog',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: prListString,
        },
      },
    ],
  }

  if (
    (options.sentryProjectName && options.sentryProjectId) ||
    options.grafanaDashboardLink
  ) {
    slackData.blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Related Tools:*',
        },
      }
    )
  }

  if (
    (options.sentryProjectName && options.sentryProjectId) ||
    options.grafanaDashboardLink
  ) {
    const relatedToolsSection: KnownBlock = {
      type: 'section',
      fields: [],
    }

    if (options.sentryProjectName && options.sentryProjectId) {
      relatedToolsSection.fields &&
        relatedToolsSection.fields.push({
          type: 'mrkdwn',
          text: `<https://${options.sentryProjectName}.sentry.io/releases/${releaseVersion}/?project=${options.sentryProjectId}|Sentry>`,
        })
    }

    if (options.grafanaDashboardLink) {
      relatedToolsSection.fields &&
        relatedToolsSection.fields.push({
          type: 'mrkdwn',
          text: `<${options.grafanaDashboardLink}|Grafana>`,
        })
    }

    slackData.blocks.push(relatedToolsSection)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  slackData.blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Please ✅ this message if you have checked the release. 🎉',
      },
    ],
  })

  return slackData
}
