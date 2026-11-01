CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('avatar','post','comment','group','event')),
  mime TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_dm_to ON direct_messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_dm_from ON direct_messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_group_members ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
