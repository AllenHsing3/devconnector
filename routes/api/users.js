const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

// @route    Post api/users
// @desc     Test Route
// @access   Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),  /// Make sure it isnt empty
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password must be a min of 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body; /// Destructure for easier variable use later

    try {
        let user = await User.findOne({ email })
        // If user exists, do not register again
        if(user){
           return res.status(400).json({ errors: [{ msg: 'User already exists'}]})
        }
        // Add in avatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            password,
            avatar
        })
        // encrypt password
        const salt = await bcrypt.genSalt(10); // 10 is recomended in docs
        user.password = await bcrypt.hash(password, salt);
        // save user
        await user.save();
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