import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

export type ProjectDocument = Project & Document;

@Schema()
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

export const ProjectSchema = SchemaFactory.createForClass(Project);