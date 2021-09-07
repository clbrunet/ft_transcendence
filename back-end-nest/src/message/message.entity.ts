import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import Participant from '../participant/participant.entity';

import { MessageStatus } from './enum.messageStatus';


@Entity()
class Message {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @Column()
    public content: string;

    @Column()
    public status: MessageStatus;

    @ManyToOne(() => Participant, participant => participant.messages, { eager: false, onDelete: "CASCADE" })
    author: Participant;
}

export default Message;
