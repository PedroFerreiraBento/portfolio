import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "./i18n";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
