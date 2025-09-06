import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import Sidebar from '@/components/sidebar';
import StockTable from '@/components/stock-table';
import ChartComponent from '@/components/chart-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Store, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { shortageData, stockByShopData } from '@/lib/mock-data';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  const { data: shopsData = [] } = useQuery({
    queryKey: ['/api/admin/shops']
  });

  const { data: statsData = {} } = useQuery({
    queryKey: ['/api/admin/stats']
  });

  const stats = [
    {
      title: 'Total Shops',
      value: (statsData as any)?.totalShops || 0,
      icon: Store,
      color: 'text-primary'
    },
    {
      title: 'Active Beneficiaries', 
      value: (statsData as any)?.beneficiaries || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Low Stock Alerts',
      value: (statsData as any)?.lowStockAlerts || 0,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Distribution Rate',
      value: `${(statsData as any)?.distributionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" userInfo={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">District Overview</h1>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search shops..."
                  className="pl-10 pr-4 py-2 w-64"
                  data-testid="input-search-shops"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="shadow-sm border border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            {stat.value}
                          </p>
                        </div>
                        <div className={`w-12 h-12 ${
                          stat.color === 'text-primary' ? 'bg-primary/10' :
                          stat.color === 'text-green-600' ? 'bg-green-100' :
                          'bg-red-100'
                        } rounded-lg flex items-center justify-center`}>
                          <Icon className={`${stat.color} text-xl`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock by Shop Chart */}
              <ChartComponent
                type="bar"
                data={stockByShopData}
                title="Stock Levels by Shop"
                height={300}
              />

              {/* Shortage Distribution Chart */}
              <ChartComponent
                type="pie"
                data={shortageData}
                title="Current Shortages"
                height={300}
              />
            </div>

            {/* All Shops Table */}
            <StockTable shops={Array.isArray(shopsData) ? shopsData : []} />
          </div>
        </main>
      </div>
    </div>
  );
}
