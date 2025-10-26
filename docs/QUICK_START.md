# クイックスタートガイド

## 🎯 このツールの目的

**作業終了時に必ず進捗を記録し、週1-2回Zenn記事として公開する**

---

## 📋 セットアップ (初回のみ、約30分)

### 1. Node.jsのインストール

```bash
# Homebrewを使用（推奨）
brew install node

# または公式サイトから
# https://nodejs.org/
```

### 2. このプロジェクトのセットアップ

```bash
cd /Users/gaku/notion-zenn-editor
npm install
```

### 3. Notionデータベースの作成

**詳細:** [Notionセットアップガイド](notion-setup-guide.md) (約20分)

**簡易手順:**
1. [Notion Integrations](https://www.notion.so/my-integrations) で Integration を作成
2. Integration Token をコピー (`secret_...`)
3. Notion で新しいデータベースを作成（Table - Full page）
4. 必須プロパティを追加:
   - Status (Select)
   - Type (Select: tech/idea)
   - Topics (Multi-select)
   - Emoji (Text)
   - Published (Checkbox)
   - **Entry Type** (Select: デイリーログ/記事/週次まとめ)
   - **Project** (Select: プロジェクト名)
   - **Work Time** (Number: 作業時間)
   - **Progress** (Select: 🟢順調/🟡やや遅れ/🔴ブロック中)
5. データベースと Integration を接続
6. Database ID を取得

### 4. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集:
```env
NOTION_API_KEY=secret_your_integration_token
NOTION_DATABASE_ID=your_database_id
```

---

## 🔄 日常の運用フロー

### 作業終了時（毎回、5-10分）

1. **Notionを開く**
   - ブックマークバーに登録しておくと便利

2. **「+ New」 → テンプレート「デイリー進捗記録」を選択**

3. **タイトルを入力**
   - 例: `2025-01-26: Notion連携機能の実装`
   - フォーマット: `YYYY-MM-DD: [やったこと]`

4. **プロパティを設定**
   - Entry Type: デイリーログ
   - Project: 今日のプロジェクト
   - Work Time: 作業時間（分）
   - Progress: 🟢 順調 / 🟡 やや遅れ / 🔴 ブロック中
   - Topics: 関連技術

5. **本文を記入（箇条書きでOK）**
   ```markdown
   ## 今日やったこと
   - API実装完了
   - テスト追加

   ## つまづいた点
   - エラーで30分ハマった

   ## 解決方法
   - ドキュメントを読んで解決

   ## 明日やること
   - [ ] UI実装開始
   ```

6. **保存して終了**

**重要:** 完璧を求めない！5-10分で終わらせる！

---

### 週1回（金曜夜 or 日曜夜、30-40分）

1. **「今週の進捗」ビューで今週のデイリーログを確認**

2. **記事化できそうなトピックを選ぶ**
   - つまづいた点と解決方法がセットで記録されているもの
   - 同じテーマで複数日記録があるもの

3. **新しいページを作成**
   - テンプレート「学習記録」を選択
   - Entry Type: **記事**
   - デイリーログの内容を統合・整える

4. **Status を「レビュー中」に変更**

5. **このツールで記事を生成**
   ```bash
   npm run dev
   # http://localhost:3000 で記事を生成
   ```

6. **Zennに公開**
   - Zenn CLI で公開
   - Notion に URL を記録
   - Status を「公開済み」に変更

---

## 📚 ドキュメント一覧

| ドキュメント | 用途 | 読むタイミング |
|-------------|------|--------------|
| [README.md](../README.md) | プロジェクト概要 | 最初に |
| [notion-setup-guide.md](notion-setup-guide.md) | Notionセットアップ | 初回セットアップ時 |
| [work-session-logging-workflow.md](work-session-logging-workflow.md) | 詳細な運用フロー | セットアップ後 |
| [daily-log-template.md](daily-log-template.md) | テンプレートの書き方 | 記録を始める前 |
| [notion-database-design.md](notion-database-design.md) | データベース設計 | 詳細を知りたい時 |

---

## ✅ セットアップ完了チェックリスト

- [ ] Node.js インストール完了
- [ ] `npm install` 実行完了
- [ ] Notion Integration 作成完了
- [ ] Notionデータベース作成完了
- [ ] 必須プロパティ（全9個）設定完了
- [ ] 「デイリー進捗記録」テンプレート作成完了
- [ ] Integration とデータベースを接続完了
- [ ] `.env.local` に設定完了
- [ ] 今日の進捗を1件記録してみた

**全てチェック完了 → 運用開始！**

---

## 🎓 最初の1週間の過ごし方

### Day 1 (今日)
- [ ] Notionセットアップ
- [ ] 今日の進捗を記録（初回）
- [ ] 5-10分で終わることを確認

### Day 2-7
- [ ] 毎日、作業終了時に記録
- [ ] 完璧を求めず、箇条書きでOK
- [ ] つまづいた点は必ず記録

### Day 8 (来週)
- [ ] 先週のデイリーログを見返す
- [ ] 記事化できそうなトピックを選ぶ
- [ ] 初めての記事を作成・公開

---

## 💡 よくある質問

### Q: 作業時間が短い日（30分以下）も記録すべき？
**A:** はい！短くても記録することで継続の証になります。

### Q: デイリーログを書き忘れたら？
**A:** 翌日に思い出せる範囲で記録。完璧を求めない！

### Q: 記事化が面倒...
**A:** デイリーログだけでもOK。記事化は「余裕があれば」。月1-2本でも十分！

---

## 🚀 今すぐ始める

```bash
# 1. Notionセットアップ
# docs/notion-setup-guide.md を参照

# 2. 今日の進捗を記録
# Notionでテンプレートを使って記録

# 3. 来週、初めての記事を公開
# 1週間続けてから記事化を検討
```

---

**習慣化が最優先。まずは1週間続けてみましょう！** 🎉
