/**
 * Static centroid table of major US cities — used to assign a city to a truck
 * given only lat/lng (which is all the old HTML files give us).
 *
 * Coverage: every state's top 3-6 metros (~280 cities). Trucks farther than
 * MAX_CITY_RADIUS_KM from any listed city are tagged as a state-level "Other".
 */
export interface CityCentroid {
  name: string;
  state: string; // full name
  lat: number;
  lng: number;
}

export const MAX_CITY_RADIUS_KM = 80;

export const CITY_CENTROIDS: CityCentroid[] = [
  // Alabama
  { name: 'Birmingham',     state: 'Alabama',     lat: 33.5186, lng: -86.8104 },
  { name: 'Huntsville',     state: 'Alabama',     lat: 34.7304, lng: -86.5861 },
  { name: 'Mobile',         state: 'Alabama',     lat: 30.6954, lng: -88.0399 },
  { name: 'Montgomery',     state: 'Alabama',     lat: 32.3668, lng: -86.3000 },
  { name: 'Tuscaloosa',     state: 'Alabama',     lat: 33.2098, lng: -87.5692 },
  // Alaska
  { name: 'Anchorage',      state: 'Alaska',      lat: 61.2181, lng: -149.9003 },
  { name: 'Fairbanks',      state: 'Alaska',      lat: 64.8378, lng: -147.7164 },
  { name: 'Juneau',         state: 'Alaska',      lat: 58.3019, lng: -134.4197 },
  // Arizona
  { name: 'Phoenix',        state: 'Arizona',     lat: 33.4484, lng: -112.0740 },
  { name: 'Tucson',         state: 'Arizona',     lat: 32.2226, lng: -110.9747 },
  { name: 'Mesa',           state: 'Arizona',     lat: 33.4152, lng: -111.8315 },
  { name: 'Scottsdale',     state: 'Arizona',     lat: 33.4942, lng: -111.9261 },
  { name: 'Chandler',       state: 'Arizona',     lat: 33.3062, lng: -111.8413 },
  { name: 'Tempe',          state: 'Arizona',     lat: 33.4255, lng: -111.9400 },
  { name: 'Flagstaff',      state: 'Arizona',     lat: 35.1983, lng: -111.6513 },
  // Arkansas
  { name: 'Little Rock',    state: 'Arkansas',    lat: 34.7465, lng: -92.2896 },
  { name: 'Fayetteville',   state: 'Arkansas',    lat: 36.0822, lng: -94.1719 },
  { name: 'Bentonville',    state: 'Arkansas',    lat: 36.3729, lng: -94.2088 },
  { name: 'Hot Springs',    state: 'Arkansas',    lat: 34.5037, lng: -93.0552 },
  { name: 'Jonesboro',      state: 'Arkansas',    lat: 35.8423, lng: -90.7043 },
  // California
  { name: 'Los Angeles',    state: 'California',  lat: 34.0522, lng: -118.2437 },
  { name: 'San Francisco',  state: 'California',  lat: 37.7749, lng: -122.4194 },
  { name: 'San Diego',      state: 'California',  lat: 32.7157, lng: -117.1611 },
  { name: 'Sacramento',     state: 'California',  lat: 38.5816, lng: -121.4944 },
  { name: 'Oakland',        state: 'California',  lat: 37.8044, lng: -122.2712 },
  { name: 'San Jose',       state: 'California',  lat: 37.3382, lng: -121.8863 },
  { name: 'Long Beach',     state: 'California',  lat: 33.7701, lng: -118.1937 },
  { name: 'Fresno',         state: 'California',  lat: 36.7378, lng: -119.7871 },
  { name: 'Bakersfield',    state: 'California',  lat: 35.3733, lng: -119.0187 },
  { name: 'Anaheim',        state: 'California',  lat: 33.8366, lng: -117.9143 },
  { name: 'Riverside',      state: 'California',  lat: 33.9806, lng: -117.3755 },
  { name: 'Santa Ana',      state: 'California',  lat: 33.7455, lng: -117.8677 },
  { name: 'Santa Barbara',  state: 'California',  lat: 34.4208, lng: -119.6982 },
  { name: 'Berkeley',       state: 'California',  lat: 37.8716, lng: -122.2727 },
  // Colorado
  { name: 'Denver',         state: 'Colorado',    lat: 39.7392, lng: -104.9903 },
  { name: 'Boulder',        state: 'Colorado',    lat: 40.0150, lng: -105.2705 },
  { name: 'Colorado Springs', state: 'Colorado',  lat: 38.8339, lng: -104.8214 },
  { name: 'Fort Collins',   state: 'Colorado',    lat: 40.5853, lng: -105.0844 },
  { name: 'Aspen',          state: 'Colorado',    lat: 39.1911, lng: -106.8175 },
  { name: 'Pueblo',         state: 'Colorado',    lat: 38.2544, lng: -104.6091 },
  // Connecticut
  { name: 'Hartford',       state: 'Connecticut', lat: 41.7658, lng: -72.6734 },
  { name: 'New Haven',      state: 'Connecticut', lat: 41.3083, lng: -72.9279 },
  { name: 'Stamford',       state: 'Connecticut', lat: 41.0534, lng: -73.5387 },
  { name: 'Bridgeport',     state: 'Connecticut', lat: 41.1865, lng: -73.1952 },
  // Delaware
  { name: 'Wilmington',     state: 'Delaware',    lat: 39.7391, lng: -75.5398 },
  { name: 'Dover',          state: 'Delaware',    lat: 39.1582, lng: -75.5244 },
  { name: 'Newark',         state: 'Delaware',    lat: 39.6837, lng: -75.7497 },
  // Florida
  { name: 'Miami',          state: 'Florida',     lat: 25.7617, lng: -80.1918 },
  { name: 'Orlando',        state: 'Florida',     lat: 28.5383, lng: -81.3792 },
  { name: 'Tampa',          state: 'Florida',     lat: 27.9506, lng: -82.4572 },
  { name: 'Jacksonville',   state: 'Florida',     lat: 30.3322, lng: -81.6557 },
  { name: 'St. Petersburg', state: 'Florida',     lat: 27.7676, lng: -82.6403 },
  { name: 'Tallahassee',    state: 'Florida',     lat: 30.4383, lng: -84.2807 },
  { name: 'Fort Lauderdale',state: 'Florida',     lat: 26.1224, lng: -80.1373 },
  { name: 'Gainesville',    state: 'Florida',     lat: 29.6516, lng: -82.3248 },
  { name: 'Pensacola',      state: 'Florida',     lat: 30.4213, lng: -87.2169 },
  { name: 'Key West',       state: 'Florida',     lat: 24.5551, lng: -81.7800 },
  // Georgia
  { name: 'Atlanta',        state: 'Georgia',     lat: 33.7490, lng: -84.3880 },
  { name: 'Savannah',       state: 'Georgia',     lat: 32.0809, lng: -81.0912 },
  { name: 'Augusta',        state: 'Georgia',     lat: 33.4735, lng: -82.0105 },
  { name: 'Athens',         state: 'Georgia',     lat: 33.9519, lng: -83.3576 },
  { name: 'Macon',          state: 'Georgia',     lat: 32.8407, lng: -83.6324 },
  { name: 'Columbus',       state: 'Georgia',     lat: 32.4609, lng: -84.9877 },
  // Hawaii
  { name: 'Honolulu',       state: 'Hawaii',      lat: 21.3099, lng: -157.8581 },
  { name: 'Hilo',           state: 'Hawaii',      lat: 19.7297, lng: -155.0900 },
  { name: 'Lahaina',        state: 'Hawaii',      lat: 20.8783, lng: -156.6825 },
  { name: 'Kailua',         state: 'Hawaii',      lat: 21.3925, lng: -157.7394 },
  // Idaho
  { name: 'Boise',          state: 'Idaho',       lat: 43.6150, lng: -116.2023 },
  { name: 'Idaho Falls',    state: 'Idaho',       lat: 43.4666, lng: -112.0341 },
  { name: 'Coeur d Alene',  state: 'Idaho',       lat: 47.6777, lng: -116.7805 },
  { name: 'Twin Falls',     state: 'Idaho',       lat: 42.5630, lng: -114.4609 },
  // Illinois
  { name: 'Chicago',        state: 'Illinois',    lat: 41.8781, lng: -87.6298 },
  { name: 'Springfield',    state: 'Illinois',    lat: 39.7817, lng: -89.6501 },
  { name: 'Naperville',     state: 'Illinois',    lat: 41.7508, lng: -88.1535 },
  { name: 'Rockford',       state: 'Illinois',    lat: 42.2711, lng: -89.0940 },
  { name: 'Evanston',       state: 'Illinois',    lat: 42.0451, lng: -87.6877 },
  { name: 'Champaign',      state: 'Illinois',    lat: 40.1164, lng: -88.2434 },
  // Indiana
  { name: 'Indianapolis',   state: 'Indiana',     lat: 39.7684, lng: -86.1581 },
  { name: 'Fort Wayne',     state: 'Indiana',     lat: 41.0793, lng: -85.1394 },
  { name: 'Bloomington',    state: 'Indiana',     lat: 39.1653, lng: -86.5264 },
  { name: 'South Bend',     state: 'Indiana',     lat: 41.6764, lng: -86.2520 },
  { name: 'Evansville',     state: 'Indiana',     lat: 37.9716, lng: -87.5711 },
  // Iowa
  { name: 'Des Moines',     state: 'Iowa',        lat: 41.5868, lng: -93.6250 },
  { name: 'Cedar Rapids',   state: 'Iowa',        lat: 41.9779, lng: -91.6656 },
  { name: 'Iowa City',      state: 'Iowa',        lat: 41.6611, lng: -91.5302 },
  { name: 'Davenport',      state: 'Iowa',        lat: 41.5236, lng: -90.5776 },
  // Kansas
  { name: 'Wichita',        state: 'Kansas',      lat: 37.6872, lng: -97.3301 },
  { name: 'Kansas City',    state: 'Kansas',      lat: 39.1142, lng: -94.6275 },
  { name: 'Topeka',         state: 'Kansas',      lat: 39.0473, lng: -95.6752 },
  { name: 'Overland Park',  state: 'Kansas',      lat: 38.9822, lng: -94.6708 },
  { name: 'Lawrence',       state: 'Kansas',      lat: 38.9717, lng: -95.2353 },
  // Kentucky
  { name: 'Louisville',     state: 'Kentucky',    lat: 38.2527, lng: -85.7585 },
  { name: 'Lexington',      state: 'Kentucky',    lat: 38.0406, lng: -84.5037 },
  { name: 'Bowling Green',  state: 'Kentucky',    lat: 36.9685, lng: -86.4808 },
  { name: 'Frankfort',      state: 'Kentucky',    lat: 38.2009, lng: -84.8733 },
  // Louisiana
  { name: 'New Orleans',    state: 'Louisiana',   lat: 29.9511, lng: -90.0715 },
  { name: 'Baton Rouge',    state: 'Louisiana',   lat: 30.4515, lng: -91.1871 },
  { name: 'Shreveport',     state: 'Louisiana',   lat: 32.5252, lng: -93.7502 },
  { name: 'Lafayette',      state: 'Louisiana',   lat: 30.2241, lng: -92.0198 },
  // Maine
  { name: 'Portland',       state: 'Maine',       lat: 43.6591, lng: -70.2568 },
  { name: 'Bangor',         state: 'Maine',       lat: 44.8016, lng: -68.7712 },
  { name: 'Augusta',        state: 'Maine',       lat: 44.3106, lng: -69.7795 },
  // Maryland
  { name: 'Baltimore',      state: 'Maryland',    lat: 39.2904, lng: -76.6122 },
  { name: 'Annapolis',      state: 'Maryland',    lat: 38.9784, lng: -76.4922 },
  { name: 'Frederick',      state: 'Maryland',    lat: 39.4143, lng: -77.4105 },
  { name: 'Silver Spring',  state: 'Maryland',    lat: 38.9907, lng: -77.0261 },
  { name: 'Rockville',      state: 'Maryland',    lat: 39.0840, lng: -77.1528 },
  // Massachusetts
  { name: 'Boston',         state: 'Massachusetts', lat: 42.3601, lng: -71.0589 },
  { name: 'Cambridge',      state: 'Massachusetts', lat: 42.3736, lng: -71.1097 },
  { name: 'Worcester',      state: 'Massachusetts', lat: 42.2626, lng: -71.8023 },
  { name: 'Salem',          state: 'Massachusetts', lat: 42.5195, lng: -70.8967 },
  { name: 'Springfield',    state: 'Massachusetts', lat: 42.1015, lng: -72.5898 },
  // Michigan
  { name: 'Detroit',        state: 'Michigan',    lat: 42.3314, lng: -83.0458 },
  { name: 'Grand Rapids',   state: 'Michigan',    lat: 42.9634, lng: -85.6681 },
  { name: 'Ann Arbor',      state: 'Michigan',    lat: 42.2808, lng: -83.7430 },
  { name: 'Lansing',        state: 'Michigan',    lat: 42.7325, lng: -84.5555 },
  { name: 'Kalamazoo',      state: 'Michigan',    lat: 42.2917, lng: -85.5872 },
  { name: 'Traverse City',  state: 'Michigan',    lat: 44.7631, lng: -85.6206 },
  // Minnesota
  { name: 'Minneapolis',    state: 'Minnesota',   lat: 44.9778, lng: -93.2650 },
  { name: 'Saint Paul',     state: 'Minnesota',   lat: 44.9537, lng: -93.0900 },
  { name: 'Duluth',         state: 'Minnesota',   lat: 46.7867, lng: -92.1005 },
  { name: 'Rochester',      state: 'Minnesota',   lat: 44.0121, lng: -92.4802 },
  // Mississippi
  { name: 'Jackson',        state: 'Mississippi', lat: 32.2988, lng: -90.1848 },
  { name: 'Gulfport',       state: 'Mississippi', lat: 30.3674, lng: -89.0928 },
  { name: 'Biloxi',         state: 'Mississippi', lat: 30.3960, lng: -88.8853 },
  { name: 'Hattiesburg',    state: 'Mississippi', lat: 31.3271, lng: -89.2903 },
  // Missouri
  { name: 'Kansas City',    state: 'Missouri',    lat: 39.0997, lng: -94.5786 },
  { name: 'St. Louis',      state: 'Missouri',    lat: 38.6270, lng: -90.1994 },
  { name: 'Springfield',    state: 'Missouri',    lat: 37.2090, lng: -93.2923 },
  { name: 'Columbia',       state: 'Missouri',    lat: 38.9517, lng: -92.3341 },
  // Montana
  { name: 'Billings',       state: 'Montana',     lat: 45.7833, lng: -108.5007 },
  { name: 'Missoula',       state: 'Montana',     lat: 46.8721, lng: -113.9940 },
  { name: 'Bozeman',        state: 'Montana',     lat: 45.6770, lng: -111.0429 },
  { name: 'Helena',         state: 'Montana',     lat: 46.5891, lng: -112.0391 },
  // Nebraska
  { name: 'Omaha',          state: 'Nebraska',    lat: 41.2565, lng: -95.9345 },
  { name: 'Lincoln',        state: 'Nebraska',    lat: 40.8136, lng: -96.7026 },
  { name: 'Bellevue',       state: 'Nebraska',    lat: 41.1370, lng: -95.9145 },
  // Nevada
  { name: 'Las Vegas',      state: 'Nevada',      lat: 36.1699, lng: -115.1398 },
  { name: 'Reno',           state: 'Nevada',      lat: 39.5296, lng: -119.8138 },
  { name: 'Henderson',      state: 'Nevada',      lat: 36.0395, lng: -114.9817 },
  { name: 'Carson City',    state: 'Nevada',      lat: 39.1638, lng: -119.7674 },
  // New Hampshire
  { name: 'Manchester',     state: 'New Hampshire', lat: 42.9956, lng: -71.4548 },
  { name: 'Concord',        state: 'New Hampshire', lat: 43.2081, lng: -71.5376 },
  { name: 'Portsmouth',     state: 'New Hampshire', lat: 43.0718, lng: -70.7626 },
  { name: 'Nashua',         state: 'New Hampshire', lat: 42.7654, lng: -71.4676 },
  // New Jersey
  { name: 'Newark',         state: 'New Jersey',  lat: 40.7357, lng: -74.1724 },
  { name: 'Jersey City',    state: 'New Jersey',  lat: 40.7178, lng: -74.0431 },
  { name: 'Hoboken',        state: 'New Jersey',  lat: 40.7440, lng: -74.0324 },
  { name: 'Princeton',      state: 'New Jersey',  lat: 40.3573, lng: -74.6672 },
  { name: 'Trenton',        state: 'New Jersey',  lat: 40.2206, lng: -74.7597 },
  { name: 'Atlantic City',  state: 'New Jersey',  lat: 39.3643, lng: -74.4229 },
  // New Mexico
  { name: 'Albuquerque',    state: 'New Mexico',  lat: 35.0844, lng: -106.6504 },
  { name: 'Santa Fe',       state: 'New Mexico',  lat: 35.6870, lng: -105.9378 },
  { name: 'Las Cruces',     state: 'New Mexico',  lat: 32.3199, lng: -106.7637 },
  { name: 'Taos',           state: 'New Mexico',  lat: 36.4072, lng: -105.5734 },
  // New York
  { name: 'New York City',  state: 'New York',    lat: 40.7128, lng: -74.0060 },
  { name: 'Brooklyn',       state: 'New York',    lat: 40.6782, lng: -73.9442 },
  { name: 'Queens',         state: 'New York',    lat: 40.7282, lng: -73.7949 },
  { name: 'Bronx',          state: 'New York',    lat: 40.8448, lng: -73.8648 },
  { name: 'Buffalo',        state: 'New York',    lat: 42.8864, lng: -78.8784 },
  { name: 'Rochester',      state: 'New York',    lat: 43.1566, lng: -77.6088 },
  { name: 'Albany',         state: 'New York',    lat: 42.6526, lng: -73.7562 },
  { name: 'Syracuse',       state: 'New York',    lat: 43.0481, lng: -76.1474 },
  { name: 'Long Island',    state: 'New York',    lat: 40.7891, lng: -73.1350 },
  // North Carolina
  { name: 'Charlotte',      state: 'North Carolina', lat: 35.2271, lng: -80.8431 },
  { name: 'Raleigh',        state: 'North Carolina', lat: 35.7796, lng: -78.6382 },
  { name: 'Asheville',      state: 'North Carolina', lat: 35.5951, lng: -82.5515 },
  { name: 'Durham',         state: 'North Carolina', lat: 35.9940, lng: -78.8986 },
  { name: 'Greensboro',     state: 'North Carolina', lat: 36.0726, lng: -79.7920 },
  { name: 'Winston-Salem',  state: 'North Carolina', lat: 36.0999, lng: -80.2442 },
  { name: 'Wilmington',     state: 'North Carolina', lat: 34.2257, lng: -77.9447 },
  // North Dakota
  { name: 'Fargo',          state: 'North Dakota', lat: 46.8772, lng: -96.7898 },
  { name: 'Bismarck',       state: 'North Dakota', lat: 46.8083, lng: -100.7837 },
  { name: 'Grand Forks',    state: 'North Dakota', lat: 47.9253, lng: -97.0329 },
  // Ohio
  { name: 'Columbus',       state: 'Ohio',        lat: 39.9612, lng: -82.9988 },
  { name: 'Cleveland',      state: 'Ohio',        lat: 41.4993, lng: -81.6944 },
  { name: 'Cincinnati',     state: 'Ohio',        lat: 39.1031, lng: -84.5120 },
  { name: 'Toledo',         state: 'Ohio',        lat: 41.6528, lng: -83.5379 },
  { name: 'Akron',          state: 'Ohio',        lat: 41.0814, lng: -81.5190 },
  { name: 'Dayton',         state: 'Ohio',        lat: 39.7589, lng: -84.1916 },
  // Oklahoma
  { name: 'Oklahoma City',  state: 'Oklahoma',    lat: 35.4676, lng: -97.5164 },
  { name: 'Tulsa',          state: 'Oklahoma',    lat: 36.1540, lng: -95.9928 },
  { name: 'Norman',         state: 'Oklahoma',    lat: 35.2226, lng: -97.4395 },
  { name: 'Edmond',         state: 'Oklahoma',    lat: 35.6529, lng: -97.4781 },
  // Oregon
  { name: 'Portland',       state: 'Oregon',      lat: 45.5152, lng: -122.6784 },
  { name: 'Eugene',         state: 'Oregon',      lat: 44.0521, lng: -123.0868 },
  { name: 'Salem',          state: 'Oregon',      lat: 44.9429, lng: -123.0351 },
  { name: 'Bend',           state: 'Oregon',      lat: 44.0582, lng: -121.3153 },
  { name: 'Hood River',     state: 'Oregon',      lat: 45.7054, lng: -121.5215 },
  // Pennsylvania
  { name: 'Philadelphia',   state: 'Pennsylvania', lat: 39.9526, lng: -75.1652 },
  { name: 'Pittsburgh',     state: 'Pennsylvania', lat: 40.4406, lng: -79.9959 },
  { name: 'Harrisburg',     state: 'Pennsylvania', lat: 40.2732, lng: -76.8867 },
  { name: 'Lancaster',      state: 'Pennsylvania', lat: 40.0379, lng: -76.3055 },
  { name: 'Allentown',      state: 'Pennsylvania', lat: 40.6084, lng: -75.4902 },
  { name: 'Erie',           state: 'Pennsylvania', lat: 42.1292, lng: -80.0851 },
  { name: 'State College',  state: 'Pennsylvania', lat: 40.7934, lng: -77.8600 },
  // Rhode Island
  { name: 'Providence',     state: 'Rhode Island', lat: 41.8240, lng: -71.4128 },
  { name: 'Newport',        state: 'Rhode Island', lat: 41.4901, lng: -71.3128 },
  { name: 'Warwick',        state: 'Rhode Island', lat: 41.7001, lng: -71.4162 },
  // South Carolina
  { name: 'Charleston',     state: 'South Carolina', lat: 32.7765, lng: -79.9311 },
  { name: 'Columbia',       state: 'South Carolina', lat: 34.0007, lng: -81.0348 },
  { name: 'Greenville',     state: 'South Carolina', lat: 34.8526, lng: -82.3940 },
  { name: 'Myrtle Beach',   state: 'South Carolina', lat: 33.6891, lng: -78.8867 },
  // South Dakota
  { name: 'Sioux Falls',    state: 'South Dakota', lat: 43.5460, lng: -96.7313 },
  { name: 'Rapid City',     state: 'South Dakota', lat: 44.0805, lng: -103.2310 },
  { name: 'Pierre',         state: 'South Dakota', lat: 44.3683, lng: -100.3510 },
  // Tennessee
  { name: 'Nashville',      state: 'Tennessee',   lat: 36.1627, lng: -86.7816 },
  { name: 'Memphis',        state: 'Tennessee',   lat: 35.1495, lng: -90.0490 },
  { name: 'Knoxville',      state: 'Tennessee',   lat: 35.9606, lng: -83.9207 },
  { name: 'Chattanooga',    state: 'Tennessee',   lat: 35.0456, lng: -85.3097 },
  { name: 'Franklin',       state: 'Tennessee',   lat: 35.9251, lng: -86.8689 },
  // Texas
  { name: 'Austin',         state: 'Texas',       lat: 30.2672, lng: -97.7431 },
  { name: 'Houston',        state: 'Texas',       lat: 29.7604, lng: -95.3698 },
  { name: 'Dallas',         state: 'Texas',       lat: 32.7767, lng: -96.7970 },
  { name: 'San Antonio',    state: 'Texas',       lat: 29.4241, lng: -98.4936 },
  { name: 'Fort Worth',     state: 'Texas',       lat: 32.7555, lng: -97.3308 },
  { name: 'El Paso',        state: 'Texas',       lat: 31.7619, lng: -106.4850 },
  { name: 'Plano',          state: 'Texas',       lat: 33.0198, lng: -96.6989 },
  { name: 'Arlington',      state: 'Texas',       lat: 32.7357, lng: -97.1081 },
  { name: 'Corpus Christi', state: 'Texas',       lat: 27.8006, lng: -97.3964 },
  { name: 'Lubbock',        state: 'Texas',       lat: 33.5779, lng: -101.8552 },
  { name: 'Galveston',      state: 'Texas',       lat: 29.3013, lng: -94.7977 },
  // Utah
  { name: 'Salt Lake City', state: 'Utah',        lat: 40.7608, lng: -111.8910 },
  { name: 'Provo',          state: 'Utah',        lat: 40.2338, lng: -111.6585 },
  { name: 'Park City',      state: 'Utah',        lat: 40.6461, lng: -111.4980 },
  { name: 'Ogden',          state: 'Utah',        lat: 41.2230, lng: -111.9738 },
  // Vermont
  { name: 'Burlington',     state: 'Vermont',     lat: 44.4759, lng: -73.2121 },
  { name: 'Montpelier',     state: 'Vermont',     lat: 44.2601, lng: -72.5754 },
  { name: 'Stowe',          state: 'Vermont',     lat: 44.4654, lng: -72.6874 },
  // Virginia
  { name: 'Richmond',       state: 'Virginia',    lat: 37.5407, lng: -77.4360 },
  { name: 'Virginia Beach', state: 'Virginia',    lat: 36.8529, lng: -75.9780 },
  { name: 'Norfolk',        state: 'Virginia',    lat: 36.8508, lng: -76.2859 },
  { name: 'Arlington',      state: 'Virginia',    lat: 38.8816, lng: -77.0910 },
  { name: 'Charlottesville',state: 'Virginia',    lat: 38.0293, lng: -78.4767 },
  { name: 'Alexandria',     state: 'Virginia',    lat: 38.8048, lng: -77.0469 },
  // Washington
  { name: 'Seattle',        state: 'Washington',  lat: 47.6062, lng: -122.3321 },
  { name: 'Spokane',        state: 'Washington',  lat: 47.6588, lng: -117.4260 },
  { name: 'Tacoma',         state: 'Washington',  lat: 47.2529, lng: -122.4443 },
  { name: 'Bellevue',       state: 'Washington',  lat: 47.6101, lng: -122.2015 },
  { name: 'Olympia',        state: 'Washington',  lat: 47.0379, lng: -122.9007 },
  // West Virginia
  { name: 'Charleston',     state: 'West Virginia', lat: 38.3498, lng: -81.6326 },
  { name: 'Huntington',     state: 'West Virginia', lat: 38.4192, lng: -82.4452 },
  { name: 'Morgantown',     state: 'West Virginia', lat: 39.6295, lng: -79.9559 },
  // Wisconsin
  { name: 'Milwaukee',      state: 'Wisconsin',   lat: 43.0389, lng: -87.9065 },
  { name: 'Madison',        state: 'Wisconsin',   lat: 43.0731, lng: -89.4012 },
  { name: 'Green Bay',      state: 'Wisconsin',   lat: 44.5133, lng: -88.0133 },
  { name: 'Eau Claire',     state: 'Wisconsin',   lat: 44.8113, lng: -91.4985 },
  // Wyoming
  { name: 'Cheyenne',       state: 'Wyoming',     lat: 41.1399, lng: -104.8202 },
  { name: 'Jackson',        state: 'Wyoming',     lat: 43.4799, lng: -110.7624 },
  { name: 'Casper',         state: 'Wyoming',     lat: 42.8666, lng: -106.3131 },
];

const TO_RAD = Math.PI / 180;

/** Haversine distance, km */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = (bLat - aLat) * TO_RAD;
  const dLng = (bLng - aLng) * TO_RAD;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * TO_RAD) * Math.cos(bLat * TO_RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

/** Find the closest city centroid within MAX_CITY_RADIUS_KM, restricted to a state. */
export function nearestCity(lat: number, lng: number, stateName: string): CityCentroid | undefined {
  let best: CityCentroid | undefined;
  let bestD = MAX_CITY_RADIUS_KM;
  for (const c of CITY_CENTROIDS) {
    if (c.state !== stateName) continue;
    const d = distanceKm(lat, lng, c.lat, c.lng);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}
