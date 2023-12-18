const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('./User')

const generateAccessToken = (id, username) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'})
}
//! REFACTOR DECOMPOSITE
class AuthController {
    async sign_up (req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Sign up error', errors})
            }

            const { username, password, email } = req.body
            const candidateUsername = await User.findOne({username})
            const candidateEmail = await User.findOne({email})

            if (candidateUsername || candidateEmail) {
                return res.status(400).json({message: 'Username/Email is already registered'})
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ username, email, password: hashPassword})
            await user.save()

            return res.status(200).json({message: 'User successfully created'})
        } catch (e) {
            console.error(e)
            res.status(400).json({message: 'Sign up error', e})
        }
    }

    async sign_in (req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ message: `User ${username} is not found` })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(400).json({ message: 'Password is not correct' })
            }

            await User.findOneAndUpdate({username: username}, {lastLogin: Date.now()})

            const token = generateAccessToken(user._id, user.username)

            return res.json({ token })
        } catch (e) {
            console.error(e)
            res.status(400).json({message: 'Sign in error'})
        }
    }

    async deleteUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.deleteMany({ _id: { $in: selectedIds } });
            return res.json({ message: 'Users deleted successfully', result });
        } catch (e) {
            console.error(e)
            res.status(500).json({message: 'error'})
        }
    }

    async blockUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.updateMany({ _id: { $in: selectedIds } }, {"$set":{"status": "BLOCKED"}})
            return res.json({ message: 'Users status updated', result });
        } catch (e) {
            console.error(e)
        }
    }

    async unblockUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.updateMany({ _id: { $in: selectedIds } }, {"$set":{"status": "ACTIVE"}})
            return res.json({ message: 'Users status updated', result });
        } catch (e) {
            console.error(e)
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (e) {
            console.error(e)
            res.status(400).json({message: 'Error while fetching Users'})
        }
    }
}

module.exports = new AuthController()