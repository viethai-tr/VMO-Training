import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { Employee } from '../../core/schemas/employee.schema';
import { EmployeeController } from '../employee.controller';
import { EmployeeService } from '../employee.service';

jest.mock('../employee.service');

describe('EmployeeController', () => {
    let controller: EmployeeController;
    let serviceMock = {
        getAllEmployees: jest.fn(),
        createEmployee: jest.fn(),
        deleteEmployee: jest.fn(),
        updateEmployee: jest.fn(),
        countEmployees: jest.fn(),
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
            projects: []
        },
    ];

    let dataCreatedMock = {
        name: 'Unit test - Create',
        dob: new Date(1999, 11, 5),
        address: 'TKC',
        id_card: '10002',
        phone_number: '0912345678',
        technologies: ['62f32902db3f35d4abfe2d0a', '62f32942db3f35d4abfe2d0b'],
        experience: 3,
        languages: ['English', 'Japanese'],
        certs: ['Cert 1', 'Cert 2'],
    };

    const paginateMock = {
        limit: '5',
        page: '1',
    };
    const sortingMock = {
        sort: 'asc',
        sortBy: 'name',
        search: '',
    };
    const queryCount = {
        technology: 'idTechnology',
        project: 'idProject'
    }

    // const createdMock: Employee;

    let expectedValueGet = dataMock;

    let dataCreatedObjectId: Employee = {
        name: 'Unit test - Create',
        dob: new Date(1999, 11, 5),
        address: 'TKC',
        id_card: '10002',
        phone_number: '0912345678',
        technologies: [
            new mongoose.Types.ObjectId('62f32902db3f35d4abfe2d0a'),
            new mongoose.Types.ObjectId('62f32942db3f35d4abfe2d0b'),
        ],
        experience: 3,
        languages: ['English', 'Japanese'],
        certs: ['Cert 1', 'Cert 2'],
        projects: []
    };

    let expectedValueCreated = dataMock.push(dataCreatedObjectId);
    let expectedValueDeleted = '';

    const errorDelete = new NotFoundException('Not found');

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

    test('EmployeeController should be defined', () => {
        expect(controller).toBeDefined();
    });

    test('EmployeeService should be called', async () => {
        await controller.getAllEmployees(paginateMock, sortingMock);
        expect(serviceMock.getAllEmployees).toHaveBeenCalled();
    });

    test('Getting all employees successfully', async () => {
        serviceMock.getAllEmployees.mockResolvedValue(expectedValueGet);
        expect(
            await controller.getAllEmployees(paginateMock, sortingMock),
        ).toEqual(expectedValueGet);
    });

    test('Creating new Employee successfully', async () => {
        serviceMock.createEmployee.mockResolvedValue(dataCreatedMock);
        expect(await controller.createEmployee(dataCreatedMock)).toEqual(
            dataCreatedMock,
        );
    });

    test('Removing employee successfully', async () => {
        serviceMock.deleteEmployee.mockResolvedValue(expectedValueDeleted);
        expect(await controller.deleteEmployee('id')).toEqual(
            expectedValueDeleted,
        );
    });

    test('Updating employee successfully', async () => {
        serviceMock.updateEmployee.mockResolvedValue(dataCreatedMock);
        expect(await controller.updateEmployee('1', dataCreatedMock)).toEqual(dataCreatedMock);
    });

    test('Counting employees successfully', async () => {
        serviceMock.countEmployees.mockResolvedValue(40);
        expect(await controller.countEmployees(queryCount)).toEqual(40);
    });
});