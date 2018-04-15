export interface Spot {
  _id: string;
  lat: number;
  lon: number;
  ts: number;
  userId: string;
  flashparty?: {
    location: Array<number>,
    participants: Array<string>
  }
}

export interface SpotRequest {
  lat: number;
  lon: number;
  ts: number;
  userId: string;
}