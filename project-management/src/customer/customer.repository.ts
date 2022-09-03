import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';

@Injectable()
export class CustomerRepository extends Repository<CustomerDocument> {
    constructor(
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {
        super(customerModel);
    }

    async deleteCustomer(id: string) {
        // try {
        //     checkCustomer = await this.customerModel.findOne({ _id: id });
        // } catch (err) {
        //     throw new HttpException(
        //         {
        //             status: HttpStatus.NOT_ACCEPTABLE,
        //             error: 'Not a valid ID',
        //         },
        //         HttpStatus.NOT_ACCEPTABLE,
        //     );
        // }

        return await this.customerModel.findOneAndDelete({ _id: id });
    }
}
