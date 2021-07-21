import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Participant } from './participant.entity';

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

    @ManyToOne(() => User, user => user.channels, { eager: false, onDelete: "CASCADE" })
    owner: User;

    @Column({ type: 'varchar', unique: true })
    owner_display_name: string;

    @Column({ type: 'varchar', unique: true })
    owner_id: string;

    @Column({ type: 'int' })
    status: channel_status;

    @Column({ type: 'varchar' })
    password: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @OneToMany(() => Participant, participant => participant.channel)
    participants: Participant[];
}
