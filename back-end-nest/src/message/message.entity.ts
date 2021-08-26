import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import Participant from '../participant/participant.entity';

@Entity()
class Message {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @Column()
    public content: string;

    @ManyToOne(() => Participant, participant => participant.messages, { eager: true, onDelete: "CASCADE" })
    author: Participant;
}

export default Message;
