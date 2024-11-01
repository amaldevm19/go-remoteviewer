package main

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDb() *gorm.DB {
	// Define the folder path
	//folderPath := "C:\\Temp\\remote_viewer"
	folderPath := "./"
	// Create the folder if it doesn't exist
	if err := os.MkdirAll(folderPath, os.ModePerm); err != nil {
		panic(err)
	}
	dbPath := filepath.Join(folderPath, "myapp.db")

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	return db
}
