import { Entity, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import User  from '../user/user.entity';


@Entity()
@Unique(["blockConnector", "block"])
class Block {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @ManyToOne(() => User, user => user.blockConnectors, { eager: true, onDelete: "CASCADE" })
    blockConnector: User;

    @ManyToOne(() => User, user => user.blocks, { eager: true, onDelete: "CASCADE" })
    block: User;
}

export default Block;