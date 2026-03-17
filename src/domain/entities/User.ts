export interface User {
  id: string;
  username: string;
  avatarEmoji: string;
  responsesGiven: number;
  helpfulVotes: number;
  badges: string[];
  joinedAt: Date;
}
