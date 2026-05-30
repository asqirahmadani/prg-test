package main

import (
	"log"
	"perdin-backend/config"
	"perdin-backend/repo/postgres"
	"perdin-backend/router"
	"perdin-backend/server"
	"perdin-backend/utils/logger"

	"github.com/jmoiron/sqlx"
)

func main() {
	cfg := config.Load()

	db := initDB(*cfg)
	defer db.Close()

	initLogger()
	defer func() { _ = logger.Log.Sync() }()

	server.StartHTTPServer(router.SetupRouter(*cfg), cfg.App)
}

func initDB(cfg config.Config) *sqlx.DB {
	db, err := postgres.Connect(cfg.Database)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}
	return db
}

func initLogger() {
	if err := logger.InitZapSugaredLogger(); err != nil {
		log.Fatal(err)
	}
}