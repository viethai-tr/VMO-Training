import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";

export type TechnologyDocument = Technology & Document;

@Schema({collection: 'technologies', timestamps: true})
export class Technology {
    @Prop({required: true, unique: true})
    name: string;

    @Prop()
    status: boolean;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology).plugin(softDeletePlugin);