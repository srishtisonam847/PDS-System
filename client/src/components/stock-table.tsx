import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StockItem {
  itemType: string;
  quantity: number;
  unit: string;
  lastUpdated: Date;
}

interface Shop {
  id: string;
  name: string;
  stock: Record<string, StockItem>;
}

interface StockTableProps {
  shops: Shop[];
}

export default function StockTable({ shops }: StockTableProps) {
  const getStockStatus = (quantity: number, itemType: string) => {
    if (quantity === 0) return { status: 'critical', color: 'bg-red-500', label: 'Out of Stock' };
    
    const threshold = itemType === 'kerosene' ? 50 : 100;
    if (quantity < threshold) return { status: 'low', color: 'bg-yellow-500', label: 'Low Stock' };
    
    return { status: 'good', color: 'bg-green-500', label: 'Good Stock' };
  };

  const formatLastUpdate = (date: string | Date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const dateObj = new Date(date); // convert string to Date if needed
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    return `${diffInHours} hours ago`;
  };
  

  const getOverallStatus = (shop: Shop) => {
    const items = ['rice', 'wheat', 'sugar', 'kerosene'];
    const statuses = items.map(item => {
      const stockItem = shop.stock[item];
      if (!stockItem) return 'critical';
      return getStockStatus(stockItem.quantity, item).status;
    });

    if (statuses.includes('critical')) return { label: 'Critical', variant: 'destructive' as const };
    if (statuses.includes('low')) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'Good Stock', variant: 'default' as const };
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">All Shops Status</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-accent text-foreground rounded-md hover:bg-accent/80">
              All
            </button>
            <button className="px-3 py-1 text-sm text-muted-foreground rounded-md hover:bg-accent">
              Low Stock
            </button>
            <button className="px-3 py-1 text-sm text-muted-foreground rounded-md hover:bg-accent">
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Shop Name</TableHead>
              <TableHead>Rice (kg)</TableHead>
              <TableHead>Wheat (kg)</TableHead>
              <TableHead>Sugar (kg)</TableHead>
              <TableHead>Kerosene (L)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => {
              const overallStatus = getOverallStatus(shop);
              return (
                <TableRow key={shop.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium" data-testid={`shop-${shop.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {shop.name}
                  </TableCell>
                  {['rice', 'wheat', 'sugar', 'kerosene'].map((item) => {
                    const stockItem = shop.stock[item];
                    const quantity = stockItem?.quantity || 0;
                    const status = getStockStatus(quantity, item);
                    
                    return (
                      <TableCell key={item}>
                        <span className="inline-flex items-center space-x-2">
                          <div className={`w-2 h-2 ${status.color} rounded-full`}></div>
                          <span className={quantity === 0 ? 'text-red-600 font-medium' : ''}>
                            {quantity}
                          </span>
                        </span>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Badge variant={overallStatus.variant}>
                      {overallStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shop.stock.rice ? formatLastUpdate(shop.stock.rice.lastUpdated) : 'N/A'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
