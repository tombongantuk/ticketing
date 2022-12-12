import { Publisher, OrderCreatedEvent, Subjects } from "@kristickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
