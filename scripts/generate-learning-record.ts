import { NotionClient } from '../lib/notion-client.js'
import { generateZennArticle } from '../lib/zenn-generator.js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// 環境変数を読み込む
dotenv.config({ path: '.env.local' })

async function main() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!apiKey || !databaseId) {
    console.error('❌ NOTION_API_KEY または NOTION_DATABASE_ID が設定されていません')
    console.error('   .env.local ファイルを確認してください')
    process.exit(1)
  }

  console.log('🚀 Notion学習記録からZenn記事を生成します...\n')

  try {
    // Notionクライアントを初期化
    const client = new NotionClient(apiKey)

    // データベース情報を取得
    console.log('📊 データベース情報を取得中...')
    const database = await client.getDatabase(databaseId)
    console.log(`   データベース名: ${database.title[0]?.plain_text || '未設定'}\n`)

    // ページ一覧を取得（最新5件）
    console.log('📄 学習記録ページを取得中...')
    const pages = await client.getPages(databaseId, {
      pageSize: 5,
      // sorts: [{ property: 'Created time', direction: 'descending' }],
    })

    if (pages.length === 0) {
      console.log('⚠️  取得できるページがありません')
      console.log('   Notionデータベースにページを追加してください')
      return
    }

    console.log(`   ${pages.length}件のページを取得しました\n`)

    // 出力ディレクトリを作成
    const outputDir = path.join(process.cwd(), 'output', 'articles')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 各ページからZenn記事を生成
    for (const page of pages) {
      console.log(`\n📝 "${page.title}" を処理中...`)

      // ページのコンテンツ（ブロック）を取得
      const blocks = await client.getBlocks(page.id)
      console.log(`   ${blocks.length}個のブロックを取得しました`)

      // Zenn記事を生成
      const article = generateZennArticle(page, blocks, {
        emoji: '📚',
        type: 'tech',
        topics: ['学習記録', 'notion'],
        published: false,
      })

      // ファイル名を生成（タイトルをサニタイズ）
      const sanitizedTitle = page.title
        .replace(/[/\\?%*:|"<>]/g, '-')
        .substring(0, 50)
      const timestamp = new Date(page.createdTime)
        .toISOString()
        .split('T')[0]
      const filename = `${timestamp}_${sanitizedTitle}.md`
      const filepath = path.join(outputDir, filename)

      // ファイルに保存
      fs.writeFileSync(filepath, article, 'utf-8')
      console.log(`   ✅ 保存完了: ${filename}`)
    }

    console.log('\n🎉 すべての記事の生成が完了しました!')
    console.log(`📁 出力先: ${outputDir}`)
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('   詳細:', error.message)
    }
    process.exit(1)
  }
}

main()
