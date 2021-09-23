import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import { ChannelStatus } from './enum.channelStatus';

import User  from '../user/user.entity';
import Participant from '../participant/participant.entity';

@Entity()
class Channel {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'boolean', default: false })
    direct: boolean ;

    @Column()
    status: ChannelStatus;

    @Column({ nullable: true })
    password: string;

    @ManyToOne(() => User, user => user.channels, { nullable: true, eager: false, onDelete: "CASCADE" })
    owner: User;

    @OneToMany(() => Participant, participant => participant.channel)
    participants: Participant[];
}

export default Channel;
