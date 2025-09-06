import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import Sidebar from '@/components/sidebar';
import StockCard from '@/components/stock-card';
import Notification from '@/components/notification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wheat, Package, Fuel } from 'lucide-react';

export default function BeneficiaryDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage] = useState('Stock update: New rice shipment arrived at your ration shop.');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'beneficiary') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  useEffect(() => {
    // Show notification after 3 seconds for demo
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const assignedShopId = user?.assignedShop?.id;

  const { data: stockData = [] } = useQuery({
    queryKey: ['/api/stock', assignedShopId],
    enabled: !!assignedShopId
  });

  const getStockStatus = (quantity: number, itemType: string): 'sufficient' | 'low' | 'empty' => {
    if (quantity === 0) return 'empty';
    const threshold = itemType === 'kerosene' ? 50 : 100;
    return quantity < threshold ? 'low' : 'sufficient';
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return `${diffInHours} hours ago`;
  };

  const stockItems = [
    { 
      type: 'rice', 
      icon: <Wheat className="text-green-600 text-xl" />, 
      unit: 'kg',
      allocation: 'Per month allocation: 5 kg'
    },
    { 
      type: 'wheat', 
      icon: <Package className="text-yellow-600 text-xl" />, 
      unit: 'kg',
      allocation: 'Per month allocation: 3 kg'
    },
    { 
      type: 'sugar', 
      icon: <Package className="text-blue-600 text-xl" />, 
      unit: 'kg',
      allocation: 'Per month allocation: 1 kg'
    },
    { 
      type: 'kerosene', 
      icon: <Fuel className="text-red-600 text-xl" />, 
      unit: 'L',
      allocation: 'Per month allocation: 2 L'
    }
  ];

  const recentUpdates = [
    {
      message: 'Sugar stock replenished',
      time: '1 hour ago',
      type: 'success' as const,
      color: 'green'
    },
    {
      message: 'Wheat stock running low',
      time: '4 hours ago', 
      type: 'warning' as const,
      color: 'yellow'
    },
    {
      message: 'Kerosene out of stock',
      time: '6 hours ago',
      type: 'error' as const,
      color: 'red'
    }
  ];

  if (!isAuthenticated || user?.role !== 'beneficiary') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="beneficiary" userInfo={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Available Stock</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Ration Shop: <span className="font-medium">{user?.assignedShop?.name}</span>
              </span>
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
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Stock Availability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockItems.map((item) => {
                const stockItem = Array.isArray(stockData) ? stockData.find((s: any) => s.itemType === item.type) : null;
                const quantity = stockItem?.quantity || 0;
                const status = getStockStatus(quantity, item.type);
                const lastUpdated = stockItem ? formatLastUpdate(new Date(stockItem.lastUpdated)) : 'Never';

                return (
                  <StockCard
                    key={item.type}
                    item={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    quantity={quantity}
                    unit={item.unit}
                    status={status}
                    lastUpdated={lastUpdated}
                    icon={item.icon}
                    allocation={item.allocation}
                  />
                );
              })}
            </div>

            {/* Recent Updates */}
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <CardTitle>Recent Stock Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        update.color === 'green' ? 'bg-green-50 border-green-200' :
                        update.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          update.color === 'green' ? 'bg-green-500' :
                          update.color === 'yellow' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-foreground">
                          {update.message}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{update.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Notification
        message={notificationMessage}
        show={showNotification}
        onHide={() => setShowNotification(false)}
        type="info"
      />
    </div>
  );
}
