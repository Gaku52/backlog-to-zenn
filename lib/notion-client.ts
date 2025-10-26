import { Client } from '@notionhq/client'
import type {
  GetBlockResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface NotionPage {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
  properties: PageObjectResponse['properties']
  url: string
  // Zennメタデータ
  zennMetadata?: {
    emoji?: string
    type?: 'tech' | 'idea'
    topics?: string[]
    published?: boolean
    status?: string
  }
}

export interface NotionBlock {
  id: string
  type: string
  content: string
  createdTime: string
  lastEditedTime: string
  language?: string // コードブロックの言語
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter?: any
  }): Promise<NotionPage[]> {
    try {
      const response = await this.client.dataSources.query({
        data_source_id: databaseId,
        page_size: options?.pageSize || 100,
        sorts: options?.sorts,
        filter: options?.filter,
      })

      return response.results.map((page) => this.formatPage(page as PageObjectResponse))
    } catch (error) {
      throw new Error(`Failed to fetch pages from database ${databaseId}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * ページの詳細を取得
   */
  async getPage(pageId: string): Promise<NotionPage> {
    try {
      const response = await this.client.pages.retrieve({ page_id: pageId })
      return this.formatPage(response as PageObjectResponse)
    } catch (error) {
      throw new Error(`Failed to fetch page ${pageId}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * ページのコンテンツ（ブロック）を取得
   */
  async getBlocks(pageId: string): Promise<NotionBlock[]> {
    try {
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
    } catch (error) {
      throw new Error(`Failed to fetch blocks from page ${pageId}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * データベース情報を取得
   */
  async getDatabase(databaseId: string) {
    try {
      return await this.client.dataSources.retrieve({ data_source_id: databaseId })
    } catch (error) {
      throw new Error(`Failed to retrieve database ${databaseId}: ${error instanceof Error ? error.message : String(error)}`)
    }
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

    // Zennメタデータを抽出
    const zennMetadata = this.extractZennMetadata(page.properties)

    return {
      id: page.id,
      title,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      properties: page.properties,
      url: page.url,
      zennMetadata,
    }
  }

  /**
   * NotionプロパティからZennメタデータを抽出
   */
  private extractZennMetadata(properties: PageObjectResponse['properties']): NotionPage['zennMetadata'] {
    const metadata: NotionPage['zennMetadata'] = {}

    // Emoji プロパティを取得
    const emojiProp = properties['Emoji'] || properties['emoji']
    if (emojiProp && emojiProp.type === 'rich_text' && emojiProp.rich_text.length > 0) {
      metadata.emoji = emojiProp.rich_text[0].plain_text
    }

    // Type プロパティを取得
    const typeProp = properties['Type'] || properties['type']
    if (typeProp && typeProp.type === 'select' && typeProp.select) {
      const typeValue = typeProp.select.name.toLowerCase()
      if (typeValue === 'tech' || typeValue === 'idea') {
        metadata.type = typeValue as 'tech' | 'idea'
      }
    }

    // Topics プロパティを取得
    const topicsProp = properties['Topics'] || properties['topics'] || properties['Tags'] || properties['tags']
    if (topicsProp && topicsProp.type === 'multi_select' && topicsProp.multi_select.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata.topics = topicsProp.multi_select.map((tag: any) => tag.name).slice(0, 5) // Zennは最大5個
    }

    // Published プロパティを取得
    const publishedProp = properties['Published'] || properties['published']
    if (publishedProp && publishedProp.type === 'checkbox') {
      metadata.published = publishedProp.checkbox
    }

    // Status プロパティを取得
    const statusProp = properties['Status'] || properties['status']
    if (statusProp && statusProp.type === 'select' && statusProp.select) {
      metadata.status = statusProp.select.name
    }

    return metadata
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
        return {
          id: block.id,
          type: blockType,
          content,
          createdTime: block.created_time,
          lastEditedTime: block.last_edited_time,
          language: block.code.language || 'plaintext',
        }
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
