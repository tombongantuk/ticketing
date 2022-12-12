import { useState } from "react";
import Router from 'next/router'
import UseRequest from "../../hooks/use-request";
const Form = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = UseRequest({
        url:'/api/users/signup',
        method:'post',
        body:{ email, password },
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async(event) => {
        event.preventDefault()
        const response = await doRequest()
        // Router.push('/')
        // console.log('res',response.data)
        // try {
        //     const response = await axios.post('/api/users/signup', {
        //         email,password
        //     })
        // } catch (error) {
        //     setErrors(error.response.data.errors)
        //     // console.log(error.response.data.errors)
        // }   
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label htmlFor="">Email Address</label>
                <input className="form-control" value={email} onChange={e=> setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="">Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control"/>
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}
export default Form