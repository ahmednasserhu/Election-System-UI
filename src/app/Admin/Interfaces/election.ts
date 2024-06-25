import { Candidate } from "../Interfaces/candidate";
export interface Election {
  id: number; 
  title: string;
  description: string;
  startdate: string; 
  enddate: string; 
  candidates: Candidate[];
  totalVotes: number;
}
