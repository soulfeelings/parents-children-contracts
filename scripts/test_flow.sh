#!/bin/bash

# Установка базового URL
API_URL="http://localhost:8080/api"

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Начинаем тестирование API..."

# Регистрация родителя
echo -e "\n📝 Регистрация родителя..."
PARENT_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "parent1",
    "email": "parent1@example.com",
    "password": "password123",
    "role": "parent",
    "firstName": "Иван",
    "lastName": "Петров"
  }')

PARENT_TOKEN=$(echo $PARENT_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$PARENT_TOKEN" ]; then
    echo -e "${RED}❌ Ошибка при регистрации родителя${NC}"
    echo "Ответ: $PARENT_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Родитель успешно зарегистрирован${NC}"

# Регистрация ребенка
echo -e "\n📝 Регистрация ребенка..."
CHILD_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "child1",
    "email": "child1@example.com",
    "password": "password123",
    "role": "child",
    "firstName": "Петр",
    "lastName": "Иванов"
  }')

CHILD_TOKEN=$(echo $CHILD_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
CHILD_ID=$(echo $CHILD_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$CHILD_TOKEN" ]; then
    echo -e "${RED}❌ Ошибка при регистрации ребенка${NC}"
    echo "Ответ: $CHILD_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Ребенок успешно зарегистрирован${NC}"

# Создание контракта
echo -e "\n📝 Создание контракта..."
START_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
END_DATE=$(date -v+30d -u +"%Y-%m-%dT%H:%M:%SZ")

CONTRACT_RESPONSE=$(curl -s -X POST "${API_URL}/contracts/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${PARENT_TOKEN}" \
  -d "{
    \"title\": \"Домашние обязанности\",
    \"description\": \"Выполнение домашних заданий и помощь по дому\",
    \"child_id\": \"${CHILD_ID}\",
    \"start_date\": \"${START_DATE}\",
    \"end_date\": \"${END_DATE}\"
  }")

if echo "$CONTRACT_RESPONSE" | grep -q "error"; then
    echo -e "${RED}❌ Ошибка при создании контракта${NC}"
    echo "Ответ: $CONTRACT_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Контракт успешно создан${NC}"

echo -e "\n🎉 Тестирование завершено успешно!"
echo -e "\nТокен родителя: ${PARENT_TOKEN}"
echo -e "Токен ребенка: ${CHILD_TOKEN}"
echo -e "ID ребенка: ${CHILD_ID}" 