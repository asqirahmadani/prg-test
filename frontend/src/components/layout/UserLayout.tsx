import { SidebarProvider } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";
import { LucideLayoutDashboard } from "lucide-react";
import { NavUser } from "../user/NavUser";
import { Separator } from "../ui/separator";
import Logo from "../../assets/logo.svg";
import { Link, Outlet, useLocation } from "react-router";

const navMenus = [
  {
    title: "PerdinKu",
    url: "/user/dashboard",
    icon: LucideLayoutDashboard,
  },
];

export const UserLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);
  return (
    <>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
            } as React.CSSProperties
          }
        >
          <Sidebar
            variant="inset"
            collapsible="offcanvas"
            className="border-r border-slate-200/60"
          >
            <SidebarHeader className="px-4 py-5 border-b border-slate-100">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="h-auto hover:bg-transparent active:bg-transparent focus-visible:ring-0 p-0"
                  >
                    <Link to="/" className="flex items-center gap-2">
                      <img
                        className="w-32 object-contain"
                        src={Logo}
                        alt="Hewan Hewan"
                      />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
              <SidebarGroup className="p-0">
                <SidebarGroupLabel className="px-2 mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Menu
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-0.5">
                    {navMenus.map((item) => {
                      const isActive = currentPath === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={location.pathname === item.url}
                            className={`
                          group relative h-10 rounded-lg px-3 transition-all duration-150
                          ${
                            isActive
                              ? "bg-blue-600! text-white! shadow-sm shadow-blue-200 hover:bg-blue-700 hover:text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }
                        `}
                          >
                            <Link
                              to={item.url}
                              className="flex items-center gap-3 w-full"
                            >
                              <item.icon
                                className={`h-4 w-4 shrink-0 transition-colors ${
                                  isActive
                                    ? "text-white"
                                    : "text-slate-400 group-hover:text-slate-600"
                                }`}
                              />
                              <span
                                className={`text-sm leading-none ${
                                  isActive ? "font-semibold" : "font-medium"
                                }`}
                              >
                                {item.title}
                              </span>
                              {isActive && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 px-3 py-3">
              <NavUser />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="bg-sidebar-inset flex flex-col m-0! p-0! rounded-none!">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-white border-slate-200/70 px-4 lg:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100" />
                <Separator
                  orientation="vertical"
                  className="mx-1 data-[orientation=vertical]:h-4 bg-slate-200"
                />
                <h1 className="text-lg font-semibold text-blue-950 truncate">
                  {navMenus.filter((item) => item.url == currentPath)[0].title}
                </h1>
              </div>
            </header>

            <main className="flex flex-col flex-1 p-6 lg:p-8">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <Outlet />
                </div>
              </div>
            </main>

            <div className="flex flex-1 flex-col"></div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};
