import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

export type AdminDocument = Admin & Document;

@Schema({ collection: 'admins' })
export class Admin {
    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    @Exclude()
    password: string;

    @Prop({ default: 'INACTIVE' })
    status: string;

    @Prop({ required: true, default: 'User' })
    role: string;

    @Prop({ default: null })
    rt: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
