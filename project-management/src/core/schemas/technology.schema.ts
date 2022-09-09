import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TechnologyDocument = Technology & Document;

@Schema({collection: 'technologies', timestamps: true})
export class Technology {
    @Prop({required: true, unique: true})
    name: string;

    @Prop()
    status: string;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);