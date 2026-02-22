# Backend Contract: Separate Content Types + User Interactions

Clear schema with separate tables for meditations, yogas, mantras, and library.

Main content entities:

- `meditations` - meditation practices
- `yogas` - yoga classes
- `mantras` - mantra/chants
- `library_items` - books/articles

User interaction per content type:

- `saved_*` tables (saved_meditations, saved_yogas, saved_mantras, saved_library_items)
- `user_*_progress` tables (user_meditation_progress, user_yoga_progress, user_mantra_progress, user_library_progress)
- `user_*_reviews` tables (user_meditation_reviews, user_yoga_reviews, user_mantra_reviews, user_library_reviews)

---

## 1) Field Naming Standard

- `snake_case` for all fields
- UUIDs for IDs
- UTC ISO datetime strings
- `duration_seconds` for all time measurements
- `progress_percent` as 0-100 number

---

## 2) Core Tables

## 2.1 Users

**Table: `users`**

- `id` (UUID)
- `email` (unique)
- `username` (unique)
- `full_name`
- `profile_image_url` (nullable)
- `bio` (nullable)
- `is_active` (boolean, default true)
- `created_at`
- `updated_at`

**Index:**

- email, username

---

## 2.2 User Stats

**Table: `user_stats`**

- `user_id` (UUID, FK → users.id, PRIMARY KEY)
- `total_sessions_completed` (integer, default 0)
- `total_meditation_minutes` (integer, default 0)
- `total_yoga_minutes` (integer, default 0)
- `total_mantras_practiced` (integer, default 0)
- `current_streak_days` (integer, default 0)
- `longest_streak_days` (integer, default 0)
- `updated_at` (datetime)

---

## 2.3 Meditations

**Table: `meditations`**

- `id` (UUID)
- `title`
- `subtitle` (nullable)
- `description` (nullable)
- `difficulty` (enum: `beginner`, `intermediate`, `advanced`, `all_levels`, default `all_levels`)
- `duration_seconds` (integer, nullable)
- `thumbnail_url` (nullable)
- `cover_image_url` (nullable)
- `media_url` (nullable)
- `goal_slug` (nullable; e.g., `stress_relief`, `focus`, `sleep`)
- `is_featured` (boolean, default false)
- `is_trending` (boolean, default false)
- `is_active` (boolean, default true)
- `accent_label` (nullable; e.g., `NEW`, `POPULAR`)
- `metadata` (JSON, nullable)
- `created_at`
- `updated_at`

**Indexes:**

- goal_slug, is_featured, is_active

**Metadata JSON (example):**

```json
{
  "about_paragraphs": [
    {"text": "Body scan meditation...", "order": 1}
  ],
  "focus_areas": [
    {"label": "Body Awareness", "icon": "spa", "order": 1},
    {"label": "Relaxation", "icon": "spa", "order": 2}
  ],
  "benefits": [
    {"text": "Stress Relief", "order": 1},
    {"text": "Better Sleep", "order": 2}
  ]
}
```

---

## 2.4 Yogas

**Table: `yogas`**

- `id` (UUID)
- `title`
- `subtitle` (nullable)
- `description` (nullable)
- `difficulty` (enum: `beginner`, `intermediate`, `advanced`, `all_levels`, default `all_levels`)
- `duration_seconds` (integer, nullable)
- `thumbnail_url` (nullable)
- `cover_image_url` (nullable)
- `media_url` (nullable)
- `goal_slug` (nullable; e.g., `strength`, `flexibility`, `balance`)
- `is_featured` (boolean, default false)
- `is_trending` (boolean, default false)
- `is_active` (boolean, default true)
- `accent_label` (nullable)
- `metadata` (JSON, nullable)
- `created_at`
- `updated_at`

**Indexes:**

- goal_slug, is_featured, is_active

**Metadata JSON (example):**

