import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type AdminDocument = Admin & Document;

@Schema({ collection: 'admins', timestamps: true })
export class Admin {
    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    @Exclude()
    password: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    avatar: string;

    @Prop({ default: false })
    status: boolean;

    @Prop({ default: false })
    active: boolean;

    @Prop({ required: true, default: 'User' })
    role: string;

    @Prop({ default: null })
    rt: string;
}

export const AdminSchema =
    SchemaFactory.createForClass(Admin).plugin(softDeletePlugin);
