
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { FileText, Lock, User } from 'lucide-react';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await login(credentials.username, credentials.password);
    
    if (success) {
      toast({
        title: "Hyrje e suksesshme",
        description: "Mirë se vini në sistemin e menaxhimit të dokumenteve!",
      });
    } else {
      toast({
        title: "Gabim në hyrje",
        description: "Përdoruesi ose fjalëkalimi nuk janë të saktë",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sistemi i Kontabilitetit
          </CardTitle>
          <CardDescription>
            Hyr në llogarinë tënde për të menaxhuar dokumentet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Përdoruesi</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Shkruaj përdoruesin"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Fjalëkalimi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Shkruaj fjalëkalimin"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Duke u kyçur...' : 'Kyçu'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo llogaritë:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Admin: <code>admin</code> / <code>123</code></div>
              <div>Klient: <code>klient1</code> / <code>123</code></div>
              <div>Klient: <code>klient2</code> / <code>123</code></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
