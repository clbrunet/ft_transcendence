import { IsString, IsUUID, } from 'class-validator';
import { Customer } from '../model/customer.entity';

export class CustomerDTO implements Readonly<CustomerDTO> {
  @IsUUID()
  id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  description: string;

  public static from(dto: Partial<CustomerDTO>) {
    const it = new CustomerDTO();
    it.id = dto.id;
    it.first_name = dto.first_name;
    it.last_name = dto.last_name;
    it.email = dto.email;
    it.phone = dto.phone;
    it.address = dto.address;
    it.description = dto.description;
    return it;
  }

  public static fromEntity(entity: Customer) {
    return this.from({
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      phone: entity.phone,
      address: entity.address,
      description: entity.description
    });
  }

  public static toEntity(dto: Partial<CustomerDTO>) {
    const it = new Customer();
    it.id = dto.id;
    it.first_name = dto.first_name;
    it.last_name = dto.last_name;
    it.email = dto.email;
    it.phone = dto.phone;
    it.address = dto.address;
    it.description = dto.description;
    it.createDateTime = new Date();
    return it;
  }
}