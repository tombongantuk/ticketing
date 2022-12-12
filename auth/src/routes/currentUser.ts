import express,{Request,Response} from 'express'
import { currentUser } from '@kristickets/common'
// import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req:Request, res:Response) => {
    // if (!req.session || !req.session.jwt) {
    //     return res.send({currentUser:null})
    // }
    // try {
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    //     res.send({currentUser:payload})
    // } catch (error) {
    //     console.log(error)
    //     res.send({currentUser:null})
    // }
    // res.send('Hi there')
    res.send({currentUser:req.currentUser||null})
})

export {router as currentUserRouter}