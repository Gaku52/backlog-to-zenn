# Notion × Zenn 自動投稿システム

**Notionで学習記録を書くだけで、自動的にZenn記事として公開される仕組み**

NotionのデータベースからZenn記事を自動生成し、GitHub Actions経由で自動デプロイするシステムです。

> **⚠️ セキュリティ注意事項**
>
> 本READMEに記載されているAPIキーやデータベースIDはすべてプレースホルダー（`xxx...`）です。実際の認証情報は以下の場所で安全に管理してください：
> - ローカル環境: `.env.local`（`.gitignore`で除外済み）
> - GitHub Actions: Repository Secrets
>
> **絶対に実際の認証情報をコミットしないでください。**

## 🎯 このツールでできること

1. **Notionで学習記録を管理** - 使い慣れたNotionで記録
2. **自動的にZenn記事を生成** - Notion API経由で記事を自動変換
3. **GitHubにpushで自動デプロイ** - Zennに自動反映
4. **週次自動実行** - 毎週日曜22時に自動的に記事を生成
5. **完全自動化** - 手動作業を最小化

## 🌟 システムの特徴

- ✅ **完全自動化**: pushするだけでZennに記事が公開される
- ✅ **Notion連携**: 学習記録がそのまま記事になる
- ✅ **GitHub Actions**: 週次自動実行で運用を自動化
- ✅ **Zenn CLI**: GitHubリポジトリ連携で自動デプロイ
- ✅ **TypeScript実装**: 型安全で拡張しやすい

---

## 📖 クイックスタート

### 前提条件

- Notionアカウント（無料）
- Zennアカウント（無料・GitHubログイン）
- GitHubアカウント
- Node.js 20以上

### セットアップの流れ

```
1. Notion Integration作成
   ↓
2. Notionデータベース作成・接続
   ↓
3. GitHubリポジトリ作成
   ↓
4. Zenn CLI セットアップ
   ↓
5. GitHub Actions設定
   ↓
6. 完成！
```

---

## 🚀 セットアップ手順

### ステップ1: Notion Integrationの作成

#### 1-1. Integration作成

