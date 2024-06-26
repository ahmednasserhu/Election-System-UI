import { Candidate } from '../Interfaces/candidate';
export interface Election {
  _id: string; 
  title: string;
  description: string;
  startdate: string;
  enddate: string;
  candidates: Candidate[];
  totalVotes: number;
}
