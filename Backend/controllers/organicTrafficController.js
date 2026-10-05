const db = require("../config/db");

// Get SEO content and traffic data
exports.getOrganicContent = async(req, res) => {
    try {

        const [articles] = await db.query(
            `SELECT
                id,
                title,
                slug,
                category,
                status,
                target_keyword,
                search_intent,
                target_url,
                organic_visits,
                leads_generated,
                published_at,
                created_at
            FROM articles
            ORDER BY created_at DESC`
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
            message: "Failed to fetch organic content"
        });

    }
};


// Create SEO content record
exports.createOrganicContent = async(req, res) => {
    try {

        const {
            title,
            slug,
            category,
            status,
            target_keyword,
            search_intent,
            target_url,
            organic_visits,
            leads_generated,
            published_at
        } = req.body;


        if (!title) {

            return res.status(400).json({
                success: false,
                message: "Article title is required"
            });

        }


        if (!slug) {

            return res.status(400).json({
                success: false,
                message: "Article slug is required"
            });

        }


        const [result] = await db.query(
            `INSERT INTO articles
            (
                title,
                slug,
                content,
                category,
                status,
                target_keyword,
                search_intent,
                target_url,
                organic_visits,
                leads_generated,
                published_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                title,
                slug,
                "",
                category || null,
                status || "draft",
                target_keyword || null,
                search_intent || null,
                target_url || null,
                organic_visits || 0,
                leads_generated || 0,
                published_at || null
            ]
        );


        res.status(201).json({
            success: true,
            message: "SEO content created successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create SEO content"
        });

    }
};


// Update traffic and lead metrics
exports.updateOrganicMetrics = async(req, res) => {
    try {

        const { id } = req.params;

        const {
            organic_visits,
            leads_generated
        } = req.body;


        const [result] = await db.query(
            `UPDATE articles
             SET organic_visits = ?,
                 leads_generated = ?
             WHERE id = ?`, [
                organic_visits || 0,
                leads_generated || 0,
                id
            ]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }


        res.json({
            success: true,
            message: "Organic metrics updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update organic metrics"
        });

    }
};