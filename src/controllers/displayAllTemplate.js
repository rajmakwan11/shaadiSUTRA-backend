const Templates = require("../models/templates");

const displayAllTemplate = async (req, res) => {
  try {
    const getTemplates = await Templates.find({});

    const templatesWithFullUrl = getTemplates.map(template => {
      let imageUrl = template.image;

      if (imageUrl.startsWith("/")) {
        // Relative path in DB → make it full
        imageUrl = process.env.BACKEND_URL + imageUrl;
      } else if (imageUrl.startsWith("http://localhost:3000")) {
        // Old localhost path → replace with deployed
        imageUrl = imageUrl.replace(
          "http://localhost:3000",
          process.env.BACKEND_URL
        );
      }

      return { ...template._doc, image: imageUrl };
    });

    res.send(templatesWithFullUrl);
  } catch (err) {
    console.error("❌ Error in displayAllTemplate:", err);
    res.status(500).send("Cannot get templates");
  }
};

module.exports = displayAllTemplate;
