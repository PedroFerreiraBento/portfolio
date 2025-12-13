import type { TeamMember } from "../types/domain";

export const team: TeamMember[] = [
  {
    id: "member-joao",
    name: "João Pereira",
    role: "Engenheiro de Software",
    bio: {
      pt: "Especializado em arquitetura de aplicações web e boas práticas de engenharia.",
      en: "Specialized in web application architecture and software engineering best practices.",
    },
    skills: ["React", "TypeScript", "Arquitetura"],
    photo:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "member-maria",
    name: "Maria Costa",
    role: "Cientista de Dados",
    bio: {
      pt: "Focada em modelos preditivos e experimentação orientada a métricas de negócio.",
      en: "Focused on predictive models and metric-driven experimentation.",
    },
    skills: ["Python", "Machine Learning", "Experimentação"],
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];
