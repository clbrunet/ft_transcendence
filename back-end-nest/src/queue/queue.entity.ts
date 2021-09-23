import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import User from '../user/user.entity';


@Entity()
class Queue {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    queueTime: Date;

    @Column({ nullable: true, default: null })
    gameId: string;

    @ManyToOne(() => User, user => user.queuers, { eager: false, onDelete: "CASCADE" })
    queuer: User;
}

export default Queue;