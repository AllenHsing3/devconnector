const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

// @route    GET api/auth
// @desc     Test Route
// @access   Public
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// @route    Post api/auth
// @desc     Authenticate user and get token
// @access   Public
router.post('/', [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body; /// Destructure for easier variable use later

    try {
        let user = await User.findOne({ email })
        if(!user){
           return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
        }


        const isMatch = await bcrypt.compare(password, user.password)  // Compare the entered password with the encrypted password

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
        }

        // create jwt 
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),  /// Pull the password from config
            { expiresIn: 36000},
            (err, token) => {
                if(err) throw token;
                res.json({ token });
            }
        )
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

module.exports = router