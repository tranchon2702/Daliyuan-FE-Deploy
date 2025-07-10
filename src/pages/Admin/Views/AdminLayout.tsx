import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, LogOut, Newspaper, Settings, Box, GanttChartSquare, Menu, ChevronRight, FileText } from "lucide-react";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-4 py-3 text-dessert-dark transition-all hover:text-dessert-primary dark:text-dessert-cream dark:hover:text-dessert-accent font-medium",
      isActive
        ? "bg-gradient-to-r from-dessert-accent/20 to-dessert-primary/10 shadow-elegant text-dessert-primary dark:bg-dessert-dark/60"
        : "text-zinc-500 hover:bg-dessert-cream/60 dark:text-zinc-400"
    );

  return (
    <div className="flex min-h-screen w-full bg-dessert-cream/60">
      {/* Sidebar */}
      <aside
        className={cn(
          "relative z-20 flex flex-col transition-all duration-300 ease-smooth shadow-elegant bg-white/90 dark:bg-dessert-dark/80 border-r border-dessert-secondary/60 dark:border-dessert-dark/40",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header */}
        <div className={"flex items-center h-[72px] px-6 border-b border-dessert-secondary/60 dark:border-dessert-dark/40 relative"}>
          {/* Avatar admin */}
          <div className={cn("flex items-center gap-3 transition-all duration-300", sidebarCollapsed ? "justify-center w-full" : "")}> 
            <div className={cn(
              "w-9 h-9 flex items-center justify-center font-bold text-xl shadow-glow transition-all duration-300",
              "bg-gradient-to-tr from-[#3a6073] via-[#d76d77] to-[#ffaf7b]",

              "rounded-full border-4 border-white dark:border-dessert-dark",
              sidebarCollapsed ? "mx-auto" : ""
            )}>
              <span className="drop-shadow text-white">A</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-lg text-dessert-primary">Admin Panel</span>
            )}
          </div>
          {/* Collapse button chỉ hiện khi sidebar mở */}
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto flex-shrink-0"
              style={{ marginLeft: 12 }}
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Thu gọn sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
        {/* Nút mở lại sidebar khi đã thu nhỏ: floating button */}
        {sidebarCollapsed && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute z-30 left-full -translate-x-1/2 top-8 w-8 h-8 min-w-0 min-h-0 p-0 bg-[#e74c3c] hover:bg-[#c0392b] border-none shadow-card flex items-center justify-center"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Mở rộng sidebar"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        )}
        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-auto py-4 px-2">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink to="/admin" end className={navLinkClasses}>
                <Home className="h-5 w-5" />
                {!sidebarCollapsed && <span>Trang chủ</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={navLinkClasses}>
                <Box className="h-5 w-5" />
                {!sidebarCollapsed && <span>Quản lý sản phẩm</span>}
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/admin/news" className={navLinkClasses}>
                <Newspaper className="h-5 w-5" />
                {!sidebarCollapsed && <span>Tin tức</span>}
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/admin/system" className={navLinkClasses}>
                <Settings className="h-5 w-5" />
                {!sidebarCollapsed && <span>Hệ thống</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={navLinkClasses}>
                <FileText className="h-5 w-5" />
                {!sidebarCollapsed && <span>Đơn hàng</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* Sidebar Footer */}
        <div className="mt-auto p-4 space-y-2">
          <NavLink
            to="/"
            className={cn(
              "flex items-center gap-2 justify-start rounded-lg px-3 py-2 text-dessert-dark transition-all hover:text-dessert-primary dark:text-dessert-cream dark:hover:text-dessert-accent w-full bg-dessert-cream hover:bg-dessert-secondary/60 dark:bg-dessert-dark dark:hover:bg-dessert-dark/80 border border-dessert-secondary dark:border-dessert-dark/40",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <Home className="h-5 w-5" />
            {!sidebarCollapsed && <span>Về trang chủ</span>}
          </NavLink>
          <Button
            variant="destructive"
            className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </Button>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* AdminHeader sẽ được thêm ở đây */}
        <div id="admin-header-placeholder" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 