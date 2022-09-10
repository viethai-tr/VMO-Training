import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type ProjectTypeDocument = ProjectType & Document;

@Schema({collection: 'types', timestamps: true})
export class ProjectType {
    @Prop({ required: true})
    name: string;

    @Prop()
    status: boolean;
}

export const ProjectTypeSchema = SchemaFactory.createForClass(ProjectType).plugin(softDeletePlugin);