export interface Job {
  _id: string;
  position: string;
  place: string;
  jobType: string[];
  employmentType: string[];
  experience:string;
  skills: string[];
  companyName: string;
  isBlocked?:boolean;
  created_at?:Date | undefined;
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


export interface Posts {
  _id: string;
  user: {
    avatar: {
      imageUrl: string;
    };
    name: string;
  };
  UserId: string;
  created_at: string; 
  description: string;
  imageUrl: string[]; 
  likes: { UserId: string }[]; 
  comments: Comment[]; 
  isLiked: boolean; 
}