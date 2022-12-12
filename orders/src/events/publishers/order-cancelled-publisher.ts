import { Publisher, OrderCancelledEvent, Subjects } from "@kristickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}