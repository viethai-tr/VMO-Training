import { employeeStub } from "../specs/stubs/employee.stub";

export const EmployeeService = jest.fn().mockReturnValue({
    getAllEmployees: jest.fn().mockResolvedValue([employeeStub()]),
    getEmployeeById: jest.fn().mockResolvedValue(employeeStub()),
    createEmployee: jest.fn().mockResolvedValue(employeeStub()),
    updateEmployee: jest.fn().mockResolvedValue(employeeStub())
});