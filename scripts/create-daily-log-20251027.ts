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
                content: '2025-10-27: 基本情報技術者試験の準備開始',
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
            name: '学習習慣化',
          },
        },
        // Work Time
        'Work Time': {
          number: 90, // 1-2時間 = 90分
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
            { name: '基本情報技術者試験' },
            { name: '学習計画' },
            { name: '健康管理' },
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
                content: '📚',
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
                  content: '📅 2025-10-27 の学習記録',
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
                  content: '基本情報技術者試験のMarkdownファイル作成',
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
                  content: '学習資料の整理',
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
                  content: '睡眠不足のため休養を優先',
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
                  content: 'プロジェクト: 学習習慣化',
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
                  content: '作業時間: 1-2時間',
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
                  content: '完了率: 100%（準備段階）',
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
                  content: '資格学習とアプリ開発を並行する戦略が効果的',
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
                  content: '継続的な学習には健康管理（睡眠）が最重要',
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
                  content: '無理せず休むことも「進捗」の一部',
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
                  content: '理論（資格）と実践（開発）の相乗効果',
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
                  content: '睡眠不足により集中力が低下。無理して進めても効率が悪いと判断。',
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
                  content: '短期的対応: 今日は早めに休養',
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
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '今後の対応:',
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
                  content: '毎日7-8時間の睡眠確保',
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
                  content: '学習時間を午前中にシフト（記憶力が高い）',
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
                  content: '資格学習（午前）とアプリ開発（夜）の時間分離',
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
                  content: '基本情報技術者試験の学習準備完了',
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
                  content: '並行学習戦略の立案',
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
                  content: '健康優先の判断（重要）',
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
                  content: 'Markdown形式での資料整理',
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
                  content: '作成したMarkdownの確認・見直し',
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
                  content: '基本情報の学習計画を具体化（試験日、範囲確認）',
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
                  content: 'APIキー取得（OpenAI, Claude, Gemini）',
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
                  content: 'notion-zenn-editorの実運用開始',
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
                  content: '過去問1回分を解いて実力チェック',
                },
              },
            ],
            checked: false,
          },
        },
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '💬 所感',
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
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '睡眠不足を認識して休養を優先したのは正しい判断。明日から資格学習とアプリ開発の並行学習を開始する。基本情報技術者試験で体系的な知識を身につけながら、実践的なアプリ開発も進めることで、理論と実践の両面から成長できる。継続するためには健康管理が最優先。',
                },
              },
            ],
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
