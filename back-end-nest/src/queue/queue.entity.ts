import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import User from '../user/user.entity';


@Entity()
class Queue {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    queueTime: Date;

    @ManyToOne(() => User, user => user.queuers, { eager: false, onDelete: "CASCADE" })
    queuer: User;
}

export default Queue;