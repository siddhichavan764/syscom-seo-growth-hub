CREATE DATABASE IF NOT EXISTS syscom_seo;

USE syscom_seo;

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description VARCHAR(320),
    featured_image VARCHAR(500),
    category VARCHAR(100),
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_audits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    score INT DEFAULT 0,
    title_score INT DEFAULT 0,
    meta_score INT DEFAULT 0,
    heading_score INT DEFAULT 0,
    image_score INT DEFAULT 0,
    technical_score INT DEFAULT 0,
    internal_link_score INT DEFAULT 0,
    issues JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    website VARCHAR(500),
    service VARCHAR(150),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    search_intent VARCHAR(50),
    target_url VARCHAR(500),
    priority VARCHAR(30),
    status VARCHAR(30) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backlinks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    anchor_text VARCHAR(255),
    status VARCHAR(50) DEFAULT 'potential',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'potential',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS social_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NULL,
    platform VARCHAR(50) NOT NULL,
    post_url VARCHAR(500),
    post_title VARCHAR(255),
    status ENUM('planned', 'published') DEFAULT 'planned',
    published_at DATETIME NULL,
    referral_visits INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id)
        ON DELETE SET NULL
);