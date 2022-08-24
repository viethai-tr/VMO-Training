import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ProjectStatusDocument = ProjectStatus & Document;

@Schema({collection: 'statuses'})
export class ProjectStatus {
    @Prop({ required: true})
    name: string;

    @Prop({ required: true})
    status: string;
}

export const ProjectStatusSchema = SchemaFactory.createForClass(ProjectStatus);