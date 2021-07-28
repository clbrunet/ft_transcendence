import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

enum channel_status {
  public,
  private,
  protected,
}

@Entity({ name: 'participant' })
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.participants, { eager: false, onDelete: "CASCADE" })
    user: User;

    @Column({ type: 'varchar', unique: true })
    user_display_name: string;

    @Column({ type: 'varchar', unique: true })
    user_id: string;

    @ManyToOne(() => Channel, channel => channel.participants, { eager: false, onDelete: "CASCADE" })
    channel: Channel;

    @Column({ type: 'varchar', unique: true })
    channel_name: string;

    @Column({ type: 'varchar', unique: true })
    channel_id: string;

    @Column({ type: 'boolean', default: false })
    admin: boolean;

    @Column({ type: 'boolean', default: false })
    mute: boolean;

    @Column({ type: 'boolean', default: false })
    ban: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
}
