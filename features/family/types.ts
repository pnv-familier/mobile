export type FamilyStatusResult = 'AUTHENTICATED' | 'UNAUTHENTICATED'
export type CreateFamilyFormData = {
  familyName: string
  description?: string
}

export type FamilyParamsList = {
  FamilyStatus: undefined,
  CreateFamily: undefined,
  InviteMembers: undefined,
  JoinFamily: undefined,
  CreateLoveTask: undefined,
  Root: undefined
}

export interface FamilyResponse {
  id: string
  name: string
  description?: string
}

export interface MyFamilyResponse extends FamilyResponse {
  inviteCode: string
  role: string
  nickname: string
}

export interface FamilyMember {
  id: number;
  name: string;
  role: string;
  avatar?: string;
}
