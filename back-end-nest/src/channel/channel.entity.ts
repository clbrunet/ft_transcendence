import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import { ChannelStatus } from './enum.channelStatus';

import User  from '../user/user.entity';
import Participant from '../participant/participant.entity';

@Entity()
class Channel {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ unique: true })
    public channelName: string;

    @Column()
    public channelStatus: ChannelStatus;

    @Column({ nullable: true })
    public password: string;

    @ManyToOne(() => User, user => user.channels, { eager: true, onDelete: "CASCADE" })
    owner: User;

    @OneToMany(() => Participant, participant => participant.channel)
    participants: Participant[];
}

export default Channel;
