const path = require("path");
const FormSubmission = require("../models/formSubmission");
const User = require("../models/user");
const whatsappClient = require("../helpers/whatsappClient");
const { MessageMedia } = require("whatsapp-web.js");

const sendInvitations = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ 1. Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "You don't have admin access" });
    }

    // ✅ 2. Get the form by ID
    const form = await FormSubmission.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    let sentCount = 0;
    let skippedCount = 0;

    // ✅ 3. Loop through recipients
    for (const card of form.cards) {
      let recipient = card.phone.trim();

      // ➜ Ensure +91 is added if only 10 digits
      if (/^\d{10}$/.test(recipient)) {
        recipient = `+91${recipient}`;
      }

      // ➜ Validate final E.164 format
      if (!/^\+\d{10,15}$/.test(recipient)) {
        console.warn(`⚠️ Skipping invalid phone: ${recipient}`);
        skippedCount++;
        continue;
      }

      // ➜ WhatsApp JID
      const chatId = recipient.replace("+", "") + "@c.us";

      // ✅ Check if number is on WhatsApp
      const isRegistered = await whatsappClient.isRegisteredUser(chatId);
      if (!isRegistered) {
        console.warn(`⚠️ ${recipient} is not on WhatsApp. Skipping.`);
        skippedCount++;
        continue;
      }

      // ✅ Load media from file
      const mediaPath = path.join(__dirname, "..", "..", "invitations", path.basename(card.imageUrl));
      const media = MessageMedia.fromFilePath(mediaPath);

      // ✅ Send with caption text
      await whatsappClient.sendMessage(chatId, media, {
        caption: `💌 You're Invited!\n👩‍❤️‍👨 Couple: ${form.coupleName}\n📅 Date: ${form.weddingDate}\n📍 Venue: ${form.address}`
      });

      console.log(`✅ Sent to ${recipient}`);
      sentCount++;
    }

    res.json({
      message: `✅ WhatsApp invitations sent! Sent: ${sentCount}, Skipped: ${skippedCount}`
    });
  } catch (err) {
    console.error("❌ Error in sendInvitations:", err);
    res.status(500).json({ message: "Failed to send WhatsApp invitations." });
  }
};
module.exports = sendInvitations;
