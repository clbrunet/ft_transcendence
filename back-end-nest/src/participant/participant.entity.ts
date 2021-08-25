import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import  User  from '../user/user.entity';
import  Channel  from '../channel/channel.entity';

@Entity()
@Unique(["user", "channel"])
class Participant {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @ManyToOne(() => User, user => user.participants, { eager: true, onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Channel, channel => channel.participants, { eager: true, onDelete: "CASCADE" })
    channel: Channel;

    @Column({ type: 'boolean', default: false })
    admin: boolean;

    @Column({ type: 'boolean', default: false })
    mute: boolean;

    //@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    //muteDateTime: Date;

    @Column({ type: 'boolean', default: false })
    ban: boolean;

    //@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    banDateTime: Date;
}

export default Participant;