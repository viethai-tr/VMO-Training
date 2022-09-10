import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type CustomerDocument = Customer & Document;

@Schema({collection: 'customers', timestamps: true})
export class Customer {
    @Prop({unique: true, required: true})
    name: string;

    @Prop()
    description: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer).plugin(softDeletePlugin);