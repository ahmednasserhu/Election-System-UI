import { Candidate } from './candidate';
import { Election } from './election';

export interface Result {
  candidates: Candidate[];
  electionId: Election;
}
