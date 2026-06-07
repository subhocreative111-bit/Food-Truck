import Link from 'next/link';
import type { BlogPost } from '../blog-posts';

export const birriaTacoTrail: BlogPost = {
  slug: 'birria-taco-trail-america',
  title: 'The Birria Taco Trail Across America',
  excerpt:
    'Birria tacos went from Jalisco specialty to American obsession in five years. Here&apos;s the trail — from Tijuana to LA to NYC to Houston — and the best trucks at every stop.',
  metaDescription:
    'A guide to the best birria taco trucks in America, from Tijuana&apos;s roots to LA, NYC, Houston, Chicago, and beyond.',
  date: '2026-06-04',
  readingTime: '10 min read',
  coverEmoji: '🌮',
  render: () => (
    <>
      <p className="lede">
        Five years ago, &ldquo;birria&rdquo; was a niche regional Mexican dish, most familiar to American eaters
        through the occasional weekend stew at a Jalisco-style restaurant. Today there are birria trucks in
        Oklahoma City, birria pop-ups in Brooklyn, and birria-burger crossovers in Portland. This is the trail of
        how that happened, and the trucks doing it best right now.
      </p>

      <h2>What birria actually is (and isn&apos;t)</h2>
      <p>
        Birria is a slow-braised meat stew — traditionally goat in Jalisco, but increasingly beef in the
        American context — cooked in a chile-based broth (guajillo, ancho, sometimes pasilla) with aromatics
        (garlic, cumin, cloves, oregano). It&apos;s served two ways: as a soup with the meat in the broth, or as
        tacos where the meat is pulled, stuffed into a tortilla that&apos;s been dipped in the rendered fat, and
        griddled until crispy. The broth is served on the side for dipping.
      </p>
      <p>
        The American taco variant — the &ldquo;quesabirria&rdquo; — adds melted cheese (usually Oaxaca or Chihuahua)
        to the taco before griddling. This is a Tijuana invention from around 2015, not a Jalisco tradition. The
        cheese version is what conquered America. The Jalisco purists are still grumbling about it. They are mostly
        being polite.
      </p>

      <h2>The trail, in order</h2>

      <h3>1. Tijuana (the modern origin)</h3>
      <p>
        Tijuana street vendors started doing the cheese variant in the mid-2010s. Specifically, the model of
        &ldquo;dip the tortilla in the consommé, add the cheese, fold, griddle, serve with consommé for dunking&rdquo;
        belongs to TJ. From there it crossed the border into San Diego.
      </p>

      <h3>2. San Diego &amp; LA (the first American outposts)</h3>
      <p>
        Birria-Landia and a few other operators set up in SoCal in the late 2010s. The format crossed quickly
        because the labor pool moves between Tijuana and San Diego daily.
      </p>
      <p>
        <Link href="/truck/birria-el-rey-san-diego">
          <strong>Birria El Rey</strong>
        </Link>{' '}
        in San Diego (4.6 stars, 523 reviews) is the cleanest representation of the Tijuana style north of the
        border. The consommé is rich, the cheese is sharp, the meat falls apart at the touch of a fork.
      </p>

      <h3>3. NYC (the moment it went national)</h3>
      <p>
        The birria phenomenon broke into general American awareness in 2019-2020 when{' '}
        <Link href="/truck/birria-landia-jackson-heights">
          <strong>Birria-Landia</strong>
        </Link>{' '}
        opened in Jackson Heights, Queens. 4.7 stars, 2,500+ reviewers — that&apos;s a massive review count for a
        taco-only operation, and it earned every star. The Jackson Heights truck still has lines around the block
        on weekends. The owners have since opened a Brooklyn location ({' '}
        <Link href="/truck/birria-landia-brooklyn">4.8 stars, 1,300+ reviews</Link>) that is somehow even better,
        plus a Manhattan operation (<Link href="/truck/birria-landia-nyc-new-york">4.8 stars</Link>).
      </p>
      <p>
        If you have one birria meal in NYC, the Jackson Heights original is the canonical choice. If you live in
        Brooklyn, the Brooklyn location is closer to home and just as good.
      </p>
      <p>
        Other NYC standouts:{' '}
        <Link href="/truck/birria-les-new-york">Birria LES</Link> (4.7 stars, 549 reviews) on the Lower East Side
        is the slightly more upscale newer-wave operator. <Link href="/truck/casa-birria-nyc-mexican-food-truck-new-york">Casa Birria NYC</Link> (4.6 stars) has
        the consommé that locals argue is the best in the city.
      </p>

      <h3>4. Houston (the Texas pivot)</h3>
      <p>
        Houston picked up birria fast because the Mexican-American population is enormous and Houston rewards
        operators who do one thing obsessively well.{' '}
        <Link href="/truck/space-city-birria-houston">
          <strong>Space City Birria</strong>
        </Link>{' '}
        leads the city — 4.8 stars, 1,500+ reviews. The quesabirria here has crisp cheese halos that go to the
        edge of each taco, and the consommé is genuinely beefy rather than watered down.{' '}
        <Link href="/truck/the-birria-queen-food-truck-houston">The Birria Queen</Link> at 4.8 stars rounds out
        the city&apos;s top tier; their ramen-birria experiment is the kind of thing that you go for once and then
        go back for twice.
      </p>

      <h3>5. Chicago (the Pilsen flag-planting)</h3>
      <p>
        Chicago&apos;s Mexican-American population is centered in Pilsen on the southwest side, and that&apos;s
        where the city&apos;s best birria comes from.{' '}
        <Link href="/truck/quesabirria-jalisco-pilsen-chicago">
          <strong>QuesaBirria Jalisco Pilsen</strong>
        </Link>{' '}
        sits at 4.8 stars from 2,100+ reviewers — putting it in the same statistical tier as the NYC operators.
        Order the quesabirria, get the consommé extra-rich, sit at a sidewalk table on a Saturday afternoon.
      </p>

      <h3>6. The expansion (everywhere else)</h3>
      <p>
        Birria has now reached Orlando ({' '}
        <Link href="/truck/birria1983-mexican-bar-and-grill-orlando">Birria1983</Link>), San Antonio (
        <Link href="/truck/tejas-birria-el-camino-san-antonio">Tejas Birria</Link>), Oklahoma City (
        <Link href="/truck/la-birria-superb-oklahoma-city">La Birria SuPerb</Link>), and dozens of other
        unexpected markets. The quality varies — some operators clearly learned the technique from YouTube,
        others got it from family. The cities still catching up: Boston, DC, the Pacific Northwest. Give them
        another year.
      </p>

      <h2>How to order birria correctly</h2>
      <p>
        First time at a serious birria truck:
      </p>
      <ol>
        <li>
          <strong>Get the quesabirria taco platter</strong> (usually 3 or 4 tacos with consommé on the side). This
          is the iconic order.
        </li>
        <li>
          <strong>Dip the taco in the consommé before each bite.</strong> The crispy tortilla holds up to the
          liquid; the consommé is what makes the dish work.
        </li>
        <li>
          <strong>Eat the consommé as a soup at the end</strong> — add the lime, salt, raw onion, cilantro from
          the toppings tray. The broth is half the meal.
        </li>
        <li>
          <strong>Order extra tortillas if you have leftover meat.</strong> Trucks will usually sell two more
          tortillas for a dollar.
        </li>
      </ol>

      <h2>The cheese question</h2>
      <p>
        A clean Tijuana-style quesabirria uses Oaxaca cheese — mild, stringy, the consistency of mozzarella. Some
        American operators substitute with cheddar or American cheese, which is fine but produces a different
        dish (saltier, less stringy). The really good operators use Chihuahua cheese, which sits between Oaxaca
        and American in both texture and flavor. You don&apos;t need to ask which one they use — but if the cheese
        is yellow, it&apos;s Chihuahua or cheddar; if it&apos;s white, it&apos;s Oaxaca or queso fresco.
      </p>

      <h2>What separates great birria from average</h2>
      <p>
        Three signals:
      </p>
      <ul>
        <li>
          <strong>The consommé is dark.</strong> A pale consommé means the meat was undercooked or the broth was
          stretched with water. The great operators reduce their broth for hours; it should be the color of strong
          coffee.
        </li>
        <li>
          <strong>The meat pulls cleanly with a fork.</strong> Birria is supposed to be melt-in-your-mouth.
          Chewy meat means under-braising.
        </li>
        <li>
          <strong>The tortilla has a fat-fried crispy edge.</strong> If the tortilla is soft, the operator didn&apos;t
          dip it in the rendered fat before griddling. That&apos;s a fatal shortcut.
        </li>
      </ul>

      <h2>Browse the full birria scene</h2>
      <p>
        Birria has spread across America fast enough that your local options have probably tripled in the last
        eighteen months. Check the{' '}
        <Link href="/cuisines/tacos">
          <strong>full taco-truck directory</strong>
        </Link>{' '}
        and filter by your state — most cities now have at least one serious birria operator. Or browse the
        <Link href="/cuisines/mexican"> Mexican cuisine page</Link> for the broader food scene the birria movement
        grew out of.
      </p>
      <p>
        If birria isn&apos;t already in your city: give it eighteen months. It&apos;s coming.
      </p>
    </>
  ),
};
