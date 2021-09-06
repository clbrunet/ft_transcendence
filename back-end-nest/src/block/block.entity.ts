import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { BlockStatus } from './enum.blockStatus';

import User  from '../user/user.entity';


@Entity()
@Unique(["blockOwner", "block"])
class Block {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column()
    public status: BlockStatus;

    @ManyToOne(() => User, user => user.blockOwners, { eager: false, onDelete: "CASCADE" })
    blockOwner: User;

    @ManyToOne(() => User, user => user.blocks, { eager: false, onDelete: "CASCADE" })
    block: User;
}

export default Block;