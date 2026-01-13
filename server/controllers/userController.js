

const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1hr', 
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */

const getProfile = async (req, res) => {
    // The user object is attached to the request by the 'protect' middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    try {
        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 3. Create user (password hashing handled by Mongoose middleware)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 4. Respond with user data and token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

/**
 * @desc    
 * @route   
 * @access  
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
         
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials (email or password).' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
};