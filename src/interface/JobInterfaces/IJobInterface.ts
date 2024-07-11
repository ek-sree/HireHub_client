export interface Job {
  _id: string;
  position: string;
  place: string;
  jobType: string[];
  employmentType: string[];
  experience:string;
  skills: string[];
  companyName: string;
  created_at?:Date;
  applications?: {
    status: string;
  }[];
}


export interface Candidate {
  id: string;
  name: string;
  profilePhoto: string;
  email: string;
  phone: string;
  resume: string;
}