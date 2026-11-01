package sqlite

import (
	"database/sql"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

func Open(path string) (*sql.DB, error) {
	dsn := fmt.Sprintf("file:%s?_foreign_keys=on", path)
	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, err
	}
	if _, err := db.Exec("PRAGMA foreign_keys=ON;"); err != nil {
		return nil, err
	}
	return db, nil
}

func Migrate(db *sql.DB, migrationsPath string) error {
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://"+migrationsPath,
		"sqlite3", driver,
	)
	if err != nil {
		return err
	}
	if err := m.Up(); err != nil && err.Error() != "no change" {
		return err
	}
	return nil
}
