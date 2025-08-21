import React, { createContext, useState } from "react";

export const SidebarCollapseContext = createContext(false);
export const SidebarSetCollapseContext = createContext(null);

const CollapseSidebarProvider = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarCollapseContext.Provider value={collapsed}>
      <SidebarSetCollapseContext.Provider
        //@ts-ignore
        value={setCollapsed}
      >
        {props.children}
      </SidebarSetCollapseContext.Provider>
    </SidebarCollapseContext.Provider>
  );
};
export { CollapseSidebarProvider };
