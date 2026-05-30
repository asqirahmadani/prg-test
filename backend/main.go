package main

import (
	"log"
	"perdin-backend/config"
	"perdin-backend/handler"
	"perdin-backend/repo/postgres"
	"perdin-backend/router"
	"perdin-backend/server"
	"perdin-backend/usecase"
	"perdin-backend/utils"
	"perdin-backend/utils/logger"

	"github.com/jmoiron/sqlx"
)

func main() {
	cfg := config.Load()

	db := initDB(*cfg)
	defer db.Close()

	initLogger()
	defer func() { _ = logger.Log.Sync() }()

	handlers := initHandlers(*cfg, db)

	server.StartHTTPServer(router.SetupRouter(*cfg, handlers), cfg.App)
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

func initHandlers(cfg config.Config, db *sqlx.DB) (*handler.Handlers) {
	authRepo := postgres.NewAuthRepository(db)

	hasher := &utils.PasswordHasher{}
	tokenIssuer := &utils.TokenIssuer{}

	authUsecase := usecase.NewAuthUsecase(authRepo, hasher, tokenIssuer, cfg.JWT)
	authHandler := handler.NewAuthHandler(authUsecase)

	handler := handler.NewHandlers(*authHandler)

	return handler
}