1. [Notion Integrations](https://www.notion.so/my-integrations)にアクセス
2. 「**+ New integration**」をクリック
3. 以下を設定：
   - **Name**: `zen-editor`（任意）
   - **Associated workspace**: 自分のワークスペースを選択
   - **Type**: Internal Integration
4. 「**Submit**」をクリック
5. **Internal Integration Token**をコピー（**必ず安全な場所に保存**）
   - 形式: `ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ このトークンは第三者に絶対に共有しないでください

#### 1-2. Capabilitiesの設定

Integrationsページで以下の権限を有効化：

- ✅ **コンテンツを読み取る** (Read content) - **必須**
- ✅ **コンテンツを更新** (Update content) - 推奨
- ✅ **コンテンツを挿入** (Insert content) - 推奨

**最低限必要な権限**: 「Read content」のみでも動作しますが、将来的な機能拡張のため他の権限も有効化することを推奨します。

**注意**: このIntegrationは接続したデータベースのみにアクセスできます。ワークスペース全体へのアクセスではありません。

---

### ステップ2: Notionデータベースの作成

#### 2-1. データベース作成

1. Notionで新しいページを作成
2. 「**Table - Full page**」を選択
3. データベース名を設定（例: 「学習記録」）

#### 2-2. 必須プロパティの追加

以下のプロパティを設定：

| プロパティ名 | 型 | 説明 | 例 |
|-------------|------|------|-----|
| **Name** | Title | 記事タイトル | 「AWS Lambda入門」 |
| **日付** | Date | 学習日 | 2024-11-03 |
| **ステータス** | Select | 記事の状態 | 完了 / 学習中 |
| **カテゴリ** | Multi-select | トピックタグ | AWS, TypeScript, Notion |

#### 2-3. データベースIDの取得

1. 作成したデータベースページを開く
2. URLをコピー:
   ```
   https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                       ↑ この32文字がデータベースID
   ```
3. ハイフンありでもなしでもOK

#### 2-4. データベースとIntegrationを接続

**⚠️ 最重要ステップ - これを忘れると動きません！**

1. データベースページの右上「**...**」メニューをクリック
2. 下にスクロールして「**接続を追加**」または「**Add connections**」をクリック
3. 作成したIntegration（例: zen-editor）を選択
4. 「**許可**」または「**Confirm**」をクリック

**確認方法**: 接続が成功すると、データベースページの「アクティブな接続」にIntegrationが表示されます。

---

### ステップ3: リポジトリのセットアップ

#### 3-1. リポジトリのクローン

```bash
git clone https://github.com/your-username/notion-zenn-editor.git
cd notion-zenn-editor
```

#### 3-2. 依存関係のインストール

```bash
npm install
```

#### 3-3. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成:

```bash
cp .env.example .env.local
```

`.env.local`を編集して、**実際の値**を設定:

```env
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  # ステップ1-1で取得したIntegration Token
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # ステップ2-3で取得したDatabase ID（32文字）
```

**⚠️ 重要**: `.env.local`は`.gitignore`に含まれているため、Gitにコミットされません。安全に認証情報を保存できます。

#### 3-4. 動作確認

```bash
npm run generate
```

成功すると：

```
🚀 Notion学習記録からZenn記事を生成します...

📊 データベース情報を取得中...
   データベース名: 学習記録

📄 学習記録ページを取得中...
   5件のページを取得しました

📝 "AWS Lambda入門" を処理中...
   ✅ 保存完了: aws-lambda-basics.md

🎉 すべての記事の生成が完了しました!
📁 出力先: /path/to/output/articles
```

---

### ステップ4: Zenn CLIのセットアップ

#### 4-1. Zenn CLIのインストール（完了済み）

```bash
npm install zenn-cli
```

#### 4-2. Zennディレクトリの初期化（完了済み）

```bash
npx zenn init
```

これにより、`articles/` と `books/` ディレクトリが作成されます。

#### 4-3. GitHubリポジトリとZennの連携

1. **Zennにログイン**: https://zenn.dev/ （GitHubアカウントでログイン）
2. **ダッシュボード → GitHubからのデプロイ**
3. **「リポジトリを連携する」をクリック**
4. **このリポジトリ**を選択
5. **ブランチを `main` に設定**
6. **「連携する」をクリック**

これで、`articles/` ディレクトリにMarkdownファイルをpushすると、**自動的にZennに反映**されます。

---

### ステップ5: GitHub Actionsの設定

#### 5-1. GitHub Secretsの設定

**重要**: GitHub Actionsで環境変数を使用するため、Secretsを設定します。

1. **GitHubリポジトリを開く**
   ```
   https://github.com/your-username/notion-zenn-editor
   ```

2. **「Settings」タブをクリック**

3. **左サイドバーの「Secrets and variables」→「Actions」をクリック**

4. **「New repository secret」をクリック**

5. **以下の2つのSecretを追加**:

   **Secret 1: NOTION_API_KEY**
   - Name: `NOTION_API_KEY`
   - Value: ステップ1-1で取得した実際のIntegration Token（`ntn_`で始まる）

   **Secret 2: NOTION_DATABASE_ID**
   - Name: `NOTION_DATABASE_ID`
   - Value: ステップ2-3で取得した実際のDatabase ID（32文字の英数字）

**セキュリティ**: GitHub Secretsは暗号化され、ログにも表示されません。安全に認証情報を保存できます。

#### 5-2. ワークフローの実行タイミング

GitHub Actionsは以下のタイミングで自動実行されます：

1. ✅ **mainブランチへpush** - Notionの記事を取得してZennに自動投稿
2. ✅ **毎週日曜日22時（JST）** - 定期的にNotionから記事を取得して自動投稿
3. ✅ **手動実行** - GitHub Actionsページから「Run workflow」で手動実行可能

**動作**: いずれのタイミングでも、Notionデータベースから「ステータス: 完了」の記事を取得し、`articles/`ディレクトリに追加します。その後、自動的にZennに反映されます。

---

## 📝 使い方

### 日常の運用フロー

#### 1. Notionで学習記録を書く

1. Notionの学習記録データベースで「**+ New**」をクリック
2. **タイトル**を入力（例: 「Next.jsのSSRとCSRの違い」）
3. **プロパティ**を設定：
   - **日付**: 今日の日付
   - **ステータス**: 完了
   - **カテゴリ**: Next.js, React
4. ページ内に学習内容を記録

#### 2. 記事を生成（自動または手動）

**方法A: 自動（週次）**
- 毎週日曜22時に自動的に記事が生成される
- 何もする必要なし

**方法B: 手動（今すぐ生成）**
```bash
npm run generate
```

#### 3. GitHubにプッシュ（手動の場合）

```bash
git add .
git commit -m "feat: 新しい学習記録を追加"
git push
```

#### 4. Zennに自動反映

- **1〜2分後**に自動的にZennに記事が反映される
- Zennダッシュボードで確認

---

## 🔧 トラブルシューティング

### ❌ `object_not_found` エラー

**症状**:
```
Could not find database with ID: xxx. Make sure the relevant pages
and databases are shared with your integration.
```

**原因**: データベースがIntegrationと接続されていない

**解決策**:
1. Notionでデータベースを開く
2. 右上「...」→「接続を追加」
3. Integrationを選択

---

### ❌ データベース情報は取得できるがページが取得できない

**症状**:
```
データベース名: 学習記録  ← 成功
Failed to fetch pages  ← 失敗
```

**原因**: Integrationの権限（Capabilities）が不足

**解決策**:
Notion Integrationsページで「**Read content**」権限を有効化

---

### ❌ Zennに記事が表示されない

**症状**: GitHubには記事があるが、Zennのダッシュボードに表示されない

**原因**: ファイル名がZennの規則に違反

**NG例**:
- `2025-10-26_AWS Lambda入門.md` （日本語、アンダースコア）
- `my-article.md` （12文字未満）

**OK例**:
- `notion-zenn-editor-setup.md`
- `aws-lambda-basics.md`

**Zennのファイル名規則**:
- 英数字とハイフン（-）のみ
- 12〜50文字

---

### ❌ `this.client.databases.query is not a function`

**症状**: SDKのメソッドが存在しない

**原因**: `@notionhq/client` のバージョンで一部APIが未実装

**解決策**: 直接 `fetch` APIを使用（本リポジトリでは実装済み）

---

## 🛠️ 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Notion SDK**: @notionhq/client
- **Zenn CLI**: zenn-cli
- **CI/CD**: GitHub Actions
- **Styling**: Tailwind CSS

---

## 📂 ディレクトリ構造

```
notion-zenn-editor/
├── .github/
│   └── workflows/
│       └── generate-articles.yml  # GitHub Actions設定
├── articles/                       # Zenn記事（Zennに自動デプロイ）
├── books/                          # Zenn本（オプション）
├── lib/
│   ├── notion-client.ts           # Notion APIクライアント
│   └── zenn-generator.ts          # Zenn記事生成ロジック
├── scripts/
│   ├── generate-learning-record.ts  # 記事生成スクリプト
│   └── add-learning-record.ts       # 進捗登録スクリプト
├── output/
│   └── articles/                   # 生成された記事の一時保存
├── .env.local                      # 環境変数（gitignore）
└── README.md
```

---

## 📖 詳細ドキュメント

- **[Notionセットアップガイド](docs/notion-setup-guide.md)** - ステップバイステップのセットアップ手順
- **[Notionデータベース設計書](docs/notion-database-design.md)** - プロパティ設計と運用フロー
- **[完全ガイド記事](articles/notion-zenn-system-complete-guide.md)** - システム全体の解説

---

## 🎯 ロードマップ

- [x] Notion API連携
- [x] Zenn記事自動生成
- [x] Zenn CLI セットアップ
- [x] GitHub Actions自動化
- [x] 完全ドキュメント作成
- [ ] ダッシュボードUI実装
- [ ] 画像の自動アップロード対応
- [ ] 複数データベース対応
- [ ] エラー通知機能（Slack、Discord）

---

## 🤝 コントリビューション

プルリクエスト大歓迎です！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📄 ライセンス

MIT

---

## 👤 作者

作成者情報はフォークした際に適宜更新してください

---

## 🙏 謝辞

このプロジェクトは、Notion API、Zenn CLI、GitHub Actionsの素晴らしいエコシステムのおかげで実現できました。

また、[Claude Code](https://claude.com/claude-code)による開発支援により、効率的に構築できました。

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
