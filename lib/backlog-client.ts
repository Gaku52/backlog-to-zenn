import axios, { AxiosInstance } from 'axios'

export interface BacklogIssue {
  id: number
  issueKey: string
  summary: string
  description: string
  status: {
    id: number
    name: string
  }
  priority: {
    id: number
    name: string
  }
  assignee?: {
    id: number
    name: string
  }
  created: string
  updated: string
  estimatedHours?: number
  actualHours?: number
}

export interface BacklogComment {
  id: number
  content: string
  createdUser: {
    id: number
    name: string
  }
  created: string
  updated: string
}

export class BacklogClient {
  private client: AxiosInstance

  constructor(spaceKey: string, apiKey: string) {
    this.client = axios.create({
      baseURL: `https://${spaceKey}.backlog.com/api/v2`,
      params: {
        apiKey,
      },
    })
  }

  /**
   * 課題一覧を取得
   */
  async getIssues(projectId: number, options?: {
    count?: number
    offset?: number
    statusId?: number[]
  }): Promise<BacklogIssue[]> {
    const response = await this.client.get<BacklogIssue[]>('/issues', {
      params: {
        projectId: [projectId],
        count: options?.count || 100,
        offset: options?.offset || 0,
        ...(options?.statusId && { statusId: options.statusId }),
      },
    })
    return response.data
  }

  /**
   * 課題の詳細を取得
   */
  async getIssue(issueIdOrKey: string | number): Promise<BacklogIssue> {
    const response = await this.client.get<BacklogIssue>(`/issues/${issueIdOrKey}`)
    return response.data
  }

  /**
   * 課題のコメント一覧を取得
   */
  async getComments(issueIdOrKey: string | number, options?: {
    count?: number
    order?: 'asc' | 'desc'
  }): Promise<BacklogComment[]> {
    const response = await this.client.get<BacklogComment[]>(
      `/issues/${issueIdOrKey}/comments`,
      {
        params: {
          count: options?.count || 100,
          order: options?.order || 'asc',
        },
      }
    )
    return response.data
  }

  /**
   * プロジェクト一覧を取得
   */
  async getProjects(): Promise<Array<{ id: number; name: string; projectKey: string }>> {
    const response = await this.client.get('/projects')
    return response.data
  }
}
