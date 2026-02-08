import { lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout.tsx";

const HomePage = lazy(() =>
  import("../pages/HomePage.tsx").then((module) => ({
    default: module.HomePage,
  }))
);

const ProjectsPage = lazy(() =>
  import("../pages/ProjectsPage.tsx").then((module) => ({
    default: module.ProjectsPage,
  }))
);

const ProjectDetailPage = lazy(() =>
  import("../pages/ProjectDetailPage.tsx").then((module) => ({
    default: module.ProjectDetailPage,
  }))
);

const ServicesPage = lazy(() =>
  import("../pages/ServicesPage.tsx").then((module) => ({
    default: module.ServicesPage,
  }))
);

const AboutPage = lazy(() =>
  import("../pages/AboutPage.tsx").then((module) => ({
    default: module.AboutPage,
  }))
);

const ContactPage = lazy(() =>
  import("../pages/ContactPage.tsx").then((module) => ({
    default: module.ContactPage,
  }))
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage.tsx").then((module) => ({
    default: module.NotFoundPage,
  }))
);

const BlogPage = lazy(() =>
  import("../pages/BlogPage.tsx").then((module) => ({
    default: module.BlogPage,
  }))
);

const BlogPostPage = lazy(() =>
  import("../pages/BlogPostPage.tsx").then((module) => ({
    default: module.BlogPostPage,
  }))
);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
}

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projetos" element={<ProjectsPage />} />
          <Route path="projetos/:slug" element={<ProjectDetailPage />} />
          <Route path="servicos" element={<ServicesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
