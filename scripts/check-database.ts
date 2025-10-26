import { Client } from '@notionhq/client'
import * as dotenv from 'dotenv'

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

async function checkDatabase() {
  try {
    const database = await notion.dataSources.retrieve({ data_source_id: databaseId! })

    console.log('📊 データベース情報:')
    console.log('名前:', (database as any).title?.[0]?.plain_text || 'N/A')
    console.log('\n📋 プロパティ一覧:')

    const properties = (database as any).properties
    for (const [name, prop] of Object.entries(properties)) {
      console.log(`- ${name} (${(prop as any).type})`)
    }
  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

checkDatabase()
