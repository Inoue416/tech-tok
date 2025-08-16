# Database Schema (Mermaid)

アプリの要件と既存の型定義から、初期リリースに必要なテーブルを定義します。データベースは PostgreSQL を想定し、Prisma などのORM導入を前提に正規化します。

```mermaid
erDiagram
  USER ||--o{ POST : "authors"
  USER ||--o{ LIKE : "likes"
  USER ||--o{ BOOKMARK : "bookmarks"
  USER ||--o{ FOLLOW : "follows"
  USER ||--o{ COMMENT : "comments"
  USER ||--o{ NOTIFICATION : "receives"

  POST ||--o{ LIKE : "liked by"
  POST ||--o{ BOOKMARK : "bookmarked by"
  POST ||--o{ COMMENT : "comments"
  POST ||--o{ POST_HASHTAG : "tags"
  POST ||--o{ POST_SHARE : "shares"

  HASHTAG ||--o{ POST_HASHTAG : "used in"

  FOLLOWER(USER) ||--o{ FOLLOW : "follows"
  FOLLOWING(USER) ||--o{ FOLLOW : "followed"

  USER {
    uuid id PK
    text username UK
    text display_name
    text avatar_url
    text bio
    timestamp created_at
    timestamp updated_at
  }

  POST {
    uuid id PK
    uuid author_id FK
    enum type "text|video"
    text title
    text body
    text video_url
    text thumbnail_url
    timestamp created_at
    timestamp updated_at
  }

  LIKE {
    uuid id PK
    uuid user_id FK
    uuid post_id FK
    timestamp created_at
    UNIQUE(user_id, post_id)
  }

  BOOKMARK {
    uuid id PK
    uuid user_id FK
    uuid post_id FK
    timestamp created_at
    UNIQUE(user_id, post_id)
  }

  COMMENT {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    text body
    uuid parent_comment_id FK "nullable for threads"
    timestamp created_at
    timestamp updated_at
  }

  FOLLOW {
    uuid id PK
    uuid follower_id FK
    uuid following_id FK
    timestamp created_at
    UNIQUE(follower_id, following_id)
  }

  HASHTAG {
    uuid id PK
    text name UK
    timestamp created_at
  }

  POST_HASHTAG {
    uuid id PK
    uuid post_id FK
    uuid hashtag_id FK
    UNIQUE(post_id, hashtag_id)
  }

  POST_SHARE {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    timestamp created_at
  }

  NOTIFICATION {
    uuid id PK
    uuid user_id FK "recipient"
    enum type "like|comment|follow|share"
    uuid actor_id FK "who did it"
    uuid post_id FK "optional"
    uuid comment_id FK "optional"
    boolean is_read
    timestamp created_at
  }
```

補足:
- 認証は NextAuth.js を想定。必要に応じて `Account`, `Session`, `VerificationToken` を追加可能（Auth.js Prisma Adapter準拠）。
- 統計値は集計で取得する想定。高頻度で必要なら `post_metrics` や `user_metrics` のマテビュー/集計テーブルを別途追加。
