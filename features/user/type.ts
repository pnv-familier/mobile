export type Profile = {
    hobbies: string[],
    dislike: string[],
    loveLanguage: string,
    personalityType: string,
    routine: string,
    additionalInfo: Map<string, object>
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: 'USER';
    authProvider: 'LOCAL' | 'GOOGLE';
    setup: boolean
}