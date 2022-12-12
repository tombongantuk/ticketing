import express,{Request,Response} from 'express'
import { body} from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { validationRequest ,BadRequestError} from '@kristickets/common'

const router = express.Router()

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
], validationRequest, async (req: Request, res: Response) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     //this is javascript land(not ts)
    //     // const error = new Error('Invalid email of Password')
    //     // error.reason = errors.array()
    //     // throw error
    //     throw new RequestValidationError(errors.array())
    // }
    const { email, password } = req.body;
    // console.log('creating a user...')
    // throw new DatabaseConnectionError()
    // res.send({})
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        // console.log('Email in use')
        // return res.send({})
        throw new BadRequestError('Email in use');
    }
    const user = User.build({ email, password })
    await user.save()
    //generate jsonwebtoken
    const userJWT = jwt.sign({
        id: user.id,
        email:user.email
    }, process.env.JWT_KEY!)
    //store in on session object
    req.session = {
        jwt: userJWT
    };

    res.status(201).send(user)
})

export {router as signUpRouter}