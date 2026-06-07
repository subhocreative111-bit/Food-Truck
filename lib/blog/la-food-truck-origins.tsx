import Link from 'next/link';
import type { BlogPost } from '../blog-posts';

export const laFoodTruckOrigins: BlogPost = {
  slug: 'la-food-truck-origins-kogi-bbq',
  title: 'How LA Invented the Modern Food Truck — A Short History',
  excerpt:
    'The modern food truck movement started in Los Angeles in 2008 with one Korean-Mexican fusion truck and a Twitter account. Here&apos;s the actual story, and what to eat in LA now.',
  metaDescription:
    'The story of how Roy Choi&apos;s Kogi BBQ truck invented modern food truck culture in LA, plus the city&apos;s best trucks today.',
  date: '2026-06-04',
  readingTime: '11 min read',
  coverEmoji: '🌴',
  render: () => (
    <>
      <p className="lede">
        Before 2008, the American &ldquo;food truck&rdquo; was a roach coach. It served coffee and pre-wrapped
        sandwiches to construction workers. The notion that a food truck might be a destination — that you might
        actively seek one out, line up for forty-five minutes, and pay restaurant prices for what came out the
        window — did not exist. Then a Korean-American chef named Roy Choi started parking a Kogi BBQ truck on
        the streets of LA and announcing its location on Twitter. The American food truck has never been the same.
      </p>

      <h2>The Kogi origin story</h2>
      <p>
        Roy Choi was a classically French-trained chef at the Beverly Hilton, between jobs and disillusioned, in
        late 2008. The financial crisis had just hit. A friend asked if he could come up with a truck menu — Korean
        BBQ on a Mexican-style taco — and Choi said yes. The first Kogi BBQ truck rolled out in November 2008. Its
        signature item, the short rib taco, was bulgogi-marinated beef on a doubled corn tortilla with kimchi salsa
        and a soy-citrus sauce.
      </p>
      <p>
        The food was good. The format was newer. What made it iconic was the Twitter account: <em>@kogibbq</em>{' '}
        announced the truck&apos;s location an hour before it arrived. By the second week, lines stretched a block
        before the truck even pulled up. By the third month, Choi was on every food TV show in America. By 2010,
        every aspiring chef in every American city was thinking <em>maybe I should buy a truck</em>.
      </p>

      <h2>What Kogi actually changed</h2>
      <p>
        Three things, in order of importance:
      </p>
      <ol>
        <li>
          <strong>Twitter-as-location.</strong> Before Kogi, customers couldn&apos;t reliably find a truck. Word of
          mouth was the marketing channel. Kogi turned the location problem into a marketing channel — the
          uncertainty itself became the appeal. People built their week around chasing Kogi from Westwood to
          Silver Lake.
        </li>
        <li>
          <strong>The chef-driven truck.</strong> Choi had Michelin training. He treated the truck as a chef-driven
          restaurant, not a discount outlet. The food was actually good. After Kogi, you could be a serious chef
          and open a truck without it being a step down.
        </li>
        <li>
          <strong>Fusion as a feature, not an apology.</strong> Korean-Mexican made cultural sense in LA — both
          populations were huge, both cuisines were ubiquitous, the labor pool already overlapped. Kogi made fusion
          feel intentional rather than gimmicky. Every Korean-X truck that followed (Korean-Brazilian, Korean-Cajun,
          Korean-Italian) owes Kogi for the cultural license.
        </li>
      </ol>

      <h2>The pre-Kogi LA truck tradition (which is still the best stuff)</h2>
      <p>
        Here&apos;s the thing the food media doesn&apos;t always foreground: <strong>Kogi did not invent LA food
        trucks.</strong> LA had a fully mature taco truck culture decades before Roy Choi parked anywhere. The
        Mexican-American truck tradition in East LA goes back to the 1970s, with thousands of trucks operating in
        the same neighborhoods, by family operators, in the same way they always had. Kogi got the press; the taco
        trucks ran the actual food economy.
      </p>
      <p>
        The biggest names in LA truck culture today are still these old-school taco trucks. The honest LA itinerary
        if you&apos;re visiting:
      </p>
      <ul>
        <li>
          <Link href="/truck/leos-tacos-truck-los-angeles-4">
            <strong>Leo&apos;s Tacos Truck</strong>
          </Link>{' '}
          — 4.5 stars, 5,800+ reviews. Multiple locations. Al pastor off the spit, doubled corn tortillas, every
          night. This is the platonic ideal of an LA taco truck. Yes, you should go to the original location off
          La Brea.
        </li>
        <li>
          <Link href="/truck/tacos-la-26-previously-ave-26-tacos-los-angeles">
            <strong>Tacos La 26</strong>
          </Link>{' '}
          (previously Ave 26 Tacos) — 4.5 stars, 1,900+ reviews. The original Ave 26 location got famous as the
          Lincoln Heights night market hub. The current cart is still doing the same brilliant adobada.
        </li>
        <li>
          <Link href="/truck/el-chato-taco-truck-los-angeles">
            <strong>El Chato Taco Truck</strong>
          </Link>{' '}
          — 4.7 stars, 700 reviews. The slightly hidden Pico-La Brea operation. The carne asada is the move; the
          quesadillas are oversized.
        </li>
        <li>
          <Link href="/truck/birrieria-los-gonzalez-lunch-truck-los-angeles">
            <strong>Birrieria Los Gonzalez</strong>
          </Link>{' '}
          — 4.4 stars, 1,000+ reviews. Birria specialists, consommé on the side, quesabirria tacos that built their
          local reputation.
        </li>
        <li>
          <Link href="/truck/tacos-1986-los-angeles">
            <strong>Tacos 1986</strong>
          </Link>{' '}
          — 4.2 stars, 800+ reviews. The newer-wave operator that picked up the post-Kogi torch. Genuinely great
          adobada, slightly higher prices, longer line. Worth the wait.
        </li>
      </ul>

      <h2>The post-Kogi wave (what the trucks look like now)</h2>
      <p>
        Sixteen years after Kogi, the LA truck scene has settled into a roughly three-tier ecosystem:
      </p>
      <ul>
        <li>
          <strong>Old-school taco trucks</strong> (Leo&apos;s, El Chato, the dozens of unnamed operators in East LA).
          Still the bulk of the volume. Still the best food per dollar. Run by families, decades of practice, $3 tacos.
        </li>
        <li>
          <strong>The chef-driven generation</strong> (Tacos 1986 and the dozens of trucks Kogi inspired). Higher
          prices, more careful sourcing, Instagram-optimized. The food is genuinely good; you&apos;re paying for the
          presentation as well as the ingredients.
        </li>
        <li>
          <strong>The fusion experimenters.</strong> The Korean-Mexican lane Kogi pioneered is now full. New
          combinations show up every month: Japanese-Mexican, Filipino-American, Persian-American. Hit or miss
          quality, but the hits are spectacular.
        </li>
      </ul>

      <h2>Whatever happened to Kogi itself?</h2>
      <p>
        Still operating. Multiple trucks. Roy Choi has expanded into restaurants (Locol, Best Friend, others), but
        the original Kogi trucks still roll through LA, still on the same schedule, still post locations on social.
        The line is shorter than 2009 because the culture has thousands of options now, but the food is the same.
        Worth a stop if you&apos;re in LA and a Kogi truck is within ten miles. For the historical novelty if nothing
        else.
      </p>

      <h2>How to eat in LA like the trucks actually matter</h2>
      <p>
        Visiting LA and trying to do the truck scene right:
      </p>
      <ol>
        <li>
          <strong>Pick one neighborhood per meal.</strong> LA is enormous; the truck scene is geographic. East LA
          for taco trucks, K-Town for Korean-anything, Boyle Heights for birria, downtown for the chef-driven
          newer wave. Don&apos;t try to cross town between trucks; the time loss kills the day.
        </li>
        <li>
          <strong>Eat between 10pm and 1am.</strong> LA taco trucks are night-life food. The crowd is locals
          coming out of bars. The carnitas are at their peak. The vibe is the real attraction.
        </li>
        <li>
          <strong>Bring cash, exact change.</strong> Most trucks take cards now, but cash gets you through the
          line faster, and the tip goes straight into the jar.
        </li>
        <li>
          <strong>Don&apos;t skip the salsas.</strong> Three options is standard; pick whichever&apos;s greener (usually
          tomatillo-based, brighter, hotter than it looks).
        </li>
      </ol>

      <h2>Browse the full LA scene</h2>
      <p>
        See the complete{' '}
        <Link href="/states/california/los-angeles">
          <strong>LA food truck directory</strong>
        </Link>{' '}
        — 100+ operators across the city, sortable by rating and review count. The{' '}
        <Link href="/cuisines/tacos">taco-truck cuisine page</Link> filters specifically for taco trucks if that&apos;s
        your priority. And the{' '}
        <Link href="/cuisines/korean">Korean cuisine page</Link> for the post-Kogi diaspora — Korean BBQ trucks
        have now spread to every major US city, but LA is still the spiritual home.
      </p>

      <p>
        Roy Choi was right about one thing: the future of American food doesn&apos;t live in white-tablecloth
        restaurants. It lives on the street. LA already knew that — what Choi did was tell the rest of the country
        out loud.
      </p>
    </>
  ),
};
