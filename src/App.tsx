import Auth from "@/components/pages/Auth";
import Dashboard from "@/components/pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route path='/login' element={<Auth />} />
            <Route
              path='/dashboard'
              element={
                <Menu>
                  <Dashboard />
                </Menu>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
