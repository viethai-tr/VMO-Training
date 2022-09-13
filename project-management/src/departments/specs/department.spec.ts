import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppModule } from '../../app.module';
import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';
import { AtGuard } from '../../shared/auth/guards/at.guard';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { NotFoundException } from '@nestjs/common';
import {
    Department,
    DepartmentDocument,
} from '../../core/schemas/department.schema';
import { Project, ProjectDocument } from '../../core/schemas/project.schema';
import { ProjectService } from '../../projects/project.service';
import { DepartmentService } from '../department.service';
import { DepartmentController } from '../department.controller';
import { DepartmentDto } from '../dtos/create.department.dto';
import { EmployeeDocument, Employee } from '../../core/schemas/employee.schema';

const mockDepartment: Department = {
    name: 'Department',
    description: 'Department description',
    founding_date: new Date('2022-09-20'),
    manager: new Types.ObjectId('62f47528059085263d64565e'),
    employees: [],
    projects: [],
};

const mockUpdatedDepartment: DepartmentDto = {
    name: 'Department - Updated',
    description: 'Department description',
    founding_date: new Date('2022-09-20'),
    manager: '62f47528059085263d64565e',
    employees: [],
    projects: [],
};

const expectedUpdatedDepartment = {
    name: 'Department - Updated',
    description: 'Department description',
    founding_date: new Date('2022-09-20'),
    manager: '62f47528059085263d64565e',
};

const mockCreatedDepartment: DepartmentDto = {
    name: 'Department - Created',
    description: 'Department description',
    founding_date: new Date('2022-09-20'),
    manager: '62f47528059085263d64565e',
    employees: [],
    projects: [],
};

const mockManager = {
    name: 'MockManager',
};

describe('Department Test', () => {
    let departmentController: DepartmentController;
    let departmentService: DepartmentService;
    let departmentModel: any;
    let projectService: ProjectService;
    let projectModel: any;
    let employeeModel: any;
    let app: NestApplication;
    let module: TestingModule;
    let test;

    const mockDepartmentModel = () => ({
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
        module = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AtGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        departmentController =
            module.get<DepartmentController>(DepartmentController);
        departmentService = module.get<DepartmentService>(DepartmentService);
        departmentModel = module.get<SoftDeleteModel<DepartmentDocument>>(
            getModelToken(Department.name),
        );
        projectService = module.get<ProjectService>(ProjectService);
        projectModel = module.get<Model<ProjectDocument>>(
            getModelToken(Project.name),
        );
        employeeModel = module.get<Model<EmployeeDocument>>(
            getModelToken(Employee.name),
        );

        app = module.createNestApplication();
        await app.init();
        test = request(app.getHttpServer());
    });

    it('Should be defined', () => {
        expect(departmentService).toBeDefined();
    });

    describe('GET all departments', () => {
        it('Should return all departments w/ pagination', async () => {
            jest.spyOn(departmentModel, 'find').mockImplementation(() => ({
                countDocuments: jest.fn().mockResolvedValue(1),
                sort: jest.fn().mockImplementation(() => ({
                    skip: jest.fn().mockImplementation(() => ({
                        limit: jest.fn().mockImplementation(() => ({
                            populate: jest.fn().mockImplementation(() => ({
                                populate: jest.fn().mockImplementation(() => ({
                                    populate: jest
                                        .fn()
                                        .mockResolvedValue([mockDepartment]),
                                })),
                            })),
                        })),
                    })),
                })),
            }));

            const result = await departmentController.getAllDepartments(
                paginateMock,
                sortingMock,
            );
            expect(result).toEqual({
                totalDocs: 1,
                curPage: 1,
                totalPages: 1,
                search: '',
                sortBy: 'name',
                sort: 'asc',
                listResult: [mockDepartment],
            });
        });
    });

    describe('CREATE new department', () => {
        it('should create a new department', async () => {
            jest.spyOn(employeeModel, 'find').mockResolvedValue(mockManager);
            jest.spyOn(departmentModel, 'create').mockResolvedValue(
                mockDepartment,
            );

            const result = await departmentController.createDepartment(
                mockCreatedDepartment,
            );
            expect(result).toEqual(mockDepartment);
        });

        it('should throw NotFoundException for Manager', async () => {
            jest.spyOn(employeeModel, 'find').mockResolvedValue(null);

            expect(
                departmentController.createDepartment(mockCreatedDepartment),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('UPDATE a department', () => {
        it('should update the department', async () => {
            jest.spyOn(employeeModel, 'find').mockResolvedValue(mockManager);
            jest.spyOn(departmentModel, 'updateOne').mockResolvedValue(
                mockDepartment,
            );

            const result = await departmentController.updateDepartment(
                '1',
                mockUpdatedDepartment,
            );
            expect(result.name).toEqual(expectedUpdatedDepartment.name);
        });

        it('should throw NotFoundException for Manager', async () => {
            jest.spyOn(employeeModel, 'find').mockResolvedValue(null);

            expect(
                departmentController.updateDepartment(
                    '1',
                    mockUpdatedDepartment,
                ),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('DELETE a department', () => {
        it('should delete a department', async () => {
            jest.spyOn(departmentModel, 'softDelete').mockResolvedValue({
                deleted: 1,
            });

            const result = await departmentController.deleteDepartment('id');
            expect(result.deleted).toEqual(1);
        });
    });

    describe('RESTORE a department', () => {
        it('shoule restore a department', async () => {
            jest.spyOn(departmentModel, 'restore').mockResolvedValue({
                restored: 1,
            });

            const result = await departmentController.restoreDepartment('id');
            expect(result.restored).toEqual(1);
        });
    });

    describe('GET all Employees of a Department', () => {
        it('should return all employees of a Department', async () => {
            jest.spyOn(departmentModel, 'findOne').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mockManager),
            }));

            const result = await departmentController.getEmployeesDepartment(
                'id',
            );
            expect(result).toEqual(mockManager);
        });
    });

    describe('GET all Projects of a Department', () => {
        it('should return all employees of a Department', async () => {
            jest.spyOn(departmentModel, 'findOne').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mockManager),
            }));

            const result = await departmentController.getProjectsDepartment(
                'id',
            );
            expect(result).toEqual(mockManager);
        });
    });
});
