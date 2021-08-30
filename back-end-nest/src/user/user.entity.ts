import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';

import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Friend from '../friend/friend.entity';


@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ unique: true })
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: '../assets/default_avatar.png' })
  public avatar: string;

  @Column({ default: 0 })
  public status: Status;

  @Column({ default: 0 })
  public level: Level;

  @Column({ default: 0 })
  public nGames: number;

  @Column({ default: 0 })
  public nWins: number;

  @Column({ default: 0 })
  public nLosses: number;

  @Column({ default: 0 })
  public xp: number;

  @OneToMany(() => Channel, channel => channel.owner)
  channels: Channel[];

  @OneToMany(() => Participant, participant => participant.user)
  participants: Participant[];

  @OneToMany(() => Friend, friend => friend.friend)
  friends: Friend[];

  @OneToMany(() => Friend, friend => friend.connector)
  connectors: Friend[];
}

export default User;
