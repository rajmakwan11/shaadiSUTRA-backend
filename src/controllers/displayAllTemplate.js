const Templates = require("../models/templates");

const displayAllTemplate = async (req, res) => {
  try {
    const getTemplates = await Templates.find({});

    const templatesWithFullUrl = getTemplates.map(template => {
      let imageUrl = template.image;

      if (!/^https?:\/\//i.test(imageUrl)) {
        // If it doesn't already start with http:// or https://
        imageUrl = `${process.env.BACKEND_URL}${imageUrl}`;
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
