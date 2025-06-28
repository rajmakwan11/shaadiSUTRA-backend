const validator = require("validator")

const validate = (data)=>{

    

        const mandatoryFields = ['name','email','password'];

        const isAllowed = mandatoryFields.every((k)=> Object.keys(data).includes(k));

        if(!isAllowed){
            throw new Error("Fill All Details");
        }

        if(!validator.isEmail(data.email)){
            throw new Error("Enter a valid email id");
        }

        if (!validator.isStrongPassword(data.password, {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 0,
            minSymbols: 0,
            })) {
            throw new Error("Weak Password (minimum 6 characters, include numbers)");
        }
        

   

}

module.exports = validate;