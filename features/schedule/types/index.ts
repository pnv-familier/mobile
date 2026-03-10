export interface FamilyEvent {
  eventId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  creator: {
    userId: string;
    fullName: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}
