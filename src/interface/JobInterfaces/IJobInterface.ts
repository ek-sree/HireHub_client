export interface Job {
  _id: string;
  position: string;
  place: string;
  jobType: string[];
  employmentType: string[];
  skills: string[];
  companyName: string;
  applications?: {
    status: string;
  }[];
}
