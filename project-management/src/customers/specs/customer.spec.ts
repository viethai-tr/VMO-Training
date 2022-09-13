import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';
import { Customer, CustomerDocument } from '../../core/schemas/customer.schema';
import { CustomerService } from '../customer.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectService } from '../../projects/project.service';
import { AppModule } from '../../app.module';
import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';
import { Project, ProjectDocument } from '../../core/schemas/project.schema';
import { AtGuard } from '../../shared/auth/guards/at.guard';
import { CustomerController } from '../customer.controller';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockCustomer: Customer = {
    name: 'Customer',
    description: 'Customer description',
};

const mockProject: Project = {
    name: '',
    description: '',
    type: new Types.ObjectId(),
    status: new Types.ObjectId(),
    technologies: [],
    employees: [],
    customer: new Types.ObjectId(),
    starting_date: new Date('2022-09-12'),
};

describe('Customer Test', () => {
    let customerController: CustomerController;
    let customerService: CustomerService;
    let customerModel: any;
    let projectService: ProjectService;
    let projectModel: any;
    let app: NestApplication;
    let module: TestingModule;
    let test;

    const mockCustomerModel = () => ({
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findOneAndUpdate: jest.fn(),
        deleteOne: jest.fn(),
        deleteMany: jest.fn(),
        countDocuments: jest.fn(),
        updateOne: jest.fn(),
        updateMany: jest.fn(),
        findByIdAndDelete: jest.fn(),
        create: jest.fn(),
    });

    const paginateMock = {
        limit: '5',
        page: '1',
    };
    const sortingMock = {
        sort: 'asc',
        sortBy: 'name',
        search: '',
    };

    beforeAll(async () => {
        // const module: TestingModule = await Test.createTestingModule({
        //     providers: [
        //         CustomerService,
        //         CustomerRepository,
        //         {
        //             provide: getModelToken(Customer.name),
        //             useFactory: mockCustomerModel,
        //         },
        //     ],
        //     imports: [ProjectModule]
        // })

        module = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AtGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        customerController = module.get<CustomerController>(CustomerController);
        customerService = module.get<CustomerService>(CustomerService);
        customerModel = module.get<SoftDeleteModel<CustomerDocument>>(
            getModelToken(Customer.name),
        );
        projectService = module.get<ProjectService>(ProjectService);
        projectModel = module.get<Model<ProjectDocument>>(
            getModelToken(Project.name),
        );

        app = module.createNestApplication();
        await app.init();
        test = request(app.getHttpServer());
    });

    it('Should be defined', () => {
        expect(customerService).toBeDefined();
    });

    describe('GET all customers', () => {
        it('Should return all customers w/ pagination', async () => {
            jest.spyOn(customerModel, 'find').mockImplementation(() => ({
                countDocuments: jest.fn().mockResolvedValue(1),
                sort: jest.fn().mockImplementation(() => ({
                    skip: jest.fn().mockImplementation(() => ({
                        limit: jest.fn().mockResolvedValue([mockCustomer]),
                    })),
                })),
            }));

            // jest.spyOn(customerModel, 'find').mockImplementation(() => ({
            //     countDocuments: jest.fn().mockResolvedValue(1),
            // }));

            const result = await customerService.getAllCustomers();
            expect(result).toEqual({
                totalDocs: 1,
                curPage: 1,
                totalPages: 1,
                search: '',
                sortBy: 'name',
                sort: 'asc',
                listResult: [mockCustomer],
            });
        });
    });

    describe('CREATE new customer', () => {
        it('should create a new customer', async () => {
            jest.spyOn(customerModel, 'create').mockResolvedValue(mockCustomer);

            const result = await customerController.createCustomer(mockCustomer);
            expect(result).toEqual(mockCustomer);
        });
    });

    describe('UPDATE a customer', () => {
        it('should update the customer', async () => {
            jest.spyOn(customerModel, 'updateOne').mockResolvedValue(
                mockCustomer,
            );

            const result = await customerController.updateCustomer(
                '1',
                mockCustomer,
            );
            expect(result).toEqual(mockCustomer);
        });
    });

    describe('DELETE a customer', () => {
        it('should delete a customer', async () => {

            jest.spyOn(customerModel, 'findOne').mockResolvedValue(
                mockCustomer,
            );
            jest.spyOn(projectModel, 'find').mockResolvedValue(mockProject);
            jest.spyOn(customerModel, 'softDelete').mockResolvedValue({'deleted': 1});

            const result = await customerController.deleteCustomer('id');
            expect(result.deleted).toEqual(1);
        });

        it('should throw NotFoundException', async () => {
            jest.spyOn(customerModel, 'findOne').mockResolvedValue(null);

            expect(customerController.deleteCustomer('id')).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw BadRequestException("Cannot be deleted")', async () => {
            jest.spyOn(customerModel, 'findOne').mockResolvedValue(
                mockCustomer,
            );
            jest.spyOn(projectModel, 'find').mockResolvedValue([]);

            expect(customerController.deleteCustomer('id')).rejects.toBeInstanceOf(BadRequestException);
        })
    });


    describe('RESTORE a customer', () => {
        it('shoule restore a customer', async () => {
            jest.spyOn(customerModel, 'restore').mockResolvedValue({'restored': 1});

            const result = await customerController.restoreCustomer('id');
            expect(result.restored).toEqual(1);
        });
    })
});
