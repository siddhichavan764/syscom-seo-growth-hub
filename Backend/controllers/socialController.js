const db = require("../config/db");

// Get all social posts
exports.getSocialPosts = async(req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                sp.*,
                a.title AS article_title
            FROM social_posts sp
            LEFT JOIN articles a ON sp.article_id = a.id
            ORDER BY sp.created_at DESC
        `);

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch social posts"
        });
    }
};


// Create social post
exports.createSocialPost = async(req, res) => {
    try {
        const {
            article_id,
            platform,
            post_url,
            post_title,
            status,
            published_at,
            referral_visits
        } = req.body;

        if (!platform) {
            return res.status(400).json({
                success: false,
                message: "Platform is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO social_posts
            (
                article_id,
                platform,
                post_url,
                post_title,
                status,
                published_at,
                referral_visits
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                article_id || null,
                platform,
                post_url || null,
                post_title || null,
                status || "planned",
                published_at || null,
                referral_visits || 0
            ]
        );

        res.status(201).json({
            success: true,
            message: "Social post created successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create social post"
        });
    }
};


// Update social post
exports.updateSocialPost = async(req, res) => {
    try {
        const { id } = req.params;

        const {
            article_id,
            platform,
            post_url,
            post_title,
            status,
            published_at,
            referral_visits
        } = req.body;

        const [result] = await db.query(
            `UPDATE social_posts
             SET
                article_id = ?,
                platform = ?,
                post_url = ?,
                post_title = ?,
                status = ?,
                published_at = ?,
                referral_visits = ?
             WHERE id = ?`, [
                article_id || null,
                platform,
                post_url || null,
                post_title || null,
                status || "planned",
                published_at || null,
                referral_visits || 0,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Social post not found"
            });
        }

        res.json({
            success: true,
            message: "Social post updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update social post"
        });
    }
};


// Delete social post
exports.deleteSocialPost = async(req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM social_posts WHERE id = ?", [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Social post not found"
            });
        }

        res.json({
            success: true,
            message: "Social post deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete social post"
        });
    }
};