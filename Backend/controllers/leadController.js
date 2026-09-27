const db = require("../config/db");

exports.getLeads = async(req, res) => {
    try {
        const [leads] = await db.query(
            "SELECT * FROM leads ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });
    }
};

exports.createLead = async(req, res) => {
    try {
        const {
            name,
            email,
            website,
            service,
            message
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO leads
            (name, email, website, service, message)
            VALUES (?, ?, ?, ?, ?)`, [
                name,
                email,
                website || null,
                service || null,
                message || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Lead submitted successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to submit lead"
        });
    }
};