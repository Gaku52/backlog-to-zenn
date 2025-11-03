---
title: "Notion × Claude Code × Zenn で実現する自動記事投稿システムの構築"
emoji: "🤖"
type: "tech"
topics: ["notion", "zenn", "githubactions", "typescript", "claudecode"]
published: false
---

## はじめに

学習記録をNotionで管理し、それを自動的にZenn記事として投稿できる仕組みを構築しました。本記事では、Notion API、Claude Code、Zenn CLI、GitHub Actionsを組み合わせた自動化システムの構築手順を詳しく解説します。

## システム概要

### アーキテクチャ

```
Notion（学習記録DB）
    ↓ Notion API
TypeScript（記事生成）
    ↓ Markdown出力
articles/ディレクトリ
    ↓ GitHub Push
Zenn（自動デプロイ）
```

### 技術スタック

- **Notion API**: 学習記録データベースからのデータ取得
- **TypeScript**: 記事生成ロジック
- **Zenn CLI**: Zenn形式のMarkdown管理
- **GitHub Actions**: 週次自動実行
- **Claude Code**: 開発支援・デバッグ

---

## 1. Notion APIとの接続確立

### 1-1. Notion Integrationの作成

1. **Notion Integrationsページにアクセス**
   ```
   https://www.notion.so/my-integrations
   ```

2. **「+ New integration」をクリック**
   - Name: 任意の名前（例: zen-editor）
   - Associated workspace: 対象のワークスペースを選択

3. **Internal Integration Tokenを取得**
   - `ntn_` で始まるAPIキーが発行される
   - このキーは後で使用するため、安全に保管

### 1-2. Capabilitiesの設定

Integrationsページで以下の権限を有効化：

```
✅ コンテンツを読み取る (Read content)
✅ コンテンツを更新 (Update content)
✅ コンテンツを挿入 (Insert content)
✅ コメントの読み取り (Read comments)
✅ コメントを挿入 (Insert comments)
```

### 1-3. データベースとの接続

1. Notionで学習記録データベースを開く
2. 右上の「**...**」メニューをクリック
3. 「**接続を追加**」をクリック
4. 作成したインテグレーションを選択
5. 「許可」をクリック

**重要**: この手順を忘れると `object_not_found` エラーが発生します。

### 1-4. データベースIDの取得

データベースのURLから32文字のIDを取得：

```
https://www.notion.so/298a438d9c2d8061bda1d538e8a81ed6?v=...
                    ↑ この部分がデータベースID
```

---

## 2. Notion-Zenn-Editorの実装

### 2-1. プロジェクトのセットアップ

```bash
mkdir notion-zenn-editor
cd notion-zenn-editor
npm init -y

# 依存関係のインストール
npm install @notionhq/client dotenv
npm install -D typescript tsx @types/node
```

### 2-2. 環境変数の設定

`.env.local` を作成：

