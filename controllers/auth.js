const cryptoJS = require('crypto-js');
const Register = require('../models/Register');

// Register
const signup = async (req, res, next) => {
    const newUser = new Register({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        confirmPassword: this.password,
        terms: req.body.terms
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).json({ savedUser, message: "successful" })
    }
    catch (err) {
        res.status(500).json(err)
    }
}

//Login
const login = async (req, res) =>{
    try{
        const user = Register.findOne({
            email: req.body.email
        });
        !user && res.status(401).json("Wrong Username");
        const hashedPassword = cryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        originalPassword != inputPassword && 
            res.status(401).json("Wrong Password");

            res.status(200).json(user, "Logged in");
    }
    catch(err){
            res.status(500).json(err)
    }
}


module.exports = {
    signup,
    login
}