/**
 * Catering funnel data — the 20 cities that get a /catering/[city]/ landing
 * page, plus the unique editorial blurb each page renders. The blurbs are
 * deliberately distinct per city (cuisines available, local context, event
 * types) so these pages read as genuine local landing pages rather than
 * doorway pages with a swapped city name.
 *
 * Lead flow: CateringQuoteForm → Supabase `submissions` (kind='catering')
 * → existing notify-submission webhook → email. No new infrastructure.
 */

export interface CateringCity {
  city: string;
  state: string;
  citySlug: string;
  stateSlug: string;
  count: number;
}

export const CATERING_CITIES: CateringCity[] = [
  { city: 'New York', state: 'New York', citySlug: 'new-york', stateSlug: 'new-york', count: 244 },
  { city: 'Portland', state: 'Oregon', citySlug: 'portland', stateSlug: 'oregon', count: 120 },
  { city: 'Houston', state: 'Texas', citySlug: 'houston', stateSlug: 'texas', count: 110 },
  { city: 'Los Angeles', state: 'California', citySlug: 'los-angeles', stateSlug: 'california', count: 101 },
  { city: 'Philadelphia', state: 'Pennsylvania', citySlug: 'philadelphia', stateSlug: 'pennsylvania', count: 89 },
  { city: 'Orlando', state: 'Florida', citySlug: 'orlando', stateSlug: 'florida', count: 78 },
  { city: 'Richmond', state: 'Virginia', citySlug: 'richmond', stateSlug: 'virginia', count: 72 },
  { city: 'Nashville', state: 'Tennessee', citySlug: 'nashville', stateSlug: 'tennessee', count: 69 },
  { city: 'Tampa', state: 'Florida', citySlug: 'tampa', stateSlug: 'florida', count: 66 },
  { city: 'Milwaukee', state: 'Wisconsin', citySlug: 'milwaukee', stateSlug: 'wisconsin', count: 64 },
  { city: 'Atlanta', state: 'Georgia', citySlug: 'atlanta', stateSlug: 'georgia', count: 60 },
  { city: 'Indianapolis', state: 'Indiana', citySlug: 'indianapolis', stateSlug: 'indiana', count: 58 },
  { city: 'Chicago', state: 'Illinois', citySlug: 'chicago', stateSlug: 'illinois', count: 58 },
  { city: 'Miami', state: 'Florida', citySlug: 'miami', stateSlug: 'florida', count: 58 },
  { city: 'Austin', state: 'Texas', citySlug: 'austin', stateSlug: 'texas', count: 56 },
  { city: 'Baltimore', state: 'Maryland', citySlug: 'baltimore', stateSlug: 'maryland', count: 55 },
  { city: 'Wichita', state: 'Kansas', citySlug: 'wichita', stateSlug: 'kansas', count: 55 },
  { city: 'Louisville', state: 'Kentucky', citySlug: 'louisville', stateSlug: 'kentucky', count: 53 },
  { city: 'Denver', state: 'Colorado', citySlug: 'denver', stateSlug: 'colorado', count: 53 },
  { city: 'Oklahoma City', state: 'Oklahoma', citySlug: 'oklahoma-city', stateSlug: 'oklahoma', count: 53 },
];

export function getCateringCity(citySlug: string): CateringCity | undefined {
  return CATERING_CITIES.find((c) => c.citySlug === citySlug);
}

/**
 * Unique per-city catering copy, keyed "stateSlug/citySlug".
 * Populated by the 2026-06-11 content sprint. Each blurb is deliberately
 * city-specific — cuisines actually bookable there, local event context —
 * so these pages don't read as doorway pages.
 */
