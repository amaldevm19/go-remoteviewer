package main

import (
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	db *gorm.DB
	gorm.Model
	Id        int64
	Body      string
	Done      bool
	CreatedAt *time.Time
	UpdatedAt *time.Time
}

type ContextKey string

const (
	TodoContextKey ContextKey = "todoKey"
)

func NewTodo() *Todo {
	db := InitDb()
	db.AutoMigrate(&Todo{})
	return &Todo{db: db}
}

func (todo *Todo) Add(body string) error {
	result := todo.db.Create(&Todo{Body: body})
	if result.Error != nil {
		return result.Error
	} else {
		return nil
	}
}
