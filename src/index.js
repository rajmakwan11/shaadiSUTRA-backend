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

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // allow cookies (important!)
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



main()
    .then(async () => {

        app.listen(process.env.PORT, () => {
            console.log(`Listening at port 3000`);
        });
    })
    .catch((err) => {
        console.log("Error occurred: " + err);
});
