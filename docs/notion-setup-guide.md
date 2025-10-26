# Notionデータベース セットアップガイド

このガイドでは、notion-zenn-editorで使用するNotionデータベースを、ゼロから構築する手順を説明します。

---

## 所要時間

- **初回セットアップ**: 約15-20分
- **テンプレート作成**: 約10分
- **合計**: 約30分

---

## 手順1: Notionデータベースの作成

### 1-1. 新しいページを作成

1. Notionを開く
2. サイドバーで「+ New Page」をクリック
3. ページタイトルを入力: **「Zenn記事管理」** または **「学習記録」**

### 1-2. データベースを追加

1. ページ内で `/database` と入力
2. **「Table - Full page」** を選択
   - これでページ全体がデータベースになります

---

## 手順2: プロパティの設定

### 2-1. デフォルトプロパティの確認

Notionデータベースには以下のプロパティが自動で作成されています：

- ✅ **Name** (Title型) - そのまま使用
- ✅ **Tags** (Multi-select型) - 後で「Topics」にリネーム
- ⚠️ **その他** - 不要なプロパティは削除してOK

### 2-2. プロパティの追加

データベースの右上「+ New」の左にある「●●●」（プロパティメニュー）をクリックし、以下のプロパティを追加します。

---

#### ① Status（必須）

1. 「+ New property」をクリック
2. プロパティ名: `Status`
3. プロパティタイプ: **Select**
4. オプションを追加:

| オプション名 | カラー |
|-------------|--------|
| 🟡 下書き | Yellow |
| 🔵 レビュー中 | Blue |
| 🟢 生成済み | Green |
| 🟣 公開済み | Purple |
| 🔴 アーカイブ | Red |

5. デフォルト値: **下書き**

---

#### ② Type（必須）

1. 「+ New property」をクリック
2. プロパティ名: `Type`
3. プロパティタイプ: **Select**
4. オプションを追加:

| オプション名 | カラー |
|-------------|--------|
| tech | Blue |
| idea | Pink |

5. デフォルト値: **tech**

---

#### ③ Topics（必須）

1. デフォルトの「Tags」プロパティをリネーム
   - プロパティ名を `Topics` に変更
2. プロパティタイプ: **Multi-select**（既にこの型のはず）
3. よく使うオプションを事前に追加:

**フロントエンド:**
- React
- Next.js
- TypeScript
- Vue.js
- CSS
- Tailwind CSS

**バックエンド:**
- Node.js
- Python
- Go
- Rust

**インフラ:**
- AWS
- Docker
- Kubernetes
- Terraform

**その他:**
- Git
- GitHub
- 学習記録
- 週次レポート

> **Note:** 後から追加・削除可能です

---

#### ④ Emoji（必須）

1. 「+ New property」をクリック
2. プロパティ名: `Emoji`
3. プロパティタイプ: **Text**
4. デフォルト値: なし（後で入力）

---

#### ⑤ Published（必須）

1. 「+ New property」をクリック
2. プロパティ名: `Published`
3. プロパティタイプ: **Checkbox**
4. デフォルト値: ☐（チェックなし）

---

#### ⑥ Created（自動）

1. 「+ New property」をクリック
2. プロパティ名: `Created`
3. プロパティタイプ: **Created time**
4. これで自動的に作成日時が記録されます

---

#### ⑦ Last Edited（自動）

1. 「+ New property」をクリック
2. プロパティ名: `Last Edited`
3. プロパティタイプ: **Last edited time**
4. これで自動的に最終編集日時が記録されます

---

#### ⑧ Published Date（推奨）

1. 「+ New property」をクリック
2. プロパティ名: `Published Date`
3. プロパティタイプ: **Date**
4. 公開した日を手動で記録

---

#### ⑨ Zenn URL（推奨）

1. 「+ New property」をクリック
2. プロパティ名: `Zenn URL`
3. プロパティタイプ: **URL**
4. 公開後に記事URLを貼り付け

---

#### ⑩ Category（推奨）

1. 「+ New property」をクリック
2. プロパティ名: `Category`
3. プロパティタイプ: **Select**
4. オプションを追加:

| オプション名 |
|-------------|
| フロントエンド |
| バックエンド |
| インフラ |
| データベース |
| 設計 |
| その他 |

---

#### ⑪ Learning Time（推奨）

1. 「+ New property」をクリック
2. プロパティ名: `Learning Time`
3. プロパティタイプ: **Number**
4. 単位: 分（min）

---

#### ⑫ Difficulty（オプション）

1. 「+ New property」をクリック
2. プロパティ名: `Difficulty`
3. プロパティタイプ: **Select**
4. オプションを追加:

