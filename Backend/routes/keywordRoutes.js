const express = require("express");
const router = express.Router();

const {
    getKeywords,
    createKeyword
} = require("../controllers/keywordController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateToken,
    getKeywords
);

router.post(
    "/",
    authenticateToken,
    createKeyword
);

module.exports = router;