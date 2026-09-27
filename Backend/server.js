const backlinkRoutes = require("./routes/backlinkRoutes");
const directoryRoutes = require("./routes/directoryRoutes");
const auditRoutes = require("./routes/auditRoutes");
const socialRoutes = require("./routes/socialRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const db = require("./config/db");

const articleRoutes = require("./routes/articleRoutes");
const keywordRoutes = require("./routes/keywordRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Syscom SEO Growth Hub API is running"
    });
});

app.get("/api/health", async(req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT 1 AS database_status"
        );

        res.json({
            success: true,
            message: "Backend and database are connected",
            database: rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

app.use("/api/articles", articleRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/backlinks", backlinkRoutes);

app.use("/api/directories", directoryRoutes);

app.use("/api/seo-audits", auditRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});