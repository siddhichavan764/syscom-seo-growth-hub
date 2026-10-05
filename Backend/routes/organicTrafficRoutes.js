const express = require("express");

const router = express.Router();

const {
    getOrganicContent,
    createOrganicContent,
    updateOrganicMetrics
} = require("../controllers/organicTrafficController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");


router.get(
    "/",
    authenticateToken,
    getOrganicContent
);


router.post(
    "/",
    authenticateToken,
    createOrganicContent
);


router.put(
    "/:id/metrics",
    authenticateToken,
    updateOrganicMetrics
);


module.exports = router;