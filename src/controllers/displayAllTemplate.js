const Templates = require("../models/templates");

const displayAllTemplate = async (req, res) => {
  try {
    const getTemplates = await Templates.find({});

    const templatesWithFullUrl = getTemplates.map(template => {
      const newImage = template.image.replace(
        "http://localhost:3000",
        process.env.BACKEND_URL
      );
      return { ...template._doc, image: newImage };
    });

    res.send(templatesWithFullUrl);
  } catch (err) {
    console.error("❌ Error in displayAllTemplate:", err);
    res.status(500).send("Cannot get templates");
  }
};

module.exports = displayAllTemplate;
