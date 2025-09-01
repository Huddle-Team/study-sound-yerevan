// Backend API integration for SpyTech booking system
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface BookingData {
  fullName: string;
  phoneNumber: string;
  selectedActionType: 'rent' | 'buy';
  selectedRentItem?: string;
  selectedSaleItem?: string;
  productName?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  messageId?: number;
}

// Submit booking request to backend API
export const submitBooking = async (bookingData: BookingData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

// Test backend connection
export const testBackendConnection = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/telegram/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error testing backend:', error);
    throw error;
  }
};

// Health check
export const checkBackendHealth = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error checking backend health:', error);
    throw error;
  }
};
