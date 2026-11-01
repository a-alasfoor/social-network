package repos

import (
	"context"
	"database/sql"
)

type User struct {
	ID           int64
	Email        string
	PasswordHash string
	FirstName    string
	LastName     string
	DOB          string
	AvatarURL    sql.NullString
	Nickname     sql.NullString
	About        sql.NullString
	IsPublic     bool
	CreatedAt    string
}

type UserRepo struct{ DB *sql.DB }

func (r *UserRepo) Create(ctx context.Context, u *User) error {
	res, err := r.DB.ExecContext(ctx, `INSERT INTO users(email, password_hash, first_name, last_name, dob, avatar_url, nickname, about, is_public) VALUES(?,?,?,?,?,?,?,?,?)`,
		u.Email, u.PasswordHash, u.FirstName, u.LastName, u.DOB, u.AvatarURL, u.Nickname, u.About, boolToInt(u.IsPublic))
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	u.ID = id
	return nil
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*User, error) {
	row := r.DB.QueryRowContext(ctx, `SELECT id, email, password_hash, first_name, last_name, dob, avatar_url, nickname, about, is_public, created_at FROM users WHERE email = ?`, email)
	return scanUser(row)
}

func (r *UserRepo) GetByID(ctx context.Context, id int64) (*User, error) {
	row := r.DB.QueryRowContext(ctx, `SELECT id, email, password_hash, first_name, last_name, dob, avatar_url, nickname, about, is_public, created_at FROM users WHERE id = ?`, id)
	return scanUser(row)
}

func (r *UserRepo) ListAll(ctx context.Context) ([]User, error) {
	rows, err := r.DB.QueryContext(ctx, `SELECT id, email, password_hash, first_name, last_name, dob, avatar_url, nickname, about, is_public, created_at FROM users ORDER BY first_name, last_name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []User
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *u)
	}
	return out, rows.Err()
}

func (r *UserRepo) ListAllPublic(ctx context.Context) ([]User, error) {
	rows, err := r.DB.QueryContext(ctx, `SELECT id, email, password_hash, first_name, last_name, dob, avatar_url, nickname, about, is_public, created_at FROM users ORDER BY first_name, last_name where is_public = 1`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []User
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *u)
	}
	return out, rows.Err()
}


func (r *UserRepo) UpdateProfile(ctx context.Context, id int64, nickname, about sql.NullString) error {
	_, err := r.DB.ExecContext(ctx, `UPDATE users SET nickname = ?, about = ? WHERE id = ?`, nickname, about, id)
	return err
}

type userScanner interface {
	Scan(dest ...any) error
}

func scanUser(s userScanner) (*User, error) {
	u := &User{}
	var isPublic int
	if err := s.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.FirstName, &u.LastName, &u.DOB, &u.AvatarURL, &u.Nickname, &u.About, &isPublic, &u.CreatedAt); err != nil {
		return nil, err
	}
	u.IsPublic = isPublic == 1
	return u, nil
}

func boolToInt(v bool) int {
	if v {
		return 1
	}
	return 0
}
