import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDto } from '../../core/dtos';
import { Employee } from '../../core/schemas/employee.schema';
import { EmployeeController } from '../employee.controller';
import { EmployeeService } from '../employee.service';
import { employeeStub } from './stubs/employee.stub';

jest.mock('../employee.service');

const mockEmployee = {
  
}

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [EmployeeService],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllEmployees', () => {
    describe('when getAllEmployees is called', () => {
      let employees: Employee[];

      beforeEach(async () => {
        employees = await controller.getAllEmployees();
      });

      test('then it should call employeeService', () => {
        expect(service.getAllEmployees).toHaveBeenCalled();
      });

      test('then it should return all employees', () => {
        expect(employees).toEqual([employeeStub()]);
      });
    });
  });

  describe('createEmployee', () => {
    let employee: Employee;
    let employeeDto: EmployeeDto;
    let technologiesObjectId = employeeStub().technologies;
    let technologies: string[];
    for (let i = 0; i < technologiesObjectId.length; i++) {
      technologies[i] = technologiesObjectId[i].toString();
    }

    beforeEach(async () => {
      employeeDto = {
        name: employeeStub().name,
        dob: employeeStub().dob,
        address: employeeStub().address,
        id_card: employeeStub().id_card,
        phone_number: employeeStub().phone_number,
        technologies: technologies,
        experience: employeeStub().experience,
        languages: employeeStub().languages,
        certs: employeeStub().certs
      }

      employee = await controller.createEmployee(employeeDto);
    });

    test('then it should call employeeService', () => {
      expect(service.createEmployee).toHaveBeenCalledWith(employeeDto);
    });

    test('then it should return an employee', () => {
      expect(employee).toEqual(employeeStub());
    });
  });
});
