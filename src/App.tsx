import Auth from "@/components/pages/Auth";
import Dashboard from "@/components/pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import Admin from "./components/pages/Admin";
import Documentation from "./components/pages/Documentation";
import Facility from "./components/pages/Facility";
import Tasks from "./components/pages/Tasks";
import Settings from "@/components/pages/Settings";
import ViewTask from "@/components/pages/ViewTask"

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
            <Route path='/tasks'>
              <Route
                index
                element={
                  <Menu>
                    <Tasks />
                  </Menu>
                }
              />
              <Route path="/tasks/:taskId" element={
              <Menu>
                <ViewTask />
              </Menu>}
              />
            </Route>
            <Route
              path='/facility'
              element={
                <Menu>
                  <Facility />
                </Menu>
              }
            />
            <Route
              path='/documentation'
              element={
                <Menu>
                  <Documentation />
                </Menu>
              }
            />
            <Route
              path='/settings'
              element={
                <Menu>
                  <Settings />
                </Menu>
              }
            />
            <Route
              path='/admin'
              element={
                <Menu>
                  <Admin />
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
