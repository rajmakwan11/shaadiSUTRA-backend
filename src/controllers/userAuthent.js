const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendOTP = require("../utils/sendOTP");
const generateOTP = require("../utils/generateOTP");


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    validate({ name, email, password });

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).send("User already registered and verified.");
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        role: "user",
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 mins
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    await sendOTP(email, otp);

    res.status(200).send("OTP sent to your email for verification.");
  } catch (err) {
    res.status(400).send("ERROR during registration: " + err.message);
  }
};


const login = async(req,res)=>{
    
    try{
        const {email,password} = req.body;

        if(!email){
            throw new Error("Invalid Credentials");
        }

        if(!password){
            throw new Error("Invalid credentials");
        }

        const user = await User.findOne({email});

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match){
            throw new Error("Invalid credentials")
        }

        //create jwt token - PAYLOAD TOKEN EXPIRY
        const token = jwt.sign({_id:user._id, email:email, role:user.role} ,process.env.JWT_KEY, {expiresIn:60*60});
        
        //set this jwt token in cookie
        res.cookie('token',token, {maxAge:60*60*1000,sameSite: "None",secure: true})

        res.status(200).send("User Logged-in Successfully");
        
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }

}

const logout = (req, res) => {
  res.clearCookie("token"); // remove the JWT token from cookies
  res.status(200).send("User Logged Out Successfully");
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found.");
  if (user.isVerified) return res.status(400).send("Already verified.");
  if (user.otp !== otp) return res.status(400).send("Invalid OTP.");
  if (user.otpExpiresAt < Date.now()) return res.status(400).send("OTP expired.");

  // ✅ Mark as verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  // ✅ Generate JWT token (same as login)
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: 60 * 60 } // 1 hour
  );

  // ✅ Set cookie
  res.cookie("token", token, {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    sameSite: "None",
    secure: true, // set to true in production with HTTPS
  });

  // ✅ Done
  res.status(200).send("Email verified successfully.");
};


const checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("No token found");

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Optional: store in req for future use
    res.status(200).send("Authenticated");
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = {register,login,logout,verifyOTP,checkAuth};
