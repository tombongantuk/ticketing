import Router from "next/router"
import { useEffect,useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import UseRequest from "../../hooks/use-request"
const OrderShow = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState('')
    const { doRequest, errors } = UseRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId:order.id
        },
        // onSuccess:(payment)=>console.log(payment)
        onSuccess:()=>Router.push('/orders')
    })
    useEffect(() => { 
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft/1000))
        }
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId)
        }
    },[order])
    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }
    return <div>
        Time left to pay : {timeLeft} seconds
        <StripeCheckout 
            token={(token)=>doRequest}
            stripeKey="pk_test_51HKcMTJebvsx6UdxhK7WqEcrTzDoIkVC0CYS87NJlp3ExCGCmYpFhLE5fRgOIc8ppJchrTwrxBsEF45CGZi4gBEY00003BJXRz"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
}
OrderShow.getInitialProps = async (context,client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)
    
    return{order:data}
}
export default OrderShow