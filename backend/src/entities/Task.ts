import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum TaskStatus {
    TODO = 'Todo',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum TaskType {
    PERSONAL = 'personal',
    ASSIGNED = 'assigned',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 255 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status!: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskType,
        default: TaskType.PERSONAL,
    })
    type!: TaskType;

    @Column({ type: 'date', nullable: true })
    dueDate!: Date | null;

    @ManyToOne(() => User, (user) => user.createdTasks, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creatorId' })
    creator!: User;

    @Column()
    creatorId!: string;

    @ManyToOne(() => User, (user) => user.assignedTasks, {
        eager: true,
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'assigneeId' })
    assignee!: User | null;

    @Column({ nullable: true })
    assigneeId!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
