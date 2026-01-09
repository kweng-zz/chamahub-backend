import { Column, 
        CreateDateColumn, 
        Entity, 
        PrimaryGeneratedColumn, 
        UpdateDateColumn } from "typeorm";

        export enum UserRole {
            MEMBER = 'member',
            TREASURER = 'treasurer',
            ADMIN = 'admin'
        }

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    clerkId: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.MEMBER,
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}