import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { RequestStatus } from './enum.requestStatus';

import User  from '../user/user.entity';


@Entity()
@Unique(["connector", "friend"])
class Friend {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column()
    public status: RequestStatus;

    @ManyToOne(() => User, user => user.connectors, { eager: true, onDelete: "CASCADE" })
    connector: User;

    @ManyToOne(() => User, user => user.friends, { eager: true, onDelete: "CASCADE" })
    friend: User;
}

export default Friend;