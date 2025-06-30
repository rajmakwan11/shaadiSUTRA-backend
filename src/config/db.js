const mongoose = require("mongoose");

async function main() {
    try{
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to DB");
    }
    catch(err){
        console.log("DB Connection ISsue")
    }
}

module.exports = main;
