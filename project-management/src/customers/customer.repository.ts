import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { Repository } from '../core/Repository';

@Injectable()
export class CustomerRepository extends Repository<CustomerDocument> {
    constructor(
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
    ) {
        super(customerModel);
    }

    async deleteCustomer(id: Types.ObjectId) {
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

        return this.customerModel.findOneAndDelete({ _id: id });
    }
}
