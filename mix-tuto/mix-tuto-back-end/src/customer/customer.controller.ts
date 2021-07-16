import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private serv: CustomerService) { }

	@Post('/create')
	public async addCustomer(@Res() res, @Body() dto: CustomerDTO): Promise<CustomerDTO> {
		const customer = await this.serv.addCustomer(dto);
		return res.status(HttpStatus.OK).json({
	    	message: "Customer has been created successfully",
	    	customer
		})
	}

	@Get('/customers')
	public async getAllCustomer(@Res() res): Promise<CustomerDTO[]> {
		const customers = await this.serv.getAllCustomer();
		return res.status(HttpStatus.OK).json(customers);
	}

	@Get('/customer/:customerID')
	public async getCustomer(@Res() res, @Param('customerID') customerID) {
		const customer = await this.serv.getCustomer(customerID);
		if (!customer) throw new NotFoundException('Customer does not exist!');
		return res.status(HttpStatus.OK).json(customer);
	}

	@Put('/update')
	public async updateCustomer(@Res() res, @Query('customerID') customerID, @Body() dto: CustomerDTO) {
	    const customer = await this.serv.updateCustomer(customerID, dto);
	    if (!customer) throw new NotFoundException('Customer does not exist!');
	    return res.status(HttpStatus.OK).json({
	        message: 'Customer has been successfully updated',
	        customer
	    });
	}

    @Delete('/delete/:customerID')
    public async deleteCustomer(@Res() res, @Param('customerID') customerID) {
        const customer = await this.serv.deleteCustomer(customerID);
        if (!customer) throw new NotFoundException('Customer does not exist');
        return res.status(HttpStatus.OK).json({
            message: 'Customer has been deleted',
            customer
        })
    }
}
