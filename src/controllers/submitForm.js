const { validationResult } = require("express-validator");
const FormSubmission = require("../models/formSubmission");
const Template = require("../models/templates");
const generateCardImage = require("../helpers/generateCardImage");
const path = require("path");

const submitForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  try {
    const { coupleName, weddingDate, address, templateId, recipients } = req.body;
    const userId = req.user._id;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: "Template not found" });

    if (!template.image) {
      return res.status(400).json({ message: "Template image path missing" });
    }

    const templateFilename = path.basename(template.image); // e.g., "weddingCard1.jpg"
    const templatePath = path.join(__dirname, "..", "assets", templateFilename);
    const positions = template.positions || {}; // Avoid undefined

    const cards = [];

    for (const recipient of recipients) {
      const imageUrl = await generateCardImage(
        templatePath,
        `invite-${userId}-${recipient.phone}.png`,
        {
          coupleName,
          weddingDate,
          address,
          recipientName: recipient.name,
        },
        positions
      );

      cards.push({
        name: recipient.name,
        phone: recipient.phone,
        imageUrl,
      });
    }

    const newForm = new FormSubmission({
      userId,
      coupleName,
      weddingDate,
      address,
      templateId,
      recipients,
      cards,
    });

    await newForm.save();

    res.status(201).json({
      message: "Form submitted and cards generated",
      formId: newForm._id,
      cards: newForm.cards,
    });
  } catch (err) {
    console.error("❌ Error in submitForm:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = submitForm;
