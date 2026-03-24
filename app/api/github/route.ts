import { NextResponse } from 'next/server'
import { REPO_CATEGORY_MAP } from '@/lib/data'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = 'LeparaLaMapara'

interface ContributionNode {
  occurredAt: string
  commitCount: number
}

interface RepoContribution {
  repository: { nameWithOwner: string }
  contributions: { nodes: ContributionNode[] }
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    )
  }

  const query = `{
    user(login: "${USERNAME}") {
      contributionsCollection {
        commitContributionsByRepository(maxRepositories: 100) {
          repository { nameWithOwner }
          contributions(first: 100, orderBy: { direction: DESC }) {
            nodes { occurredAt commitCount }
          }
        }
      }
    }
  }`

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'GitHub API error' },
        { status: res.status }
      )
    }

    const data = await res.json()
    const repos: RepoContribution[] =
      data.data.user.contributionsCollection.commitContributionsByRepository

    // Build a map: category -> { date -> count }
    const categoryContributions: Record<string, Record<string, number>> = {}

    for (const repo of repos) {
      const repoName = repo.repository.nameWithOwner
      const category = REPO_CATEGORY_MAP[repoName]
      if (!category) continue

      if (!categoryContributions[category]) {
        categoryContributions[category] = {}
      }

      for (const node of repo.contributions.nodes) {
        const date = node.occurredAt.split('T')[0]
        categoryContributions[category][date] =
          (categoryContributions[category][date] || 0) + node.commitCount
      }
    }

    return NextResponse.json(categoryContributions)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    )
  }
}
