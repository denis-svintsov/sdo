import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  Train
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Дашборд", href: "/" },
    { icon: BookOpen, label: "Назначенные курсы", href: "/catalog" },
    { icon: CheckSquare, label: "Мой выбор", href: "/selection" },
    { icon: Calendar, label: "Расписание", href: "/calendar" },
    { icon: MessageSquare, label: "Чаты", href: "/chat" },
    { icon: FileText, label: "Сертификаты", href: "/certificates" },
  ];

  const adminItems = [
    { icon: Settings, label: "Администрирование", href: "/admin" },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Train className="h-6 w-6" />
          <span>СДО</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </Link>
          ))}

          <div className="my-4 border-t px-4 pt-4 text-xs font-semibold uppercase text-muted-foreground">
            Администратор
          </div>
          
          {adminItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <Link href="/auth">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </Link>
      </div>
    </div>
  );
}