| オプション名 | カラー |
|-------------|--------|
| 初級 | Green |
| 中級 | Yellow |
| 上級 | Red |

---

### 2-3. プロパティの並び替え

プロパティをドラッグ&ドロップで以下の順番に並べ替えると使いやすいです：

1. Name（タイトル）
2. Status
3. Type
4. Topics
5. Emoji
6. Published
7. Created
8. Last Edited
9. Published Date
10. Zenn URL
11. Category
12. Learning Time
13. Difficulty

---

## 手順3: データベースビューの作成

### 3-1. デフォルトビューの設定

1. ビュー名を「全記事」に変更
2. **表示するプロパティ** を選択:
   - Name
   - Status
   - Type
   - Topics
   - Created
   - Published Date
3. **グループ化**: Status
4. **並び替え**: Created（降順）

---

### 3-2. 「今週の学習」ビューの作成

1. 左上のビュー名の右にある「+ Add a view」をクリック
2. ビュー名: `今週の学習`
3. ビュータイプ: **Table**
4. **フィルタを追加**:
   - Created: **Is within** → **This week**
   - Status: **Is not** → **アーカイブ**
5. **表示するプロパティ**:
   - Name
   - Status
   - Topics
   - Learning Time
   - Created
6. **並び替え**: Created（降順）

---

### 3-3. 「公開準備中」ビューの作成

1. 「+ Add a view」をクリック
2. ビュー名: `公開準備中`
3. ビュータイプ: **Table**
4. **フィルタを追加**:
   - Status: **Is** → **レビュー中**
   - または
   - Status: **Is** → **生成済み**
5. **表示するプロパティ**:
   - Name
   - Status
   - Type
   - Topics
   - Emoji
   - Published
6. **並び替え**: Last Edited（降順）

---

### 3-4. 「公開済み」ビューの作成

1. 「+ Add a view」をクリック
2. ビュー名: `公開済み`
3. ビュータイプ: **Table**
4. **フィルタを追加**:
   - Status: **Is** → **公開済み**
5. **表示するプロパティ**:
   - Name
   - Published Date
   - Zenn URL
   - Topics
   - Type
6. **並び替え**: Published Date（降順）

---

## 手順4: テンプレートの作成

### 4-1. テンプレート機能を有効化

1. データベースの右上「●●●」→「Database templates」をクリック
2. 「+ New template」をクリック

---

### 4-2. テンプレート①「学習記録」

#### プロパティのデフォルト値:
- Status: **下書き**
- Type: **tech**
- Emoji: **📝**
- Published: ☐

#### テンプレート本文:

```
## 概要
[今日学んだことの概要を1-2行で]

## 学んだこと
-
-
-

## 詳細

### [トピック1]


### [トピック2]


## つまづいた点
[困ったこと、エラー、理解に時間がかかった点]

## 解決方法
[どうやって解決したか、何が理解のブレイクスルーになったか]

## コード例

```typescript
// ここにコードを記載
```

## 参考資料
- [公式ドキュメント]()
- [参考記事]()

## 次のアクション
- [ ]
```

**保存**: テンプレート名を「学習記録」として保存

---

### 4-3. テンプレート②「チュートリアル」

#### プロパティのデフォルト値:
- Status: **下書き**
- Type: **tech**
- Emoji: **🚀**
- Published: ☐

#### テンプレート本文:

```
## はじめに
[何を作るか、なぜ作るか]

## 前提条件
- Node.js v20以上
-

## 環境構築

```bash
# コマンド
```

## 実装手順

### Step 1: [ステップ名]

[説明]

```typescript
// コード
```

### Step 2: [ステップ名]

[説明]

```typescript
// コード
```

## 動作確認

```bash
# テストコマンド
```

## まとめ
[作ったもの、学んだこと]

## 参考資料
-
```

**保存**: テンプレート名を「チュートリアル」として保存

---

### 4-4. テンプレート③「週次レポート」

#### プロパティのデフォルト値:
- Status: **レビュー中**
- Type: **tech**
- Emoji: **📚**
- Topics: **学習記録**, **週次レポート**
- Published: ☐

#### テンプレート本文:

```
## はじめに
[今週の学習のテーマや全体的な振り返り]

## 今週の学習内容

### 1. [テーマ1]
- 学んだこと
- つまづいた点
- 成果

### 2. [テーマ2]
- 学んだこと
- つまづいた点
- 成果

### 3. [テーマ3]
- 学んだこと
- つまづいた点
- 成果

## 今週の学び
- [重要な気づき1]
- [重要な気づき2]
- [重要な気づき3]

## 来週の目標
- [ ]
- [ ]
- [ ]
```

