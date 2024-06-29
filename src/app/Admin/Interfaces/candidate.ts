import { Election } from "./election";

export interface Candidate {
  _id: string;
  citizenId: string;
  electionId: string;
  election: Election;
  party: string;
  brief: string;
  criminalRecord: string;
  logoName: string;
  logoImage: string;
  status: string;
  requestedAt: string;
  paginationResults: {
    total: number;
  };
}
