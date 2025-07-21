export type User = {
  address: string;
  history: string[];
  isKyc: boolean;
  score: string;
  updatedAt: string | null;
  _id: string;
};

export type UserRanking = {
  users: {
    _id: string;
    address: string;
    score: string;
    name: string;
  }[];
};
