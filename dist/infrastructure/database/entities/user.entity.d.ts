export declare enum UserRole {
    MEMBER = "member",
    TREASURER = "treasurer",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profileImage: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
