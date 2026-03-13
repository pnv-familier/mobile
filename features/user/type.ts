export type Profile = {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    relationship?: string;
    hobbies?: string[];
    dislike?: string[];
    loveLanguage?: string;
    personalityType?: string;
    routine?: string;
    additionalInfo?: Map<string, object>;
}

export interface User {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: 'USER';
    authProvider: 'LOCAL' | 'GOOGLE';
    setup: boolean
}