export interface JobSalaryRange {
  min: number;
  max: number;
  currency: string;
  displayText: string;
}

export interface JobListCard {
  badge: string;
  startedOnText: string;
  cta: string;
}

export interface JobApplicationFormField {
  key: string;
  validation: {
    required: boolean;
  };
}

export interface JobApplicationFormSection {
  title: string;
  fields: JobApplicationFormField[];
}

export interface JobApplicationForm {
  sections: JobApplicationFormSection[];
}

export interface JobConfiguration {
  applicationForm: JobApplicationForm;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'inactive' | 'closed';
  salaryRange: JobSalaryRange;
  listCard: JobListCard;
  configuration?: JobConfiguration;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobListResponse {
  data: Job[];
}

export interface JobDetailResponse {
  data: Job;
}

export interface CreateJobInput {
  slug: string;
  title: string;
  status: 'active' | 'inactive' | 'closed';
  salaryRange: JobSalaryRange;
  listCard: JobListCard;
  configuration?: JobConfiguration;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  id: string;
}

// Snake case types for storage (internal use)
export interface JobSnakeCase {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'inactive' | 'closed';
  salary_range: {
    min: number;
    max: number;
    currency: string;
    display_text: string;
  };
  list_card: {
    badge: string;
    started_on_text: string;
    cta: string;
  };
  configuration?: {
    application_form: {
      sections: {
        title: string;
        fields: {
          key: string;
          validation: {
            required: boolean;
          };
        }[];
      }[];
    };
  };
  created_at?: string;
  updated_at?: string;
}
