 import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';

import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Friend from '../friend/friend.entity';
import Block from '../block/block.entity';
import Duel from '../duel/duel.entity';
import Queue from '../queue/queue.entity';
import Player from '../player/player.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isFortyTwoAccount: boolean;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: (process.env.URL || 'http://localhost:3000') + '/user/avatar/default.png' })
  avatar: string;

  @Column({ default: 0 })
  status: Status;

  @Column({ default: 0 })
  level: Level;

  @Column({ default: 0 })
  nGames: number;

  @Column({ default: 0 })
  nWins: number;

  @Column({ default: 0 })
  nLosses: number;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Channel, channel => channel.owner)
  channels: Channel[];

  @OneToMany(() => Participant, participant => participant.user)
  participants: Participant[];

  @OneToMany(() => Friend, friend => friend.friend)
  friends: Friend[];

  @OneToMany(() => Friend, friend => friend.friendOwner)
  friendOwners: Friend[];

  @OneToMany(() => Block, block => block.block)
  blocks: Block[];

  @OneToMany(() => Block, block => block.blockOwner)
  blockOwners: Block[];

  @OneToMany(() => Duel, duel => duel.duel)
  duels: Duel[];

  @OneToMany(() => Duel, duel => duel.duelOwner)
  duelOwners: Duel[];

  @OneToMany(() => Queue, queue => queue.queuer)
  queuers: Queue[];

  @OneToMany(() => Player, player => player.user)
  players: Player[];
}

export default User;