export const CATERING_BLURBS: Record<string, string> = {
  'new-york/new-york':
    "Booking a truck in New York means choosing from the deepest bench in the country — 244 operators in our directory, from the halal-cart dynasties of Midtown to Brooklyn's birria specialists and the kati-roll carts that feed office towers. NYC trucks are battle-tested on volume: a Manhattan lunch rush is harder than most weddings. Popular bookings here skew corporate — office park-ups, film-set catering, rooftop parties — but trucks routinely work weddings in Brooklyn lofts and Long Island venues. Permits and parking are the trucks' problem, not yours; experienced NYC operators handle logistics that would terrify caterers in any other city.",
  'oregon/portland':
    "Portland's 120-truck scene grew up in permanent pods, which means its operators are unusually good at event work — many already run shared-space service daily. You can book Thai, Korean-fusion, smash burgers, Egyptian, wood-fired pizza, or the city's famous breakfast-sandwich operators for anything from a Pearl District office party to a Willamette Valley vineyard wedding. Portland trucks tend to bring strong vegetarian and vegan menus by default — useful when your guest list has mixed diets. Rainy-season bookings are normal here; most operators carry canopy setups and serve through drizzle without blinking.",
  'texas/houston':
    "Houston catering means range: 110 trucks covering East-Texas BBQ smokers, taco trucks with al pastor off the spit, Viet-Cajun crawfish hybrids, halal platters, and the loaded-baked-potato trucks the city is quietly obsessed with. Corporate bookings dominate weekdays — the Energy Corridor and Medical Center both run regular food-truck programs — while weekends fill with quinceañeras, weddings, and neighborhood festivals. Houston operators are used to feeding big, hungry crowds fast, and most can scale from a 30-person office lunch to a 500-person festival line without changing their setup.",
  'california/los-angeles':
    "LA invented modern food-truck catering — Kogi's first private bookings predate most cities' entire scenes. Today you can book taco trucks that have fed the same neighborhoods for decades, Korean-Mexican fusion, birria specialists, and chef-driven trucks running restaurant-grade menus. Film and TV production catering is its own economy here; so are studio lot lunches, tech-office Fridays, and backyard weddings from Pasadena to the Palisades. LA operators quote fast and know every venue's loading quirks. If your event has a cuisine in mind, LA almost certainly has a truck that does it natively.",
  'pennsylvania/philadelphia':
    "Philly's 89-truck lineup leans hard into what the city does best — cheesesteaks done properly, halal platters with serious followings, Mexican trucks around the Italian Market, and the university-district operators who feed Penn and Drexel daily. That campus experience makes them efficient at high-volume service windows, which is exactly what you want at a wedding or corporate picnic. Center City office bookings, Manayunk block parties, Fishtown warehouse weddings — Philadelphia trucks work them all, and the cheesesteak station at a reception remains one of the most reliably mobbed catering choices in American events.",
  'florida/orlando':
    "Orlando's 78 trucks run on a hospitality-industry rhythm — many operators feed theme-park workers on late shifts, which means they're used to serving at odd hours and scaling on demand. The Latin food bench is deep: Puerto Rican lechon, Venezuelan arepas, Cuban sandwiches pressed to order. Convention bookings are a staple (the Orange County Convention Center crowd has to eat somewhere), alongside resort-adjacent weddings and corporate campus lunches around Lake Nona. If your event runs into the night, Orlando trucks won't flinch — half of them already work nights.",
  'virginia/richmond':
    "Richmond books above its weight — 72 trucks in a city its size means real competition, and the survivors are good. The scene skews creative-Southern: fried-chicken specialists, Global-fusion operators, taco trucks, and the brewery-circuit regulars who park at Scott's Addition taprooms every weekend. That brewery experience matters for events: Richmond operators are pros at serving steady crowds over a long window rather than one rush, which suits wedding receptions perfectly. Corporate bookings downtown and VCU-area events round out the calendar.",
  'tennessee/nashville':
    "Nashville catering starts with the obvious — yes, you can book a hot-chicken truck for your wedding, and yes, your out-of-town guests will lose their minds. The city's 69 trucks also cover smoked-meat operations, taco trucks, shaved ice for summer events, and Southern-comfort menus built for crowds. The bachelorette and corporate-retreat economy keeps Nashville operators busy year-round, so book early for spring and fall weekends. Broadway-adjacent venues are tight on space; experienced local trucks know which lots and loading zones actually work.",
  'florida/tampa':
    "Tampa's 66 trucks carry the Cuban tradition seriously — pressed sandwiches, lechon, café con leche service — alongside birria specialists, seafood operators, and the dessert trucks that thrive in a city where it's patio weather most of the year. Ybor City weddings, downtown office parks, and the beach-adjacent private-party circuit keep the calendar full. Tampa operators are hurricane-season pragmatists: they confirm logistics early, carry backup plans, and serve through heat that would wilt a northern crew. Outdoor events here almost always work — that's the point of Florida.",
  'wisconsin/milwaukee':
    "Milwaukee's 64-truck scene mixes Polish and German comfort traditions with a fast-growing taco-truck bench and the festival operators who work Summerfest and the lakefront circuit every year. That festival pedigree is the tell: Milwaukee trucks know high-volume outdoor service cold. Brewery weddings are the signature local booking — half the city's venues are taprooms — and trucks here pair with them naturally. Summer books out fast because the season is short; winter events move indoors and trucks adapt with smaller footprint setups.",
  'georgia/atlanta':
    "Atlanta catering runs from soul-food trucks doing Sunday-supper menus to Korean-fusion operators, wing specialists, and the vegan trucks that have built real followings here. The film-industry economy brings steady production-catering work, which means many of the city's 60 trucks are already set up for long days and big crews. Corporate campuses in Midtown and Buckhead book weekday lunches; weekends go to weddings at the city's warehouse venues and BeltLine-adjacent spaces. Atlanta operators handle summer heat and pop-up storms with practiced ease.",
  'indiana/indianapolis':
    "Indianapolis trucks earn their living on downtown lunch crowds and the Monument Circle circuit, which makes the 58-truck scene more polished than outsiders expect. You can book BBQ smokers, taco trucks, gyro operators, and comfort-food specialists for weddings at the city's industrial-chic venues, Speedway-adjacent events (race weekends are their own catering economy), and office parks on the north side. Indy operators are Midwest-practical: clear quotes, on-time arrivals, generous portions. The value for money here is among the best in the country.",
  'illinois/chicago':
    "Chicago's trucks survived the most hostile regulations in America, and the 58 that made it are scrappy, excellent, and very good at private events — for years, private bookings were the only reliable way to operate here. Pilsen's birria and taco operators, Loop lunch veterans, and the brewery-lot regulars all cater. Office bookings downtown, weddings at West Loop venues, and backyard parties from Logan Square to Evanston fill the calendar. Chicago operators handle weather contingencies better than almost anyone — they've had to.",
  'florida/miami':
    "Miami catering is Latin America on wheels: Cuban sandwich trucks, Venezuelan arepas, Colombian street food, ceviche operators, and late-night chimichurri-burger trucks that don't really get going until 11pm. The city's 58 trucks work an event circuit unlike anywhere else — Wynwood gallery nights, Brickell office parties, beach weddings, and the quinceañera economy. Spanish-first service is standard and bilingual menus are everywhere. If your event runs late, Miami trucks are the only ones in the country that might outlast your guests.",
  'texas/austin':
    "Austin is the city where the food truck became an institution, and booking one for your event here is practically mandatory. The 56-truck directory covers breakfast-taco royalty, CDMX-style street taco specialists, smoked-brisket trailers, and the kind of chef-driven operations that started as trailers and ended up with James Beard nods. Wedding bookings at Hill Country venues, SXSW and tech-office catering, and backyard parties keep operators busy year-round. Austin trucks quote professionally — this is a mature market — so book popular operators months out for spring wedding season.",
  'maryland/baltimore':
    "Baltimore's 55 trucks lean into the city's own food language — pit beef with tiger sauce, crab-season specials, Old Bay on everything — plus taco trucks, halal operators, and soul-food kitchens. Harbor-adjacent corporate events, Hampden and Fells Point weddings, and the university circuit at Hopkins keep the scene working. Pit-beef stations at receptions are a Baltimore signature that out-of-town guests remember. Operators here are direct and unfussy: tell them your headcount and budget, and they'll tell you exactly what they can do.",
  'kansas/wichita':
    "Wichita's 55-truck scene is the plains-city surprise — a deep Mexican-truck bench (the Tacos Uruapan school of serious taqueria work), Vietnamese operators from the city's refugee-community history, and BBQ trucks that hold their own against either coast. Corporate bookings at the aviation employers, church and school events, and backyard weddings make up the calendar. Wichita operators offer some of the most generous portion-per-dollar catering in the country, and the booking lead times are friendlier than any big metro.",
  'kentucky/louisville':
    "Louisville's 53 trucks work a calendar anchored by Derby season — the two weeks around the first Saturday in May book out a year ahead — plus bourbon-trail weddings, NuLu office events, and the festival circuit. The scene covers Southern comfort, taco trucks, hot-chicken operators (the Nashville influence crossed the river), and dessert trucks. Bourbon-distillery venues and trucks pair naturally, and most local operators have worked those loading docks before. Outside Derby season, availability is good and pricing is reasonable.",
  'colorado/denver':
    "Denver's 53 trucks operate at altitude and in a four-season market, which breeds adaptable operators. The scene covers green-chile-smothered everything, taco trucks, Asian-fusion bowls, and the brewery-circuit regulars who park at RiNo taprooms year-round. Mountain weddings are the signature booking — many Denver trucks happily drive to Evergreen, Boulder, or ski-town venues for the right event — alongside tech-office lunches and park festivals. Confirm altitude and power needs for remote venues; experienced Colorado operators ask about both before you do.",
  'oklahoma/oklahoma-city':
    "OKC's 53-truck scene has grown up fast with the city — taco trucks and birria specialists, BBQ smokers, Vietnamese operators, and the Plaza District regulars who work the city's festival calendar. Corporate bookings downtown and at the energy companies, Paseo-district weddings, and church and school events fill most calendars. Oklahoma operators are weather-realists: spring storm season means every experienced truck has a contingency conversation ready. Booking is refreshingly direct here, and the value rivals any city in the country.",
};