**保存**: テンプレート名を「週次レポート」として保存

---

## 手順5: Integration（API Key）の接続

### 5-1. Integrationの作成

1. [Notion Integrations](https://www.notion.so/my-integrations) にアクセス
2. 「+ New integration」をクリック
3. 設定:
   - **Name**: `Zenn Converter`
   - **Associated workspace**: 自分のワークスペース
   - **Type**: Internal Integration
4. 「Submit」をクリック
5. **Internal Integration Token** をコピー
   - 形式: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - これを `.env.local` の `NOTION_API_KEY` に設定

### 5-2. データベースにIntegrationを接続

1. 作成したデータベースページを開く
2. 右上の「●●●」メニューをクリック
3. 「Add connections」を選択
4. 作成したIntegration（Zenn Converter）を選択
5. 「Confirm」をクリック

✅ これでIntegrationがデータベースにアクセスできるようになりました

---

## 手順6: Database IDの取得

1. データベースページを開く
2. ブラウザのURLをコピー:
   ```
   https://www.notion.so/yourworkspace/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6?v=...
   ```
3. URLの中の **32文字のID部分** をコピー:
   - `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - ハイフンは含めない
4. これを `.env.local` の `NOTION_DATABASE_ID` に設定

---

## 手順7: 動作確認

### 7-1. テストページの作成

1. Notionデータベースで「+ New」をクリック
2. テンプレート「学習記録」を選択
3. 以下の内容で記入:

**タイトル**: `テスト記事`

**プロパティ**:
- Status: レビュー中
- Type: tech
- Topics: TypeScript, テスト
- Emoji: 🧪

**本文**:
```
## 概要
これはテスト記事です。

## 学んだこと
- Notionとの連携
- データベース設計
- プロパティの設定

## まとめ
セットアップが完了しました！
```

### 7-2. ツールで記事を生成

```bash
cd /Users/gaku/notion-zenn-editor
npm run dev
```

ブラウザで http://localhost:3000 にアクセスし、テスト記事が表示されるか確認。

---

## トラブルシューティング

### ❌ 「Integration Token が無効です」

**原因**: Integrationが正しく作成されていない、またはTokenが間違っている

**解決方法**:
1. [Notion Integrations](https://www.notion.so/my-integrations) でTokenを再確認
2. `.env.local` のTokenをコピペし直す
3. `secret_` で始まっていることを確認

---

### ❌ 「Database ID が見つかりません」

**原因**: Database IDが間違っている、またはIntegrationが接続されていない

**解決方法**:
1. データベースページのURLを再確認
2. 32文字のIDをコピー（ハイフンなし）
3. データベースの「Connections」にIntegrationが表示されているか確認

---

### ❌ 「ページが取得できません」

**原因**: Integrationがデータベースにアクセスできていない

**解決方法**:
1. データベースページの右上「●●●」→「Connections」を確認
2. Integration（Zenn Converter）が表示されていない場合:
   - 「Add connections」で追加
3. ページをリロードして再試行

---

### ❌ プロパティが正しく取得できない

**原因**: プロパティ名が想定と異なる

**解決方法**:
1. プロパティ名のスペルを確認（大文字・小文字も区別）
2. 必須プロパティ（Name, Status, Type, Topics, Emoji）が存在するか確認

---

## 完了チェックリスト

セットアップが完了したら、以下をチェックしてください：

- [ ] Notionデータベースが作成できた
- [ ] 必須プロパティ（Status, Type, Topics, Emoji, Published）を追加した
- [ ] 推奨プロパティ（Created, Last Edited, Published Date, Zenn URL）を追加した
- [ ] 4つのビュー（全記事、今週の学習、公開準備中、公開済み）を作成した
- [ ] 2-3個のテンプレートを作成した
- [ ] Integrationを作成し、Tokenを取得した
- [ ] データベースにIntegrationを接続した
- [ ] Database IDを取得した
- [ ] `.env.local` に設定を記入した
- [ ] テストページを作成し、ツールで読み込めることを確認した

---

## 次のステップ

✅ セットアップが完了したら、実際に運用を開始しましょう！

1. **1日目**: テンプレートを使って学習記録を1ページ作成
2. **3日目**: 3ページ溜まったら、1つを「レビュー中」に変更
3. **7日目**: ツールでZenn記事を生成し、公開してみる

**詳細な運用方法は `docs/notion-database-design.md` の「運用フロー」セクションを参照してください。**

---

何か困ったことがあれば、GitHubのIssuesで質問してください！
