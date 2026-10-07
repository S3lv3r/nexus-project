CREATE DATABASE IF NOT EXISTS u576901639_exchangevg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE u576901639_exchangevg;

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    igdb_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary TEXT NULL,
    cover_url VARCHAR(512) NULL,
    genres VARCHAR(255) NULL,
    release_date BIGINT NULL,
    initial_price DOUBLE NOT NULL DEFAULT 100.0,
    current_price DOUBLE NOT NULL DEFAULT 100.0,
    change_24h DOUBLE NOT NULL DEFAULT 0.0,
    high_24h DOUBLE NOT NULL DEFAULT 100.0,
    low_24h DOUBLE NOT NULL DEFAULT 100.0,
    volume_24h DOUBLE NOT NULL DEFAULT 0.0,
    rating DOUBLE NULL,
    rating_count INT NULL,
    hypes INT NULL,
    follows INT NULL,
    sentiment_score DOUBLE NOT NULL DEFAULT 50.0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_assets_name (name),
    INDEX idx_assets_igdb_id (igdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolios (
    id VARCHAR(64) PRIMARY KEY,
    cash_balance DOUBLE NOT NULL DEFAULT 10000.0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id VARCHAR(64) NOT NULL,
    asset_id INT NOT NULL,
    quantity DOUBLE NOT NULL DEFAULT 0.0,
    average_buy_price DOUBLE NOT NULL DEFAULT 0.0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_holdings_portfolio (portfolio_id),
    INDEX idx_holdings_asset (asset_id),
    CONSTRAINT fk_holdings_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
    CONSTRAINT fk_holdings_asset FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id VARCHAR(64) NOT NULL,
    asset_id INT NOT NULL,
    transaction_type VARCHAR(16) NOT NULL,
    quantity DOUBLE NOT NULL,
    price_per_unit DOUBLE NOT NULL,
    total_amount DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transactions_portfolio (portfolio_id),
    INDEX idx_transactions_asset (asset_id),
    INDEX idx_transactions_timestamp (timestamp),
    CONSTRAINT fk_transactions_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios (id),
    CONSTRAINT fk_transactions_asset FOREIGN KEY (asset_id) REFERENCES assets (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS price_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    price DOUBLE NOT NULL,
    volume DOUBLE NOT NULL DEFAULT 0.0,
    rating DOUBLE NULL,
    hypes INT NULL,
    sentiment_score DOUBLE NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_snapshots_asset (asset_id),
    INDEX idx_snapshots_timestamp (timestamp),
    CONSTRAINT fk_snapshots_asset FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO portfolios (id, cash_balance) VALUES ('default_user', 10000.0);
