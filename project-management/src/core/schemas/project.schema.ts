import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types, Document } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type ProjectDocument = Project & Document;

@Schema({collection: 'projects', timestamps: true})
export class Project {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "ProjectType", required: true})
    type: Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "ProjectStatus", required: true})
    status: Types.ObjectId;

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Technology", required: true}])
    technologies: Types.ObjectId[];

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true}])
    employees: Types.ObjectId[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true})
    customer: Types.ObjectId;

    @Prop({required: true}) 
    starting_date: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project).plugin(softDeletePlugin);