import { camelizeKeys, snakeCaseKeys } from '@/lib/utils';
import jobMockData from './job.mock.json';
import type {
  CreateJobInput,
  Job,
  JobDetailResponse,
  JobListResponse,
  JobSnakeCase,
  UpdateJobInput,
} from './job.types';

const STORAGE_KEY = 'hiring_dashboard_jobs';

// Helper function to get jobs from localStorage
const getJobsFromStorage = (): Job[] => {
  if (typeof window === 'undefined') {
    return camelizeKeys<Job[]>(jobMockData.data);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data if nothing exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobMockData.data));
    return camelizeKeys<Job[]>(jobMockData.data);
  }

  const parsedData = JSON.parse(stored) as JobSnakeCase[];
  return camelizeKeys<Job[]>(parsedData);
};

// Helper function to save jobs to localStorage
const saveJobsToStorage = (jobs: Job[]): void => {
  if (typeof window === 'undefined') return;
  const snakeCaseJobs = snakeCaseKeys<JobSnakeCase[]>(jobs);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snakeCaseJobs));
};

// Simulate API delay
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Generate unique ID
const generateJobId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `job_${dateStr}_${randomNum}`;
};

/**
 * Get all jobs
 */
export const getJobs = async (): Promise<JobListResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();

  return {
    data: jobs,
  };
};

/**
 * Get job by ID
 */
export const getJobById = async (id: string): Promise<JobDetailResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    throw new Error(`Job with ID ${id} not found`);
  }

  return {
    data: job,
  };
};

/**
 * Get job by slug
 */
export const getJobBySlug = async (
  slug: string
): Promise<JobDetailResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const job = jobs.find((j) => j.slug === slug);

  if (!job) {
    throw new Error(`Job with slug ${slug} not found`);
  }

  return {
    data: job,
  };
};

/**
 * Create new job
 */
export const createJob = async (
  input: CreateJobInput
): Promise<JobDetailResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();

  // Check if slug already exists
  const existingJob = jobs.find((j) => j.slug === input.slug);
  if (existingJob) {
    throw new Error(`Job with slug ${input.slug} already exists`);
  }

  const newJob: Job = {
    ...input,
    id: generateJobId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  saveJobsToStorage(jobs);

  return {
    data: newJob,
  };
};

/**
 * Update existing job
 */
export const updateJob = async (
  input: UpdateJobInput
): Promise<JobDetailResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const index = jobs.findIndex((j) => j.id === input.id);

  if (index === -1) {
    throw new Error(`Job with ID ${input.id} not found`);
  }

  // Check if slug is being changed and if it conflicts
  if (input.slug && input.slug !== jobs[index].slug) {
    const slugExists = jobs.some(
      (j) => j.slug === input.slug && j.id !== input.id
    );
    if (slugExists) {
      throw new Error(`Job with slug ${input.slug} already exists`);
    }
  }

  const updatedJob: Job = {
    ...jobs[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  jobs[index] = updatedJob;
  saveJobsToStorage(jobs);

  return {
    data: updatedJob,
  };
};

/**
 * Delete job
 */
export const deleteJob = async (id: string): Promise<{ success: boolean }> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const index = jobs.findIndex((j) => j.id === id);

  if (index === -1) {
    throw new Error(`Job with ID ${id} not found`);
  }

  jobs.splice(index, 1);
  saveJobsToStorage(jobs);

  return {
    success: true,
  };
};

/**
 * Get jobs by status
 */
export const getJobsByStatus = async (
  status: 'active' | 'inactive' | 'closed'
): Promise<JobListResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const filteredJobs = jobs.filter((j) => j.status === status);

  return {
    data: filteredJobs,
  };
};

/**
 * Search jobs by title
 */
export const searchJobs = async (query: string): Promise<JobListResponse> => {
  await simulateDelay();

  const jobs = getJobsFromStorage();
  const searchQuery = query.toLowerCase();
  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery)
  );

  return {
    data: filteredJobs,
  };
};

/**
 * Reset jobs to initial mock data
 */
export const resetJobsToMock = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobMockData.data));
};

/**
 * Clear all jobs from storage
 */
export const clearJobsStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
