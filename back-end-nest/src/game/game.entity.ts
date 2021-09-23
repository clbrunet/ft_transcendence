import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { GameStatus } from './enum.gameStatus';

import User from '../user/user.entity';
import Player from '../player/player.entity';


@Entity()
class Game {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;

	@Column()
  	pointToVictory: number;

  @Column()
    ballSize: number;

  @Column()
    ballSpeed: number;

	@Column({ default: 0 })
  	status: GameStatus;

	@OneToMany(() => Player, player => player.game)
  	players: Player[];
}

export default Game;