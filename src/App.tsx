import Auth from "@/components/pages/Auth";
import CreateTask from "@/components/pages/CreateTask";
import Dashboard from "@/components/pages/Dashboard";
import Settings from "@/components/pages/Settings";
import ViewTask from "@/components/pages/ViewTask";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext } from "react";
import Menu from "./components/Menu";
import Admin from "./components/pages/Admin";
import Documentation from "./components/pages/Documentation";
import Facility from "./components/pages/Facility";
import Tasks from "./components/pages/Tasks";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

export interface MenuModeContextType {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

export const MenuModeContext = createContext<MenuModeContextType>({
  mode: "normal",
  setMode: () => {},
});

function App() {
  const [mode, setMode] = useState("normal");
  const value = { mode, setMode };

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <BrowserRouter>
        <MenuModeContext.Provider value={value}>
          <Routes>
            <Route path='/'>
              <Route index element={<Auth />} />
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
                <Route
                  path='/tasks/createTask'
                  element={
                    <Menu>
                      <CreateTask />
                    </Menu>
                  }
                />
                <Route
                  path='/tasks/:taskId'
                  element={
                    <Menu>
                      <ViewTask />
                    </Menu>
                  }
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
        </MenuModeContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
