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

  // 本日の日付
  const today = new Date().toISOString().split('T')[0]

  // 登録するデータ
  const title = 'Notion-Zenn-Editorの構築とClaude CodeとNotionの接続の再確認'
  const content = `学習内容と成果:
- アプリケーション構築におけるsupabaseとVercel、GithubActionsの構築について
- spark-vaultの構築`

  console.log('📝 Notionに学習記録を登録します...\n')
  console.log(`タイトル: ${title}`)
  console.log(`日付: ${today}\n`)

  try {
    // Notion APIでページを作成
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: {
          database_id: databaseId,
        },
        properties: {
          // タイトルプロパティ
          Name: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
          // 日付プロパティ
          '日付': {
            date: {
              start: today,
            },
          },
          // ステータス
          'ステータス': {
            select: {
              name: '完了',
            },
          },
          // カテゴリ
          'カテゴリ': {
            multi_select: [
              { name: 'Notion' },
              { name: 'DevOps' },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ エラー:', error)
      throw new Error(error.message || 'Failed to create page')
    }

    const data = await response.json()
    console.log('✅ 登録完了しました！')
    console.log(`📄 ページURL: ${data.url}`)
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('   詳細:', error.message)
    }
    process.exit(1)
  }
}

main()
