import { BacklogIssue, BacklogComment } from './backlog-client'
import { formatDate } from './utils'

export interface ZennArticleOptions {
  title?: string
  emoji?: string
  type?: 'tech' | 'idea'
  topics?: string[]
  published?: boolean
}

/**
 * Backlogの課題とコメントからZenn記事を生成
 */
export function generateZennArticle(
  issue: BacklogIssue,
  comments: BacklogComment[],
  options?: ZennArticleOptions
): string {
  const title = options?.title || issue.summary
  const emoji = options?.emoji || '📝'
  const type = options?.type || 'tech'
  const topics = options?.topics || ['backlog', '学習記録']
  const published = options?.published ?? false

  // Frontmatter
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `emoji: "${emoji}"`,
    `type: "${type}"`,
    `topics: [${topics.map(t => `"${t}"`).join(', ')}]`,
    `published: ${published}`,
    '---',
  ].join('\n')

  // 記事本文
  const body = []

  // はじめに
  body.push('## はじめに\n')
  body.push(`${formatDate(issue.created)}に取り組んだ内容をまとめます。\n`)

  // 課題の説明
  if (issue.description) {
    body.push('## 取り組んだこと\n')
    body.push(`${issue.description}\n`)
  }

  // コメントから学習内容を抽出
  if (comments.length > 0) {
    body.push('## 学習内容・気づき\n')

    comments.forEach((comment) => {
      const date = formatDate(comment.created)
      body.push(`### ${date}\n`)
      body.push(`${comment.content}\n`)
    })
  }

  // 工数情報
  if (issue.estimatedHours || issue.actualHours) {
    body.push('## 作業時間\n')
    if (issue.estimatedHours) {
      body.push(`- 予定: ${issue.estimatedHours}時間`)
    }
    if (issue.actualHours) {
      body.push(`- 実績: ${issue.actualHours}時間`)
    }
    body.push('')
  }

  // まとめ
  body.push('## まとめ\n')
  body.push('今回の学習を通じて、以下のことを学びました：\n')
  body.push('- （ここに学びを追記してください）\n')

  return [frontmatter, '', body.join('\n')].join('\n')
}

/**
 * 複数の課題から週次レポートを生成
 */
export function generateWeeklyReport(
  issues: Array<{ issue: BacklogIssue; comments: BacklogComment[] }>,
  weekStart: Date,
  options?: ZennArticleOptions
): string {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const title = options?.title || `学習記録 ${formatDate(weekStart)} - ${formatDate(weekEnd)}`
  const emoji = options?.emoji || '📚'
  const type = options?.type || 'tech'
  const topics = options?.topics || ['学習記録', '週次レポート']
  const published = options?.published ?? false

  // Frontmatter
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `emoji: "${emoji}"`,
    `type: "${type}"`,
    `topics: [${topics.map(t => `"${t}"`).join(', ')}]`,
    `published: ${published}`,
    '---',
  ].join('\n')

  // 記事本文
  const body = []

  body.push('## はじめに\n')
  body.push(`${formatDate(weekStart)}から${formatDate(weekEnd)}までの学習記録です。\n`)

  body.push('## 今週の取り組み\n')

  issues.forEach(({ issue, comments }) => {
    body.push(`### ${issue.summary}\n`)

    if (issue.description) {
      body.push(`${issue.description}\n`)
    }

    if (comments.length > 0) {
      body.push('**学習内容・気づき**:\n')
      comments.forEach((comment) => {
        body.push(`- ${comment.content.split('\n')[0]}...`)
      })
      body.push('')
    }

    if (issue.actualHours) {
      body.push(`作業時間: ${issue.actualHours}時間\n`)
    }
  })

  // 合計時間
  const totalHours = issues.reduce((sum, { issue }) => sum + (issue.actualHours || 0), 0)
  if (totalHours > 0) {
    body.push(`## 今週の合計作業時間\n`)
    body.push(`${totalHours}時間\n`)
  }

  body.push('## 来週の目標\n')
  body.push('- （ここに来週の目標を記入してください）\n')

  return [frontmatter, '', body.join('\n')].join('\n')
}
