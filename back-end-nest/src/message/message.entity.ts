import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import Participant from '../participant/participant.entity';


@Entity()
class Message {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @Column()
    content: string;

    @Column({ type: 'boolean', default: false })
    button: boolean;

    @Column({ nullable: true, default: null })
    duelId: string;

    @ManyToOne(() => Participant, participant => participant.messages, { eager: false, onDelete: "CASCADE" })
    author: Participant;
}

export default Message;
