import { Module } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
})

export class AuthModule { }