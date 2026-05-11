const express = require("express");

const router = express.Router();

// Controller imports
const {
    register,
    login
} = require("../controllers/authController");

router.post("/register", register);

// Login existing user
router.post("/login", login);

module.exports = router;
