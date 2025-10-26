import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function test() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  const notion = new Client({ auth: apiKey })

  console.log('Testing different query methods...\n')

  // Try method 1: search for data_source
  try {
    console.log('1. Testing search method with data_source...')
    const searchResult = await notion.search({
      filter: {
        value: 'data_source',
        property: 'object'
      }
    })
    console.log('Search results:', searchResult.results.length, 'items')
    if (searchResult.results.length > 0) {
      console.log('First result ID:', searchResult.results[0].id)
      console.log('Full result:', JSON.stringify(searchResult.results[0], null, 2))
    }
  } catch (error: any) {
    console.log('Search failed:', error.message)
  }

  // Try method 2: Check if we can access the database via pages
  try {
    console.log('\n2. Testing page query directly...')
    // @ts-ignore - trying undocumented API
    const result = await notion.request({
      path: `databases/${databaseId}/query`,
      method: 'post',
      body: {
        page_size: 5
      }
    })
    console.log('Direct query succeeded!')
    console.log('Results:', result)
  } catch (error: any) {
    console.log('Direct query failed:', error.message)
  }
}

test()
