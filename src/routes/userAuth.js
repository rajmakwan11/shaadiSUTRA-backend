const express = require("express");
const {login,register,logout,verifyOTP,checkAuth} = require("../controllers/userAuthent");
const { getProfile } = require("../controllers/userController");


const authRouter = express.Router();

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout" ,logout)
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/check-auth", checkAuth);
authRouter.get("/me", getProfile);


module.exports = authRouter;
