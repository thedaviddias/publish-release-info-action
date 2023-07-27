import * as github from '@actions/github'

/**
 * Get the base URL for a repo from the context
 *
 * @returns {string} The base URL.
 */
export function getBaseUrlFromContext(): string {
  const repoUrl = github.context.payload.repository?.html_url || ''
  const baseUrlParts = repoUrl.split('/')
  return baseUrlParts.slice(0, 3).join('/')
}
