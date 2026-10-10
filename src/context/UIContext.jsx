import { createContext, useContext, useState } from 'react';
const Ctx = createContext(null);
export const useUI = () => useContext(Ctx);
export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <Ctx.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</Ctx.Provider>;
}
