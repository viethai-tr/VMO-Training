import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
})
export class UserModule { }
