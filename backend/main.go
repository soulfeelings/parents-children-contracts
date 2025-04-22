package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/config"
	"github.com/soulfeelings/parents-children-contracts/backend/database"
	"github.com/soulfeelings/parents-children-contracts/backend/handlers"
	"github.com/soulfeelings/parents-children-contracts/backend/middleware"
)

func main() {
	// Загружаем конфигурацию
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Ошибка загрузки конфигурации:", err)
	}

	// Подключаемся к базе данных
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Ошибка подключения к базе данных:", err)
	}

	// Применяем миграции
	if err := database.RunMigrations(cfg); err != nil {
		log.Fatal("Ошибка применения миграций:", err)
	}

	// Инициализируем роутер
	router := gin.Default()

	// Настраиваем trusted proxies
	router.SetTrustedProxies([]string{"127.0.0.1", "::1"})

	// Настраиваем CORS
	router.Use(middleware.CORS())

	// Инициализация обработчиков
	authHandlers := handlers.NewAuthHandlers(db)
	contractHandlers := handlers.NewContractHandlers(db)
	taskHandlers := handlers.NewTaskHandlers(db)
	rewardHandlers := handlers.NewRewardHandlers(db)
	settingsHandlers := handlers.NewSettingsHandlers(db)

	// Группы маршрутов
	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandlers.Register)
			auth.POST("/login", authHandlers.Login)
		}

		// Защищенные маршруты
		authorized := api.Group("")
		authorized.Use(middleware.AuthMiddleware())
		{
			contracts := authorized.Group("/contracts")
			{
				contracts.GET("/", contractHandlers.List)
				contracts.POST("/", middleware.RoleMiddleware("parent"), contractHandlers.Create)
				contracts.GET("/:id", contractHandlers.Get)
				contracts.PUT("/:id", contractHandlers.Update)
				contracts.DELETE("/:id", middleware.RoleMiddleware("parent"), contractHandlers.Delete)
			}

			tasks := authorized.Group("/tasks")
			{
				tasks.GET("/", taskHandlers.List)
				tasks.POST("/", middleware.RoleMiddleware("parent"), taskHandlers.Create)
				tasks.GET("/:id", taskHandlers.Get)
				tasks.PUT("/:id", taskHandlers.Update)
				tasks.DELETE("/:id", middleware.RoleMiddleware("parent"), taskHandlers.Delete)
			}

			rewards := authorized.Group("/rewards")
			{
				rewards.GET("/", rewardHandlers.List)
				rewards.POST("/", middleware.RoleMiddleware("parent"), rewardHandlers.Create)
				rewards.GET("/:id", rewardHandlers.Get)
				rewards.PUT("/:id", rewardHandlers.Update)
				rewards.DELETE("/:id", middleware.RoleMiddleware("parent"), rewardHandlers.Delete)
			}

			settings := authorized.Group("/settings")
			{
				settings.GET("/profile", settingsHandlers.GetProfile)
				settings.PUT("/profile", settingsHandlers.UpdateProfile)
				settings.PUT("/password", settingsHandlers.UpdatePassword)
				settings.PUT("/notifications", settingsHandlers.UpdateNotificationSettings)
				settings.DELETE("/account", settingsHandlers.DeleteAccount)
			}
		}
	}

	// Запуск сервера
	port := cfg.ServerPort
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
} 