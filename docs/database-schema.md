# Database Schema (Mermaid)

アプリの要件と既存の型定義から、初期リリースに必要なテーブルを定義します。データベースは PostgreSQL を想定し、Prisma などのORM導入を前提に正規化します。

```mermaid
erDiagram
  USER ||--o{ POST : authors
  USER ||--o{ LIKE : likes
  USER ||--o{ BOOKMARK : bookmarks
  USER ||--o{ FOLLOW : follows
  USER ||--o{ COMMENT : comments
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ POST_SHARE : shares
  USER ||--o{ USER_TECHNOLOGY : uses

  POST ||--o{ LIKE : liked_by
  POST ||--o{ BOOKMARK : bookmarked_by
  POST ||--o{ COMMENT : comments
  POST ||--o{ POST_HASHTAG : tagged_with
  POST ||--o{ POST_SHARE : shared_as

  HASHTAG ||--o{ POST_HASHTAG : used_in
  TECHNOLOGY ||--o{ USER_TECHNOLOGY : used_by

  RSS_SOURCE ||--o{ RSS_ENTRY : provides
  RSS_ENTRY ||--o{ RSS_ENCLOSURE : has_media
  RSS_ENTRY ||--o{ RSS_ENTRY_HASHTAG : tagged_with
  HASHTAG ||--o{ RSS_ENTRY_HASHTAG : used_in
  RSS_SOURCE ||--o{ RSS_FETCH_LOG : fetches
  RSS_SOURCE ||--o{ SOURCE_TECHNOLOGY : categorized_as
  TECHNOLOGY ||--o{ SOURCE_TECHNOLOGY : category_map

  FEED_ITEM }o--|| RSS_ENTRY : references
  FEED_ITEM }o--|| POST : references

  USER {
    string id PK
    string username UK
    string display_name
    string avatar_url
    string bio
    datetime created_at
    datetime updated_at
  }

  POST {
    string id PK
    string author_id FK
    string type
    string title
    string body
    string video_url
    string thumbnail_url
    datetime created_at
    datetime updated_at
  }

  LIKE {
    string id PK
    string user_id FK
    string post_id FK
    datetime created_at
  }

  BOOKMARK {
    string id PK
    string user_id FK
    string post_id FK
    datetime created_at
  }

  COMMENT {
    string id PK
    string post_id FK
    string user_id FK
    string body
    string parent_comment_id FK
    datetime created_at
    datetime updated_at
  }

  FOLLOW {
    string id PK
    string follower_id FK
    string following_id FK
    datetime created_at
  }

  HASHTAG {
    string id PK
    string name UK
    datetime created_at
  }

  POST_HASHTAG {
    string id PK
    string post_id FK
    string hashtag_id FK
  }

  POST_SHARE {
    string id PK
    string post_id FK
    string user_id FK
    datetime created_at
  }

  NOTIFICATION {
    string id PK
    string user_id FK
    string type
    string actor_id FK
    string post_id FK
    string comment_id FK
    boolean is_read
    datetime created_at
  }

  TECHNOLOGY {
    string id PK
    string name
    string category
    string color
    datetime created_at
    datetime updated_at
  }

  USER_TECHNOLOGY {
    string id PK
    string user_id FK
    string technology_id FK
    datetime created_at
  }

  RSS_SOURCE {
    string id PK
    string feed_url UK
    string site_url
    string title
    string description
    string language
    string category
    boolean is_active
    int fetch_interval_minutes
    string etag
    string last_modified
    datetime last_fetched_at
    datetime created_at
    datetime updated_at
  }

  RSS_ENTRY {
    string id PK
    string source_id FK
    string guid
    string link
    string title
    string description
    string content_html
    string content_text
    string author_name
    string language
    string image_url
    datetime published_at
    datetime updated_at
    string content_hash
  }

  RSS_ENCLOSURE {
    string id PK
    string entry_id FK
    string url
    string mime_type
    int length
    string thumbnail_url
  }

  RSS_ENTRY_HASHTAG {
    string id PK
    string entry_id FK
    string hashtag_id FK
  }

  RSS_FETCH_LOG {
    string id PK
    string source_id FK
    datetime started_at
    datetime finished_at
    int http_status
    int fetched_count
    int inserted_count
    int updated_count
    int duration_ms
    string error_message
  }

  SOURCE_TECHNOLOGY {
    string id PK
    string source_id FK
    string technology_id FK
    datetime created_at
  }

  FEED_ITEM {
    string id PK
    string type
    string rss_entry_id FK
    string post_id FK
    boolean is_published
    float rank_score
    datetime published_at
    datetime created_at
    datetime updated_at
  }
```

補足:
- 認証は NextAuth.js を想定。必要に応じて `Account`, `Session`, `VerificationToken` を追加可能（Auth.js Prisma Adapter準拠）。
- `POST.type` は `text | video` を想定（将来リリース）。現段階のフィードは `FEED_ITEM` で `RSS_ENTRY` を参照します。
- 複合ユニーク制約（例: `LIKE(user_id, post_id)`、`BOOKMARK(user_id, post_id)`、`FOLLOW(follower_id, following_id)`、`POST_HASHTAG(post_id, hashtag_id)`、`USER_TECHNOLOGY(user_id, technology_id)`、`RSS_ENTRY(source_id, guid)`、`RSS_ENTRY_HASHTAG(entry_id, hashtag_id)`、`SOURCE_TECHNOLOGY(source_id, technology_id)`）はDBで付与してください。
- 重複排除用に `RSS_ENTRY.content_hash` を保持。
- メディアは `RSS_ENCLOSURE` に格納し、必要に応じて `thumbnail_url` を `FEED_ITEM` 描画に活用。
- 統計値は集計で取得する想定。高頻度で必要なら `post_metrics` や `user_metrics` のマテビュー/集計テーブルを別途追加。
