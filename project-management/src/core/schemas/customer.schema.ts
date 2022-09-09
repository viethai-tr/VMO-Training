import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CustomerDocument = Customer & Document;

@Schema({collection: 'customers', timestamps: true})
export class Customer {
    @Prop({unique: true, required: true})
    name: string;

    @Prop()
    description: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);