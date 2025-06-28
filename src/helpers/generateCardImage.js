const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const generateCardImage = async (
  templatePath,
  outputFilename,
  textData,
  positions
) => {
  try {
    const image = await loadImage(templatePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    // ✅ Couple Name
    if (positions.couple) {
      ctx.font = "bold 30px Sans-serif";
      ctx.fillText(`Wedding of: \n${textData.coupleName}`, positions.couple.x, positions.couple.y);
    }

    // ✅ Wedding Date
    if (positions.date) {
      ctx.font = "bold 24px Sans-serif";
      ctx.fillText(`Wedding Date: ${textData.weddingDate}`, positions.date.x, positions.date.y);
    }

    // ✅ Address
    if (positions.address) {
      ctx.font = "20px Sans-serif";
      ctx.fillText(`At ${textData.address}`, positions.address.x, positions.address.y);
    }

    // ✅ Recipient Name
    if (positions.recipient) {
      ctx.font = "italic 22px Sans-serif";
      ctx.fillText(`Dear ${textData.recipientName} you are invited`, positions.recipient.x, positions.recipient.y);
    }

    const outputPath = path.join(
      __dirname,
      "..",
      "..",
      "invitations",
      outputFilename || `${uuidv4()}.png`
    );

    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    await new Promise((resolve, reject) => {
      out.on("finish", resolve);
      out.on("error", reject);
    });

    return `/invitations/${path.basename(outputPath)}`;
  } catch (err) {
    console.error("❌ Error generating card:", err);
    throw err;
  }
};

module.exports = generateCardImage;
