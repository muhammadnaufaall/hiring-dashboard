import { camelizeKeys, snakeCaseKeys } from '@/lib/utils';
import candidateMockData from './candidate.mock.json';
import type {
  Candidate,
  CandidateDetailResponse,
  CandidateListResponse,
  CandidateSnakeCase,
  CreateCandidateInput,
  UpdateCandidateInput,
} from './candidate.types';

const STORAGE_KEY = 'hiring_dashboard_candidates';

// Helper function to get candidates from localStorage
const getCandidatesFromStorage = (): Candidate[] => {
  if (typeof window === 'undefined') {
    return camelizeKeys<Candidate[]>(candidateMockData.data);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data if nothing exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidateMockData.data));
    return camelizeKeys<Candidate[]>(candidateMockData.data);
  }

  const parsedData = JSON.parse(stored) as CandidateSnakeCase[];
  return camelizeKeys<Candidate[]>(parsedData);
};

// Helper function to save candidates to localStorage
const saveCandidatesToStorage = (candidates: Candidate[]): void => {
  if (typeof window === 'undefined') return;
  const snakeCaseCandidates = snakeCaseKeys<CandidateSnakeCase[]>(candidates);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snakeCaseCandidates));
};

// Simulate API delay
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Generate unique ID
const generateCandidateId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `cand_${dateStr}_${randomNum}`;
};

/**
 * Get all candidates
 */
export const getCandidates = async (): Promise<CandidateListResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();

  return {
    data: candidates,
  };
};

/**
 * Get candidate by ID
 */
export const getCandidateById = async (
  id: string
): Promise<CandidateDetailResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    throw new Error(`Candidate with ID ${id} not found`);
  }

  return {
    data: candidate,
  };
};

/**
 * Get candidates by job ID
 */
export const getCandidatesByJobId = async (
  jobId: string
): Promise<CandidateListResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const filteredCandidates = candidates.filter((c) => c.jobId === jobId);

  return {
    data: filteredCandidates,
  };
};

/**
 * Get candidates by status
 */
export const getCandidatesByStatus = async (
  status: 'new' | 'in_review' | 'interview' | 'accepted' | 'rejected'
): Promise<CandidateListResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const filteredCandidates = candidates.filter((c) => c.status === status);

  return {
    data: filteredCandidates,
  };
};

/**
 * Create new candidate
 */
export const createCandidate = async (
  input: CreateCandidateInput
): Promise<CandidateDetailResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();

  // Add order to attributes
  const attributesWithOrder = input.attributes.map((attr, index) => ({
    ...attr,
    order: index + 1,
  }));

  const newCandidate: Candidate = {
    id: generateCandidateId(),
    attributes: attributesWithOrder,
    jobId: input.jobId,
    status: input.status || 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  candidates.push(newCandidate);
  saveCandidatesToStorage(candidates);

  return {
    data: newCandidate,
  };
};

/**
 * Update existing candidate
 */
export const updateCandidate = async (
  input: UpdateCandidateInput
): Promise<CandidateDetailResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const index = candidates.findIndex((c) => c.id === input.id);

  if (index === -1) {
    throw new Error(`Candidate with ID ${input.id} not found`);
  }

  const updatedCandidate: Candidate = {
    ...candidates[index],
    ...(input.attributes && {
      attributes: input.attributes.map((attr, i) => ({
        ...attr,
        order: i + 1,
      })),
    }),
    ...(input.status && { status: input.status }),
    updatedAt: new Date().toISOString(),
  };

  candidates[index] = updatedCandidate;
  saveCandidatesToStorage(candidates);

  return {
    data: updatedCandidate,
  };
};

/**
 * Delete candidate
 */
export const deleteCandidate = async (
  id: string
): Promise<{ success: boolean }> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const index = candidates.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Candidate with ID ${id} not found`);
  }

  candidates.splice(index, 1);
  saveCandidatesToStorage(candidates);

  return {
    success: true,
  };
};

/**
 * Search candidates by name or email
 */
export const searchCandidates = async (
  query: string
): Promise<CandidateListResponse> => {
  await simulateDelay();

  const candidates = getCandidatesFromStorage();
  const searchQuery = query.toLowerCase();

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName =
      candidate.attributes.find((attr) => attr.key === 'full_name')?.value ||
      '';
    const email =
      candidate.attributes.find((attr) => attr.key === 'email')?.value || '';

    return (
      fullName.toLowerCase().includes(searchQuery) ||
      email.toLowerCase().includes(searchQuery)
    );
  });

  return {
    data: filteredCandidates,
  };
};

/**
 * Reset candidates to initial mock data
 */
export const resetCandidatesToMock = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidateMockData.data));
};

/**
 * Clear all candidates from storage
 */
export const clearCandidatesStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
