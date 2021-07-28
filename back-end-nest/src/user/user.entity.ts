import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from './enum.level';
import { Status } from './enum.status';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  public name: string;

  @Column()
  public password: string;

  @Column({ default: '../assets/default_avatar.png' })
  avatar: string;

  @Column({ default: 0 })
  status: Status;

  @Column({ default: 0 })
  level: Level;

  @Column({ default: 0 })
  n_games: number;

  @Column({ default: 0 })
  n_wins: number;

  @Column({ default: 0 })
  n_losses: number;

  @Column({ default: 0 })
  xp: number;
}

export default User;
