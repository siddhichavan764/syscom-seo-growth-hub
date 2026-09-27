const db = require("../config/db");

// Get directories
exports.getDirectories = async(req, res) => {
    try {
        const [directories] = await db.query(
            "SELECT * FROM directories ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: directories.length,
            data: directories
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch directories"
        });
    }
};

// Add directory
exports.createDirectory = async(req, res) => {
    try {
        const {
            name,
            url,
            category,
            status
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Directory name is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO directories
            (name, url, category, status)
            VALUES (?, ?, ?, ?)`, [
                name,
                url || null,
                category || null,
                status || "potential"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Directory added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create directory"
        });
    }
};

// Update directory
exports.updateDirectory = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const [result] = await db.query(
            "UPDATE directories SET status = ? WHERE id = ?", [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Directory not found"
            });
        }

        res.json({
            success: true,
            message: "Directory updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update directory"
        });
    }
};