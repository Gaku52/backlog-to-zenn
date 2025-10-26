# Notion to Zenn Converter

NotionのページからZenn記事を自動生成するツールです。

## 機能

- ✅ Notion APIからページとコンテンツを取得
- ✅ Zenn形式のMarkdown記事を自動生成
- ✅ 週次レポートの自動生成
- ✅ シンプルなダッシュボードUI（開発中）

## なぜNotionなのか？

- **個人利用完全無料**
- **組織名不要**
- **API無料**
- **Markdown完全対応**
- **今最も人気のあるツール**
- **エンジニアなら使ったことがある**

## セットアップ

### 1. Notionアカウント作成（既にある場合はスキップ）

1. [Notion公式サイト](https://www.notion.so/)にアクセス
2. 無料アカウントを作成

### 2. Notion Integration（API Key）の作成

#### Integration作成手順

1. [Notion Integrations](https://www.notion.so/my-integrations)にアクセス
2. 「+ New integration」をクリック
3. 以下を設定：
   - **Name**: `Zenn Converter`（任意）
   - **Associated workspace**: 自分のワークスペースを選択
   - **Type**: Internal Integration
4. 「Submit」をクリック
5. **Internal Integration Token**が表示されるのでコピー（後で使用）
   - 形式: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Notionデータベースの作成

#### データベース作成手順

1. Notionで新しいページを作成
2. 「Table - Inline」を選択してデータベースを作成
3. データベース名を設定（例: 「学習記録」）
4. 以下のプロパティを推奨：
   - **Name**（Title）: ページタイトル
   - **Date**: 作成日
   - **Tags**（Multi-select）: カテゴリ（例: AWS, Next.js, TypeScript）
   - **Status**（Select）: 進捗状況

#### データベースIDの取得

1. 作成したデータベースページを開く
2. URLをコピー:
   ```
   https://www.notion.so/yourworkspace/{database-id}?v=...
   ```
3. `{database-id}` の部分（32文字のハイフン付きID）をコピー
   - 例: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

#### データベースとIntegrationを接続

1. データベースページの右上「...」メニューをクリック
2. 「Add connections」を選択
3. 作成したIntegration（例: Zenn Converter）を選択
4. 「Confirm」をクリック

これでIntegrationがこのデータベースにアクセスできるようになります。

### 4. このアプリのセットアップ

#### リポジトリのクローン

```bash
git clone https://github.com/Gaku52/backlog-to-zenn.git
cd backlog-to-zenn
```

#### 依存関係のインストール

```bash
npm install
```

#### 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成:

```bash
cp .env.local.example .env.local
```

`.env.local`を編集:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Integration Token
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # Database ID
```

#### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 にアクセスしてダッシュボードを開く。

## 使い方

### 日常の運用フロー

#### 毎日: Notionで学習内容を記録

1. Notionデータベースに新しいページを作成
2. タイトルを入力（例: 「AWS VPC学習」）
3. ページ内に学習内容を記録：
   - 学んだこと
   - つまづいた点
   - 解決方法
   - コードサンプル
4. タグを設定（例: AWS, ネットワーク）

#### 週2回: このアプリでZenn記事を生成

1. ダッシュボードでNotionページを選択
2. 「Zenn記事を生成」をクリック
3. 生成されたMarkdownをコピー
4. Zennに投稿

### Notionページの例

```
# AWS VPC学習

## 学んだこと
- VPCはAWSのプライベートネットワーク
- サブネットでIPアドレス範囲を分割
- パブリックとプライベートサブネットの違い

## つまづいた点
サブネット設計で30分悩んだ。CIDR記法が理解できなかった。

## 解決方法
公式ドキュメントを読んで理解できた。
/24は256個のIPアドレスを意味する。

## コード例
\`\`\`
VPC: 10.0.0.0/16
Public Subnet: 10.0.1.0/24
Private Subnet: 10.0.2.0/24
\`\`\`
```

↓ このアプリで変換 ↓

Zenn記事が自動生成されます！

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Notion SDK**: @notionhq/client
- **Markdown**: react-markdown, remark-gfm

## 開発ロードマップ

- [x] Notion API クライアント実装
- [x] Zenn記事生成ロジック実装
- [ ] ダッシュボードUI実装
- [ ] ページ一覧表示
- [ ] 記事生成プレビュー
- [ ] 週次レポート生成
- [ ] GitHub連携（Zennリポジトリへの自動push）

## トラブルシューティング

### Integration Tokenが無効

- Integrationが正しく作成されているか確認
- データベースにIntegrationが接続されているか確認

### データベースIDが見つからない

- データベースページのURLを確認
- 32文字のハイフンなしIDをコピー

### ページが取得できない

- データベースとIntegrationの接続を確認
- データベースページの「Connections」に表示されているか確認

## ライセンス

MIT

## 作者

[@Gaku52](https://github.com/Gaku52)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
