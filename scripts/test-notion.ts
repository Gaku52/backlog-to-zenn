import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function test() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  console.log('API Key:', apiKey?.substring(0, 10) + '...')
  console.log('Database ID:', databaseId)

  const notion = new Client({ auth: apiKey })

  console.log('\nNotion client created:', notion)
  console.log('dataSources:', notion.dataSources)
  console.log('dataSources.query:', typeof notion.dataSources.query)

  try {
    const database = await notion.dataSources.retrieve({ data_source_id: databaseId! })
    console.log('\nDatabase retrieved successfully!')
    console.log('Title:', (database as any).title?.[0]?.plain_text)
  } catch (error) {
    console.error('Error:', error)
  }
}

test()
