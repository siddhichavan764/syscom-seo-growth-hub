const express = require("express");
const router = express.Router();

const {
    getBacklinks,
    createBacklink,
    updateBacklink
} = require("../controllers/backlinkController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateToken,
    getBacklinks
);

router.post(
    "/",
    authenticateToken,
    createBacklink
);

router.put(
    "/:id",
    authenticateToken,
    updateBacklink
);

module.exports = router;