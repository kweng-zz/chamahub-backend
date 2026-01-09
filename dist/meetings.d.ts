export interface Meeting {
    id: string;
    chamaId: string;
    title: string;
    description?: string;
    location: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
    status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    chama?: {
        name: string;
    };
    attendees?: {
        id: string;
        userId: string;
        status: 'invited' | 'attending' | 'declined' | 'absent';
    }[];
}
export interface CreateMeetingDto {
    chamaId: string;
    title: string;
    description?: string;
    location: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
    status?: 'draft' | 'scheduled';
}
export interface UpdateMeetingDto {
    title?: string;
    description?: string;
    location?: string;
    meetingDate?: string;
    startTime?: string;
    endTime?: string;
    status?: 'draft' | 'scheduled' | 'completed' | 'cancelled';
}
export declare const meetingsApi: {
    create(data: CreateMeetingDto, token: string): Promise<Meeting>;
    getByChamaId(chamaId: string, token: string): Promise<Meeting[]>;
    getAll(token: string): Promise<Meeting[]>;
    getById(id: string, token: string): Promise<Meeting>;
    update(id: string, data: UpdateMeetingDto, token: string): Promise<Meeting>;
    delete(id: string, token: string): Promise<void>;
};
