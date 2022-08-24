import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type AdminDocument = Admin & Document;

@Schema({collection: 'admins'})
export class Admin {
    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    status: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);