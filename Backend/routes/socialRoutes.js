const express = require("express");
const router = express.Router();

const {
    getSocialPosts,
    createSocialPost,
    updateSocialPost,
    deleteSocialPost
} = require("../controllers/socialController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

// Get all social posts
router.get("/", authenticateToken, getSocialPosts);

// Create social post
router.post("/", authenticateToken, createSocialPost);

// Update social post
router.put("/:id", authenticateToken, updateSocialPost);

// Delete social post
router.delete("/:id", authenticateToken, deleteSocialPost);

module.exports = router;