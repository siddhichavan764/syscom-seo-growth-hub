const db = require("../config/db");

// Get all social posts
exports.getSocialPosts = async(req, res) => {
    try {
        const [posts] = await db.query(
            "SELECT * FROM social_posts ORDER BY created_at DESC"
        );

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


// Update social post status
exports.updateSocialPost = async(req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            referral_visits,
            published_at
        } = req.body;
        let formattedPublishedAt = null;

        if (published_at) {
            const date = new Date(published_at);

            if (!isNaN(date.getTime())) {
                formattedPublishedAt =
                    date.toISOString()
                    .slice(0, 19)
                    .replace("T", " ");
            }
        }
        const [result] = await db.query(
            `UPDATE social_posts
             SET status = ?,
                 referral_visits = ?,
                 published_at = ?
             WHERE id = ?`, [
                status || "planned",
                Number(referral_visits) || 0,
                formattedPublishedAt,
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
            message: "Social post metrics updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update social post metrics"
        });
    }
};