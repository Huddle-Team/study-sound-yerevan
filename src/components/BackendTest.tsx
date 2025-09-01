import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkBackendHealth, testBackendConnection } from "@/lib/api";
import { toast } from "sonner";

const BackendTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('unknown');
  const [telegramStatus, setTelegramStatus] = useState<string>('unknown');
  const [isLoading, setIsLoading] = useState(false);

  const handleHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await checkBackendHealth();
      if (result.success) {
        setHealthStatus('healthy');
        toast.success('Backend is running!');
      }
    } catch (error) {
      setHealthStatus('error');
      toast.error('Backend connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramTest = async () => {
    setIsLoading(true);
    try {
      const result = await testBackendConnection();
      if (result.success) {
        setTelegramStatus('working');
        toast.success('Telegram integration working!');
      }
    } catch (error) {
      setTelegramStatus('error');
      toast.error('Telegram test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'working':
        return <Badge variant="outline" className="bg-green-100 text-green-800">✅ Working</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800">❌ Error</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">❓ Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔧 Backend API Test</CardTitle>
        <CardDescription>Test backend connection and Telegram integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Backend Health:</span>
          {getStatusBadge(healthStatus)}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Telegram Bot:</span>
          {getStatusBadge(telegramStatus)}
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleHealthCheck} 
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            Test Backend Health
          </Button>
          
          <Button 
            onClick={handleTelegramTest} 
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            Test Telegram Integration
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Backend URL: {import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendTest;
