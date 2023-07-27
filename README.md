# Release notification (Action)

A GitHub Action that sends release notifications to Slack, integrating with JIRA, Sentry, and Grafana.

## Usage

### Screenshot of the Slack notification

![Screenshot of the Slack notification](./screenshots/demo-1.jpg)
### Create Workflow

To use this GitHub Action, you need to create a workflow file (e.g., ``.github/workflows/deploy.yml``) in your repository. Here's an example workflow that runs when a tag matching the pattern `v[0-9]+.[0-9]+.[0-9]+` is pushed:

```yaml
name: Deploy to production

on:
  push:
    # Push/tags only work if you manually created the tag/release using Github GUI
    tags:
      - "v[0-9]+.[0-9]+.[0-9]+"
  # Prefer the workflows/completed, specially if using tools like semantic-release
  workflow_run:
    workflows: ['Production workflow']
    types:
      - completed

jobs:
  release:
    permissions:
      contents: read
      pull-requests: write

    runs-on: ubuntu-latest

    steps:

      - name: Release Notification
        uses: thedaviddias/publish-release-info-action@v1.1.1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          slack_webhook_url: https://hooks.slack.com/services/XXXXXX/XXXXX/XXXXXXX
          jira_ticket_prefix: ABC
          jira_instance_url: https://your-jira-instance.com/browse
          sentry_project_name: MyProject
          sentry_project_id: 1234
          grafana_dashboard_link: https://grafana.com/dashboards/XXXX
          contributor_replace_regex: "--"
          contributor_replace_char: "-"
```

#### Inputs

| Name                        | Required | Default | Description                                                                                               |
| --------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `github_token`              | yes      |         | Token to use to authorize label changes. Typically the GITHUB_TOKEN secret                                |
| `repo`                      | no       |         | Name of the repo (e.g. owner/repo) if not the current one                                                 |
| `contributor_replace_regex` | no       | "-"     | Regular expression (regex) pattern to identify characters in the `contributor` name that will be replaced |
| `contributor_replace_char`  | no       | "."     | The character that will replace specific characters in the `contributor` name                             |
| `slack_webhook_url`         | no       |         | Slack webhook URL to receive release notifications                                                        |
| `jira_ticket_prefix`        | no       |         | Prefix for JIRA ticket references in PR titles (e.g. ABC)                                                 |
| `jira_instance_url`         | no       |         | URL for your JIRA instance to generate JIRA ticket links (e.g. https://your-jira-instance.com/browse)     |
| `sentry_project_name`       | no       |         | ID of the Sentry project for error tracking                                                               |
| `sentry_project_name`       | no       |         | Name of the Sentry project for error tracking                                                             |
| `grafana_dashboard_link`    | no       |         | Link to the Grafana dashboard for monitoring                                                              |


### Outputs

The is the list of the outputs. You can use another action and format the way you want.


```json
{
  "repo": "",
  "repoLink": "",
  "releaseVersion": "",
  "releaseLink": "",
  "currentTagCommit": {
    "url": "",
    "author": {
      "name": "",
      "email": "",
      "date": ""
    }
  },
  "prList": [
    {
      "contributor": "",
      "prTitle": "",
      "prUrl": "",
      "prNumber": 0
    }
  ]
}
```

## Examples

### Example Workflow (Minimum Configuration)

```yaml
name: Deploy to production

on:
  push:
    tags:
      - "v[0-9]+.[0-9]+.[0-9]+"

jobs:
  release:
    permissions:
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Release Notification
        uses: thedaviddias/publish-release-info-action@v1.1.1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}

```

## Licence

This GitHub Action is licensed under the [MIT License](./LICENSE).
