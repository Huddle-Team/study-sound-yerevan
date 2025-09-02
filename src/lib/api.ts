// Backend API integration for SpyTech booking system
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface BookingData {
  fullName: string;
  phoneNumber: string;
  selectedActionType: 'rent' | 'buy';
  selectedRentItem?: string;
  selectedSaleItem?: string;
  productName?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
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
    console.log('Sending booking data to backend:', bookingData);

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
