export type Cuisine =
  | 'American'
  | 'BBQ'
  | 'Mexican'
  | 'Tacos'
  | 'Asian'
  | 'Thai'
  | 'Chinese'
  | 'Korean'
  | 'Japanese'
  | 'Vietnamese'
  | 'Indian'
  | 'Mediterranean'
  | 'Italian'
  | 'Pizza'
  | 'Seafood'
  | 'Soul Food'
  | 'Vegan'
  | 'Desserts'
  | 'Coffee'
  | 'Breakfast'
  | 'Sandwiches'
  | 'Burgers'
  | 'Halal'
  | 'Caribbean'
  | 'Cajun'
  | 'Tex-Mex'
  | 'Other';

export interface Hours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface Truck {
  slug: string;
  name: string;
  state: string;           // full state name, e.g. "California"
  stateSlug: string;       // "california"
  city: string;
  citySlug: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  cuisine: Cuisine[];
  rating: number;          // 0-5
  reviewCount: number;
  hours?: Hours;
  photos: string[];
  placeId?: string;
  featured?: boolean;
  priceLevel?: 1 | 2 | 3;  // $ / $$ / $$$
  description?: string;
}

export interface CitySummary {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  count: number;
  topRating: number;
  /** Cover photo for city cards. Prefers a real Google CDN URL from the
   *  highest-ranked truck in that city; undefined when no real photo exists. */
  coverPhoto?: string;
}

export interface StateSummary {
  name: string;
  slug: string;
  abbr: string;
  count: number;
  topCities: CitySummary[];
  topCuisines: { cuisine: Cuisine; count: number }[];
}

export interface CuisineSummary {
  cuisine: Cuisine;
  slug: string;
  count: number;
}
