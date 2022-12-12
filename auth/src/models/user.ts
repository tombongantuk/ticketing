import mongose from "mongoose";
import { Password } from '../services/password';

// An interface that describe the properties
// that are required to create a new user
interface UserAttrs{
    email: string;
    password: string;
}

// an interface that describe the properties
// that a user Model has
interface UserModel extends mongose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describe the properties
// that a User Document has
interface UserDoc extends mongose.Document{
    email: string;
    password: string;
}

const userSchema = new mongose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id=ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
      }   
    }
});
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password',hashed)
    }
    done()
})
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}
const User = mongose.model<UserDoc,UserModel>('User',userSchema)
export { User };