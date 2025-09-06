import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { loginSchema, type LoginData } from '@shared/schema';
import { Warehouse, Store, User, Shield } from 'lucide-react';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'shop'
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/login', data);
      return response.json();
    },
    onSuccess: (userData) => {
      login(userData);
      toast({
        title: 'Login Successful',
        description: `Welcome, ${userData.name}!`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate({ ...data, role: selectedRole as any });
  };

  const roleOptions = [
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'beneficiary', label: 'Beneficiary', icon: User },
    { id: 'admin', label: 'Admin', icon: Shield }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Warehouse className="text-2xl text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">PDS Management System</h1>
            <p className="text-muted-foreground">Public Distribution System Portal</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-3">Select Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        className={`flex flex-col items-center p-3 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors ${
                          isSelected ? 'border-primary bg-accent' : 'border-border'
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                        data-testid={`role-${role.id}`}
                      >
                        <Icon className="text-lg mb-1 text-muted-foreground" />
                        <span className="text-xs font-medium">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={!selectedRole || loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@pds.gov / admin123</p>
              <p><strong>Shop:</strong> shop@mainstreet.com / shop123</p>
              <p><strong>Beneficiary:</strong> john@example.com / user123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
