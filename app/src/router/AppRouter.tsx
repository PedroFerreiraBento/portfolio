import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout.tsx";
import { HomePage } from "../pages/HomePage.tsx";
import { ProjectsPage } from "../pages/ProjectsPage.tsx";
import { ProjectDetailPage } from "../pages/ProjectDetailPage.tsx";
import { ServicesPage } from "../pages/ServicesPage.tsx";
import { AboutPage } from "../pages/AboutPage.tsx";
import { ContactPage } from "../pages/ContactPage.tsx";
import { NotFoundPage } from "../pages/NotFoundPage.tsx";

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
          <Route path="sobre" element={<AboutPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
