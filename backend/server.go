package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"social-net/pkg/repos"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// Global variables
var (
	db       *sql.DB
	userRepo *repos.UserRepo
)

func getenv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func main() {
	// Open SQLite database
	var err error
	dbPath := getenv("DATABASE_PATH", "./socialnet.db")
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	// Initialize UserRepo
	userRepo = &repos.UserRepo{DB: db}

	// Routes
	http.HandleFunc("/users", usersHandler)
	http.HandleFunc("/users/", userByIDHandler)

	log.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Helper to respond JSON
func respondJSON(w http.ResponseWriter, data any, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// ---------------- API Handlers ----------------

// GET /users - list all users
// POST /users - create new user
func usersHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		users, err := userRepo.ListAll(ctx)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		respondJSON(w, users, http.StatusOK)

	case http.MethodPost:
		var u repos.User
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		if err := userRepo.Create(ctx, &u); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		respondJSON(w, u, http.StatusCreated)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// GET /users/:id
func userByIDHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	idStr := strings.TrimPrefix(r.URL.Path, "/users/")
	if idStr == "" {
		http.Error(w, "missing user id", http.StatusBadRequest)
		return
	}

	// Convert id to int64
	var id int64
	_, err := fmt.Sscan(idStr, &id)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	user, err := userRepo.GetByID(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	respondJSON(w, user, http.StatusOK)
}
