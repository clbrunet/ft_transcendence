import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

import { DuelStatus } from './enum.duelStatus';

import User  from '../user/user.entity';
import Game  from '../game/game.entity';


@Entity()
@Unique(["duelOwner", "duel"])
class Duel {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column()
    public status: DuelStatus;

    @Column({ nullable: true, default: null })
    gameId: string;

    @ManyToOne(() => User, user => user.duelOwners, { eager: false, onDelete: "CASCADE" })
    duelOwner: User;

    @ManyToOne(() => User, user => user.duels, { eager: false, onDelete: "CASCADE" })
    duel: User;
}

export default Duel;