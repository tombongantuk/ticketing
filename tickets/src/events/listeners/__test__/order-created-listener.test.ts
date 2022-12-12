import { OrderCreatedEvent,OrderStatus } from "@kristickets/common"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/tickets"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)
    
    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId:'adfadsf'
    })
    await ticket.save()

    //create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sdfasdf',
        expiresAt: 'asdfsadf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // create the fake msg
    // @ts-ignore
    const msg: Message = {
        ack:jest.fn()
    }

    return {listener,msg,data,ticket}
}
it('sets the userId of the ticket', async () => {
    const { listener, ticket, msg, data } = await setup()
    await listener.onMessage(data, msg)
    
    const updatedTicket = await Ticket.findById(ticket.id)
    
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack the message', async () => {
    const { listener, ticket, msg, data } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { listener, ticket, msg, data } = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    
    //@ts-ignore
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(data.id).toEqual(ticketUpdatedData.OrderId)
})