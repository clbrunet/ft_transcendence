import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../model/customer.entity';
import { Repository } from 'typeorm';
import { CustomerDTO } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>) { }

	public async addCustomer(dto: CustomerDTO): Promise<CustomerDTO> {
		return this.repo.save(CustomerDTO.toEntity(dto))
		  .then(e => CustomerDTO.fromEntity(e));
	}

	public async getAllCustomer(): Promise<CustomerDTO[]> {
		return await this.repo.find()
		  .then(items => items.map(e => CustomerDTO.fromEntity(e)));
	}

	public async getCustomer(customerID): Promise<CustomerDTO> {
		return await this.repo.findOne(customerID);
	}

	public async updateCustomer(customerID, dto: CustomerDTO): Promise<CustomerDTO> {
	    await this.repo.update(customerID, dto);
		return await this.repo.findOne(customerID);
	}

    public async deleteCustomer(customerID): Promise<any> {
        return await this.repo.delete(customerID);
    }
}
