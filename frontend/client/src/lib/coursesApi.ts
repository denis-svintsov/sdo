export type CourseStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface CourseDto {
  id: string;
  title: string;
  description?: string;
  categoryId?: string | null;
  difficulty?: DifficultyLevel | null;
  durationMinutes?: number | null;
  status?: CourseStatus | null;
  tagIds?: string[];
  allowedRoles?: string[];
  allowedDepartmentIds?: string[];
  specializations?: string[];
  instructions?: string | null;
  aggregatorUrl?: string | null;
  coverUrl?: string | null;
  companyCost?: number | null;
  partnerName?: string | null;
  partnerLocation?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProgressSummaryDto {
  userId: string;
  courses: {
    courseId: string;
    courseTitle: string;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
  }[];
}

export interface CertificateDto {
  id: string;
  courseId: string;
  issueDate: string;
  certificateUrl: string;
  hash: string;
}

export interface AssignedCourseDto {
  id: string;
  userId: string;
  courseId: string;
  courseTitle?: string | null;
  courseDescription?: string | null;
  courseCategoryId?: string | null;
  courseDifficulty?: DifficultyLevel | null;
  courseDurationMinutes?: number | null;
  courseStatus?: CourseStatus | null;
  courseCoverUrl?: string | null;
  courseAggregatorUrl?: string | null;
  courseInstructions?: string | null;
  courseSpecializations?: string[];
  courseCompanyCost?: number | null;
  assignedBy?: string | null;
  dueDate?: string | null;
  status?: string | null;
  createdAt?: string | null;
}

const COURSES_API_URL =
  import.meta.env.VITE_COURSES_API_URL ?? "http://localhost:8080";

function buildUrl(path: string, params?: Record<string, string | number | undefined | null>) {
  const url = new URL(path, COURSES_API_URL);
  if (!params) return url.toString();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return (await res.json()) as T;
}

export async function fetchCourses(params?: {
  q?: string;
  categoryId?: string;
  difficulty?: DifficultyLevel;
  status?: CourseStatus;
  tagId?: string;
  specialization?: string;
  page?: number;
  size?: number;
}): Promise<Page<CourseDto>> {
  const url = buildUrl("/courses", params);
  return fetchJson<Page<CourseDto>>(url);
}

export async function fetchRecommendedCourses(params?: {
  page?: number;
  size?: number;
}): Promise<Page<CourseDto>> {
  const url = buildUrl("/courses/recommended", params);
  return fetchJson<Page<CourseDto>>(url);
}

export async function fetchCourse(id: string): Promise<CourseDto> {
  return fetchJson<CourseDto>(buildUrl(`/courses/${id}`));
}

export async function updateCourseSpecialization(id: string, specialization: string): Promise<CourseDto> {
  return fetchJson<CourseDto>(buildUrl(`/courses/${id}/specialization`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ specializations: [specialization] }),
  });
}

export async function fetchAssignedCourses(): Promise<AssignedCourseDto[]> {
  return fetchJson<AssignedCourseDto[]>(buildUrl("/courses/assigned-courses/my"));
}

export async function assignCourse(request: {
  userId: string;
  courseId: string;
  assignedBy: string;
  dueDate?: string;
}) {
  return fetchJson(buildUrl("/courses/assign"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export async function fetchMyProgress(userId: string): Promise<ProgressSummaryDto> {
  return fetchJson<ProgressSummaryDto>(buildUrl("/progress/my"), {
    headers: { "X-User-Id": userId },
  });
}

export async function fetchMyCertificates(userId: string): Promise<CertificateDto[]> {
  return fetchJson<CertificateDto[]>(buildUrl("/certificates/my"), {
    headers: { "X-User-Id": userId },
  });
}

export async function downloadCertificate(id: string, userId: string): Promise<Blob> {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers({ "X-User-Id": userId });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(buildUrl(`/certificates/${id}`), {
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return await res.blob();
}
