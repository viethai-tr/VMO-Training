import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';

@Injectable()
export class CustomerRepository extends Repository<CustomerDocument> {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {
    super(customerModel);
  }

  async deleteCustomer(id: string) {
    let checkCustomer;
    try {
      checkCustomer = await this.customerModel.findOne({ _id: id });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Not a valid ID',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (checkCustomer) {
      const projects = this.projectModel.find({ customer: id });
      if (!projects || (await projects).length == 0) {
        await this.customerModel.findOneAndDelete({ _id: id });
        return {
          HttpStatus: HttpStatus.OK,
          msg: 'Delete successfully!',
        };
      } else {
        throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
