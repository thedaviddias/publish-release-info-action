import { generateSlackMessage } from '../generateSlackMessage'
import { SectionBlock } from '@slack/types'

import {
  MOCK_REPO_LINK,
  MOCK_RELEASE_LINK,
  MOCK_RELEASE_VERSION,
  MOCK_CURRENT_TAG_COMMIT,
  MOCK_PR_LIST_STRING,
  MOCK_GET_INPUTS,
  MOCK_REPO,
} from './__mocks__/testData'

describe('generateSlackMessage', () => {
  const MOCK_CURRENT_DATE = 'July 27, 2023, 12:00:00 AM'
  it('should generate a valid slack message', () => {
    const slackMessage = generateSlackMessage(
      MOCK_REPO_LINK,
      MOCK_RELEASE_LINK,
      MOCK_RELEASE_VERSION,
      MOCK_CURRENT_TAG_COMMIT,
      MOCK_PR_LIST_STRING,
      MOCK_GET_INPUTS,
      MOCK_REPO,
      MOCK_CURRENT_DATE
    )

    // check some parts of the slack message
    expect(slackMessage.blocks).toBeDefined()

    // To check the fields property, we need to make sure the block is a SectionBlock
    const sectionBlock1 = slackMessage.blocks[1] as SectionBlock
    const sectionBlock2 = slackMessage.blocks[2] as SectionBlock

    expect(sectionBlock1.fields?.[0]?.text).toContain(MOCK_REPO_LINK)
    expect(sectionBlock1.fields?.[1]?.text).toContain(MOCK_RELEASE_LINK)
    expect(sectionBlock2.fields?.[1]?.text).toContain(
      MOCK_CURRENT_TAG_COMMIT.data.author.name
    )

    // check the related tools section
    const relatedToolsSection = slackMessage.blocks[8] as SectionBlock
    expect(relatedToolsSection.fields?.[0]?.text).toContain(
      MOCK_GET_INPUTS.sentryProjectName
    )
    expect(relatedToolsSection.fields?.[1]?.text).toContain(
      MOCK_GET_INPUTS.grafanaDashboardLink
    )
  })

  it('should generate a valid slack message with only a sentry link', () => {
    const inputs = { ...MOCK_GET_INPUTS, grafanaDashboardLink: '' }
    const slackMessage = generateSlackMessage(
      MOCK_REPO_LINK,
      MOCK_RELEASE_LINK,
      MOCK_RELEASE_VERSION,
      MOCK_CURRENT_TAG_COMMIT,
      MOCK_PR_LIST_STRING,
      inputs,
      MOCK_REPO,
      MOCK_CURRENT_DATE
    )

    const relatedToolsSection = slackMessage.blocks[8] as SectionBlock
    expect(relatedToolsSection.fields?.[0]?.text).toContain(
      MOCK_GET_INPUTS.sentryProjectName
    )
    expect(relatedToolsSection.fields?.[1]?.text).toBeUndefined()
  })

  it('should generate a valid slack message with neither a sentry nor a grafana link', () => {
    const inputs = {
      ...MOCK_GET_INPUTS,
      sentryProjectName: '',
      sentryProjectId: '',
      grafanaDashboardLink: '',
      slackWebhookUrls: '',
    }
    const slackMessage = generateSlackMessage(
      MOCK_REPO_LINK,
      MOCK_RELEASE_LINK,
      MOCK_RELEASE_VERSION,
      MOCK_CURRENT_TAG_COMMIT,
      MOCK_PR_LIST_STRING,
      inputs,
      MOCK_REPO,
      MOCK_CURRENT_DATE
    )

    const relatedToolsSection = slackMessage.blocks[8] as SectionBlock

    expect(relatedToolsSection).toBeUndefined()
  })
})
