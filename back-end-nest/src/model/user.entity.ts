import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

enum user_status {
  online,
  in_queue,
  in_game,
  offline,
}

enum user_level {
  bronze,
  silver,
  gold,
  platinium,
}

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    display_name: string;

    @Column({ type: 'varchar', unique: true })
    mail: string;

    @Column({ type: 'varchar'})
    password: string;

    @Column({ type: 'varchar', default: '../assets/default_avatar.jpg'})
    avatar_path: string;

    @Column({ type: 'boolean', default: false })
    authenticated: boolean;

    @Column({ type: 'int', default: 0})
    status: user_status;

    @Column({ type: 'int', default: 0})
    n_games: number;

    @Column({ type: 'int', default: 0})
    n_wins: number;

    @Column({ type: 'int', default: 0})
    n_losses: number;

    @Column({ type: 'int', default: 0})
    xp: number;

    @Column({ type: 'int', default: 0})
    level: user_level;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
}
