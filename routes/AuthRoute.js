const express = require("express");
const { registerUser, authUser, logout } = require("../controllers/AuthController");
const { authenticateToken } = require("../config/generateToken");
const AuthRouter = express.Router();

AuthRouter.route('/').post(registerUser)
AuthRouter.post('/login', authUser);
AuthRouter.post("/logout", authenticateToken, logout);


module.exports = AuthRouter;