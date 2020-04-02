export interface Tournament {
  _id: string;
  index: number;
  title: string;
  price: number;
  registrationsCount: number;
  isFull: boolean;
  maxPlayers: number;
  day: number;
  startTime: string;
  reward: string;
}