```json
{
  "about_paragraphs": [
    {"text": "Ultimate core flow yoga...", "order": 1}
  ],
  "focus_areas": [
    {"label": "Core Strength", "icon": "fitness", "order": 1},
    {"label": "Flexibility", "icon": "spa", "order": 2}
  ],
  "requirements": [
    {"label": "Yoga Mat", "icon": "mat", "required": true, "order": 1},
    {"label": "Blocks (optional)", "icon": "block", "required": false, "order": 2}
  ],
  "steps": [
    {"title": "Warm-up", "description": "5 min warm-up", "duration_seconds": 300, "order": 1},
    {"title": "Core Work", "description": "Main flow", "duration_seconds": 1200, "order": 2}
  ],
  "benefits": [
    {"text": "Core Strength", "order": 1},
    {"text": "Better Posture", "order": 2}
  ]
}
```

---

## 2.5 Mantras

**Table: `mantras`**

- `id` (UUID)
- `title` (mantra name)
- `meaning` (nullable)
- `lyrics` (text, nullable)
- `transliteration` (nullable)
- `pronunciation_guide` (nullable)
- `duration_seconds` (integer, nullable)
- `thumbnail_url` (nullable)
- `audio_url` (nullable)
- `is_featured` (boolean, default false)
- `is_trending` (boolean, default false)
- `is_active` (boolean, default true)
- `accent_label` (nullable)
- `metadata` (JSON, nullable)
- `created_at`
- `updated_at`

**Indexes:**

- is_featured, is_active

**Metadata JSON (example):**

```json
{
  "about_paragraphs": [
    {"text": "Gayatri Mantra is...", "order": 1}
  ],
  "intents": [
    {"label": "Wisdom", "icon": "lightbulb", "order": 1},
    {"label": "Clarity", "icon": "clarity", "order": 2}
  ],
  "benefits": [
    {"text": "Mental Clarity", "order": 1},
    {"text": "Spiritual Growth", "order": 2}
  ]
}
```

---

## 2.6 Library Items

**Table: `library_items`**

- `id` (UUID)
- `library_type` (enum: `book`, `article`, `resource`)
- `title`
- `author_name` (nullable)
- `description` (nullable)
- `read_minutes` (integer, nullable)
- `cover_image_url` (nullable)
- `thumbnail_url` (nullable)
- `category_slug` (nullable)
- `is_featured` (boolean, default false)
- `is_active` (boolean, default true)
- `created_at`
- `updated_at`

**Indexes:**

- library_type, category_slug, is_active

---

## 2.7 Saved Meditations

**Table: `saved_meditations`**

- `user_id` (UUID, FK → users.id)
- `meditation_id` (UUID, FK → meditations.id)
- `saved_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, meditation_id)

---

## 2.8 Saved Yogas

**Table: `saved_yogas`**

- `user_id` (UUID, FK → users.id)
- `yoga_id` (UUID, FK → yogas.id)
- `saved_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, yoga_id)

---

## 2.9 Saved Mantras

**Table: `saved_mantras`**

- `user_id` (UUID, FK → users.id)
- `mantra_id` (UUID, FK → mantras.id)
- `saved_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, mantra_id)

---

## 2.10 Saved Library Items

**Table: `saved_library_items`**

- `user_id` (UUID, FK → users.id)
- `library_item_id` (UUID, FK → library_items.id)
- `saved_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, library_item_id)

---

## 2.11 User Meditation Progress

**Table: `user_meditation_progress`**

- `user_id` (UUID, FK → users.id)
- `meditation_id` (UUID, FK → meditations.id)
- `progress_percent` (numeric 0-100, default 0)
- `status` (enum: `not_started`, `in_progress`, `completed`, default `not_started`)
- `last_position_seconds` (integer, default 0)
- `started_at` (datetime, nullable)
- `completed_at` (datetime, nullable)
- `last_played_at` (datetime, nullable)
- `updated_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, meditation_id)

---

## 2.12 User Yoga Progress

**Table: `user_yoga_progress`**

- `user_id` (UUID, FK → users.id)
- `yoga_id` (UUID, FK → yogas.id)
- `progress_percent` (numeric 0-100, default 0)
- `status` (enum: `not_started`, `in_progress`, `completed`, default `not_started`)
- `last_position_seconds` (integer, default 0)
- `started_at` (datetime, nullable)
- `completed_at` (datetime, nullable)
- `last_played_at` (datetime, nullable)
- `updated_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, yoga_id)

