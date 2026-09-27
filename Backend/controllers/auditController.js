const db = require("../config/db");
const { runSeoAudit } = require("../services/seoAuditService");

exports.getAudits = async(req, res) => {
    try {
        const [audits] = await db.query(
            "SELECT * FROM seo_audits ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            count: audits.length,
            data: audits
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SEO audits"
        });
    }
};


exports.runAudit = async(req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        const audit = await runSeoAudit(url);

        const metric = audit.metrics;

        const [result] = await db.query(
            `INSERT INTO seo_audits
            (
                url,
                score,
                title_score,
                meta_score,
                heading_score,
                image_score,
                technical_score,
                internal_link_score,
                issues
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                audit.url,
                audit.score,
                metric.title.score,
                metric.meta.score,
                metric.heading.score,
                metric.images.score,
                metric.technical.score,
                metric.internalLinks.score,
                JSON.stringify(audit.issues)
            ]
        );

        res.status(201).json({
            success: true,
            message: "SEO audit completed successfully",
            auditId: result.insertId,
            data: audit
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message ||
                "SEO audit failed"
        });
    }
};


exports.createAudit = async(req, res) => {
    try {
        const {
            url,
            score,
            title_score,
            meta_score,
            heading_score,
            image_score,
            technical_score,
            internal_link_score,
            issues
        } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO seo_audits
            (
                url,
                score,
                title_score,
                meta_score,
                heading_score,
                image_score,
                technical_score,
                internal_link_score,
                issues
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                url,
                score || 0,
                title_score || 0,
                meta_score || 0,
                heading_score || 0,
                image_score || 0,
                technical_score || 0,
                internal_link_score || 0,
                JSON.stringify(issues || [])
            ]
        );

        res.status(201).json({
            success: true,
            message: "SEO audit saved successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to save SEO audit"
        });
    }
};