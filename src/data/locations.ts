export interface CityLocation {
  city: string;
  defaultLat: number;
  defaultLng: number;
  zoom: number;
  wards: {
    wardNo: string;
    name: string;
    lat: number;
    lng: number;
  }[];
}

export const INDIAN_CITIES: CityLocation[] = [
  {
    city: 'Hyderabad',
    defaultLat: 17.3850,
    defaultLng: 78.4867,
    zoom: 12,
    wards: [
      { wardNo: 'Ward 92', name: 'Banjara Hills', lat: 17.4156, lng: 78.4350 },
      { wardNo: 'Ward 94', name: 'Jubilee Hills', lat: 17.4325, lng: 78.4072 },
      { wardNo: 'Ward 105', name: 'Madhapur / HITEC City', lat: 17.4483, lng: 78.3915 },
      { wardNo: 'Ward 106', name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
      { wardNo: 'Ward 65', name: 'Charminar / Old City', lat: 17.3616, lng: 78.4747 },
      { wardNo: 'Ward 78', name: 'Kukatpally Housing Board', lat: 17.4875, lng: 78.3953 },
      { wardNo: 'Ward 88', name: 'Ameerpet / SR Nagar', lat: 17.4375, lng: 78.4482 }
    ]
  },
  {
    city: 'Bengaluru',
    defaultLat: 12.9716,
    defaultLng: 77.5946,
    zoom: 12,
    wards: [
      { wardNo: 'Ward 151', name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
      { wardNo: 'Ward 112', name: 'Indiranagar 100 Feet Rd', lat: 12.9784, lng: 77.6408 },
      { wardNo: 'Ward 85', name: 'Whitefield Main Rd', lat: 12.9698, lng: 77.7500 },
      { wardNo: 'Ward 174', name: 'HSR Layout Sector 1', lat: 12.9121, lng: 77.6446 },
      { wardNo: 'Ward 146', name: 'Jayanagar 4th Block', lat: 12.9250, lng: 77.5838 }
    ]
  },
  {
    city: 'Delhi',
    defaultLat: 28.6139,
    defaultLng: 77.2090,
    zoom: 12,
    wards: [
      { wardNo: 'Ward 58', name: 'Lajpat Nagar Central Market', lat: 28.5677, lng: 77.2433 },
      { wardNo: 'Ward 45', name: 'Connaught Place Outer Circle', lat: 28.6315, lng: 77.2167 },
      { wardNo: 'Ward 102', name: 'Rohini Sector 7', lat: 28.7159, lng: 77.1120 },
      { wardNo: 'Ward 72', name: 'Karol Bagh Arya Samaj Rd', lat: 28.6514, lng: 77.1907 }
    ]
  },
  {
    city: 'Pune',
    defaultLat: 18.5204,
    defaultLng: 73.8567,
    zoom: 12,
    wards: [
      { wardNo: 'Ward 32', name: 'Kothrud Ideal Colony', lat: 18.5074, lng: 73.8077 },
      { wardNo: 'Ward 18', name: 'Viman Nagar Dutta Mandir', lat: 18.5679, lng: 73.9143 },
      { wardNo: 'Ward 24', name: 'Shivajinagar FC Road', lat: 18.5314, lng: 73.8446 },
      { wardNo: 'Ward 41', name: 'Hinjawadi Phase 1', lat: 18.5913, lng: 73.7389 }
    ]
  }
];
