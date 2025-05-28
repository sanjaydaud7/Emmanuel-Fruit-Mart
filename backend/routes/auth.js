const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Register
router.post("/register", async (req, res) => {
  try {
      console.log("📥 Received registration data:", req.body); // <-- log the body

      const { fName, lName, email, phone, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        fName,
        lName,
        email,
        phone,
        password: hashedPassword, // ✅ use the hashed password here
    });
    

      await newUser.save();
      console.log("✅ User saved to DB:", newUser); // <-- log success
      res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
      console.error("❌ Registration error:", err); // <-- log error
      res.status(500).json({ error: "Something went wrong" });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.status(200).json({ status: "success", message: "Login successful!" });
  } catch (err) {
    console.error("❌ Login error:", err); // Log any unexpected errors
    res.status(500).json({ error: "Login failed" });
  }
});


module.exports = router;