```env
NOTION_API_KEY=ntn_your_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

### 2-3. Notion APIクライアントの実装

**重要な実装ポイント**：

#### 問題1: SDKのAPIバージョン

最初、`@notionhq/client` のSDK経由でAPIを呼び出そうとしましたが、`databases.query` メソッドが存在せず、エラーが発生しました。

**解決策**: 直接 `fetch` APIを使用してNotion APIを呼び出す：

\`\`\`typescript:lib/notion-client.ts
async getPages(databaseId: string, options?: {
  pageSize?: number
  sorts?: Array<{ property: string; direction: 'ascending' | 'descending' }>
  filter?: any
}): Promise<NotionPage[]> {
  try {
    // 直接APIリクエストを送信
    const response = await fetch(\`https://api.notion.com/v1/databases/\${databaseId}/query\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: options?.pageSize || 100,
        sorts: options?.sorts,
        filter: options?.filter,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to query database')
    }

    const data = await response.json()
    return data.results.map((page: any) => this.formatPage(page as PageObjectResponse))
  } catch (error) {
    throw new Error(\`Failed to fetch pages: \${error instanceof Error ? error.message : String(error)}\`)
  }
}
\`\`\`

#### 問題2: ブロックの取得

ページのコンテンツ（ブロック）を取得する際は、SDK の `blocks.children.list` が使用できます：

\`\`\`typescript:lib/notion-client.ts
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
\`\`\`

### 2-4. Zenn記事生成スクリプト

\`\`\`typescript:scripts/generate-learning-record.ts
import { NotionClient } from '@/lib/notion-client'
import { generateZennArticle } from '@/lib/zenn-generator'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!apiKey || !databaseId) {
    console.error('❌ 環境変数が設定されていません')
    process.exit(1)
  }

  const client = new NotionClient(apiKey)

  // データベースからページを取得
  const pages = await client.getPages(databaseId, {
    pageSize: 5,
  })

  const outputDir = path.join(process.cwd(), 'output', 'articles')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const page of pages) {
    const blocks = await client.getBlocks(page.id)
    const article = generateZennArticle(page, blocks, {
      emoji: '📚',
      type: 'tech',
      topics: ['学習記録', 'notion'],
      published: false,
    })

    // Zenn形式のファイル名を生成
    const slug = page.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)

    const timestamp = Date.now().toString(36)
    const filename = slug.length >= 12 ? \`\${slug}.md\` : \`\${slug}-\${timestamp}.md\`

    fs.writeFileSync(path.join(outputDir, filename), article, 'utf-8')
    console.log(\`✅ 保存完了: \${filename}\`)
  }
}

main()
\`\`\`

**重要**: Zennのファイル名は以下の規則に従う必要があります：
- 英数字とハイフン（-）のみ
- 12〜50文字
- 例: `notion-zenn-editor-setup.md`

### 2-5. package.jsonにスクリプト追加

\`\`\`json:package.json
{
  "scripts": {
    "generate": "tsx scripts/generate-learning-record.ts"
  }
}
\`\`\`

---

## 3. Zenn CLIのセットアップ

### 3-1. Zenn CLIのインストール

\`\`\`bash
npm install zenn-cli
\`\`\`

### 3-2. Zennディレクトリの初期化

\`\`\`bash
npx zenn init
\`\`\`

これにより、以下のディレクトリが作成されます：
- `articles/` - Zenn記事を配置
- `books/` - Zennの本を配置（オプション）

### 3-3. GitHubリポジトリとZennの連携

1. **Zennにログイン** (https://zenn.dev/)
2. **ダッシュボード → GitHubからのデプロイ**
3. **リポジトリを連携**
   - 対象リポジトリを選択
   - ブランチを `main` に設定
4. **連携完了**

これで、`articles/` ディレクトリにMarkdownファイルをプッシュすると、自動的にZennに反映されます。

---

## 4. GitHub Actionsによる自動化

### 4-1. ワークフローファイルの作成

\`\`\`.github/workflows/generate-articles.yml
name: Generate Zenn Articles from Notion

on:
  # 毎週日曜日の22時（JST）に実行
  schedule:
    - cron: '0 13 * * 0'  # UTC 13:00 = JST 22:00

  # 手動実行も可能
  workflow_dispatch:

jobs:
  generate-and-publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.local
        run: |
          echo "NOTION_API_KEY=\${{ secrets.NOTION_API_KEY }}" >> .env.local
          echo "NOTION_DATABASE_ID=\${{ secrets.NOTION_DATABASE_ID }}" >> .env.local

      - name: Generate articles from Notion
        run: npm run generate

      - name: Copy articles to Zenn directory
        run: |
          cp -f output/articles/*.md articles/ 2>/dev/null || echo "No new articles"

      - name: Check for changes
        id: check_changes
        run: |
          git diff --quiet articles/ || echo "has_changes=true" >> \$GITHUB_OUTPUT

      - name: Commit and push if changes exist
        if: steps.check_changes.outputs.has_changes == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add articles/
          git commit -m "chore: 週末の学習記録を自動生成"
          git push

      - name: No changes detected
        if: steps.check_changes.outputs.has_changes != 'true'
        run: echo "📝 新しい記事はありませんでした"
\`\`\`

### 4-2. GitHub Secretsの設定

リポジトリの `Settings` → `Secrets and variables` → `Actions` で以下を追加：

- **NOTION_API_KEY**: Notion Integration Token
- **NOTION_DATABASE_ID**: NotionデータベースID

**重要**: アンダースコア（_）は使用可能です。使えない文字は小文字、ハイフン（-）、特殊文字です。

---

## 5. トラブルシューティング

### 5-1. `object_not_found` エラー

**症状**:
\`\`\`
Could not find database with ID: xxx. Make sure the relevant pages
and databases are shared with your integration.
\`\`\`

**原因**: データベースがインテグレーションと接続されていない

**解決策**:
1. Notionでデータベースを開く
2. 右上「...」→「接続を追加」
3. インテグレーションを選択

### 5-2. データベース情報は取得できるがページが取得できない

**症状**:
\`\`\`
データベース名: 学習記録  ← 成功
Failed to fetch pages  ← 失敗
\`\`\`

**原因**: インテグレーションの権限（Capabilities）が不足

**解決策**:
Notion Integrationsページで「Read content」権限を有効化

### 5-3. `this.client.databases.query is not a function`

**症状**: SDKのメソッドが存在しない

**原因**: `@notionhq/client` v5.3.0のバージョンで一部APIが未実装

**解決策**: 直接 `fetch` APIを使用（本記事の実装例を参照）

### 5-4. Zennに記事が表示されない

**症状**: GitHubには記事があるが、Zennのダッシュボードに表示されない

**原因**: ファイル名がZennの規則に違反

**NG例**:
- `2025-10-26_AWS Lambda入門.md` （日本語、アンダースコア）
- `my-article.md` （12文字未満）

**OK例**:
- `notion-zenn-editor-setup.md`
- `aws-lambda-basics.md`

**解決策**: ファイル名を英数字とハイフン（-）のみ、12〜50文字に修正

---

## 6. 追加実装: 進捗記録の自動登録

学習完了後、Notionに進捗を自動登録する機能も実装しました。

\`\`\`typescript:scripts/add-learning-record.ts
async function addLearningRecord(title: string, content: string) {
  const today = new Date().toISOString().split('T')[0]

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [{ text: { content: title } }],
        },
        '日付': {
          date: { start: today },
        },
        'ステータス': {
          select: { name: '完了' },
        },
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
            rich_text: [{ type: 'text', text: { content } }],
          },
        },
      ],
    }),
  })

  const data = await response.json()
  console.log(\`✅ 登録完了: \${data.url}\`)
}
\`\`\`

---

## 運用フロー

### 日常の運用

1. **Notionで学習記録を書く**
   - 学習内容、気づき、メモなどを記録
   - プロパティ（カテゴリ、ステータス）を設定

2. **記事を生成（手動）**
   \`\`\`bash
   npm run generate
   \`\`\`

3. **GitHubにプッシュ**
   \`\`\`bash
   git add .
   git commit -m "feat: 新しい学習記録を追加"
   git push
   \`\`\`

4. **Zennに自動反映**
   - 1〜2分で自動的にZennに記事が公開される

### 週次の自動実行

- **毎週日曜日22時（JST）** に自動的に実行
- 新しい学習記録があれば自動的に記事が生成される
- GitHub Actionsが自動的にコミット＆プッシュ

---

## まとめ

### 構築できたこと

✅ Notion APIとの接続確立
✅ 学習記録からZenn記事への自動変換
✅ Zenn CLIとGitHubの連携
✅ GitHub Actionsによる週次自動実行
✅ トラブルシューティングのノウハウ蓄積

### システムの利点

- **学習記録がそのまま記事になる**: 二重管理不要
- **週次自動化**: 手動作業を最小化
- **Gitで履歴管理**: 記事の変更履歴を追跡可能
- **柔軟なカスタマイズ**: TypeScriptで自由に拡張

### 今後の改善案

- [ ] ZennのフロントマターをNotionプロパティから自動生成
- [ ] 画像の自動アップロード対応
- [ ] 複数データベースからの記事生成
- [ ] エラー通知機能（Slack、Discord等）
- [ ] 記事の自動公開/下書き管理

---

## 参考リンク

- [Notion API Documentation](https://developers.notion.com/)
- [Zenn CLI Documentation](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## おわりに

Notion、Claude Code、Zenn、GitHub Actionsを組み合わせることで、学習記録の執筆から公開までを完全自動化できました。この仕組みにより、技術的な学びを継続的にアウトプットする習慣が確立できます。

ぜひ皆さんも試してみてください！
