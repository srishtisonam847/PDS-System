import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface StockCardProps {
  item: string;
  quantity: number;
  unit: string;
  status: 'sufficient' | 'low' | 'empty';
  lastUpdated: string;
  icon?: React.ReactNode;
  allocation?: string;
}

export default function StockCard({ 
  item, 
  quantity, 
  unit, 
  status, 
  lastUpdated, 
  icon,
  allocation 
}: StockCardProps) {
  const statusConfig = {
    sufficient: {
      color: 'bg-green-500',
      text: 'text-green-600',
      label: 'Available'
    },
    low: {
      color: 'bg-yellow-500', 
      text: 'text-yellow-600',
      label: 'Low Stock'
    },
    empty: {
      color: 'bg-red-500',
      text: 'text-red-600', 
      label: 'Out of Stock'
    }
  };

  const config = statusConfig[status];

  return (
    <Card className="shadow-sm border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={`w-12 h-12 ${status === 'sufficient' ? 'bg-green-100' : status === 'low' ? 'bg-yellow-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-medium text-foreground">{item}</h3>
              {allocation && (
                <p className="text-sm text-muted-foreground">{allocation}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 ${config.color} rounded-full`} title={config.label}></div>
            <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
          </div>
        </div>
        
        <p className="text-2xl font-bold text-foreground mb-2" data-testid={`stock-${item.toLowerCase()}`}>
          {quantity} {unit} {status !== 'empty' ? 'in stock' : ''}
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          Last updated {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}
