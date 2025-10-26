# Backlog to Zenn Converter

Backlogの課題とコメントから、Zenn記事を自動生成するツールです。

## 機能

- ✅ Backlog APIから課題とコメントを取得
- ✅ Zenn形式のMarkdown記事を自動生成
- ✅ 週次レポートの自動生成
- ✅ シンプルなダッシュボードUI

## セットアップ

### 1. Backlogアカウント作成

#### フリープランのアカウント作成手順

1. [Backlog公式サイト](https://backlog.com/ja/)にアクセス
2. 「無料ではじめる」をクリック
3. メールアドレスを入力して登録
4. スペースID（スペースキー）を設定
   - 例: `your-space` → `https://your-space.backlog.com`
5. プロジェクトを作成
   - 名前: 「学習記録」など
   - キー: `STUDY` など

#### APIキーの取得

1. Backlogにログイン後、右上のアイコンをクリック
2. 「個人設定」を選択
3. 左メニューから「API」を選択
4. 「登録」ボタンをクリックしてAPIキーを生成
5. 生成されたAPIキーをコピー（**重要**: 後で確認できないので保存してください）

#### プロジェクトIDの確認

1. Backlogのプロジェクト画面を開く
2. URLを確認: `https://your-space.backlog.com/projects/12345`
3. 最後の数字（例: `12345`）がプロジェクトIDです

### 2. このアプリのセットアップ

#### 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、編集:

```env
BACKLOG_SPACE_KEY=your-space        # あなたのスペースキー
BACKLOG_API_KEY=your-api-key-here  # 取得したAPIキー
BACKLOG_PROJECT_ID=12345           # プロジェクトID
```

#### 依存関係のインストール

```bash
npm install
```

#### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 にアクセスしてダッシュボードを開く。

## 使い方

### 日常の運用フロー

1. **毎日**: Backlogで学習内容を課題として登録
2. **週2回**: このアプリでZenn記事を生成・投稿

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Backlog REST API v2

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
