import mongoose from "mongoose";
import { Employee } from "../../../core/schemas/employee.schema";

export const employeeStub = (): Employee => {
    return {
        name: 'Unit test',
        dob: new Date(1999, 11, 5),
        address: 'TKC',
        id_card: '10001',
        phone_number: '0961317991',
        technologies: [new mongoose.Types.ObjectId('62f32902db3f35d4abfe2d0a'), new mongoose.Types.ObjectId('62f32942db3f35d4abfe2d0b')],
        experience: 3,
        languages: ['English', 'Japanese'],
        certs: ['Cert 1', 'Cert 2'],
    }
}