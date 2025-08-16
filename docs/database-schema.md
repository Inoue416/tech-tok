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
    string type
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
    string type
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
```

補足:
- 認証は NextAuth.js を想定。必要に応じて `Account`, `Session`, `VerificationToken` を追加可能（Auth.js Prisma Adapter準拠）。
- `POST.type` は `text | video` を想定。
- 複合ユニーク制約（例: `LIKE(user_id, post_id)`、`BOOKMARK(user_id, post_id)`、`FOLLOW(follower_id, following_id)`、`POST_HASHTAG(post_id, hashtag_id)`、`USER_TECHNOLOGY(user_id, technology_id)`）はDBで付与してください（Mermaidの記法上は注釈のみ）。
- 統計値は集計で取得する想定。高頻度で必要なら `post_metrics` や `user_metrics` のマテビュー/集計テーブルを別途追加。
