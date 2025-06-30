require("dotenv").config(); 
const express = require("express");
const app = express();
const main = require("./config/db");
const path = require("path");
const cors = require("cors")
const cookieParser = require("cookie-parser");
// const Template = require("./models/templates"); // IMPORT the model
const displayAllTemplate = require("./controllers/displayAllTemplate");
const submitForm = require("./controllers/submitForm");
const validateForm = require("./validators/formValidator");
const authRouter = require("./routes/userAuth");
const authenticate = require("./middleware/auth");
const formSubmission = require("./models/formSubmission")
const sendInvitations  = require("./controllers/sendInvitations");
const Templates = require("./models/templates");
const fs = require('fs');

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // allow your main production domain
    if (origin === process.env.CLIENT_URL) return callback(null, true);

    // allow any vercel preview
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));




app.use("/user",authRouter);  // will do login signup and all (authRouter mein routes banayenge login, register ke liye)
app.post("/sendWhatsapp/:formId", authenticate, sendInvitations);

app.use("/auth", authenticate ,authRouter);


app.use("/templates", express.static(path.join(__dirname, "assets")));
app.use("/invitations", express.static(path.join(__dirname, "..", "invitations")));

app.post("/submitForm", authenticate, validateForm, submitForm); // ye form se data lega like date ,address etc.
app.get("/AllTemplates", displayAllTemplate);


app.get("/form/:formId", authenticate, async (req, res) => {
  const form = await formSubmission.findById(req.params.formId);
  if (!form) return res.status(404).json({ message: "Form not found" });
  res.json(form);
});

// 🧹 TEMPORARY CLEANUP ROUTE
app.delete("/admin/cleanup-invitations", (req, res) => {
  const folder = path.join(__dirname, "..", "invitations");

  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error("❌ Error reading invitations folder:", err);
      return res.status(500).send("Error reading folder");
    }

    for (const file of files) {
      fs.unlinkSync(path.join(folder, file));
    }

    console.log("✅ All invitation images deleted.");
    res.send("✅ All invitation images deleted.");
  });
});



main()
    .then(async () => {

        app.listen(process.env.PORT, () => {
            console.log(`Listening at port 3000`);
        });
    })
    .catch((err) => {
        console.log("Error occurred: " + err);
});
