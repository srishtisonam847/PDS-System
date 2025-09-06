import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Settings, 
  LogOut, 
  Store, 
  User, 
  Shield,
  Receipt,
  History,
  Bell,
  Users,
  BarChart
} from 'lucide-react';

interface SidebarProps {
  role: 'shop' | 'beneficiary' | 'admin';
  userInfo?: any;
}

export default function Sidebar({ role, userInfo }: SidebarProps) {
  const { logout } = useAuth();

  const roleConfig = {
    shop: {
      icon: Store,
      title: 'Shop Dashboard',
      subtitle: userInfo?.shop?.name || 'Shop Manager',
      navItems: [
        { icon: BarChart3, label: 'Dashboard', active: true },
        { icon: Package, label: 'Inventory' },
        { icon: BarChart, label: 'Reports' },
        { icon: Settings, label: 'Settings' }
      ]
    },
    beneficiary: {
      icon: User,
      title: 'Beneficiary Portal',
      subtitle: userInfo?.name || 'User',
      navItems: [
        { icon: BarChart3, label: 'Dashboard', active: true },
        { icon: Receipt, label: 'My Allocations' },
        { icon: History, label: 'Purchase History' },
        { icon: Bell, label: 'Notifications' }
      ]
    },
    admin: {
      icon: Shield,
      title: 'Admin Panel',
      subtitle: 'District Office',
      navItems: [
        { icon: BarChart3, label: 'Dashboard', active: true },
        { icon: Store, label: 'Manage Shops' },
        { icon: Users, label: 'Beneficiaries' },
        { icon: BarChart, label: 'Analytics' },
        { icon: Settings, label: 'Settings' }
      ]
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="w-64 bg-card shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{config.title}</h2>
            <p className="text-sm text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {config.navItems.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <ItemIcon className="mr-3 h-4 w-4" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
