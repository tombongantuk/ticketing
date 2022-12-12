import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global{
    var signin:(id?:string)=>string[]
}
// declare global{
//     namespace NodeJS{
//         interface Global{
//             signin():Promise<string[]>
//         }
//     }
// }

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY='sk_test_51HKcMTJebvsx6UdxwTQ8YURLRG4eMjjJ1aaTpYRGOSzUddjWj2v4Y61QA8wFIy7hmqcFmNWKLfIeJ1I0nngqJCAT00wQHj1bJO'
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY='asdfasdf'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri,{})
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signin =  (id?:string) => {
    // build a JWT payload. {id,email}
    const payload = {
        id: id||new mongoose.Types.ObjectId().toHexString(),
        email:'test@test.com'
    }

    //create the JWT
    const token=jwt.sign(payload,process.env.JWT_KEY!)
    
    // build session object{jwt:MY_JWT}
    const session = { jwt: token }
    
    //turn that session into JSON
    const sessionJSON=JSON.stringify(session)
    
    // take JSON and encode it as bas64
    const base64=Buffer.from(sessionJSON).toString('base64')
    
    //return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}