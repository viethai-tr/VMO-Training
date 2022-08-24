import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from 'src/core/schemas/customer.schema';
import { Project, ProjectSchema } from 'src/core/schemas/project.schema';

@Module({
  providers: [CustomerService, CustomerRepository],
  controllers: [CustomerController],
  imports: [MongooseModule.forFeature([
    { name: Customer.name, schema: CustomerSchema },
    { name: Project.name, schema: ProjectSchema }
  ])]
})
export class CustomerModule { }
