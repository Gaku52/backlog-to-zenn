# Notion to Zenn Converter

**作業終了時に必ず進捗を記録し、週1-2回Zenn記事として公開する**

NotionのページからZenn記事を自動生成するツールです。

## 🎯 このツールでできること

1. **作業終了時の進捗記録** - 作業が終わったら5-10分でNotionに記録
2. **知見の蓄積** - つまづいた点と解決方法を記録
3. **Zenn記事の自動生成** - 記録をまとめて週1-2回記事化
4. **習慣化のサポート** - テンプレートで記録のハードルを下げる

## 📖 クイックスタート

**初めての方:** [クイックスタートガイド](docs/QUICK_START.md) を参照

## 機能

- ✅ Notion APIからページとコンテンツを取得
- ✅ Notionプロパティから記事メタデータを自動抽出
- ✅ Zenn形式のMarkdown記事を自動生成
- ✅ デイリーログから週次レポートを生成
- ✅ 作業終了時の進捗記録フロー
- ✅ シンプルなダッシュボードUI（開発中）

## なぜNotionなのか？

- **個人利用完全無料**
- **組織名不要**
- **API無料**
- **Markdown完全対応**
- **テンプレート機能で記録が簡単**
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

#### 📚 詳細なセットアップガイド

Notionデータベースの詳細な設計と運用方法については、以下のドキュメントを参照してください：

- **[Notionセットアップガイド](docs/notion-setup-guide.md)** - ステップバイステップのセットアップ手順
- **[Notionデータベース設計書](docs/notion-database-design.md)** - プロパティ設計と運用フロー

#### 必須プロパティ

以下のプロパティを設定することで、Zenn記事のメタデータを自動的に取得できます：

| プロパティ名 | 型 | 説明 | 例 |
|-------------|------|------|-----|
| **Name** | Title | 記事タイトル | 「AWS VPCの基礎を学んだ」 |
| **Status** | Select | 記事の状態 | 下書き / レビュー中 / 公開済み |
| **Type** | Select | 記事の種類 | tech / idea |
| **Topics** | Multi-select | トピックタグ（最大5個） | AWS, VPC, ネットワーク |
| **Emoji** | Text | 記事の絵文字 | 📝 🚀 💡 |
| **Published** | Checkbox | 公開フラグ | ☑ / ☐ |

#### 推奨プロパティ

| プロパティ名 | 型 | 説明 |
|-------------|------|------|
| **Created** | Created time | 作成日（自動） |
| **Last Edited** | Last edited time | 最終編集日（自動） |
| **Published Date** | Date | 公開日 |
| **Zenn URL** | URL | 公開済み記事のURL |

#### 簡易セットアップ手順

1. Notionで新しいページを作成
2. 「Table - Full page」を選択してデータベースを作成
3. データベース名を設定（例: 「Zenn記事管理」）
4. 上記の必須プロパティを追加
5. テンプレートを作成（詳細は[セットアップガイド](docs/notion-setup-guide.md)参照）

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

`.env.example`をコピーして`.env.local`を作成:

```bash
cp .env.example .env.local
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

### 📖 詳細な運用方法

実運用のための詳細な運用フローとベストプラクティスは、[Notionデータベース設計書](docs/notion-database-design.md)の「運用フロー」セクションを参照してください。

### 日常の運用フロー（概要）

#### ステップ1: 毎日Notionで学習内容を記録

1. Notionデータベースで **「+ New」** をクリック
2. **テンプレート**（学習記録 or チュートリアル）を選択
3. **タイトル**を入力（例: 「AWS VPCの基礎を学んだ」）
4. **プロパティ**を設定：
   - **Status**: 下書き（自動設定）
   - **Type**: tech または idea
   - **Topics**: 学習したトピックを選択（例: AWS, VPC）
   - **Emoji**: 絵文字を1つ選択（例: ☁️）
5. ページ内に学習内容を記録（テンプレートに沿って記入）

#### ステップ2: 週2回 記事をレビュー・公開準備

1. 今週作成したページを確認
2. 公開したいページを選択し、内容を推敲
3. **Status** を **「レビュー中」** に変更

#### ステップ3: このアプリでZenn記事を生成

1. 開発サーバーを起動: `npm run dev`
2. ダッシュボードで「レビュー中」のページを選択
3. 「Zenn記事を生成」をクリック
4. プレビューで内容を確認
5. Markdownファイルをダウンロード
6. （ツールが自動で Status を「生成済み」に変更）

#### ステップ4: Zennに公開

1. Zenn CLI で記事を公開: `npx zenn new:article`
2. 生成したMarkdownを記事ファイルにコピー
3. `npx zenn preview` で確認後、GitHubにpush
4. Notionに戻り：
   - **Zenn URL** フィールドに記事URLを貼り付け
   - **Published Date** を今日の日付に設定
   - **Published** を ☑ にチェック
   - **Status** を **「公開済み」** に変更

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
