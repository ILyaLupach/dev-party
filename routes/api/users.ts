import express from 'express'
import config from 'config'
import { body, validationResult } from 'express-validator'
import { Request } from 'express-validator/src/base';
import bcrypt from 'bcryptjs'
import gravatar from 'gravatar'
import { Document } from 'mongoose'
import normalize from 'normalize-url'
import jwt from 'jsonwebtoken'
import User from '../../models/User'

export interface IUserDocument extends Document {
  email?: string;
  name?: string;
  password?: string;
}

const router = express.Router();

// @route   Post api/users
// @desc    register user
// @access  Public
router.post('/',
  [
    body('email', 'Incluse a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('name', 'Name is required').not().isEmpty(),
  ],
  async (req: Request, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, password, email } = req.body
    try {
      // See if user exists
      let user: IUserDocument = await User.findOne({ email })
      if (user) {
        res.status(400).json({
          errors: [
            { message: 'User already exists' }
          ]
        })
      }
      // Get users gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );
      //Create new user
      user = new User({
        name,
        email,
        avatar,
        password,
      })
      // Encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      // Return jsonwebtoken
      const payload = {
        user: { id: user.id }
      }
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }
)

export default router
