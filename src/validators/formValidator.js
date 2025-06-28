const { body, validationResult } = require("express-validator");

const validateForm = [
  body("coupleName").notEmpty().withMessage("Couple name is required"),
  body("weddingDate")
    .notEmpty().withMessage("Wedding Date is required")
    .isISO8601().withMessage("Invalid date format"),
  body("address").notEmpty().withMessage("Address is required"),
  body("templateId").notEmpty().withMessage("Template ID is required"),
  body("recipients")
    .isArray({ min: 1 }).withMessage("At least one recipient is required"),
  body("recipients.*.name").notEmpty().withMessage("Recipient name is required"),
  body("recipients.*.phone")
    .notEmpty().withMessage("Recipient phone is required")
    .isMobilePhone("en-IN").withMessage("Invalid Indian phone number"),

  // 👇 This runs after all the above validations
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports =  validateForm ;
