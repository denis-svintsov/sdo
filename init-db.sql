-- Создание схемы БД для системы управления обучением РЖД-Академия
-- Разделение на схемы: auth и users

-- Создание схем
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;

-- ============================================
-- СХЕМА USERS
-- ============================================

-- Создание таблицы users в схеме users (базовая версия)
CREATE TABLE IF NOT EXISTS users.users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Таблица должностей
CREATE TABLE IF NOT EXISTS users.position (
    position_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    grade VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отделов (без внешних ключей сначала, добавим позже)
CREATE TABLE IF NOT EXISTS users.department (
    department_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id VARCHAR(36),
    parent_department_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Расширение таблицы users
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS position_id VARCHAR(36);
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS department_id VARCHAR(36);
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Добавление внешних ключей для users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_position') THEN
        ALTER TABLE users.users ADD CONSTRAINT fk_user_position FOREIGN KEY (position_id) REFERENCES users.position(position_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_department') THEN
        ALTER TABLE users.users ADD CONSTRAINT fk_user_department FOREIGN KEY (department_id) REFERENCES users.department(department_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_department_manager') THEN
        ALTER TABLE users.department ADD CONSTRAINT fk_department_manager FOREIGN KEY (manager_id) REFERENCES users.users(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_department_parent') THEN
        ALTER TABLE users.department ADD CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES users.department(department_id) ON DELETE SET NULL;
    END IF;
END $$;

-- Таблица настроек пользователя
CREATE TABLE IF NOT EXISTS users.user_settings (
    user_id VARCHAR(36) PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    language VARCHAR(10) DEFAULT 'ru',
    timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

-- Таблица ролей пользователя
CREATE TABLE IF NOT EXISTS users.user_roles (
    user_id VARCHAR(36),
    role_name VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_name),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

-- ============================================
-- СХЕМА AUTH
-- ============================================

-- Таблица сессий аутентификации
CREATE TABLE IF NOT EXISTS auth.auth_session (
    session_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    jwt_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    ip_address VARCHAR(45),
    user_agent TEXT,
    CONSTRAINT fk_auth_session_user FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

-- Индекс для быстрого поиска активных сессий
CREATE INDEX IF NOT EXISTS idx_auth_session_user_status ON auth.auth_session(user_id, status);
CREATE INDEX IF NOT EXISTS idx_auth_session_expires_at ON auth.auth_session(expires_at);

-- Таблица refresh токенов
CREATE TABLE IF NOT EXISTS auth.refresh_token (
    token_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    refresh_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

-- Индексы для refresh_token
CREATE INDEX IF NOT EXISTS idx_refresh_token_user ON auth.refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_token ON auth.refresh_token(refresh_token);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expires_at ON auth.refresh_token(expires_at);

-- Таблица политик безопасности
CREATE TABLE IF NOT EXISTS auth.security_policy (
    policy_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    policy_name VARCHAR(255) NOT NULL UNIQUE,
    max_login_attempts INTEGER DEFAULT 5,
    password_min_length INTEGER DEFAULT 8,
    session_timeout_minutes INTEGER DEFAULT 1440,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица попыток входа
CREATE TABLE IF NOT EXISTS auth.login_attempt (
    attempt_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    success BOOLEAN NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_login_attempt_user FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE SET NULL
);

-- Индексы для login_attempt
CREATE INDEX IF NOT EXISTS idx_login_attempt_user ON auth.login_attempt(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempt_email ON auth.login_attempt(email);
CREATE INDEX IF NOT EXISTS idx_login_attempt_ip ON auth.login_attempt(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempt_time ON auth.login_attempt(attempt_time);

-- Вставка дефолтной политики безопасности
INSERT INTO auth.security_policy (policy_name, max_login_attempts, password_min_length, session_timeout_minutes)
VALUES ('default', 5, 8, 1440)
ON CONFLICT (policy_name) DO NOTHING;

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION users.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users.users
    FOR EACH ROW EXECUTE FUNCTION users.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON users.user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON users.user_settings
    FOR EACH ROW EXECUTE FUNCTION users.update_updated_at_column();

-- Создание функции для очистки устаревших сессий
CREATE OR REPLACE FUNCTION auth.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM auth.auth_session WHERE expires_at < CURRENT_TIMESTAMP;
    DELETE FROM auth.refresh_token WHERE expires_at < CURRENT_TIMESTAMP OR revoked = true;
END;
$$ language 'plpgsql';
