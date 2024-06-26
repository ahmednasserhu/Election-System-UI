export interface Citizen {
    _id: string;
    firstName: string;
    lastName:string;
    status: string;
    paginationResults: {
        total: number;
      };
}
