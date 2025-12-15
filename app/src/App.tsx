import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "./i18n";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
