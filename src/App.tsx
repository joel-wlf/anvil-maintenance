import Auth from "@/components/pages/Auth";
import Dashboard from "@/components/pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route path='/login' element={<Auth />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
