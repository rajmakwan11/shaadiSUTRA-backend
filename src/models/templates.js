const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const templateSchema = ({
    title:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    positions: {
        couple: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        date: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
        },
        address: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        recipient: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
        }
    }
});

const Templates = mongoose.model("Template", templateSchema);
module.exports = Templates;

