import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, detectNearbyDuplicates } from '../services/duplicateDetector';
import { Complaint } from '../types';

describe('Duplicate Detection & Proximity Engine', () => {
  it('should accurately calculate Haversine distance in meters', () => {
    // Hyderabad Banjara Hills Road 10 to Road 12 (~450m)
    const lat1 = 17.4156;
    const lon1 = 78.4350;
    const lat2 = 17.4190;
    const lon2 = 78.4370;

    const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(300);
    expect(distance).toBeLessThan(600);
  });

  it('should flag complaints within 300m as potential duplicates', () => {
    const mockComplaints: Partial<Complaint>[] = [
      {
        id: 'comp-1',
        title: 'Pothole on Main Road',
        categoryId: 'cat-pothole',
        latitude: 17.4156,
        longitude: 78.4350,
        status: 'in_progress',
        supportersCount: 5
      },
      {
        id: 'comp-2',
        title: 'Garbage 5km away',
        categoryId: 'cat-garbage',
        latitude: 17.4500,
        longitude: 78.4800,
        status: 'submitted',
        supportersCount: 1
      }
    ];

    // Coordinate 50 meters away from comp-1
    const testLat = 17.4158;
    const testLng = 78.4352;

    const matches = detectNearbyDuplicates(
      mockComplaints as Complaint[],
      testLat,
      testLng,
      'cat-pothole',
      300
    );

    expect(matches.length).toBe(1);
    expect(matches[0].complaint.id).toBe('comp-1');
    expect(matches[0].distanceMeters).toBeLessThan(100);
    expect(matches[0].matchScore).toBeGreaterThanOrEqual(80);
  });

  it('should ignore resolved complaints from duplicate warnings', () => {
    const mockComplaints: Partial<Complaint>[] = [
      {
        id: 'comp-resolved',
        title: 'Old Fixed Pothole',
        categoryId: 'cat-pothole',
        latitude: 17.4156,
        longitude: 78.4350,
        status: 'resolved'
      }
    ];

    const matches = detectNearbyDuplicates(
      mockComplaints as Complaint[],
      17.4156,
      78.4350,
      'cat-pothole',
      300
    );

    expect(matches.length).toBe(0);
  });
});
