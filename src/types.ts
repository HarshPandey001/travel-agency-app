export type VehicleType = 
  | 'AC Force Urbania (12 Seater)'
  | 'AC Force Traveller (20 Seater)'
  | 'AC Luxury Volvo Coach (30 Seater)'
  | 'AC Deluxe Mini Bus (16 Seater)'
  | '4x4 Offroad Expedition Gypsy';

export type TravelStyle = 
  | 'Adventure & Trekking'
  | 'Nature & Camping'
  | 'Himalayan Escape'
  | 'Culture & Heritage'
  | 'Beach & Coastal Vibes'
  | 'Relaxation & Stargazing'
  | 'Photography & Sunsets'
  | 'Weekend Rush';

export type SeatStatus = 'available' | 'booked' | 'selected' | 'blocked' | 'reserved_female' | 'reserved_male';

export interface SeatInfo {
  id: string;
  seatNumber: number;
  row: number;
  column: number; // 1 to 4 (e.g. Window left, Aisle left, Aisle right, Window right, or Last row)
  isWindow: boolean;
  isAisle: boolean;
  status: SeatStatus;
  bookedBy?: {
    name: string;
    gender: 'male' | 'female' | 'other';
    age?: number;
    city?: string;
    bookingId?: string;
  };
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  mealsIncluded: ('Breakfast' | 'Lunch' | 'Dinner' | 'Evening Tea & Snacks')[];
  stayName?: string;
  stayType?: string;
}

export interface Trip {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  state: string;
  startingLocation: string; // Hub, e.g. "Gorakhpur", "Delhi NCR", "Mumbai", "Bangalore"
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string; // ISO date string YYYY-MM-DD
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  featured?: boolean;
  travelStyle: TravelStyle[];
  
  // Vehicle details
  vehicleType: VehicleType;
  vehicleDetails: {
    name: string;
    isAC: boolean;
    hasPushbackSeats: boolean;
    hasChargingPorts: boolean;
    hasMusicSystem: boolean;
    sanitized: boolean;
    registrationState?: string;
  };
  totalSeats: number;
  seats: SeatInfo[]; // Array of seat objects with row/column layout
  
  // Stays & Meals
  accommodationDetails: {
    hotelName: string;
    roomType: string; // e.g. "Triple/Quad sharing in Premium Riverside Camps & 3-Star Resort"
    amenities: string[];
    images: string[];
  };
  foodDetails: {
    summary: string;
    mealPlan: string;
    vegNonVegAvailable: boolean;
    specialDinnerIncluded?: boolean;
  };
  
  // Experience & Route
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  activities: string[];
  
  // Logistics
  pickupPoints: {
    location: string;
    reportingTime: string;
    googleMapsLandmark: string;
  }[];
  dropPoints: {
    location: string;
    approxTime: string;
  }[];
  
  // Media & Agency
  coverImage: string;
  galleryImages: string[];
  tripCaptain: {
    name: string;
    phone: string;
    bio: string;
    avatar: string;
    experienceYears: number;
    rating: number;
  };
  
  // Demographics preview (privacy preserving)
  coTravelerSnippet?: {
    ageRange: string;
    soloTravelerCount: number;
    pairsCount: number;
    vibes: string[];
  };
  
  // Policies
  cancellationPolicy: string;
  tripRules: string[];
  status: 'published' | 'filling_fast' | 'almost_full' | 'sold_out' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  tripId: string;
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  startingLocation: string;
  pickupPoint: string;
  reportingTime: string;
  seatNumbers: number[];
  
  // Primary traveler details
  primaryTraveler: {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    city: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    dietaryPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Vegan';
    travelerVibes: string[];
    bio?: string;
  };
  
  // Financials
  baseAmount: number;
  discountAmount: number;
  tripInsuranceIncluded: boolean;
  insuranceAmount: number;
  totalAmountPaid: number;
  advancePaymentPercentage?: number;
  remainingBalanceDue?: number;
  paymentMode?: '40% Advance Lock' | '100% Full Payment';
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Pay at Hub' | 'Razorpay Gateway' | 'Razorpay Secure Gateway';
  paymentId: string;
  paymentStatus: 'PAID' | 'REFUNDED' | 'CANCELLED';
  bookingDate: string;
  
  // Status
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  cancellationReason?: string;
  qrCodeValue?: string;
  emailSentStatus?: boolean;
  emailSentTime?: string;
}

export const ADMIN_EMAILS = ['hapa1929@gmail.com', 'mynameisharshji@gmail.com'];
export const ADMIN_EMAIL = 'hapa1929@gmail.com';
export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === clean);
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  bio: string;
  travelStyles: TravelStyle[];
  travelInterests: string[];
  badges: {
    title: string;
    icon: string;
    description: string;
  }[];
  joinedDate: string;
  isAdmin?: boolean;
}

export interface TripReview {
  id: string;
  tripId: string;
  tripTitle: string;
  travelerName: string;
  travelerAvatar: string;
  travelerCity: string;
  rating: number;
  comment: string;
  date: string;
  travelStyle: string;
  photos?: string[];
}

export interface TripAnnouncement {
  id: string;
  tripId: string;
  tripTitle: string;
  title: string;
  message: string;
  date: string;
  urgent: boolean;
  sentBy: string;
}
