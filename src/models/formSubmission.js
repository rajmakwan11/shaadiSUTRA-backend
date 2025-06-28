const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const formSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  coupleName: {
    type: String,
    required: true,
  },
  weddingDate: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cards: [ //name and phone number bhi store kar rhe he taki baad mein, whatsapp send karne mein dikkat na ho
    {
      name: String,
      phone: String,
      imageUrl: String, // local path or URL of the generated card
    },
  ],
  recipients: [recipientSchema], // Array of recipients
}, {
  timestamps: true
});

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
