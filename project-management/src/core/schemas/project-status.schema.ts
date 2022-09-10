import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type ProjectStatusDocument = ProjectStatus & Document;

@Schema({collection: 'statuses', timestamps: true})
export class ProjectStatus {
    @Prop({ required: true})
    name: string;

    @Prop({ required: true })
    status: boolean;
}

export const ProjectStatusSchema = SchemaFactory.createForClass(ProjectStatus).plugin(softDeletePlugin);