import { memo } from 'react';

// No longer push agent-specific sidebar content via NavPanelPortal.
// The BridgePointSidebar falls back to <SidebarContent /> (all conversations)
// when no portal is active, giving a seamless workspace feel.
const Sidebar = memo(() => {
  return null;
});

Sidebar.displayName = 'ChatSidebar';

export default Sidebar;
