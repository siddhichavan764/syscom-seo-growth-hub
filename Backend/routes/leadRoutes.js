const express = require("express");
const router = express.Router();

const {
    getLeads,
    createLead
} = require("../controllers/leadController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateToken,
    getLeads
);

router.post(
    "/",
    createLead
);

module.exports = router;