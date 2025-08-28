import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Package } from "lucide-react";
import { useGPS } from "@/contexts/GPSContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProductData } from "@/hooks/useProductData";

const GPSTrackingDashboard = () => {
  const { trackings, getActiveTrackings, getCurrentLocation, updateLocation } = useGPS();
  const { t } = useLanguage();
  const { allRentals } = useProductData();

  const activeTrackings = getActiveTrackings();

  const handleUpdateLocation = async (trackingId: string) => {
    const location = await getCurrentLocation();
    if (location) {
      updateLocation(trackingId, location);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getItemName = (itemId: number) => {
    const item = allRentals.find(rental => rental.id === itemId);
    return item?.name || `Item #${itemId}`;
  };

  if (activeTrackings.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            GPS Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No active rentals with GPS tracking
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6" />
        GPS Tracking Dashboard
      </h2>
      
      {activeTrackings.map((tracking) => (
        <Card key={tracking.id} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {getItemName(tracking.itemId)}
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Renter:</span>
                  <span className="text-sm text-muted-foreground">{tracking.userEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Period:</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(tracking.startDate)} - {formatDate(tracking.endDate)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {tracking.currentLocation && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Location:</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      Lat: {tracking.currentLocation.latitude.toFixed(6)}
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      Lng: {tracking.currentLocation.longitude.toFixed(6)}
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      Updated: {new Date(tracking.currentLocation.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpdateLocation(tracking.id)}
                size="sm"
                variant="outline"
              >
                Update Location
              </Button>
              {tracking.currentLocation && (
                <Button 
                  onClick={() => {
                    const { latitude, longitude } = tracking.currentLocation!;
                    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
                  }}
                  size="sm"
                  variant="secondary"
                >
                  View on Map
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GPSTrackingDashboard;
