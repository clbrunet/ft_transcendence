import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

enum channel_status {
  public,
  private,
  protected,
}

@Entity({ name: 'channel' })
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    channel_name: string;

    @ManyToOne(() => User, user => user.channels, { eager: true })
    user: User;

    @Column({ type: 'int', default: 0})
    status: channel_status;

    @Column({ type: 'varchar'})
    password: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
}
