import { Subjects, Listener, PaymentCeatedEvent, OrderStatus } from '@kristickets/common'
import { queueGroupName } from './queue-group-name'
import {Message}from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCeatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName=queueGroupName

    async onMessage(data: PaymentCeatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId)
        
        if (!order) {
            throw new Error('Order not found')
        }

        order.set({
            status:OrderStatus.Complete
        })

        await order.save()

        msg.ack()
    }
}