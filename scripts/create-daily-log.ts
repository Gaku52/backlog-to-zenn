import { Client } from '@notionhq/client'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const apiKey = process.env.NOTION_API_KEY
const databaseId = process.env.NOTION_DATABASE_ID

if (!apiKey || !databaseId) {
  console.error('❌ エラー: 環境変数が設定されていません')
  console.error('NOTION_API_KEY と NOTION_DATABASE_ID を .env.local に設定してください')
  process.exit(1)
}

const notion = new Client({
  auth: apiKey,
})

async function createDailyLog() {
  try {
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: databaseId!,
      },
      properties: {
        // タイトル
        title: {
          title: [
            {
              text: {
                content: '2025-10-26: Notion to Zenn リポジトリ構築と運用設計の学習',
              },
            },
          ],
        },
        // Entry Type
        'Entry Type': {
          select: {
            name: 'デイリーログ',
          },
        },
        // Project
        Project: {
          select: {
            name: 'notion-zenn-editor',
          },
        },
        // Work Time
        'Work Time': {
          number: 240,
        },
        // Progress
        Progress: {
          select: {
            name: '🟢 順調',
          },
        },
        // Topics
        Topics: {
          multi_select: [
            { name: 'Notion' },
            { name: 'TypeScript' },
            { name: 'リポジトリ設計' },
            { name: 'セキュリティ' },
          ],
        },
        // Status
        Status: {
          select: {
            name: '下書き',
          },
        },
        // Type
        Type: {
          select: {
            name: 'tech',
          },
        },
        // Emoji
        Emoji: {
          rich_text: [
            {
              text: {
                content: '📝',
              },
            },
          ],
        },
        // Published
        Published: {
          checkbox: false,
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '📅 2025-10-26 の学習記録',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '🎯 今日やったこと',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Notion to Zenn のリポジトリ構築',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Notionデータベース設計と運用フロー設計',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Notion API を使ったメタデータ抽出機能の実装',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '基本情報技術者試験のセキュリティ分野学習',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Windows/Mac 両環境での開発環境構築',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '📊 進捗',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'プロジェクト: notion-zenn-editor',
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '作業時間: 240分（12:30-13:30、20:30-23:30）',
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '進捗状況: 🟢 順調',
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '完了率: 80%',
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '📚 学んだこと',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Notion API のプロパティ構造（rich_text, select, multi_select, checkbox）',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'TypeScript での型定義とオプショナルフィールドの扱い方',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    '実運用のための運用設計の重要性（技術実装よりも運用フローが重要）',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Notionデータベースをデータソースとした記事生成の仕組み',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '基本情報技術者試験：セキュリティ分野の基礎知識',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '🚧 つまづいた点',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Mac のターミナルが消えてしまう問題: トラックパッドの操作中にターミナルが消えてしまった。おそらくトラックパッドのジェスチャー（スワイプ等）を誤って実行。Mac の操作に不慣れなため、15分ほどロス。',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '💡 解決方法',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    '短期的対応: Dock からターミナルを再起動して作業を継続。今後の対応: Mac のトラックパッドジェスチャー一覧を確認し、システム環境設定でジェスチャーをカスタマイズする予定。',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '✅ 達成したこと',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Notion to Zenn コンバーターの基盤完成',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Notionデータベース設計完了（プロパティ、ビュー、テンプレート）',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '作業終了時の進捗記録ワークフロー設計完了',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'ドキュメント6つ作成（合計約2400行）',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'TypeScript コード実装（Notion プロパティ自動抽出）',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Windows/Mac 両環境での開発環境構築',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '🎯 次に学ぶこと・やること',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Notionの運用を実際に開始（このツールを使って継続）',
                },
              },
            ],
            checked: false,
          },
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '次のアプリケーション開発のアイデアだし',
                },
              },
            ],
            checked: false,
          },
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'アイデアの選定と検討、可能であれば決定',
                },
              },
            ],
            checked: false,
          },
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Mac のトラックパッドジェスチャー習得',
                },
              },
            ],
            checked: false,
          },
        },
      ],
    })

    console.log('✅ Notionにデイリーログを作成しました！')
    console.log('📄 ページURL:', (response as any).url || response.id)
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('詳細:', error.message)
    }
  }
}

createDailyLog()
