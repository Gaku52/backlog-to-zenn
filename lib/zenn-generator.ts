import { NotionPage, NotionBlock } from './notion-client'
import { formatDate } from './utils'

export interface ZennArticleOptions {
  title?: string
  emoji?: string
  type?: 'tech' | 'idea'
  topics?: string[]
  published?: boolean
}

/**
 * NotionページからZenn記事を生成
 */
export function generateZennArticle(
  page: NotionPage,
  blocks: NotionBlock[],
  options?: ZennArticleOptions
): string {
  const title = options?.title || page.title
  const emoji = options?.emoji || '📝'
  const type = options?.type || 'tech'
  const topics = options?.topics || ['notion', '学習記録']
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
  body.push(`${formatDate(page.createdTime)}に取り組んだ内容をまとめます。\n`)

  // Notionのコンテンツを変換
  if (blocks.length > 0) {
    body.push('## 学習内容\n')
    body.push(convertBlocksToMarkdown(blocks))
    body.push('')
  }

  // まとめ
  body.push('## まとめ\n')
  body.push('今回の学習を通じて、以下のことを学びました：\n')
  body.push('- （ここに学びを追記してください）\n')

  return [frontmatter, '', body.join('\n')].join('\n')
}

/**
 * 複数のNotionページから週次レポートを生成
 */
export function generateWeeklyReport(
  pages: Array<{ page: NotionPage; blocks: NotionBlock[] }>,
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

  pages.forEach(({ page, blocks }) => {
    body.push(`### ${page.title}\n`)
    body.push(`作成日: ${formatDate(page.createdTime)}\n`)

    if (blocks.length > 0) {
      const summary = blocks
        .filter(b => b.content.trim().length > 0)
        .slice(0, 3)
        .map(b => `- ${b.content.split('\n')[0]}`)
        .join('\n')

      if (summary) {
        body.push('**主な内容**:\n')
        body.push(summary)
        body.push('')
      }
    }
  })

  body.push('## 来週の目標\n')
  body.push('- （ここに来週の目標を記入してください）\n')

  return [frontmatter, '', body.join('\n')].join('\n')
}

/**
 * NotionブロックをMarkdownに変換
 */
function convertBlocksToMarkdown(blocks: NotionBlock[]): string {
  const lines: string[] = []

  blocks.forEach((block) => {
    if (!block.content.trim()) return

    switch (block.type) {
      case 'heading_1':
        lines.push(`# ${block.content}`)
        break
      case 'heading_2':
        lines.push(`## ${block.content}`)
        break
      case 'heading_3':
        lines.push(`### ${block.content}`)
        break
      case 'paragraph':
        lines.push(block.content)
        break
      case 'bulleted_list_item':
        lines.push(`- ${block.content}`)
        break
      case 'numbered_list_item':
        lines.push(`1. ${block.content}`)
        break
      case 'to_do':
        lines.push(`- ${block.content}`)
        break
      case 'code':
        lines.push('```')
        lines.push(block.content)
        lines.push('```')
        break
      case 'quote':
        lines.push(`> ${block.content}`)
        break
      default:
        lines.push(block.content)
    }
  })

  return lines.join('\n')
}
