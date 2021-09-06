import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { DuelStatus } from './enum.duelStatus';

import User  from '../user/user.entity';


@Entity()
@Unique(["duelOwner", "duel"])
class Duel {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column()
    public status: DuelStatus;

    @ManyToOne(() => User, user => user.duelOwners, { eager: false, onDelete: "CASCADE" })
    duelOwner: User;

    @ManyToOne(() => User, user => user.duels, { eager: false, onDelete: "CASCADE" })
    duel: User;
}

export default Duel;