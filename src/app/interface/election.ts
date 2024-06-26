import { Candidate } from './candidate';
export interface Election {
  candidates: Candidate[];
  createdAt: string;
  description: string;
  enddate: string;
  startdate: string;
  title: string;
  totalVotes: number;
  updatedAt: string;
  __v: number;
  _id: string;
}
