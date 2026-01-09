export class UserResponseDto {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}