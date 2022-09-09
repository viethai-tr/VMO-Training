import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ProjectTypeDocument = ProjectType & Document;

@Schema({collection: 'types', timestamps: true})
export class ProjectType {
    @Prop({ required: true})
    name: string;

    @Prop()
    status: string;
}

export const ProjectTypeSchema = SchemaFactory.createForClass(ProjectType);