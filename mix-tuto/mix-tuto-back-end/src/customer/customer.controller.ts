import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private serv: CustomerService) { }

  @Get()
  public async getAll(): Promise<CustomerDTO[]> {
    return await this.serv.getAll()
  }

  @Post()
  public async post(@Body() dto: CustomerDTO): Promise<CustomerDTO> {
    return this.serv.create(dto);
  }
}
