const db = require("../config/db");

// Get all backlinks
exports.getBacklinks = async(req, res) => {
    try {
        const [backlinks] = await db.query(
            "SELECT * FROM backlinks ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: backlinks.length,
            data: backlinks
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch backlinks"
        });
    }
};

// Create backlink
exports.createBacklink = async(req, res) => {
    try {
        const {
            domain,
            url,
            anchor_text,
            status
        } = req.body;

        if (!domain) {
            return res.status(400).json({
                success: false,
                message: "Domain is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO backlinks
            (domain, url, anchor_text, status)
            VALUES (?, ?, ?, ?)`, [
                domain,
                url || null,
                anchor_text || null,
                status || "potential"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Backlink added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create backlink"
        });
    }
};

// Update backlink status
exports.updateBacklink = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const [result] = await db.query(
            "UPDATE backlinks SET status = ? WHERE id = ?", [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Backlink not found"
            });
        }

        res.json({
            success: true,
            message: "Backlink updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update backlink"
        });
    }
};