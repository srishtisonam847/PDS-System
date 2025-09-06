import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { stockUpdateSchema, type StockUpdateData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/sidebar';
import StockCard from '@/components/stock-card';
import ChartComponent from '@/components/chart-component';
import Notification from '@/components/notification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wheat, Droplets, Package, Fuel } from 'lucide-react';
import { stockTrendData } from '@/lib/mock-data';

export default function ShopDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'shop') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  const form = useForm<StockUpdateData>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      rice: undefined,
      wheat: undefined,
      sugar: undefined,
      kerosene: undefined
    }
  });

  const { data: stockData = [], isLoading } = useQuery({
    queryKey: ['/api/stock', user?.shopId],
    enabled: !!user?.shopId
  });

  const updateStockMutation = useMutation({
    mutationFn: async (data: StockUpdateData) => {
      const response = await apiRequest('POST', `/api/stock/${user?.shopId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stock', user?.shopId] });
      toast({
        title: 'Stock Updated',
        description: 'Stock levels have been updated successfully!'
      });
      setNotificationMessage('Stock levels have been updated successfully!');
      setShowNotification(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update stock',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: StockUpdateData) => {
    // Filter out undefined values
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof StockUpdateData] = value;
      }
      return acc;
    }, {} as StockUpdateData);

    if (Object.keys(filteredData).length === 0) {
      toast({
        title: 'No Updates',
        description: 'Please enter at least one stock quantity to update.',
        variant: 'destructive'
      });
      return;
    }

    updateStockMutation.mutate(filteredData);
  };

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
    { type: 'rice', icon: <Wheat className="text-green-600 text-xl" />, unit: 'kg' },
    { type: 'wheat', icon: <Package className="text-yellow-600 text-xl" />, unit: 'kg' },
    { type: 'sugar', icon: <Package className="text-blue-600 text-xl" />, unit: 'kg' },
    { type: 'kerosene', icon: <Fuel className="text-red-600 text-xl" />, unit: 'L' }
  ];

  if (!isAuthenticated || user?.role !== 'shop') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="shop" userInfo={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
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
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stock Update Form */}
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <CardTitle>Update Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stockItems.map((item) => (
                        <FormField
                          key={item.type}
                          control={form.control}
                          name={item.type as keyof StockUpdateData}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                {item.type} ({item.unit})
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter quantity"
                                  min="0"
                                  data-testid={`input-${item.type}`}
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={updateStockMutation.isPending}
                      data-testid="button-update-stock"
                    >
                      {updateStockMutation.isPending ? 'Updating...' : 'Update Stock'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Current Stock Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  />
                );
              })}
            </div>

            {/* Stock Trend Chart */}
            <ChartComponent
              type="line"
              data={stockTrendData.labels.map((date, index) => ({
                date,
                rice: stockTrendData.datasets[0].data[index],
                wheat: stockTrendData.datasets[1].data[index],
                sugar: stockTrendData.datasets[2].data[index],
                kerosene: stockTrendData.datasets[3].data[index]
              }))}
              title="Stock Trend (Last 7 Days)"
              height={300}
            />
          </div>
        </main>
      </div>

      <Notification
        message={notificationMessage}
        show={showNotification}
        onHide={() => setShowNotification(false)}
        type="success"
      />
    </div>
  );
}
