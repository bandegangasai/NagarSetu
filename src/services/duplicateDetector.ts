import { Complaint } from '../types';

export interface NearbyComplaintMatch {
  complaint: Complaint;
  distanceMeters: number;
  matchScore: number; // 0 - 100
}

/**
 * Calculates Haversine distance between two GPS coordinates in meters.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Detects existing active complaints near a given coordinate and category.
 * @param complaints Current list of all complaints
 * @param latitude Target latitude
 * @param longitude Target longitude
 * @param categoryId Target category UUID
 * @param radiusMeters Search radius in meters (default 250m)
 */
export function detectNearbyDuplicates(
  complaints: Complaint[],
  latitude: number,
  longitude: number,
  categoryId?: string,
  radiusMeters: number = 300
): NearbyComplaintMatch[] {
  if (!latitude || !longitude) return [];

  const matches: NearbyComplaintMatch[] = [];

  for (const complaint of complaints) {
    // Only check unresolved/active issues
    if (complaint.status === 'resolved' || complaint.status === 'rejected') {
      continue;
    }

    const distance = calculateHaversineDistance(
      latitude,
      longitude,
      complaint.latitude,
      complaint.longitude
    );

    if (distance <= radiusMeters) {
      let score = 50; // base score for geographic proximity

      if (categoryId && complaint.categoryId === categoryId) {
        score += 40; // High confidence match if same category
      }

      if (distance <= 100) {
        score += 10;
      }

      matches.push({
        complaint,
        distanceMeters: distance,
        matchScore: Math.min(100, score)
      });
    }
  }

  // Sort by highest confidence and closest distance
  return matches.sort((a, b) => b.matchScore - a.matchScore || a.distanceMeters - b.distanceMeters);
}
