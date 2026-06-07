import Link from 'next/link';
import type { BlogPost } from '../blog-posts';

export const foodTruckMenuIdeas: BlogPost = {
  slug: 'food-truck-menu-ideas',
  title: 'Food Truck Menu Ideas — What to Sell and Why',
  excerpt:
    'A practical guide to building a food truck menu — what actually sells, how to price it, and 30 concrete menu ideas across cuisines that work on a truck.',
  metaDescription:
    'Food truck menu ideas that actually sell — by cuisine, price point, and prep complexity. A practical guide for new and existing truck operators.',
  date: '2026-06-08',
  readingTime: '12 min read',
  coverEmoji: '📋',
  render: () => (
    <>
      <p className="lede">
        The single most important decision a food truck operator makes is what to put on the menu. It determines
        the truck&apos;s margin, the speed of service, the customer base, and ultimately whether the operation
        survives year one. This guide is the practical version — what works on a truck, what doesn&apos;t, and
        thirty concrete menu ideas to start from.
      </p>

      <h2>The four rules of a food truck menu</h2>
      <p>
        Every successful menu — whether it&apos;s a one-item brisket truck or a multi-cuisine fusion operation —
        respects four constraints:
      </p>
      <ol>
        <li>
          <strong>Five to twelve items, maximum.</strong> A long menu means slow service, more inventory waste,
          more chances for the line cook to make mistakes. The best operators sell five things obsessively well.
        </li>
        <li>
          <strong>One signature item that drives 60-70% of orders.</strong> Customers default to the named famous
          thing. Make sure that thing is your best work.
        </li>
        <li>
          <strong>Shared mise en place across the menu.</strong> The al pastor goes in the taco, the burrito, and
          the bowl. The brisket goes in the sandwich, the nachos, and the platter. You cannot prep ten unique
          proteins on a truck.
        </li>
        <li>
          <strong>Food cost ≤ 30-35%.</strong> Anything higher and the truck can&apos;t profitable. Build pricing
          backward from this target.
        </li>
      </ol>

      <h2>Menu archetypes that actually work on a truck</h2>
      <p>
        Six menu shapes are proven on the truck format. Pick one and build inside it:
      </p>

      <h3>The taco truck — three meats, two formats</h3>
      <p>
        <strong>Structure:</strong> three protein options (al pastor, carne asada, carnitas or similar) × two
        formats (tacos or burrito/bowl) = six items, every customer can find something.
      </p>
      <p>
        <strong>Why it works:</strong> shared protein prep, fast assembly, $3-5 per taco price point lets you do
        volume.
      </p>
      <p>
        <strong>Add-ons:</strong> elote (Mexican street corn), agua fresca, churros. Each one is a single-station
        addition that lifts ticket size by $3-5.
      </p>

      <h3>The BBQ truck — two meats, three sides</h3>
      <p>
        <strong>Structure:</strong> brisket and pulled pork as the anchors, three sides (beans, slaw, mac), white
        bread thrown in free. Combo plates do most of the volume.
      </p>
      <p>
        <strong>Why it works:</strong> meats are cooked overnight in bulk, sides are batch-prepped, service is
        fast. The only complexity is portion control.
      </p>
      <p>
        <strong>Add-ons:</strong> jalapeño-cheddar sausage, burnt-end loaded baked potato, banana pudding for
        dessert.
      </p>

      <h3>The halal cart — one platform, two proteins</h3>
      <p>
        <strong>Structure:</strong> chicken or lamb (or combo) over rice OR in a pita, with white sauce and hot
        sauce. Falafel for the vegetarian play.
      </p>
      <p>
        <strong>Why it works:</strong> the entire menu fits on one sign. Customers know what they want before
        they reach the window. Cost-per-meal is low, ticket sizes are $10-13.
      </p>
      <p>
        <strong>Add-ons:</strong> hummus side, Coke and water. That&apos;s the entire drink menu.
      </p>

      <h3>The burger truck — three burgers, fries, milkshake</h3>
      <p>
        <strong>Structure:</strong> single, double, and a specialty burger (mushroom-swiss, chili cheese,
        smashburger with bacon). Fries one way. Milkshake or soda.
      </p>
      <p>
        <strong>Why it works:</strong> smashburger format is fast, consistent, and easy to plate. Fries are batch
        cooked. Milkshakes are a high-margin upsell.
      </p>
      <p>
        <strong>Add-ons:</strong> loaded fries (chili, cheese, jalapeños) as a separate menu item. Specialty milkshake of the
        week.
      </p>

      <h3>The breakfast truck — three sandwiches, coffee</h3>
      <p>
        <strong>Structure:</strong> bacon-egg-cheese, sausage-egg-cheese, and a specialty (avocado-egg, breakfast
        burrito, whatever). Cold brew. Hash browns.
      </p>
      <p>
        <strong>Why it works:</strong> breakfast rush is short (6-10am), customers are predictable, $8-12 ticket
        sizes from office workers who&apos;ll come back tomorrow.
      </p>
      <p>
        <strong>Add-ons:</strong> a pastry option (croissant, breakfast cookie). Specialty coffee drink.
      </p>

      <h3>The dessert truck — single category, ten variations</h3>
      <p>
        <strong>Structure:</strong> pick one dessert category (ice cream, churros, donuts, cookies, paletas) and
        do ten variations. Single category = simple equipment + signature focus.
      </p>
      <p>
        <strong>Why it works:</strong> food cost is low (15-25%), prep time is short, customers buy on impulse,
        nighttime hours.
      </p>
      <p>
        <strong>Add-ons:</strong> coffee or affogato for the ice cream truck. Iced milk drinks. Topping bar.
      </p>

      <h2>30 concrete menu ideas, by cuisine</h2>

      <h3>Mexican / Tacos (high margin, proven format)</h3>
      <ol>
        <li>Al pastor tacos with pineapple, cilantro, white onion</li>
        <li>Birria tacos with consommé on the side</li>
        <li>Carne asada burrito with rice, beans, salsa verde</li>
        <li>Carnitas tacos with pickled red onion</li>
        <li>Elote (Mexican corn) with cotija and lime — sells out fast every time</li>
      </ol>

      <h3>BBQ (high reputation upside)</h3>
      <ol start={6}>
        <li>Brisket sandwich on a brioche bun with pickles and onion</li>
        <li>Pulled pork plate with mac, slaw, and white bread</li>
        <li>Burnt-end loaded baked potato (the cult favorite)</li>
        <li>Jalapeño-cheddar smoked sausage link with mustard</li>
        <li>Beef rib (one item, $18-25, sells out daily — the prestige item)</li>
      </ol>

      <h3>Burgers (volume + universal appeal)</h3>
      <ol start={11}>
        <li>Smashburger with American cheese, lettuce, tomato, special sauce</li>
        <li>Double smashburger with bacon and grilled onions</li>
        <li>Mushroom-swiss burger with truffle aioli</li>
        <li>Loaded fries with chili, cheese, and jalapeños</li>
        <li>Vanilla milkshake (high margin, universal appeal)</li>
      </ol>

      <h3>Asian (rising category, strong urban demand)</h3>
      <ol start={16}>
        <li>Korean BBQ bowl with bulgogi, rice, kimchi, fried egg</li>
        <li>Korean fried chicken with soy garlic sauce</li>
        <li>Bánh mì (Vietnamese baguette sandwich) with grilled pork</li>
        <li>Pad Thai or pho if you can execute it (high skill, high reward)</li>
        <li>Boba tea drinks as add-ons (15-20% margins, easy)</li>
      </ol>

      <h3>Halal / Mediterranean (lunch-rush gold)</h3>
      <ol start={21}>
        <li>Chicken over rice with white sauce and hot sauce</li>
        <li>Lamb gyro pita with tzatziki and pickled onion</li>
        <li>Falafel platter with hummus and pita</li>
        <li>Shawarma wrap with garlic sauce</li>
        <li>Side of hummus + pita as the obvious add-on</li>
      </ol>

      <h3>Sweet / Dessert (high margin, impulse buys)</h3>
      <ol start={26}>
        <li>Soft-serve ice cream with a creative topping bar</li>
        <li>Churros with chocolate or cajeta dipping sauces</li>
        <li>Hot cookies with cold milk (the late-night winner)</li>
        <li>Loaded waffles (Belgian-style with fruit, Nutella, etc.)</li>
        <li>Paletas (Mexican-style fruit popsicles)</li>
      </ol>

      <h2>Pricing — the math that actually matters</h2>
      <p>
        For any menu item, the price calculation:
      </p>
      <ul>
        <li>Raw food cost (ingredients) — should be ≤ 30% of menu price</li>
        <li>Pricing rule of thumb: <strong>menu price = raw food cost × 3.3-4</strong></li>
        <li>Example: ingredients for a taco = $1.10 → menu price = $3.99</li>
        <li>Burger ingredients = $2.50 → menu price = $9.95</li>
      </ul>
      <p>
        If a menu item exceeds these multiples (you&apos;d need to sell tacos for $5.50 to hit the math), either
        change the recipe to cut cost or drop the item.
      </p>

      <h2>The menu-board rules</h2>
      <p>
        Once you know what&apos;s on the menu, the board itself matters:
      </p>
      <ul>
        <li>
          <strong>Prices visible from the line.</strong> Customers in line should never need to ask. Asking
          slows service and signals amateurism.
        </li>
        <li>
          <strong>One signature item highlighted.</strong> The largest font, the most visual treatment. 60-70%
          of orders will follow what you visually emphasize.
        </li>
        <li>
          <strong>Combos / platters prominent.</strong> Combos lift ticket size by 20-40%. Make sure customers
          see them clearly.
        </li>
        <li>
          <strong>Dietary callouts.</strong> &ldquo;V&rdquo; for vegetarian, &ldquo;GF&rdquo; for gluten-free.
          Costs nothing, captures customers who&apos;d otherwise walk away.
        </li>
        <li>
          <strong>No more than 12 items total.</strong> Twelve forces a customer to decide quickly. Twenty causes
          paralysis and slows the line.
        </li>
      </ul>

      <h2>What to drop from your menu, even if you think it&apos;s a winner</h2>
      <p>
        Most first-time operators carry too many items. The candidates to cut, in order:
      </p>
      <ul>
        <li>
          <strong>Anything that takes &gt; 4 minutes to prepare.</strong> Truck service expectations are 2-3
          minutes. Anything slower kills the line.
        </li>
        <li>
          <strong>Anything that requires a unique ingredient you don&apos;t use elsewhere.</strong> If one item
          requires you to stock fresh dill or pomegranate seeds, the waste cost on those ingredients eats your
          margin.
        </li>
        <li>
          <strong>Anything that sells fewer than 5 orders a day.</strong> The kitchen real estate is too valuable.
        </li>
        <li>
          <strong>The &ldquo;please everyone&rdquo; option</strong> — the chicken Caesar wrap on the BBQ menu, the
          vegetable plate on the burger menu. These items signal indecision; they also rarely sell.
        </li>
      </ul>

      <h2>Validation — how to test menu ideas before committing</h2>
      <p>
        The cheapest way to validate menu ideas:
      </p>
      <ol>
        <li>
          <strong>Run a pop-up.</strong> Rent space at a brewery or food-hall slot for a weekend. Charge real
          prices. Track what sells.
        </li>
        <li>
          <strong>Add &ldquo;weekend specials&rdquo; to your existing menu.</strong> Two-week test, real-money
          conversion data. The best of these become permanent menu items.
        </li>
        <li>
          <strong>Look at the trash bin.</strong> If customers consistently leave a quarter of a dish, your
          portion is wrong or the dish itself isn&apos;t working. Adjust or cut.
        </li>
        <li>
          <strong>Ask the regulars.</strong> Your regulars will tell you what they wish you had. They&apos;re right
          more often than you&apos;d expect.
        </li>
      </ol>

      <h2>One final note</h2>
      <p>
        A food truck menu is not a static document. The best operators iterate quietly: add an item, watch it for
        two weeks, keep or kill. After two years, your menu looks very different from what you launched with — and
        it&apos;s better for it. The willingness to cut a beloved item that isn&apos;t selling is the single
        skill that separates the trucks that make it from the ones that don&apos;t.
      </p>

      <h2>Read these next</h2>
      <p>
        For the broader operator playbook, see{' '}
        <Link href="/blog/how-to-start-a-food-truck-business">How to Start a Food Truck Business</Link>. For
        regional menu inspiration, our city guides cover the menus that local trucks have refined:{' '}
        <Link href="/blog/houston-food-truck-guide">Houston</Link>,{' '}
        <Link href="/blog/portland-food-truck-pods-guide">Portland</Link>,{' '}
        <Link href="/blog/la-food-truck-origins-kogi-bbq">LA</Link>, and{' '}
        <Link href="/blog/best-halal-carts-nyc">NYC halal carts</Link>.
      </p>
      <p>
        Ready to launch?{' '}
        <Link href="/list-your-truck">
          <strong>Get listed on FoodTrucksNearMeUSA</strong>
        </Link>{' '}
        — free, takes ten minutes, puts your menu in front of customers across all 50 states.
      </p>
    </>
  ),
};
