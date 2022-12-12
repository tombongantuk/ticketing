import express,{Request,Response} from 'express'
import {body,} from 'express-validator'
import { validationRequest,BadRequestError } from '@kristickets/common'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validationRequest, async (req:Request, res:Response) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     //this is javascript land(not ts)
    //     // const error = new Error('Invalid email of Password')
    //     // error.reason = errors.array()
    //     // throw error
    //     throw new RequestValidationError(errors.array())
    // }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
        throw new BadRequestError('User not found');
    }
    //compare password
    const passwordMatched=await Password.compare(existingUser.password,password)
    if(!passwordMatched)throw new BadRequestError('Password not match')
    
    //generate jsonwebtoken
    const userJWT = jwt.sign({
        id: existingUser.id,
        email:existingUser.email
    }, process.env.JWT_KEY!)
    //store in on session object
    req.session = {
        jwt: userJWT
    };

    res.status(201).send(existingUser)
})

export {router as signInRouter}