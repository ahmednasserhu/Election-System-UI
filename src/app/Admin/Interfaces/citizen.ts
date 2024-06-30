export interface Citizen {
  _id: string;
  ssn: string
  firstName: string;
  lastName: string;
  status: string;
  image: string;
  paginationResults: {
    total: number;
  };
}