---

## 2.13 User Mantra Progress

**Table: `user_mantra_progress`**

- `user_id` (UUID, FK → users.id)
- `mantra_id` (UUID, FK → mantras.id)
- `times_practiced` (integer, default 0)
- `last_practiced_at` (datetime, nullable)
- `updated_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, mantra_id)

---

## 2.14 User Library Progress

**Table: `user_library_progress`**

- `user_id` (UUID, FK → users.id)
- `library_item_id` (UUID, FK → library_items.id)
- `progress_percent` (numeric 0-100, default 0)
- `status` (enum: `not_started`, `in_progress`, `completed`, default `not_started`)
- `last_read_at` (datetime, nullable)
- `updated_at` (datetime)

**Constraint:**

- PRIMARY KEY (user_id, library_item_id)

---

## 2.15 User Meditation Reviews

**Table: `user_meditation_reviews`**

- `id` (UUID)
- `user_id` (UUID, FK → users.id)
- `meditation_id` (UUID, FK → meditations.id)
- `rating` (integer 1-5)
- `title` (string, nullable)
- `comment` (text, nullable)
- `created_at`
- `updated_at`

**Constraint:**

- UNIQUE (user_id, meditation_id)

---

## 2.16 User Yoga Reviews

**Table: `user_yoga_reviews`**

- `id` (UUID)
- `user_id` (UUID, FK → users.id)
- `yoga_id` (UUID, FK → yogas.id)
- `rating` (integer 1-5)
- `title` (string, nullable)
- `comment` (text, nullable)
- `created_at`
- `updated_at`

**Constraint:**

- UNIQUE (user_id, yoga_id)

---

## 2.17 User Mantra Reviews

**Table: `user_mantra_reviews`**

- `id` (UUID)
- `user_id` (UUID, FK → users.id)
- `mantra_id` (UUID, FK → mantras.id)
- `rating` (integer 1-5)
- `comment` (text, nullable)
- `created_at`
- `updated_at`

**Constraint:**

- UNIQUE (user_id, mantra_id)

---

## 2.18 User Library Reviews

**Table: `user_library_reviews`**

- `id` (UUID)
- `user_id` (UUID, FK → users.id)
- `library_item_id` (UUID, FK → library_items.id)
- `rating` (integer 1-5)
- `comment` (text, nullable)
- `created_at`
- `updated_at`

**Constraint:**

- UNIQUE (user_id, library_item_id)

---

## 3) API Contract

Response envelope for all endpoints:

- `success`: boolean
- `message`: string
- `data`: object | array

### 3.1 Home

**`GET /api/v1/home`**

Returns:

- user greeting
- streak summary
- featured meditations
- featured yogas
- featured mantras
- mantra of day
- recommended items

---

### 3.2 Meditations

**`GET /api/v1/meditations`**

Filter query params:

- `goal_slug`
- `difficulty`
- `is_featured`
- `is_trending`
- `sort` (`recent`, `popular`, `duration_asc`, `duration_desc`)
- `page`
- `limit`

**`GET /api/v1/meditations/{meditation_id}`**

**`POST /api/v1/meditations`** (admin)

**`PATCH /api/v1/meditations/{meditation_id}`** (admin)

**`DELETE /api/v1/meditations/{meditation_id}`** (admin)

---

### 3.3 Yogas

**`GET /api/v1/yogas`**

Filter query params:

- `goal_slug`
- `difficulty`
- `is_featured`
- `is_trending`
- `sort`
- `page`
- `limit`

**`GET /api/v1/yogas/{yoga_id}`**

**`POST /api/v1/yogas`** (admin)

**`PATCH /api/v1/yogas/{yoga_id}`** (admin)

**`DELETE /api/v1/yogas/{yoga_id}`** (admin)

---

### 3.4 Mantras

**`GET /api/v1/mantras`**

Filter query params:

- `is_featured`
- `is_trending`
- `sort`
- `page`
- `limit`

**`GET /api/v1/mantras/{mantra_id}`**

**`POST /api/v1/mantras`** (admin)

**`PATCH /api/v1/mantras/{mantra_id}`** (admin)

**`DELETE /api/v1/mantras/{mantra_id}`** (admin)

---

### 3.5 Library

**`GET /api/v1/library`**

Filter query params:

- `library_type`
- `category_slug`
- `is_featured`
- `sort`
- `page`
- `limit`

**`GET /api/v1/library/{library_item_id}`**

**`POST /api/v1/library`** (admin)

**`PATCH /api/v1/library/{library_item_id}`** (admin)

**`DELETE /api/v1/library/{library_item_id}`** (admin)

---

### 3.6 User Saved Meditations

**`GET /api/v1/me/saved-meditations`**

**`POST /api/v1/me/saved-meditations`**

Body: `{ meditation_id }`

**`DELETE /api/v1/me/saved-meditations/{meditation_id}`**

---

### 3.7 User Saved Yogas

**`GET /api/v1/me/saved-yogas`**

**`POST /api/v1/me/saved-yogas`**

Body: `{ yoga_id }`

**`DELETE /api/v1/me/saved-yogas/{yoga_id}`**

---

### 3.8 User Saved Mantras

**`GET /api/v1/me/saved-mantras`**

**`POST /api/v1/me/saved-mantras`**

Body: `{ mantra_id }`

**`DELETE /api/v1/me/saved-mantras/{mantra_id}`**

---

### 3.9 User Saved Library

**`GET /api/v1/me/saved-library`**

**`POST /api/v1/me/saved-library`**

Body: `{ library_item_id }`

**`DELETE /api/v1/me/saved-library/{library_item_id}`**

---

### 3.10 User Meditation Progress

**`GET /api/v1/me/meditation-progress`**

**`POST /api/v1/me/meditation-progress`**

Body:

```json
{
  "meditation_id": "uuid",
  "progress_percent": 50,
  "status": "in_progress",
  "last_position_seconds": 300
}
```

**`PATCH /api/v1/me/meditation-progress/{meditation_id}`**

---

### 3.11 User Yoga Progress

**`GET /api/v1/me/yoga-progress`**

**`POST /api/v1/me/yoga-progress`**

Body:

```json
{
  "yoga_id": "uuid",
  "progress_percent": 75,
  "status": "in_progress",
  "last_position_seconds": 600
}
```

**`PATCH /api/v1/me/yoga-progress/{yoga_id}`**

---

### 3.12 User Mantra Progress

**`GET /api/v1/me/mantra-progress`**

**`POST /api/v1/me/mantra-progress`**

Body:

```json
{
  "mantra_id": "uuid",
  "times_practiced": 5
}
```

**`PATCH /api/v1/me/mantra-progress/{mantra_id}`**

---

### 3.13 User Library Progress

**`GET /api/v1/me/library-progress`**

**`POST /api/v1/me/library-progress`**

Body:

```json
{
  "library_item_id": "uuid",
  "progress_percent": 40,
  "status": "in_progress"
}
```

**`PATCH /api/v1/me/library-progress/{library_item_id}`**

---

### 3.14 User Meditation Reviews

**`GET /api/v1/meditations/{meditation_id}/reviews`**

**`POST /api/v1/meditations/{meditation_id}/reviews`**

Body:

```json
{
  "rating": 5,
  "title": "Great session",
  "comment": "Very relaxing"
}
```

**`PATCH /api/v1/meditations/{meditation_id}/reviews/{review_id}`**

**`DELETE /api/v1/meditations/{meditation_id}/reviews/{review_id}`**

---

### 3.15 User Yoga Reviews

**`GET /api/v1/yogas/{yoga_id}/reviews`**

**`POST /api/v1/yogas/{yoga_id}/reviews`**

**`PATCH /api/v1/yogas/{yoga_id}/reviews/{review_id}`**

**`DELETE /api/v1/yogas/{yoga_id}/reviews/{review_id}`**

---

### 3.16 User Mantra Reviews

**`GET /api/v1/mantras/{mantra_id}/reviews`**

**`POST /api/v1/mantras/{mantra_id}/reviews`**

**`PATCH /api/v1/mantras/{mantra_id}/reviews/{review_id}`**

**`DELETE /api/v1/mantras/{mantra_id}/reviews/{review_id}`**

---

### 3.17 User Library Reviews

**`GET /api/v1/library/{library_item_id}/reviews`**

**`POST /api/v1/library/{library_item_id}/reviews`**

**`PATCH /api/v1/library/{library_item_id}/reviews/{review_id}`**

**`DELETE /api/v1/library/{library_item_id}/reviews/{review_id}`**

---

## 4) Required Constraints

- `users.email` unique
- `users.username` unique
- `saved_meditations`: unique (user_id, meditation_id)
- `saved_yogas`: unique (user_id, yoga_id)
- `saved_mantras`: unique (user_id, mantra_id)
- `saved_library_items`: unique (user_id, library_item_id)
- `user_meditation_reviews`: unique (user_id, meditation_id)
- `user_yoga_reviews`: unique (user_id, yoga_id)
- `user_mantra_reviews`: unique (user_id, mantra_id)
- `user_library_reviews`: unique (user_id, library_item_id)
- `progress_percent` must be within 0..100
- `rating` must be within 1..5
- durations/counts cannot be negative

---

## 5) Implementation Notes

- All IDs are UUIDs (strings)
- All timestamps are UTC ISO-8601
- Metadata fields store rich content (about_paragraphs, focus_areas, requirements, steps, benefits)
- Progress tables track WHERE user is + completion status
- Reviews are one per user+content
- Soft deletes use `is_active=false` flag (no hard deletes)









## 6) Missing Points from Current UI + Required Contract Additions

This section captures the gaps found while comparing the implemented UI with this contract.

### 6.1 Required: Media Path / URL Coverage (Meditations and Others)

Current UI needs explicit media paths for playback and card rendering. To avoid fallback dummy content, keep these fields mandatory at API response level when relevant.

#### Meditations

- Existing fields already present: `thumbnail_url`, `cover_image_url`, `media_url`
- Clarification (required):
  - `media_url` must be the playable source path (audio/video stream or file URL)
  - `thumbnail_url` must be card/list image path
  - `cover_image_url` must be detail/hero image path

#### Yogas

- Existing fields already present: `thumbnail_url`, `cover_image_url`, `media_url`
- Clarification (required): same semantics as meditations

#### Mantras

- Existing fields already present: `thumbnail_url`, `audio_url`
- Add required field:
  - `cover_image_url` (nullable) for detail/hero view parity with meditation/yoga
- Clarification:
  - `audio_url` is the playable mantra audio path

#### Library Items

- Existing fields already present: `thumbnail_url`, `cover_image_url`
- Add recommended field:
  - `content_url` (nullable): canonical path for article/resource/book reader target

### 6.2 Required: Home Payload Shape Must Be Explicit

`GET /api/v1/home` should return a structured object so UI sections can be fully dynamic.

Required `data` shape:

```json
{
  "user": {
    "id": "uuid",
    "first_name": "string",
    "full_name": "string",
    "profile_image_url": "string|null"
  },
  "streak_summary": {
    "current_streak_days": 0,
    "longest_streak_days": 0
  },
  "today_focus": "string",
  "featured_meditations": [],
  "featured_yogas": [],
  "featured_mantras": [],
  "mantra_of_day": {},
  "recommended_items": []
}
```

`recommended_items` item shape (required):

```json
{
  "content_type": "meditation|yoga|mantra|library",
  "content_id": "uuid",
  "title": "string",
  "subtitle": "string|null",
  "duration_seconds": 0,
  "thumbnail_url": "string|null",
  "accent_label": "string|null",
  "reason": "string|null"
}
```

### 6.3 Required: Metadata Keys Needed by Detail Screens

To remove detail-screen fallback dummy blocks, standardize metadata keys.

#### Meditations metadata (required keys)

- `about_paragraphs[]`
- `focus_areas[]`
- `requirements[]`
- `steps[]`
- `benefits[]`

#### Yogas metadata (required keys)

- `about_paragraphs[]`
- `focus_areas[]`
- `requirements[]`
- `steps[]`
- `benefits[]`

#### Mantras metadata (required keys)

- `about_paragraphs[]`
- `intents[]`
- `benefits[]`

### 6.4 Required: Profile "Saved Sessions" Aggregation

Current profile UI needs one mixed list for tabs. Add aggregation endpoint:

- **`GET /api/v1/me/saved-sessions`**

Query params:

- `content_type` (`meditation|yoga|mantra|library`)
- `page`
- `limit`

Response item shape:

```json
{
  "content_type": "meditation|yoga|mantra|library",
  "content_id": "uuid",
  "title": "string",
  "subtitle": "string|null",
  "duration_seconds": 0,
  "thumbnail_url": "string|null",
  "saved_at": "2026-01-01T00:00:00Z"
}
```

### 6.5 Optional but Recommended: UI Concepts Not Covered by Current Contract

These are used by UI but not yet first-class in this schema.

#### A) Instructors

Add table:

- `instructors`
  - `id` (UUID)
  - `full_name`
  - `avatar_url` (nullable)
  - `bio` (nullable)
  - `is_active` (boolean, default true)
  - `created_at`
  - `updated_at`

Join tables:

- `meditation_instructors` (`meditation_id`, `instructor_id`)
- `yoga_instructors` (`yoga_id`, `instructor_id`)

#### B) Learning Paths

Add tables:

- `learning_paths`
  - `id` (UUID)
  - `title`
  - `description` (nullable)
  - `cover_image_url` (nullable)
  - `is_active` (boolean, default true)
  - `created_at`
  - `updated_at`

- `learning_path_items`
  - `learning_path_id` (UUID FK)
  - `content_type` (`meditation|yoga|mantra|library`)
  - `content_id` (UUID)
  - `order_index` (integer)

Endpoint:

- **`GET /api/v1/learning-paths`**

#### C) Wellness Check-ins (Home mood widget)

Add table:

- `user_wellness_checkins`
  - `id` (UUID)
  - `user_id` (UUID FK)
  - `mood_slug` (`calm|stressed|tired|energized|...`)
  - `note` (nullable)
  - `created_at`

Endpoints:

- **`POST /api/v1/me/wellness-checkins`**
- **`GET /api/v1/me/wellness-checkins`**

#### D) Pranayama

Profile currently shows a pranayama tab. Either:

1. Remove pranayama tab from UI, or
2. Add full parity module:
   - `pranayamas`
   - `saved_pranayamas`
   - `user_pranayama_progress`
   - `user_pranayama_reviews`
   - related `/api/v1/pranayamas` and `/api/v1/me/*` endpoints

### 6.6 Validation Additions

- `media_url`, `audio_url`, `thumbnail_url`, `cover_image_url`, `content_url` must be valid URL/path strings when provided
- For playable content (meditation/yoga/mantra), at least one playable path must exist (`media_url` or `audio_url` depending on type)
- API should return nulls explicitly for optional media fields to keep client parsing deterministic
