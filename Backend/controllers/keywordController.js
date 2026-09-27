const db = require("../config/db");

exports.getKeywords = async(req, res) => {
    try {
        const [keywords] = await db.query(
            "SELECT * FROM keywords ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: keywords.length,
            data: keywords
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch keywords"
        });
    }
};

exports.createKeyword = async(req, res) => {
    try {
        const {
            keyword,
            search_intent,
            target_url,
            priority,
            status
        } = req.body;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Keyword is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO keywords
            (keyword, search_intent, target_url, priority, status)
            VALUES (?, ?, ?, ?, ?)`, [
                keyword,
                search_intent || null,
                target_url || null,
                priority || "medium",
                status || "planned"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Keyword created successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create keyword"
        });
    }
};