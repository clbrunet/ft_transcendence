import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { FriendStatus } from './enum.friendStatus';

import User  from '../user/user.entity';


@Entity()
@Unique(["friendOwner", "friend"])
class Friend {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column()
    public status: FriendStatus;

    @ManyToOne(() => User, user => user.friendOwners, { eager: true, onDelete: "CASCADE" })
    friendOwner: User;

    @ManyToOne(() => User, user => user.friends, { eager: true, onDelete: "CASCADE" })
    friend: User;
}

export default Friend;