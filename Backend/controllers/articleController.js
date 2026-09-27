const db = require("../config/db");

// Get all published articles
exports.getArticles = async(req, res) => {
    try {
        const [articles] = await db.query(
            "SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch articles"
        });
    }
};

// Get single article by slug
exports.getArticleBySlug = async(req, res) => {
    try {
        const { slug } = req.params;

        const [articles] = await db.query(
            "SELECT * FROM articles WHERE slug = ? AND status = 'published'", [slug]
        );

        if (articles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        res.json({
            success: true,
            data: articles[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch article"
        });
    }
};

// Create article
exports.createArticle = async(req, res) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            meta_title,
            meta_description,
            featured_image,
            category,
            status
        } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "Title, slug and content are required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO articles
            (title, slug, excerpt, content, meta_title,
             meta_description, featured_image, category, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                title,
                slug,
                excerpt || null,
                content,
                meta_title || null,
                meta_description || null,
                featured_image || null,
                category || null,
                status || "published"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Article created successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create article"
        });
    }
};