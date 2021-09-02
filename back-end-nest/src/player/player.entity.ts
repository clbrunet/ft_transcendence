import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import User from '../user/user.entity';
import Game from '../game/game.entity';

@Entity()
@Unique(["user", "game"])
class Player {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

	@Column({ default: 0 })
  	public point: number;

    @ManyToOne(() => User, user => user.players, { eager: true, onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Game, game => game.players, { eager: true, onDelete: "CASCADE" })
    game: Game;
}

export default Player;