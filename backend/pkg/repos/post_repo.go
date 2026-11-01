package repos

import (
	"context"
	"database/sql"
)

type Post struct {
	ID        int64
	AuthorID  int64
	Body      string
	ImageURL  sql.NullString
	Privacy   string
	CreatedAt string
}

type Comment struct {
	ID        int64
	PostID    int64
	AuthorID  int64
	Body      string
	ImageURL  sql.NullString
	CreatedAt string
}

type PostRepo struct{ DB *sql.DB }

func (r *PostRepo) Create(ctx context.Context, p *Post) error {
	res, err := r.DB.ExecContext(ctx, `INSERT INTO posts(author_id, body, image_url, privacy) VALUES(?,?,?,?)`, p.AuthorID, p.Body, p.ImageURL, p.Privacy)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	p.ID = id
	if err := r.DB.QueryRowContext(ctx, `SELECT created_at FROM posts WHERE id = ?`, p.ID).Scan(&p.CreatedAt); err != nil {
		return err
	}
	return nil
}

func (r *PostRepo) ListRecent(ctx context.Context, userID int64, limit int) ([]Post, error) {
	rows, err := r.DB.QueryContext(ctx, `SELECT id, author_id, body, image_url, privacy, created_at FROM posts ORDER BY created_at DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.AuthorID, &p.Body, &p.ImageURL, &p.Privacy, &p.CreatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (r *PostRepo) GetByID(ctx context.Context, id int64) (*Post, error) {
	row := r.DB.QueryRowContext(ctx, `SELECT id, author_id, body, image_url, privacy, created_at FROM posts WHERE id = ?`, id)
	var p Post
	if err := row.Scan(&p.ID, &p.AuthorID, &p.Body, &p.ImageURL, &p.Privacy, &p.CreatedAt); err != nil {
		return nil, err
	}
	return &p, nil
}
