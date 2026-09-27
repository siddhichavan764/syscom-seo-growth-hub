const express = require("express");
const router = express.Router();

const {
    getDirectories,
    createDirectory,
    updateDirectory
} = require("../controllers/directoryController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticateToken,
    getDirectories
);

router.post(
    "/",
    authenticateToken,
    createDirectory
);

router.put(
    "/:id",
    authenticateToken,
    updateDirectory
);

module.exports = router;