export type UserProfile = {
  username: string;
};

export type ActiveUserProfile = UserProfile & {
  email: string;
  phone: string;
};
