import { Subjects, Publisher, PaymentCeatedEvent } from '@kristickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCeatedEvent>{
    subject:Subjects.PaymentCreated=Subjects.PaymentCreated
}