export interface CandidateAttribute {
  key: string;
  label: string;
  value: string;
  order: number;
}

export interface Candidate {
  id: string;
  attributes: CandidateAttribute[];
  jobId: string;
  status?: 'new' | 'in_review' | 'interview' | 'accepted' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateListResponse {
  data: Candidate[];
}

export interface CandidateDetailResponse {
  data: Candidate;
}

export interface CreateCandidateInput {
  attributes: Omit<CandidateAttribute, 'order'>[];
  jobId: string;
  status?: 'new' | 'in_review' | 'interview' | 'accepted' | 'rejected';
}

export interface UpdateCandidateInput {
  id: string;
  attributes?: Omit<CandidateAttribute, 'order'>[];
  status?: 'new' | 'in_review' | 'interview' | 'accepted' | 'rejected';
}

// Snake case types for storage (internal use)
export interface CandidateSnakeCase {
  id: string;
  attributes: CandidateAttribute[];
  job_id: string;
  status?: 'new' | 'in_review' | 'interview' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}
