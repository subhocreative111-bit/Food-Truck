import Link from 'next/link';
import type { BlogPost } from '../blog-posts';

export const cuisineGuide: BlogPost = {
  slug: 'food-truck-cuisine-guide',
  title: 'A Beginner&apos;s Guide to American Food Truck Cuisines',
  excerpt:
    'Tacos, halal, BBQ, Korean, Indian, Cajun — the major food truck cuisines in the United States, what to order if you&apos;ve never tried them, and how to spot the real deal.',
  metaDescription:
    'New to food trucks? A practical beginner&apos;s guide to the major American food truck cuisines and what to order on your first visit.',
  date: '2026-05-28',
  readingTime: '11 min read',
  coverEmoji: '🌮',
  render: () => (
    <>
      <p className="lede">
        Food trucks in America are a window into the country&apos;s food story — every immigration wave, every regional
        tradition, every weird American fusion. Here&apos;s how to navigate the menu the first time, by cuisine, with
        opinionated orders.
      </p>

      <h2>Tacos &amp; Mexican</h2>
      <p>
        The biggest category in the country and the easiest to start with. There&apos;s a real difference between a
        &ldquo;Mexican truck&rdquo; and a &ldquo;taco truck.&rdquo; The former is broader — burritos, quesadillas,
        tortas. The latter focuses on the taco itself, usually with house-made tortillas.
      </p>
      <p>
        <strong>What to order first:</strong> Al pastor (marinated pork from a vertical spit) and carne asada
        (grilled steak). Add a couple of carnitas (slow-cooked pork) if you&apos;re ordering for a group. Always with
        cilantro and white onion, never with shredded yellow cheese.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Corn tortillas, not flour. Two stacked tortillas per taco (not
        one). A salsa bar with at least three salsas. Spanish being spoken at the window.
      </p>
      <p>
        <strong>Where to start:</strong>{' '}
        <Link href="/cuisines/tacos">all taco trucks</Link> or{' '}
        <Link href="/cuisines/mexican">Mexican food trucks nationwide</Link>.
      </p>

      <h2>Halal</h2>
      <p>
        The Halal cart is a New York invention that has gone national. It&apos;s the platform truck — chicken or lamb
        gyro meat, basmati-style rice, salad, white sauce, hot sauce, pita on the side. Fast, filling, $10–12.
      </p>
      <p>
        <strong>What to order first:</strong> Chicken-over-rice combo, white sauce, &ldquo;a little&rdquo; hot
        sauce. The hot sauce at any serious halal cart is significantly hotter than it looks.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> A blue-and-yellow color scheme is common but not required. A
        long line at lunchtime in a business district. The chicken is shaved off a vertical spit, not pulled from
        a tray.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/halal">Halal food trucks</Link> by city.
      </p>

      <h2>BBQ</h2>
      <p>
        American BBQ on a truck splits into roughly four regional traditions — Central Texas (post-oak smoke, salt
        and pepper, no sauce), Carolina (vinegar-based, whole hog), Kansas City (sweet sauce, burnt ends), and
        Memphis (dry rub on ribs). Trucks usually pick one tradition and stick with it.
      </p>
      <p>
        <strong>What to order first:</strong> Whatever the truck is best at — usually the largest item on the menu
        or the one with its own subheading. Brisket in Texas, pulled pork sandwich in the Carolinas, ribs in
        Memphis. Always order more sides than you think you need.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Smoke smell from a block away. A smoker visible (or audible) on
        site. Brown butcher paper used as plates. A sign saying &ldquo;sold out&rdquo; that goes up around 2pm —
        the best BBQ trucks run out, every day.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/bbq">BBQ food trucks across the US</Link>. Texans
        will tell you to read{' '}
        <Link href="/blog/texas-bbq-food-truck-guide">our Texas BBQ guide</Link> instead.
      </p>

      <h2>Korean</h2>
      <p>
        Korean food trucks blew up in the early 2010s — Roy Choi&apos;s Kogi BBQ in Los Angeles is the famous origin —
        and they&apos;re now in every major city. Most are some flavor of Korean-Mexican fusion (Korean BBQ tacos,
        bulgogi burritos), but a growing wave does straight Korean comfort food too.
      </p>
      <p>
        <strong>What to order first:</strong> A bulgogi (marinated beef) bowl with rice, kimchi, and a fried egg
        on top. If they have galbi (short ribs), get that. Korean fried chicken is having a moment and the trucks
        doing it are usually doing it well.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Kimchi is fermented, not just chopped raw cabbage with chili
        flakes. Banchan (side dishes) on offer, even if just two or three. Garlic in everything.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/korean">Korean food trucks</Link>.
      </p>

      <h2>Indian</h2>
      <p>
        Indian food trucks are usually one of three types — North Indian (curries, naan, tandoor), South Indian
        (dosas, idli, sambar), or street-food trucks (kati rolls, chaat, samosas). They rarely overlap.
      </p>
      <p>
        <strong>What to order first:</strong> At a kati roll truck, the unda (egg) roll with chicken. At a curry
        truck, butter chicken or chicken tikka masala for first-timers, biryani if you&apos;re hungrier. At a dosa
        truck, the masala dosa — a giant crispy crepe wrapped around spiced potato.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Spices are ground in-house (you can smell the difference). The
        menu has options &ldquo;medium&rdquo; and &ldquo;hot,&rdquo; not just &ldquo;mild.&rdquo; A chutney bar
        with at least two options.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/indian">Indian food trucks</Link>.
      </p>

      <h2>Vietnamese</h2>
      <p>
        Vietnamese trucks usually mean two things — pho (the soup) and bánh mì (the sandwich). Both translate well
        to truck format and both are fast lunch champions.
      </p>
      <p>
        <strong>What to order first:</strong> A classic bánh mì with grilled pork, pickled carrots and daikon,
        cilantro, jalapeño, and pâté. The pâté is essential, even if you don&apos;t think you like pâté. Or a small
        pho — clear, sharp, herbaceous broth with rice noodles and your protein of choice.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Pho takes hours to make properly — trucks that have it on the
        menu and have a line are taking it seriously. Bánh mì on a fresh, crusty baguette with a soft interior.
        Vietnamese coffee with condensed milk as a drink option.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/vietnamese">Vietnamese food trucks</Link>.
      </p>

      <h2>Cajun &amp; Soul Food</h2>
      <p>
        Louisiana&apos;s Cajun and Creole traditions, plus the African-American soul food tradition that runs from the
        Carolinas up through the Mississippi delta and into Chicago. Heavy, rich, deeply seasoned.
      </p>
      <p>
        <strong>What to order first:</strong> Po&apos; boys (a Louisiana sandwich — go shrimp or roast beef), red
        beans and rice, gumbo if it&apos;s a cool day, jambalaya if it&apos;s not. From the soul food side, a fried
        chicken plate with collard greens, mac and cheese, and cornbread.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> The roux for gumbo is actually dark — bricklike, not pale.
        Hot sauce on the table by default, and it&apos;s a regional brand you might not recognize (Crystal, Tabasco
        Original, Slap Ya Mama).
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/cajun">Cajun</Link> and{' '}
        <Link href="/cuisines/soul-food">soul food</Link> directories.
      </p>

      <h2>Mediterranean &amp; Middle Eastern</h2>
      <p>
        A broad category — Greek, Turkish, Lebanese, Israeli, Egyptian, sometimes North African. Trucks usually
        specialize in one tradition, but the menu vocabulary overlaps: gyros, kebabs, falafel, hummus, tabbouleh.
      </p>
      <p>
        <strong>What to order first:</strong> A gyro or shawarma platter with rice or fries, hummus, salad, and
        garlic sauce. If they make their own pita, get the pita instead of rice. A side of falafel doesn&apos;t hurt.
      </p>
      <p>
        <strong>How to spot the real deal:</strong> Pita is freshly grilled, not microwaved. Hummus has olive oil
        and paprika on top, and tastes like actual sesame. Falafel is bright green inside (parsley and herbs) and
        crispy outside.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/mediterranean">Mediterranean food trucks</Link>.
      </p>

      <h2>Burgers, Pizza &amp; American</h2>
      <p>
        A massive catch-all that runs from elevated smashburger trucks to wood-fired pizza-on-wheels operations to
        diner-on-a-truck classics. The quality range is enormous.
      </p>
      <p>
        <strong>What to order first:</strong> At a burger truck, the simplest thing on the menu — single patty,
        American cheese, lettuce, tomato, pickle. If they can&apos;t nail that, they can&apos;t nail anything. At a pizza
        truck, a plain Margherita first time. Smart trucks know they&apos;re being tested on the basics.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/burgers">Burger trucks</Link>,{' '}
        <Link href="/cuisines/pizza">pizza trucks</Link>, or{' '}
        <Link href="/cuisines/american">American food trucks</Link>.
      </p>

      <h2>Desserts &amp; Coffee</h2>
      <p>
        The undersung category. Dessert trucks (ice cream, churros, dumplings, beignets) and coffee trucks tend to
        be the most reliably good entries on a truck circuit because the menu is small and the variables are few.
      </p>
      <p>
        <strong>What to order first:</strong> Whatever they&apos;re known for, which is usually printed largest on
        the truck. Soft serve with a twist, a single specialty pastry, a single signature drink.
      </p>
      <p>
        <strong>Where to start:</strong> <Link href="/cuisines/desserts">Dessert trucks</Link> and{' '}
        <Link href="/cuisines/coffee">coffee trucks</Link>.
      </p>

      <h2>The fusion question</h2>
      <p>
        Fusion food (Korean tacos, Indian burritos, sushi burritos, bánh mì pizza, etc.) is genuinely a food-truck
        invention. It happens at trucks because trucks are small, fast, and run by chefs who don&apos;t need to
        convince a steering committee. The best fusion happens when two adjacent traditions overlap; the worst
        happens when a truck is throwing things at a wall. Trust your nose — if it smells like nothing in
        particular, it&apos;ll probably taste like nothing in particular.
      </p>

      <h2>How to use this guide</h2>
      <p>
        Treat any cuisine here as a starting point, not a category to stay within. The whole point of food trucks
        is that they let small, opinionated operators take risks that a brick-and-mortar restaurant can&apos;t. If a
        truck does one weird thing exceptionally well — Filipino lechon kawali tacos, Ethiopian-Italian fusion,
        Persian rice with American BBQ — go to that truck. The category labels are a map, not a fence.
      </p>
      <p>
        Browse the full <Link href="/cuisines">cuisines directory</Link> to pick a tradition. Or start from your{' '}
        <Link href="/states">state</Link> and see what&apos;s actually within walking distance.
      </p>
    </>
  ),
};
