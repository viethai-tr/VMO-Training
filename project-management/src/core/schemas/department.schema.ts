import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types, Document } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type DepartmentDocument = Department & Document;

@Schema({collection: 'departments', timestamps: true})
export class Department {
    @Prop({ required: true})
    name: string;

    @Prop()
    description: string;

    @Prop()
    founding_date: Date;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true})
    manager: Types.ObjectId;
    
    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true}])
    employees: Types.ObjectId[];

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true}])
    projects: Types.ObjectId[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department).plugin(softDeletePlugin);