import { Client } from '@notionhq/client'
import {
  QueryDatabaseResponse,
  GetPageResponse,
  GetBlockResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface NotionPage {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
  properties: Record<string, any>
  url: string
}

export interface NotionBlock {
  id: string
  type: string
  content: string
  createdTime: string
  lastEditedTime: string
}

export class NotionClient {
  private client: Client

  constructor(apiKey: string) {
    this.client = new Client({
      auth: apiKey,
    })
  }

  /**
   * データベースからページ一覧を取得
   */
  async getPages(databaseId: string, options?: {
    pageSize?: number
    sorts?: Array<{ property: string; direction: 'ascending' | 'descending' }>
    filter?: any
  }): Promise<NotionPage[]> {
    const response = await this.client.dataSources.query({
      data_source_id: databaseId,
      page_size: options?.pageSize || 100,
      sorts: options?.sorts,
      filter: options?.filter,
    })

    return response.results.map((page) => this.formatPage(page as PageObjectResponse))
  }

  /**
   * ページの詳細を取得
   */
  async getPage(pageId: string): Promise<NotionPage> {
    const response = await this.client.pages.retrieve({ page_id: pageId })
    return this.formatPage(response as PageObjectResponse)
  }

  /**
   * ページのコンテンツ（ブロック）を取得
   */
  async getBlocks(pageId: string): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = []
    let hasMore = true
    let startCursor: string | undefined = undefined

    while (hasMore) {
      const response = await this.client.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
      })

      for (const block of response.results) {
        const formattedBlock = await this.formatBlock(block as GetBlockResponse)
        blocks.push(formattedBlock)

        // 子ブロックがある場合は再帰的に取得
        if ('has_children' in block && block.has_children) {
          const childBlocks = await this.getBlocks(block.id)
          blocks.push(...childBlocks)
        }
      }

      hasMore = response.has_more
      startCursor = response.next_cursor || undefined
    }

    return blocks
  }

  /**
   * データベース情報を取得
   */
  async getDatabase(databaseId: string) {
    return await this.client.dataSources.retrieve({ data_source_id: databaseId })
  }

  /**
   * ページオブジェクトを整形
   */
  private formatPage(page: PageObjectResponse): NotionPage {
    // タイトルを取得
    let title = 'Untitled'
    const titleProperty = Object.values(page.properties).find(
      (prop) => prop.type === 'title'
    )
    if (titleProperty && titleProperty.type === 'title' && titleProperty.title.length > 0) {
      title = titleProperty.title.map((t) => t.plain_text).join('')
    }

    return {
      id: page.id,
      title,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      properties: page.properties,
      url: page.url,
    }
  }

  /**
   * ブロックオブジェクトを整形
   */
  private async formatBlock(block: GetBlockResponse): Promise<NotionBlock> {
    let content = ''

    if (!('type' in block)) {
      return {
        id: block.id,
        type: 'unknown',
        content: '',
        createdTime: '',
        lastEditedTime: '',
      }
    }

    const blockType = block.type

    // ブロックタイプに応じてコンテンツを抽出
    switch (blockType) {
      case 'paragraph':
        content = block.paragraph.rich_text.map((t) => t.plain_text).join('')
        break
      case 'heading_1':
        content = block.heading_1.rich_text.map((t) => t.plain_text).join('')
        break
      case 'heading_2':
        content = block.heading_2.rich_text.map((t) => t.plain_text).join('')
        break
      case 'heading_3':
        content = block.heading_3.rich_text.map((t) => t.plain_text).join('')
        break
      case 'bulleted_list_item':
        content = block.bulleted_list_item.rich_text.map((t) => t.plain_text).join('')
        break
      case 'numbered_list_item':
        content = block.numbered_list_item.rich_text.map((t) => t.plain_text).join('')
        break
      case 'to_do':
        const checked = block.to_do.checked ? '[x]' : '[ ]'
        const todoText = block.to_do.rich_text.map((t) => t.plain_text).join('')
        content = `${checked} ${todoText}`
        break
      case 'code':
        content = block.code.rich_text.map((t) => t.plain_text).join('')
        break
      case 'quote':
        content = block.quote.rich_text.map((t) => t.plain_text).join('')
        break
      default:
        content = ''
    }

    return {
      id: block.id,
      type: blockType,
      content,
      createdTime: block.created_time,
      lastEditedTime: block.last_edited_time,
    }
  }
}
