# Database Schema (Mermaid)

アプリの要件と既存の型定義から、初期リリースに必要なテーブルを定義します。データベースは PostgreSQL を想定し、Prisma などのORM導入を前提に正規化します。

```mermaid
erDiagram
  %% Users and social graph
  USER ||--o{ POST : authors
  USER ||--o{ LIKE : likes
  USER ||--o{ BOOKMARK : bookmarks
  USER ||--o{ FOLLOW : follows
  USER ||--o{ COMMENT : comments
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ POST_SHARE : shares
  USER ||--o{ USER_TECHNOLOGY : uses

  %% Posts relationships
  POST ||--o{ LIKE : liked_by
  POST ||--o{ BOOKMARK : bookmarked_by
  POST ||--o{ COMMENT : comments
  POST ||--o{ POST_HASHTAG : tagged_with
  POST ||--o{ POST_SHARE : shared_as

  %% Hashtags
  HASHTAG ||--o{ POST_HASHTAG : used_in
  TECHNOLOGY ||--o{ USER_TECHNOLOGY : used_by

  %% RSS ingestion and feed curation
  RSS_SOURCE ||--o{ RSS_ENTRY : provides
  RSS_ENTRY ||--o{ RSS_ENCLOSURE : has_media
  RSS_ENTRY ||--o{ RSS_ENTRY_HASHTAG : tagged_with
  HASHTAG ||--o{ RSS_ENTRY_HASHTAG : used_in
  RSS_SOURCE ||--o{ RSS_FETCH_LOG : fetches
  RSS_SOURCE ||--o{ SOURCE_TECHNOLOGY : categorized_as
  TECHNOLOGY ||--o{ SOURCE_TECHNOLOGY : category_map

  %% Feed items referencing either RSS entries or future posts
  FEED_ITEM }o--|| RSS_ENTRY : references
  FEED_ITEM }o--|| POST : references

  USER {
    uuid id PK
    string username UK
    string display_name
    string avatar_url
    string bio
    timestamp created_at
    timestamp updated_at
  }

  POST {
    uuid id PK
    uuid author_id FK
    string type %% text|video
    string title
    string body
    string video_url
    string thumbnail_url
    timestamp created_at
    timestamp updated_at
  }

  LIKE {
    uuid id PK
    uuid user_id FK
    uuid post_id FK
    timestamp created_at
  }

  BOOKMARK {
    uuid id PK
    uuid user_id FK
    uuid post_id FK
    timestamp created_at
  }

  COMMENT {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    string body
    uuid parent_comment_id FK
    timestamp created_at
    timestamp updated_at
  }

  FOLLOW {
    uuid id PK
    uuid follower_id FK
    uuid following_id FK
    timestamp created_at
  }

  HASHTAG {
    uuid id PK
    string name UK
    timestamp created_at
  }

  POST_HASHTAG {
    uuid id PK
    uuid post_id FK
    uuid hashtag_id FK
  }

  POST_SHARE {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    timestamp created_at
  }

  NOTIFICATION {
    uuid id PK
    uuid user_id FK
    string type %% like|comment|follow|share
    uuid actor_id FK
    uuid post_id FK
    uuid comment_id FK
    boolean is_read
    timestamp created_at
  }

  TECHNOLOGY {
    uuid id PK
    string name
    string category
    string color
    timestamp created_at
    timestamp updated_at
  }

  USER_TECHNOLOGY {
    uuid id PK
    uuid user_id FK
    uuid technology_id FK
    timestamp created_at
  }

  %% RSS ingestion
  RSS_SOURCE {
    uuid id PK
    string feed_url UK
    string site_url
    string title
    string description
    string language
    string category
    boolean is_active
    integer fetch_interval_minutes
    string etag
    string last_modified
    timestamp last_fetched_at
    timestamp created_at
    timestamp updated_at
  }

  RSS_ENTRY {
    uuid id PK
    uuid source_id FK
    string guid
    string link
    string title
    string description
    string content_html
    string content_text
    string author_name
    string language
    string image_url
    timestamp published_at
    timestamp updated_at
    string content_hash %% for deduplication
  }

  RSS_ENCLOSURE {
    uuid id PK
    uuid entry_id FK
    string url
    string mime_type
    integer length
    string thumbnail_url
  }

  RSS_ENTRY_HASHTAG {
    uuid id PK
    uuid entry_id FK
    uuid hashtag_id FK
  }

  RSS_FETCH_LOG {
    uuid id PK
    uuid source_id FK
    timestamp started_at
    timestamp finished_at
    integer http_status
    integer fetched_count
    integer inserted_count
    integer updated_count
    integer duration_ms
    string error_message
  }

  SOURCE_TECHNOLOGY {
    uuid id PK
    uuid source_id FK
    uuid technology_id FK
    timestamp created_at
  }

  %% Feed curation
  FEED_ITEM {
    uuid id PK
    string type %% rss|post
    uuid rss_entry_id FK
    uuid post_id FK
    boolean is_published
    float rank_score
    timestamp published_at
    timestamp created_at
    timestamp updated_at
  }
```

補足:
- 認証は NextAuth.js を想定。必要に応じて `Account`, `Session`, `VerificationToken` を追加可能（Auth.js Prisma Adapter準拠）。
- `POST.type` は `text | video` を想定（将来リリース）。現段階のフィードは `FEED_ITEM` で `RSS_ENTRY` を参照します。
- 複合ユニーク制約（例: `LIKE(user_id, post_id)`、`BOOKMARK(user_id, post_id)`、`FOLLOW(follower_id, following_id)`、`POST_HASHTAG(post_id, hashtag_id)`、`USER_TECHNOLOGY(user_id, technology_id)`、`RSS_ENTRY(source_id, guid)`、`RSS_ENTRY_HASHTAG(entry_id, hashtag_id)`、`SOURCE_TECHNOLOGY(source_id, technology_id)`）はDBで付与してください（Mermaidの記法上は注釈のみ）。
- 重複排除用に `RSS_ENTRY.content_hash` を保持。`guid` がない/不安定なフィードにも対応。
- 画像/動画などのメディアは `RSS_ENCLOSURE` に格納し、必要に応じて `thumbnail_url` を `FEED_ITEM` 描画に活用。
- 統計値は集計で取得する想定。高頻度で必要なら `post_metrics` や `user_metrics` のマテビュー/集計テーブルを別途追加。
