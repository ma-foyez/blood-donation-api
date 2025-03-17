const express = require("express");
const { registerUser, authUser, logout, updateUserProfile, updateProfileActive, getProfileData, requestPasswordReset, changePasswordByMatchingOtp, OtpMatchForRegister, resendOTP } = require("../controllers/AuthController");
const { authenticateToken } = require("../config/generateToken");
const { matchOtp } = require("../controllers/OtpController");
const AuthRouter = express.Router();

AuthRouter.route('/').post(registerUser)
AuthRouter.post('/login', authUser);
AuthRouter.post("/logout", authenticateToken, logout);
// AuthRouter.route('/profile-update').put(authenticateToken, updateUserProfile)
// AuthRouter.route('/profile-activation').put(authenticateToken, updateProfileActive)
AuthRouter.put("/profile-update", authenticateToken, updateUserProfile);
AuthRouter.put("/profile-activation", authenticateToken, updateProfileActive);
AuthRouter.get("/profile", authenticateToken, getProfileData);
AuthRouter.post("/password-reset-request", requestPasswordReset);
AuthRouter.post("/password-reset", changePasswordByMatchingOtp);
AuthRouter.post("/register-otp-match", OtpMatchForRegister);
AuthRouter.post("/resent-otp", resendOTP);
AuthRouter.post("/otp-match", OtpMatchForRegister);


module.exports = AuthRouter;
