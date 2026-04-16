import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Task } from './Task';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true, length: 100 })
    email!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ select: false }) // Never return password in queries
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Task, (task) => task.creator)
    createdTasks!: Task[];

    @OneToMany(() => Task, (task) => task.assignee)
    assignedTasks!: Task[];
}
