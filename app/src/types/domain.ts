export type Locale = "pt" | "en";

export type LocalizedString = {
  pt: string;
  en: string;
};

export type CategoryId = string;
export type TechId = string;
export type ProjectId = string;
export type ServiceId = string;
export type TestimonialId = string;
export type TeamMemberId = string;

export type TechType =
  | "frontend"
  | "backend"
  | "data-science"
  | "data-engineering"
  | "mlops"
  | "devops"
  | "design";

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
}

export interface Tech {
  id: TechId;
  name: string;
  type: TechType;
  icon?: string;
}

export type ProjectStatus = "interno" | "poc" | "em-producao";

export interface ProjectResultMetric {
  value?: number;
  unit?: string;
}

export interface Project {
  id: ProjectId;
  slug: string;
  categoryIds: CategoryId[];
  results: ProjectResultMetric[];
  techIds: TechId[];
  duration?: string;
  year?: number;
  status?: ProjectStatus;
  highlight?: boolean;
  thumbnail?: string;
  gallery?: string[];
}

export interface Service {
  id: ServiceId;
  slug: string;
  thumbnail?: string;
  techIds?: TechId[];
  relatedProjectIds?: ProjectId[];
}

export interface Testimonial {
  id: TestimonialId;
  authorName: string;
  authorRole: string;
  company?: string;
  quote: LocalizedString;
  relatedProjectId?: ProjectId;
}

export interface TeamMember {
  id: TeamMemberId;
  name: string;
  role: string;
  bio: LocalizedString;
  photo?: string;
  skills?: string[];
}

export type BlogPostId = string;

export interface BlogPost {
  id: BlogPostId;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  authorId: TeamMemberId;
  date: string; // ISO date
  readTime: number; // minutes
  imageUrl?: string;
  categoryIds: CategoryId[];
}
