-- Удаление индексов
DROP INDEX IF EXISTS idx_rewards_contract_id;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_tasks_contract_id;
DROP INDEX IF EXISTS idx_contracts_child_id;
DROP INDEX IF EXISTS idx_contracts_parent_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Удаление таблиц
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS users;

-- Удаление расширения
DROP EXTENSION IF EXISTS "uuid-ossp"; 