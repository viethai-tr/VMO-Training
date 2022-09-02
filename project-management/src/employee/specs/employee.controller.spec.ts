import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { EmployeeDto } from '../../core/dtos';
import { Employee } from '../../core/schemas/employee.schema';
import { EmployeeController } from '../employee.controller';
import { EmployeeService } from '../employee.service';

jest.mock('../employee.service');

describe('EmployeeController', () => {
    let controller: EmployeeController;
    let serviceMock = {
        getAllEmployees: jest.fn(),
    };

    let dataMock: Employee[] = [
        {
            name: 'Unit test',
            dob: new Date(1999, 11, 5),
            address: 'TKC',
            id_card: '10001',
            phone_number: '0961317991',
            technologies: [
                new mongoose.Types.ObjectId('62f32902db3f35d4abfe2d0a'),
                new mongoose.Types.ObjectId('62f32942db3f35d4abfe2d0b'),
            ],
            experience: 3,
            languages: ['English', 'Japanese'],
            certs: ['Cert 1', 'Cert 2'],
        },
    ];

    const paginateMock = {
        limit: 2,
        page: 1,
    };
    const sortingMock = {
        sort: 'asc',
        sortBy: 'name',
    };

    // const createdMock: Employee;

    let expectedValueGet = dataMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeeController],
            providers: [EmployeeService],
        })
            .overrideProvider(EmployeeService)
            .useValue(serviceMock)
            .compile();

        controller = module.get<EmployeeController>(EmployeeController);
    });

    it('EmployeeController should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Get all employees', async () => {
        serviceMock.getAllEmployees.mockResolvedValue(expectedValueGet);
        expect(
            await controller.getAllEmployees(paginateMock, sortingMock),
        ).toEqual(expectedValueGet);
    });
});
