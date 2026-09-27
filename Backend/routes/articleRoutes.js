const express = require("express");

const router = express.Router();

const {
    getArticles,
    getArticleBySlug,
    createArticle
} = require("../controllers/articleController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

// Public
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);

// Protected
router.post("/", authenticateToken, createArticle);

module.exports = router;