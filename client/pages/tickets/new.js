import { useState } from "react"
import Router from 'next/router'
import UseRequest from "../../hooks/use-request"

const NewTicket = () => {
    const [title,setTitle]=useState('')
    const [price,setPrice]=useState('')
    const { doRequest, errors } = UseRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,price
        },
        // onSuccess:(ticket)=>console.log(ticket)
        onSuccess:()=>Router.push('/')
    })
    const onBlur = () => {
        const value = parseFloat(price)
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2))
    }
    const onSubmit = (event) => {
        event.preventDefault()
        doRequest()
    }
    return (
        <div>
            <h1>Create a ticket</h1>
            <form action="" onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input 
                        type="text"
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control" />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket