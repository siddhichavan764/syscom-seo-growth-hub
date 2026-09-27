const express = require("express");
const router = express.Router();

const {
    getAudits,
    runAudit,
    createAudit
} = require("../controllers/auditController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateToken,
    getAudits
);

router.post(
    "/run",
    authenticateToken,
    runAudit
);

router.post(
    "/",
    authenticateToken,
    createAudit
);

module.exports = router;