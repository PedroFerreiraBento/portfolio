import type { Tech } from "../types/domain";

export const techs: Tech[] = [
  { id: "react", name: "React", type: "frontend", icon: "react" },
  {
    id: "typescript",
    name: "TypeScript",
    type: "frontend",
    icon: "typescript",
  },
  { id: "python", name: "Python", type: "data-science", icon: "python" },
  { id: "fastapi", name: "FastAPI", type: "backend", icon: "fastapi" },
  { id: "dbt", name: "dbt", type: "data-engineering", icon: "dbt" },
  { id: "airflow", name: "Apache Airflow", type: "mlops", icon: "airflow" },
];
