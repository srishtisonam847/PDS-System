import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  show: boolean;
  onHide: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export default function Notification({ message, show, onHide, type = 'info' }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        onHide();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onHide]);

  const typeConfig = {
    info: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
    success: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'text-yellow-600' },
    error: { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' }
  };

  const config = typeConfig[type];

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-transform duration-300 ease-in-out ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className="max-w-sm shadow-lg border border-border">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 ${config.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Bell className={`h-4 w-4 ${config.icon}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Stock Updated</h4>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground ml-2 h-6 w-6 p-0"
              onClick={onHide}
              data-testid="button-close-notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
