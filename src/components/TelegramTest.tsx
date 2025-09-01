import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { testTelegramConnection } from "@/lib/telegram";
import { toast } from "sonner";

const TelegramTest: React.FC = () => {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    
    try {
      const success = await testTelegramConnection();
      
      if (success) {
        toast.success('✅ Telegram connection successful! Check your Telegram chat.');
      } else {
        toast.error('❌ Telegram connection failed. Please check your configuration.');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('❌ Telegram test failed. Please check your configuration.');
    }
    
    setTesting(false);
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleTest}
        disabled={testing}
        variant="outline"
        size="sm"
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        {testing ? 'Testing...' : '🧪 Test Telegram'}
      </Button>
    </div>
  );
};

export default TelegramTest;
