import { Trip, Booking, UserProfile, TripReview, TripAnnouncement } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-901',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@gmail.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  age: 26,
  gender: 'male',
  city: 'Gorakhpur',
  bio: 'Product designer & weekend nomad. Love campfire conversations, mountain coffee, and stargazing.',
  travelStyles: ['Himalayan Escape', 'Adventure & Trekking', 'Photography & Sunsets'],
  travelInterests: ['Cafe Hopping', 'Trekking', 'Bonfire Acoustic Nights', 'Landscape Photography'],
  badges: [
    { title: 'Social Explorer', icon: 'Sparkles', description: 'Traveled on 3+ group agency trips' },
    { title: 'Peak Seeker', icon: 'Mountain', description: 'Conquered 10,000ft+ passes' },
    { title: 'Early Bird', icon: 'Clock', description: 'Always on time at pickup points' }
  ],
  joinedDate: '2025-01-15'
};

const generateInitialSeats = (totalSeats: number, bookedSeatNumbers: { seatNumber: number; name: string; gender: 'male' | 'female'; age: number; city: string }[]) => {
  const seats = [];
  const bookedMap = new Map(bookedSeatNumbers.map(b => [b.seatNumber, b]));

  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / 2);
    const col = (i % 2 === 1) ? 1 : 2;
    const isBooked = bookedMap.has(i);
    const bookedInfo = bookedMap.get(i);

    seats.push({
      id: `seat-${i}`,
      seatNumber: i,
      row,
      column: col,
      isWindow: i % 2 !== 0 || i === totalSeats,
      isAisle: i % 2 === 0,
      status: isBooked ? ('booked' as const) : ('available' as const),
      bookedBy: isBooked && bookedInfo ? {
        name: bookedInfo.name,
        gender: bookedInfo.gender,
        age: bookedInfo.age,
        city: bookedInfo.city,
        bookingId: `BK-DEMO-${i}`
      } : undefined
    });
  }
  return seats;
};

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-manali-01',
    title: 'MANALI & SOLANG SOCIAL EXPEDITION',
    tagline: 'Old Manali vibes, riverside wooden cottages, high mountain passes & acoustic bonfires.',
    destination: 'Manali, Himachal Pradesh',
    state: 'Himachal Pradesh',
    startingLocation: 'Gorakhpur',
    startDate: '2026-09-04',
    endDate: '2026-09-08',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 8999,
    originalPrice: 11499,
    featured: true,
    travelStyle: ['Himalayan Escape', 'Adventure & Trekking', 'Weekend Rush'],
    vehicleType: 'AC Force Traveller (20 Seater)',
    vehicleDetails: {
      name: 'Force Traveller Executive 20-Seater',
      isAC: true,
      hasPushbackSeats: true,
      hasChargingPorts: true,
      hasMusicSystem: true,
      sanitized: true,
      registrationState: 'UP-53 (Gorakhpur Commercial Coach)'
    },
    totalSeats: 20,
    seats: generateInitialSeats(20, [
      { seatNumber: 1, name: 'Kavya Verma', gender: 'female', age: 24, city: 'Lucknow' },
      { seatNumber: 2, name: 'Rohan Gupta', gender: 'male', age: 27, city: 'Gorakhpur' },
      { seatNumber: 3, name: 'Ananya Roy', gender: 'female', age: 25, city: 'Varanasi' },
      { seatNumber: 4, name: 'Siddharth Sen', gender: 'male', age: 28, city: 'Patna' },
      { seatNumber: 5, name: 'Priya Joshi', gender: 'female', age: 23, city: 'Delhi' },
      { seatNumber: 6, name: 'Tanmay Saxena', gender: 'male', age: 26, city: 'Kanpur' },
      { seatNumber: 7, name: 'Neha Singhania', gender: 'female', age: 25, city: 'Gorakhpur' }
    ]),
    accommodationDetails: {
      hotelName: 'The Pine Wood Whispers & Riverside Alpine Camps',
      roomType: 'Triple / Quad sharing (Double sharing upgrade available upon request)',
      amenities: ['24/7 Geyser Hot Water', 'Mountain View Balcony', 'High-Speed Wi-Fi', 'Campfire Lawn', 'In-house Chef'],
      images: [
        'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      ]
    },
    foodDetails: {
      summary: 'Daily Buffet Breakfast & Dinner with Live Himalayan Cookouts',
      mealPlan: 'MAP Plan (Breakfast + Dinner included during stay)',
      vegNonVegAvailable: true,
      specialDinnerIncluded: true
    },
    itinerary: [
      {
        dayNumber: 1,
        title: 'Boarding from Gorakhpur & Overnight Scenic Journey',
        location: 'Gorakhpur -> Chandigarh -> Bilaspur Route',
        description: 'Meet fellow travelers at the designated reporting terminal in Gorakhpur. Icebreaker briefing by our dedicated Trip Captain, luggage loading, and departure in our pushback AC Traveller with custom curated road-trip playlist.',
        highlights: ['Group Meet & Greet', 'Comfortable AC Pushback Drive', 'Midnight Highway Dhaba Halt'],
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        title: 'Arrival in Manali, Check-in & Old Manali Heritage Walk',
        location: 'Old Manali, Hadimba Temple & Cafe Crawl',
        description: 'Wake up to towering pine trees. Check into our riverfront resort, refresh, and head out for an easy heritage walk exploring Manu Temple, Hadimba Shrine, and quirky indie cafes.',
        highlights: ['Riverfront Cottage Check-in', 'Hadimba Forest Stroll', 'Cafe 1947 Live Music Evening'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Pine Wood Whispers Resort'
      },
      {
        dayNumber: 3,
        title: 'Solang Valley Snow Point, Atal Tunnel & Sissu Glaciers',
        location: 'Solang Valley -> Atal Tunnel -> Lahaul Valley',
        description: 'Cross the engineering marvel Atal Tunnel into the dramatically barren Lahaul Valley. Explore frozen waterfalls at Sissu and indulge in group snowball battles & ATV rides.',
        highlights: ['Atal Tunnel Crossing', 'Sissu Waterfall Trek', 'Lahaul Valley Group Photography'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Pine Wood Whispers Resort'
      },
      {
        dayNumber: 4,
        title: 'Jogini Waterfall Hike, Cafe Hopping & Farewell Bonfire',
        location: 'Vashisht -> Jogini Falls -> Riverside Lawn',
        description: 'Moderate hike through apple orchards to Jogini Waterfalls. Return in the evening for a signature WanderVibe acoustic guitar circle, barbecue snacks, and travel trivia.',
        highlights: ['Jogini Waterfall Hike', 'Local Himachali Trout / Veg Delicacy', 'Group Bonfire & Antakshari'],
        mealsIncluded: ['Breakfast', 'Evening Tea & Snacks', 'Dinner'],
        stayName: 'Riverside Alpine Camps'
      },
      {
        dayNumber: 5,
        title: 'Kasol Market Souvenirs & Return Journey to Gorakhpur',
        location: 'Kasol / Kullu -> Gorakhpur Return',
        description: 'Depart after a wholesome breakfast. Quick stopover at Kullu for river rafting and handloom shopping before we cruise back with full camera rolls and lifelong friendships.',
        highlights: ['Kullu White Water Rafting Option', 'Group Photo Ceremony', 'Safe Drop-off at Hub'],
        mealsIncluded: ['Breakfast']
      }
    ],
    inclusions: [
      'Round-trip transportation from Gorakhpur in Sanitized AC Force Traveller',
      'All toll taxes, parking fees, state road tax, driver allowance & fuel',
      '4 Nights accommodation (Resort + Riverside Swiss Tents)',
      '8 Meals (4 Breakfasts + 4 Dinners with Veg/Non-Veg choices)',
      'Full-time certified Agency Trip Captain & First Aid responder',
      'Atal Tunnel & Sissu excursion permits',
      'Evening Bonfire with music equipment',
      'High-res group photos & video highlights'
    ],
    exclusions: [
      'Personal expenses (shopping, tips, laundry)',
      'Any paragliding, skiing, ATV ride or river rafting fees',
      'Lunch expenses on transit days',
      'Anything not explicitly mentioned in inclusions'
    ],
    activities: [
      'Atal Tunnel Snow Excursion',
      'Jogini Waterfall Nature Hike',
      'Cafe Crawl in Old Manali',
      'Acoustic Bonfire & Stargazing',
      'Kullu River Rafting Experience'
    ],
    pickupPoints: [
      {
        location: 'Gorakhpur Railway Station - Main Gate Parking',
        reportingTime: '05:30 PM (Day 1)',
        googleMapsLandmark: 'Opposite Platform 1 VIP Gate, Golghar Link'
      },
      {
        location: 'Kaptanganj Bypass Intersection',
        reportingTime: '06:15 PM (Day 1)',
        googleMapsLandmark: 'National Highway Highway Plaza'
      },
      {
        location: 'Lucknow Transport Nagar Flyover',
        reportingTime: '10:45 PM (Day 1)',
        googleMapsLandmark: 'Metro Pillar 140'
      }
    ],
    dropPoints: [
      { location: 'Lucknow Transport Nagar', approxTime: '06:00 AM' },
      { location: 'Gorakhpur Railway Station Central Parking', approxTime: '11:00 AM' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    tripCaptain: {
      name: 'Vikram "Vicky" Negi',
      phone: '+91 94180 55432',
      bio: 'Mountaineering graduate from NIM with 7+ years leading social group trips across Himachal and Ladakh.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      experienceYears: 7,
      rating: 4.95
    },
    coTravelerSnippet: {
      ageRange: '22 - 33 years',
      soloTravelerCount: 5,
      pairsCount: 1,
      vibes: ['Photography', 'Music Lovers', 'Nature Buffs', 'Storytellers']
    },
    cancellationPolicy: 'Full refund up to 7 days before departure. 50% refund between 7 to 3 days. Free seat transfer to another friend anytime up to 24 hours before trip.',
    tripRules: [
      'Strict zero-tolerance policy against misconduct, harassment, or non-consensual behavior.',
      'Punctuality at all pickup and assembly points is mandatory for group harmony.',
      'Smoking or drinking inside the vehicle is strictly prohibited during transit.',
      'Govt photo ID (Aadhaar / Passport / Driving License) required at boarding.'
    ],
    status: 'filling_fast',
    createdAt: '2026-08-01'
  },
  {
    id: 'trip-kasol-02',
    title: 'KASOL & KHEERGANGA TREK WEEKENDER',
    tagline: 'Parvati Valley pine trails, natural thermal hot springs, starry camps & cafe culture.',
    destination: 'Kasol & Kheerganga, Himachal Pradesh',
    state: 'Himachal Pradesh',
    startingLocation: 'Gorakhpur',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 7499,
    originalPrice: 9999,
    featured: false,
    travelStyle: ['Adventure & Trekking', 'Nature & Camping'],
    vehicleType: 'AC Deluxe Mini Bus (16 Seater)',
    vehicleDetails: {
      name: 'Tata Ultra AC Luxury 16-Seater Coach',
      isAC: true,
      hasPushbackSeats: true,
      hasChargingPorts: true,
      hasMusicSystem: true,
      sanitized: true,
      registrationState: 'UP-53'
    },
    totalSeats: 16,
    seats: generateInitialSeats(16, [
      { seatNumber: 1, name: 'Divya Pandey', gender: 'female', age: 24, city: 'Gorakhpur' },
      { seatNumber: 2, name: 'Akash Dixit', gender: 'male', age: 26, city: 'Deoria' },
      { seatNumber: 3, name: 'Rahul Maurya', gender: 'male', age: 25, city: 'Varanasi' },
      { seatNumber: 4, name: 'Simran Walia', gender: 'female', age: 27, city: 'Delhi' }
    ]),
    accommodationDetails: {
      hotelName: 'Parvati Valley Alpine Riverside Tents & Kheerganga Peak Domes',
      roomType: 'Twin / Triple sharing Weather-proof Alpine Tents with sleeping bags',
      amenities: ['Clean Shared Bathrooms', 'Campfire Circle', 'Hot Mountain Water', 'Cafe on site'],
      images: [
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80'
      ]
    },
    foodDetails: {
      summary: 'Freshly prepared vegetarian & egg meals, Israeli dips, local tea & porridge',
      mealPlan: 'Breakfast & Dinners at camps included',
      vegNonVegAvailable: true
    },
    itinerary: [
      {
        dayNumber: 1,
        title: 'Gorakhpur to Parvati Valley Boarding',
        location: 'Gorakhpur Hub -> Himalayan Highway',
        description: 'Board our luxury mini-coach from Gorakhpur. Introduction games, icebreaker challenges, and smooth highway transit.',
        highlights: ['Intro Sessions', 'Highway Stoppages'],
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        title: 'Arrival in Kasol, Chalal Nature Walk & Israeli Cafes',
        location: 'Kasol Riverside & Chalal Village',
        description: 'Cross the wooden suspension bridge to Chalal village. Relax by Parvati river banks and taste authentic Shakshuka & Falafel.',
        highlights: ['Chalal Suspension Bridge', 'Parvati River Chilling', 'Moon Dance Cafe'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Kasol Riverside Camp'
      },
      {
        dayNumber: 3,
        title: 'Trek from Barshaini to Kheerganga Top',
        location: 'Barshaini -> Rudranag -> Kheerganga Peak (10,000 ft)',
        description: 'Scenic 12 km trail passing gushing waterfalls, wooden bridges, and apple gardens. Reach the summit and take a dip in natural hot water springs.',
        highlights: ['Rudranag Sacred Waterfall', 'Natural Hot Water Springs', 'Top of World Sunset'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Kheerganga Peak Camps'
      },
      {
        dayNumber: 4,
        title: 'Descent Trek to Barshaini, Manikaran Sahib & Return Ride',
        location: 'Kheerganga -> Manikaran Gurudwara -> Gorakhpur',
        description: 'Morning sunrise over snowy peaks. Trek down to Barshaini, visit historic Manikaran Gurudwara for langar, and board return coach.',
        highlights: ['Sunrise Meditation', 'Manikaran Sahib Visit', 'Hot Springs Langar'],
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 5,
        title: 'Arrival Back in Gorakhpur with Memories',
        location: 'Gorakhpur Central Hub',
        description: 'Reach back early morning fresh and ready for the week with a new squad of friends.',
        highlights: ['Trip Reunion WhatsApp Group handover'],
        mealsIncluded: ['Breakfast']
      }
    ],
    inclusions: [
      'Pushback AC Mini Coach from Gorakhpur to Barshaini and back',
      'Trek Leader and local certified mountain guide',
      'Camp stay at Kasol & Kheerganga (sleeping bags & mats provided)',
      '4 Breakfasts and 3 Dinners',
      'Forest entry fee & camping permits'
    ],
    exclusions: ['Pony or porter charges for personal bags', 'Personal cafe bills in Kasol'],
    activities: ['Kheerganga 12km Summit Trek', 'Natural Hot Springs Bath', 'Chalal Riverside Walk', 'Acoustic Jamming'],
    pickupPoints: [
      { location: 'Gorakhpur Railway Station Roundabout', reportingTime: '04:00 PM (Day 1)', googleMapsLandmark: 'Platform 1 gate' },
      { location: 'Basti Toll Plaza', reportingTime: '05:30 PM (Day 1)', googleMapsLandmark: 'NH28 Highway Entry' }
    ],
    dropPoints: [{ location: 'Gorakhpur Station', approxTime: '08:00 AM' }],
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80'
    ],
    tripCaptain: {
      name: 'Rajat Thakur',
      phone: '+91 98160 88712',
      bio: 'Local Kullu valley trekker who knows every hidden trail and cafe secret in Parvati valley.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      experienceYears: 5,
      rating: 4.9
    },
    coTravelerSnippet: {
      ageRange: '20 - 30 years',
      soloTravelerCount: 3,
      pairsCount: 1,
      vibes: ['Trekking Enthusiasts', 'Backpackers', 'Cafe Lovers']
    },
    cancellationPolicy: 'Full refund before 5 days of departure.',
    tripRules: ['Strict safety protocols during high altitude trekking.', 'Follow trek leader instructions on trail.'],
    status: 'published',
    createdAt: '2026-08-05'
  },
  {
    id: 'trip-jaisalmer-03',
    title: 'JAISALMER GOLDEN DUNES & DESERT SAFARI',
    tagline: 'Sam sand dunes, royal fort walks, folk Kalbeliya dances, quad biking & midnight stargazing.',
    destination: 'Jaisalmer, Rajasthan',
    state: 'Rajasthan',
    startingLocation: 'Delhi NCR',
    startDate: '2026-10-02',
    endDate: '2026-10-06',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 10499,
    originalPrice: 13999,
    featured: true,
    travelStyle: ['Culture & Heritage', 'Nature & Camping', 'Photography & Sunsets'],
    vehicleType: 'AC Luxury Volvo Coach (30 Seater)',
    vehicleDetails: {
      name: 'Mercedes-Benz Multi-Axle Luxury AC Coach',
      isAC: true,
      hasPushbackSeats: true,
      hasChargingPorts: true,
      hasMusicSystem: true,
      sanitized: true,
      registrationState: 'DL-01'
    },
    totalSeats: 30,
    seats: generateInitialSeats(30, [
      { seatNumber: 1, name: 'Meera Kapoor', gender: 'female', age: 29, city: 'Delhi' },
      { seatNumber: 2, name: 'Varun Grover', gender: 'male', age: 31, city: 'Gurugram' },
      { seatNumber: 3, name: 'Ankita Sen', gender: 'female', age: 26, city: 'Noida' },
      { seatNumber: 4, name: 'Harshita Goel', gender: 'female', age: 25, city: 'Jaipur' },
      { seatNumber: 5, name: 'Kunal Malhotra', gender: 'male', age: 28, city: 'Chandigarh' }
    ]),
    accommodationDetails: {
      hotelName: 'Heritage Haveli Hotel & Royal Swiss Desert Tents (Sam Dunes)',
      roomType: 'Twin / Triple Sharing Luxury Swiss Tents with attached modern bathrooms',
      amenities: ['Air Cooler / AC Tents', 'Swimming Pool at Haveli', 'Cultural Stage', 'Private Dune Access'],
      images: [
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
      ]
    },
    foodDetails: {
      summary: 'Authentic Rajasthani Thali (Dal Baati Churma, Ker Sangri) + Buffet Breakfasts & Dinners',
      mealPlan: 'MAP Plan (4 Breakfasts + 3 Dinners)',
      vegNonVegAvailable: true,
      specialDinnerIncluded: true
    },
    itinerary: [
      {
        dayNumber: 1,
        title: 'Departure from Delhi / Gurgaon Hub',
        location: 'Delhi -> Bikaner -> Jaisalmer Highway',
        description: 'Assemble at IFFCO Chowk / Dhaula Kuan. Boarding, meet & greet, and smooth luxury cruise on Rajasthan expressways.',
        highlights: ['Expressway Cruise', 'Road-trip Quizzes'],
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        title: 'Arrival in Jaisalmer, Golden Fort & Patwon Ki Haveli',
        location: 'Living Fort of Jaisalmer & Gadisar Lake',
        description: 'Check in to heritage haveli. Visit the historic Sonar Qila (Golden Fort), shoot sunset reflections at Gadisar Lake with boating.',
        highlights: ['Living Fort Heritage Walk', 'Gadisar Lake Sunset Boating', 'Rooftop Cafe Evening'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Desert Pride Haveli'
      },
      {
        dayNumber: 3,
        title: 'Haunted Kuldhara Village, Sam Sand Dunes & Camel Safari',
        location: 'Kuldhara -> Sam Sand Dunes',
        description: 'Explore the abandoned cursed village of Kuldhara. Check in to Swiss Desert Tents at Sam Sand Dunes. Enjoy golden hour camel rides, dune bashing, and Rajasthani folk music.',
        highlights: ['Kuldhara Village Exploration', 'Dune Bashing & Camel Safari', 'Folk Dance & Bonfire'],
        mealsIncluded: ['Breakfast', 'Evening Tea & Snacks', 'Dinner'],
        stayName: 'Royal Thar Desert Resort'
      },
      {
        dayNumber: 4,
        title: 'Longewala Border Post & Tanot Mata Temple',
        location: 'Indo-Pak Border & Tanot Mata',
        description: 'Visit the historic battlefield of Longewala (1971 war hero memorial) and the miraculously unexploded shell site at Tanot Temple.',
        highlights: ['Longewala War Memorial', 'Tanot Mata Temple', 'Desert Sunset Group Shoot'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Royal Thar Desert Resort'
      },
      {
        dayNumber: 5,
        title: 'Morning Dune Walk & Return Cruise to Delhi',
        location: 'Jaisalmer -> Delhi NCR Drop',
        description: 'Capture sunrise shadows over desert ripples before our comfortable return drive to Delhi.',
        highlights: ['Desert Sunrise Photography', 'Safe Drop at Metro Hubs'],
        mealsIncluded: ['Breakfast']
      }
    ],
    inclusions: [
      'Round-trip travel in Luxury Multi-Axle Volvo Coach',
      '2 Nights Haveli Stay + 2 Nights Luxury Swiss Desert Camp',
      'Camel Safari & 4x4 Jeep Dune Bashing Session',
      'Rajasthani Folk Dance & Cultural Performance with Evening Snacks',
      'All breakfasts and lavish dinners',
      'Dedicated Trip Captain & Local Guide'
    ],
    exclusions: ['Monument entrance & camera tickets', 'Quad bike ride charges'],
    activities: ['Dune Bashing & Camel Ride', 'Kuldhara Mystery Tour', 'Longewala Border Visit', 'Acoustic Desert Campfire'],
    pickupPoints: [
      { location: 'Dhaula Kuan Metro Station (Gate 1)', reportingTime: '06:00 PM (Day 1)', googleMapsLandmark: 'Airport Line Exit' },
      { location: 'IFFCO Chowk, Gurugram', reportingTime: '07:00 PM (Day 1)', googleMapsLandmark: 'Under Main Flyover' }
    ],
    dropPoints: [{ location: 'IFFCO Chowk / Dhaula Kuan', approxTime: '08:00 AM' }],
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    tripCaptain: {
      name: 'Samar Pratap Singh',
      phone: '+91 99280 44321',
      bio: 'Rajasthani storyteller & photographer with 60+ desert expeditions conducted.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      experienceYears: 8,
      rating: 4.98
    },
    coTravelerSnippet: {
      ageRange: '23 - 36 years',
      soloTravelerCount: 12,
      pairsCount: 3,
      vibes: ['History Lovers', 'Photographers', 'Desert Adventurers']
    },
    cancellationPolicy: '100% refund up to 7 days before trip date.',
    tripRules: ['Maintain cleanliness at desert campsites and historical monuments.'],
    status: 'filling_fast',
    createdAt: '2026-08-08'
  },
  {
    id: 'trip-gokarna-04',
    title: 'GOKARNA BEACH TREK & DANDELI ADVENTURE',
    tagline: 'Cliffside coastal trails, secret Om beach coves, Kali river white water rafting & bioluminescent waves.',
    destination: 'Gokarna & Dandeli, Karnataka',
    state: 'Karnataka',
    startingLocation: 'Bangalore',
    startDate: '2026-09-25',
    endDate: '2026-09-28',
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 6999,
    originalPrice: 8999,
    featured: false,
    travelStyle: ['Beach & Coastal Vibes', 'Adventure & Trekking', 'Relaxation & Stargazing'],
    vehicleType: 'AC Force Urbania (12 Seater)',
    vehicleDetails: {
      name: 'Force Urbania Premium VIP 12-Seater',
      isAC: true,
      hasPushbackSeats: true,
      hasChargingPorts: true,
      hasMusicSystem: true,
      sanitized: true,
      registrationState: 'KA-01'
    },
    totalSeats: 12,
    seats: generateInitialSeats(12, [
      { seatNumber: 1, name: 'Sreya Nair', gender: 'female', age: 24, city: 'Bangalore' },
      { seatNumber: 2, name: 'Pranav Rao', gender: 'male', age: 27, city: 'Bangalore' },
      { seatNumber: 3, name: 'Kiran Kurup', gender: 'male', age: 28, city: 'Mysore' }
    ]),
    accommodationDetails: {
      hotelName: 'Kudle Ocean Breeze Cottages & Jungle Wilderness Resort Dandeli',
      roomType: 'Twin / Triple Sharing Beachside Wooden Shacks & Jungle Stays',
      amenities: ['Sea View Balconies', 'Swimming Pool in Dandeli', 'Hammock Zone', 'Direct Beach Access'],
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      ]
    },
    foodDetails: {
      summary: 'South Indian & Continental Breakfasts, Coastal Seafood / Veg Dinners',
      mealPlan: 'Breakfasts + 2 Dinners included',
      vegNonVegAvailable: true
    },
    itinerary: [
      {
        dayNumber: 1,
        title: 'Overnight Bangalore Pickup & Coastal Highway Drive',
        location: 'Bangalore Hub -> Tumkur -> Shimoga -> Gokarna',
        description: 'Boarding from Silk Board, Indiranagar and Yeshwantpur. Highway introductions and overnight sleep in comfortable Urbania captain seats.',
        highlights: ['Easy City Pickups', 'Reclining Luxury Seats'],
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        title: 'Gokarna 5-Beach Trek (Kudle -> Om -> Half Moon -> Paradise)',
        location: 'Gokarna Coastal Trail',
        description: 'Trek along scenic cliffs overlooking Arabian sea. Swim at secluded Paradise Beach, boat ride back to Om Beach, and sunset cafe dinner.',
        highlights: ['5-Beach Coastal Trail', 'Cliff Jumping & Swimming', 'Sunset at Namaste Cafe'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayName: 'Kudle Ocean Shacks'
      },
      {
        dayNumber: 3,
        title: 'Dandeli Kali River Rafting & Jungle Campfire',
        location: 'Gokarna -> Dandeli Wilderness',
        description: 'Drive through Western Ghats to Dandeli. Conquer Grade 3 rapids in Kali river white water rafting, try kayaking, and enjoy a jungle night.',
        highlights: ['Kali River White Water Rafting', 'Jungle Kayaking', 'Wildlife Night Sounds'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        stayName: 'Dandeli Wilderness Resort'
      },
      {
        dayNumber: 4,
        title: 'Syntheri Rocks & Return Drive to Bangalore',
        location: 'Dandeli -> Bangalore Return',
        description: 'Explore monolithic Syntheri limestone canyon before heading back to Bangalore.',
        highlights: ['Syntheri Rocks', 'Group Memories exchange'],
        mealsIncluded: ['Breakfast']
      }
    ],
    inclusions: [
      'Force Urbania Luxury Transport from Bangalore & return',
      'Beachside and jungle accommodation (2 Nights)',
      'Kali River Rafting (standard stretch) & Kayaking',
      'Guided 5-Beach Trek with local guide',
      'Buffet meals as per plan'
    ],
    exclusions: ['Personal cafe meals on beach', 'Water sports upgrades'],
    activities: ['5-Beach Cliff Trek', 'Kali River White Water Rafting', 'Jungle Kayaking', 'Beach Volleyball & Bonfire'],
    pickupPoints: [
      { location: 'Silk Board Junction (Udupi Garden side)', reportingTime: '08:30 PM (Day 1)', googleMapsLandmark: 'Metro Pillar 12' },
      { location: 'Indiranagar Metro Station', reportingTime: '09:15 PM (Day 1)', googleMapsLandmark: 'CMH Road Exit' },
      { location: 'Yeshwantpur Govardhan Theatre', reportingTime: '10:00 PM (Day 1)', googleMapsLandmark: 'Near Metro Gate 2' }
    ],
    dropPoints: [{ location: 'Yeshwantpur & Silk Board', approxTime: '06:00 AM' }],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    tripCaptain: {
      name: 'Aditya Gowda',
      phone: '+91 97420 11988',
      bio: 'Coastal trail leader and certified kayak instructor who loves introducing solo travelers to the ocean.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      experienceYears: 6,
      rating: 4.96
    },
    coTravelerSnippet: {
      ageRange: '21 - 32 years',
      soloTravelerCount: 4,
      pairsCount: 1,
      vibes: ['Beach Bums', 'Swimmers', 'Active Adventurers']
    },
    cancellationPolicy: 'Full refund before 4 days of departure.',
    tripRules: ['Life jackets mandatory during all water activities.'],
    status: 'published',
    createdAt: '2026-08-10'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-VIA-8821',
    tripId: 'trip-manali-01',
    tripTitle: 'MANALI & SOLANG SOCIAL EXPEDITION',
    destination: 'Manali, Himachal Pradesh',
    startDate: '2026-09-04',
    endDate: '2026-09-08',
    startingLocation: 'Gorakhpur',
    pickupPoint: 'Gorakhpur Railway Station - Main Gate Parking',
    reportingTime: '05:30 PM (Day 1)',
    seatNumbers: [8],
    primaryTraveler: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98765 43210',
      age: 26,
      gender: 'male',
      city: 'Gorakhpur',
      emergencyContactName: 'Rajesh Sharma',
      emergencyContactPhone: '+91 98765 00000',
      dietaryPreference: 'Vegetarian',
      travelerVibes: ['Photography', 'Music Lovers', 'Nature Buffs'],
      bio: 'Excited for mountain air and meeting new friends!'
    },
    baseAmount: 8999,
    discountAmount: 500,
    tripInsuranceIncluded: true,
    insuranceAmount: 199,
    totalAmountPaid: 8698,
    paymentMethod: 'UPI',
    paymentId: 'UPI-TXN-9021849182',
    paymentStatus: 'PAID',
    bookingDate: '2026-08-15T14:30:00Z',
    status: 'CONFIRMED',
    qrCodeValue: 'WANDER-PASS-BK-VIA-8821-SEAT-8'
  }
];

export const INITIAL_REVIEWS: TripReview[] = [
  {
    id: 'rev-01',
    tripId: 'trip-manali-01',
    tripTitle: 'MANALI & SOLANG SOCIAL EXPEDITION',
    travelerName: 'Pooja Kashyap',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    travelerCity: 'Varanasi',
    rating: 5,
    comment: 'Booked solo for the first time with WanderVibe from Gorakhpur. The AC Traveller was super clean, seats were spacious, and Captain Vicky handled everything like a pro. Made 4 lifelong friends around the campfire!',
    date: '2026-07-28',
    travelStyle: 'Solo Traveler / Mountain Lover'
  },
  {
    id: 'rev-02',
    tripId: 'trip-jaisalmer-03',
    tripTitle: 'JAISALMER GOLDEN DUNES',
    travelerName: 'Devendra Singhal',
    travelerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    travelerCity: 'Delhi',
    rating: 5,
    comment: 'The dune bashing and midnight acoustic session in Sam dunes was otherworldly. Perfect balance of private space and group energy.',
    date: '2026-06-12',
    travelStyle: 'Culture & Photography'
  }
];

export const INITIAL_ANNOUNCEMENTS: TripAnnouncement[] = [
  {
    id: 'ann-01',
    tripId: 'trip-manali-01',
    tripTitle: 'MANALI & SOLANG SOCIAL EXPEDITION',
    title: 'Warm Layers & Packing Checklist Reminder',
    message: 'Night temperatures in Solang and Sissu have dropped to 8°C. Please ensure you pack at least one fleece jacket and sturdy walking shoes. Captain Vicky will initiate the WhatsApp squad group 48 hours prior!',
    date: '2026-08-18',
    urgent: false,
    sentBy: 'Agency Operations Desk'
  }
];
