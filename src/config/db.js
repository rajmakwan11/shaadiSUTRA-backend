const mongoose = require("mongoose");

async function main() {
    try{
    await mongoose.connect("mongodb+srv://rajmakwana:rajmakwana2735@codingadda.gtfhmlq.mongodb.net/shaadiSutra");
    console.log("Connected to DB");
    }
    catch(err){
        console.log("DB Connection ISsue")
    }
}

module.exports = main;