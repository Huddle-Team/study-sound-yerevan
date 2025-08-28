import React, { createContext, useContext, useState, useEffect } from 'react';

interface GPSLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RentalTracking {
  id: string;
  itemId: number;
  userEmail: string;
  startDate: string;
  endDate: string;
  currentLocation?: GPSLocation;
  isActive: boolean;
}

interface GPSContextType {
  trackings: RentalTracking[];
  addTracking: (tracking: Omit<RentalTracking, 'id'>) => void;
  updateLocation: (trackingId: string, location: GPSLocation) => void;
  getActiveTrackings: () => RentalTracking[];
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<GPSLocation | null>;
}

const GPSContext = createContext<GPSContextType | undefined>(undefined);

export const GPSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackings, setTrackings] = useState<RentalTracking[]>([]);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    // Load trackings from localStorage
    const savedTrackings = localStorage.getItem('gpsTrackings');
    if (savedTrackings) {
      setTrackings(JSON.parse(savedTrackings));
    }
  }, []);

  useEffect(() => {
    // Save trackings to localStorage
    localStorage.setItem('gpsTrackings', JSON.stringify(trackings));
  }, [trackings]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') {
        setLocationPermission(true);
        return true;
      } else if (permission.state === 'prompt') {
        // Request permission
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationPermission(true);
              resolve(true);
            },
            () => {
              setLocationPermission(false);
              resolve(false);
            }
          );
        });
      } else {
        setLocationPermission(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission(false);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<GPSLocation | null> => {
    if (!locationPermission) {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute
        }
      );
    });
  };

  const addTracking = (tracking: Omit<RentalTracking, 'id'>) => {
    const newTracking: RentalTracking = {
      ...tracking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setTrackings(prev => [...prev, newTracking]);
  };

  const updateLocation = (trackingId: string, location: GPSLocation) => {
    setTrackings(prev =>
      prev.map(tracking =>
        tracking.id === trackingId
          ? { ...tracking, currentLocation: location }
          : tracking
      )
    );
  };

  const getActiveTrackings = () => {
    const now = new Date().toISOString();
    return trackings.filter(
      tracking => tracking.isActive && tracking.endDate > now
    );
  };

  const value = {
    trackings,
    addTracking,
    updateLocation,
    getActiveTrackings,
    requestLocationPermission,
    getCurrentLocation,
  };

  return (
    <GPSContext.Provider value={value}>
      {children}
    </GPSContext.Provider>
  );
};

export const useGPS = () => {
  const context = useContext(GPSContext);
  if (!context) {
    throw new Error('useGPS must be used within a GPSProvider');
  }
  return context;
};
