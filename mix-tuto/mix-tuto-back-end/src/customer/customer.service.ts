import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../model/customer.entity';
import { Repository } from 'typeorm';
import { CustomerDTO } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>) { }

  public async getAll(): Promise<CustomerDTO[]> {
    return await this.repo.find()
      .then(items => items.map(e => CustomerDTO.fromEntity(e)));
  }

  public async create(dto: CustomerDTO): Promise<CustomerDTO> {
    return this.repo.save(CustomerDTO.toEntity(dto))
      .then(e => CustomerDTO.fromEntity(e));
  }
}
