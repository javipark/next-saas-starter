export type User = {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type Team = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeProductId: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
};

// ... (define other types as needed)

export type ActivityType = 'SIGN_IN' | 'SIGN_OUT' | 'SIGN_UP' | 'UPDATE_PASSWORD' | 'DELETE_ACCOUNT' | 'UPDATE_ACCOUNT' | 'CREATE_TEAM' | 'REMOVE_TEAM_MEMBER' | 'INVITE_TEAM_MEMBER' | 'ACCEPT_INVITATION';
