export interface FamilyEvent {
  eventId: number;
  title: string;
  description: string;
  startTime: string | number[];
  endTime: string | number[];
  location?: string;
  creator: {
    userId: string;
    fullName: string;
    avatarUrl: string;
  };
  createdAt: string | number[];
  participantIds: string[];
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  participantIds?: string[];
}
