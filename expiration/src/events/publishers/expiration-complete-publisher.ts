import { Subjects, Publisher, ExpirationCompleteEvent } from "@kristickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete
}