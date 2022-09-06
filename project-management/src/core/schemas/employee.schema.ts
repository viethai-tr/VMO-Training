import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

export type EmployeeDocument = Employee & Document;

@Schema({collection: 'employees'})
export class Employee {
    @Prop({ required: true })
    name: string;

    @Prop()
    dob: Date;

    @Prop()
    address: string;

    @Prop({required: true, unique: true})
    id_card: string;

    @Prop({unique: true})
    phone_number: string;

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Technology", required: true}])
    technologies: Types.ObjectId[];

    @Prop({required: true, default: 0})
    experience: number;

    @Prop()
    languages: string[];

    @Prop()
    certs: string[];

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Project"}])
    projects: Types.ObjectId[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);