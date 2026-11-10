// Marquee hire, offered with our marquee partner's range.
//
// Jake, 10 Nov 2026: marquees go in the quote as an add-on. Crockery, chairs
// and the other marquee extras are only offered once a marquee is added.
// Prices are still to be agreed, so every line reads "To confirm" (never £0).

import type { Pence } from '../visual-quote/money.ts';

export interface MarqueeItem {
  id: string;
  name: string;
  /** One plain line: size, capacity or what it is. */
  detail: string;
  /** How it's counted: "each", "per marquee", "set of 10". */
  unit: string;
  /** Null until Jake and the marquee partner agree a price. */
  price: Pence | null;
  /** Diagram to show, where we have one. */
  diagram?: string;
}

export interface MarqueeGroup {
  id: string;
  name: string;
  blurb: string;
  /** Structures are chosen first; everything else needs a structure in the quote. */
  kind: 'structure' | 'extra';
  /** Largest sensible quantity for the counter. */
  max: number;
  items: MarqueeItem[];
}

// MARQUEE-DATA-START (our marquee partner's range, read from their website on 10 Nov 2026)
export const MARQUEE_GROUPS: MarqueeGroup[] = [
  {
    id: 'marquee', name: 'Your marquee', blurb: 'Sizes are confirmed after a site visit.', kind: 'structure', max: 6,
    items: [
      { id: 'mq-clear-span', name: 'Clear span marquee', detail: 'A modern frame marquee with no centre poles or guy ropes, built to the size your event needs.', unit: 'marquee', price: null, diagram: 'frame' },
      { id: 'mq-chinese-hat', name: 'Chinese hat marquee', detail: 'A square, pointed-roof pagoda. Use one for a garden party, or join two or three together.', unit: 'pagoda', price: null, diagram: 'pagoda' },
      { id: 'mq-catering', name: 'Catering marquee', detail: 'A covered work area for your caterers, beside the main marquee.', unit: 'marquee', price: null, diagram: 'pagoda' },
    ],
  },
  {
    id: 'walls', name: 'Walls, roof and doors', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-walls-white', name: 'White walls', detail: 'Solid white wall panels.', unit: 'set', price: null },
      { id: 'mq-walls-clear', name: 'Clear window walls', detail: 'See-through wall panels, to keep the view.', unit: 'set', price: null },
      { id: 'mq-clear-roof', name: 'Clear roof', detail: 'See-through roof sections for daylight and a view of the sky.', unit: 'set', price: null },
      { id: 'mq-doors', name: 'Double door entrance', detail: 'Glazed double doors that keep the warmth in.', unit: 'set', price: null },
    ],
  },
  {
    id: 'linings', name: 'Linings and ceilings', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-lining-pleated', name: 'White pleated lining', detail: 'Gathered white fabric over the roof and walls that hides the frame.', unit: 'set', price: null },
      { id: 'mq-starlit-ceiling', name: 'Black starlit ceiling', detail: 'A black roof lining dotted with small LED lights.', unit: 'set', price: null },
      { id: 'mq-swags', name: 'Coloured swags', detail: 'Fabric drapes hung in loops along the eaves.', unit: 'set', price: null },
    ],
  },
  {
    id: 'flooring', name: 'Flooring', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-floor-boards', name: 'Wooden floor boards with carpet', detail: 'A firm, level boarded floor finished with carpet.', unit: 'floor', price: null },
      { id: 'mq-carpet', name: 'Carpet', detail: 'Fitted marquee carpet, in a choice of colours.', unit: 'floor', price: null },
      { id: 'mq-matting', name: 'Matting laid to grass', detail: 'Natural coconut matting rolled out over the lawn.', unit: 'floor', price: null },
      { id: 'mq-walkway', name: 'Outside walkway', detail: 'A dry path to the marquee.', unit: 'walkway', price: null },
    ],
  },
  {
    id: 'dance-floor', name: 'Dance floor', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-dance-wood', name: 'Wooden parquet dance floor', detail: 'A wood-effect parquet floor.', unit: 'floor', price: null },
      { id: 'mq-dance-chequered', name: 'Black and white chequered dance floor', detail: 'The classic chessboard dance floor.', unit: 'floor', price: null },
      { id: 'mq-dance-starlit', name: 'White starlit LED dance floor', detail: 'A gloss white floor with twinkling lights set into it.', unit: 'floor', price: null },
    ],
  },
  {
    id: 'lighting', name: 'Lighting', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-fairy-lights', name: 'Fairy lights', detail: 'Strings of tiny warm lights across the ceiling.', unit: 'set', price: null },
      { id: 'mq-chandeliers', name: 'Chandeliers', detail: 'Hanging chandeliers down the centre of the marquee.', unit: 'set', price: null },
      { id: 'mq-festoons', name: 'Festoon lights', detail: 'Strings of large round bulbs, inside or out.', unit: 'set', price: null },
      { id: 'mq-uplighters', name: 'LED up-lighters', detail: 'Floor lights that wash the walls with colour.', unit: 'set', price: null },
      { id: 'mq-outside-lighting', name: 'Outside lighting', detail: 'Lighting for paths and the area around the marquee.', unit: 'set', price: null },
    ],
  },
  {
    id: 'heating', name: 'Heating and power', blurb: '', kind: 'extra', max: 10,
    items: [
      { id: 'mq-heater', name: 'Heater', detail: 'Sits outside and blows thermostat-controlled warm air in.', unit: 'each', price: null },
      { id: 'mq-power', name: 'Power distribution', detail: 'Cabling and sockets for lights, heaters and equipment.', unit: 'set', price: null },
      { id: 'mq-generator', name: 'Generator', detail: 'Only needed when caterers or a band need more power than the building can give.', unit: 'each', price: null },
    ],
  },
  {
    id: 'furniture', name: 'Chairs, tables and sofas', blurb: '', kind: 'extra', max: 1000,
    items: [
      { id: 'mq-limewash-chiavari-banquet-chair', name: 'Limewash Chiavari chair', detail: 'Whitewashed wooden banquet chair with a spindle back and a pale padded seat. The usual wedding chair.', unit: 'each', price: null },
      { id: 'mq-wooden-folding-chair', name: 'Wooden folding chair', detail: 'Light natural-wood folding chair with a slatted back.', unit: 'each', price: null },
      { id: 'mq-child-s-high-chair', name: 'Child’s high chair', detail: 'Wooden restaurant-style high chair for a baby or toddler.', unit: 'each', price: null },
      { id: 'mq-round-banquet-tables-3ft', name: 'Round table, 3ft', detail: 'Round folding dining table.', unit: 'each', price: null },
      { id: 'mq-round-banquet-tables-4ft', name: 'Round table, 4ft', detail: 'Round folding dining table.', unit: 'each', price: null },
      { id: 'mq-round-banquet-tables-5ft', name: 'Round table, 5ft', detail: 'Round folding dining table.', unit: 'each', price: null },
      { id: 'mq-round-banquet-tables-5-6ft', name: 'Round table, 5ft 6in', detail: 'Round folding dining table.', unit: 'each', price: null },
      { id: 'mq-round-banquet-tables-6ft', name: 'Round table, 6ft', detail: 'Round folding dining table.', unit: 'each', price: null },
      { id: 'mq-trestle-tables-4ft', name: 'Trestle table, 4ft', detail: 'Rectangular folding table.', unit: 'each', price: null },
      { id: 'mq-trestle-tables-6ft', name: 'Trestle table, 6ft', detail: 'Rectangular folding table.', unit: 'each', price: null },
      { id: 'mq-bar-stools-for-poser-tables', name: 'Bar stool', detail: 'Tall white bar stool on a chrome stem, for poser tables.', unit: 'each', price: null },
      { id: 'mq-glass-poser-tables', name: 'Glass poser table', detail: 'Tall round standing-height drinks table with a clear glass top.', unit: 'each', price: null },
      { id: 'mq-white-cubes', name: 'White cube seat', detail: 'White padded cube seat.', unit: 'each', price: null },
      { id: 'mq-white-2-seater-sofas', name: 'White two-seater sofa', detail: 'Boxy white leather-look two-seat sofa for chill-out areas.', unit: 'each', price: null },
      { id: 'mq-white-armchairs', name: 'White armchair', detail: 'Single armchair matching the white sofa.', unit: 'each', price: null },
      { id: 'mq-white-coffee-tables', name: 'White coffee table', detail: 'Low square white gloss coffee table.', unit: 'each', price: null },
    ],
  },
  {
    id: 'linen', name: 'Table linen', blurb: '', kind: 'extra', max: 200,
    items: [
      { id: 'mq-linen-white', name: 'White table linen', detail: 'White tablecloths for the dining tables.', unit: 'each', price: null },
      { id: 'mq-linen-overlay', name: 'Coloured overlay', detail: 'A coloured fabric overlay for a table.', unit: 'each', price: null },
    ],
  },
  {
    id: 'crockery', name: 'Crockery', blurb: 'Plain white china.', kind: 'extra', max: 2000,
    items: [
      { id: 'mq-side-plate-6-inches', name: 'Side plate, 6 inches', detail: 'Small plain white china plate for bread or sides.', unit: 'each', price: null },
      { id: 'mq-starter-dessert-plate-8-inches', name: 'Starter / dessert plate, 8 inches', detail: 'Plain white round plate for starters or desserts.', unit: 'each', price: null },
      { id: 'mq-starter-dessert-plate-9-5-inches', name: 'Starter / dessert plate, 9.5 inches', detail: 'Plain white round plate for starters or desserts, the larger size.', unit: 'each', price: null },
      { id: 'mq-dinner-plate-10-5-inches', name: 'Dinner plate, 10.5 inches', detail: 'Standard plain white round dinner plate.', unit: 'each', price: null },
      { id: 'mq-dinner-plate-13-inches', name: 'Dinner plate, 13 inches', detail: 'Extra-large plain white round dinner or charger plate.', unit: 'each', price: null },
      { id: 'mq-soup-plate-dessert-bowl-9-inches', name: 'Soup plate / dessert bowl, 9 inches', detail: 'Shallow wide-rimmed white bowl for soup or dessert.', unit: 'each', price: null },
      { id: 'mq-pasta-bowl-12-inches', name: 'Pasta bowl, 12 inches', detail: 'Large wide-rimmed white bowl for pasta.', unit: 'each', price: null },
      { id: 'mq-square-round-dinner-plate-10-5-inches', name: 'Rounded square dinner plate, 10.5 inches', detail: 'White dinner plate in a soft square shape with rounded corners.', unit: 'each', price: null },
      { id: 'mq-square-side-plate-6-inches', name: 'Square side plate, 6 inches', detail: 'Small square white side plate with a raised rim.', unit: 'each', price: null },
      { id: 'mq-square-starter-dessert-plate-7-5-inches', name: 'Square starter / dessert plate, 7.5 inches', detail: 'Square white plate for starters or desserts.', unit: 'each', price: null },
      { id: 'mq-square-dinner-plate-10-inches', name: 'Square dinner plate, 10 inches', detail: 'Square white dinner plate.', unit: 'each', price: null },
      { id: 'mq-rectangle-starter-plate-11-inches', name: 'Rectangle starter plate, 11 inches', detail: 'Long rectangular white plate for starters.', unit: 'each', price: null },
      { id: 'mq-platter-plate-16-inches-by-11-inches', name: 'Platter plate, 16 inches by 11 inches', detail: 'Large rectangular white serving platter.', unit: 'each', price: null },
      { id: 'mq-oval-bowl-9-inches-by-5-5-inches', name: 'Oval bowl, 9 inches by 5.5 inches', detail: 'White oval bowl.', unit: 'each', price: null },
      { id: 'mq-oatmeal-bowl-6-inches', name: 'Oatmeal bowl, 6 inches', detail: 'Deep round white bowl for cereal, porridge or soup.', unit: 'each', price: null },
      { id: 'mq-cup-and-saucer', name: 'Cup and saucer', detail: 'White teacup with matching saucer.', unit: 'each', price: null },
      { id: 'mq-espresso-cup-and-saucer', name: 'Espresso cup and saucer', detail: 'Small white espresso cup with saucer.', unit: 'each', price: null },
      { id: 'mq-tea-pot', name: 'Teapot', detail: 'White china teapot.', unit: 'each', price: null },
      { id: 'mq-coffee-pot', name: 'Coffee pot', detail: 'Tall white china coffee pot.', unit: 'each', price: null },
      { id: 'mq-ramekin-sugar-bowl-4-inches', name: 'Ramekin / sugar bowl, 4 inches', detail: 'Small white bowl for sugar, sauces or individual desserts.', unit: 'each', price: null },
      { id: 'mq-milk-jug-12oz', name: 'Milk jug', detail: 'White milk jug.', unit: 'each', price: null },
      { id: 'mq-butter-dish-6-5-inches', name: 'Butter dish, 6.5 inches', detail: 'Small square white dish for butter.', unit: 'each', price: null },
      { id: 'mq-salt-pepper-set', name: 'Salt and pepper set', detail: 'Pair of white salt and pepper shakers.', unit: 'each', price: null },
      { id: 'mq-gravy-boat', name: 'Gravy boat', detail: 'White gravy or sauce boat.', unit: 'each', price: null },
      { id: 'mq-large-salad-bowl', name: 'Large salad bowl', detail: 'Large deep white bowl for salad.', unit: 'each', price: null },
      { id: 'mq-large-oval-bowl', name: 'Large oval bowl', detail: 'Long white oval serving bowl.', unit: 'each', price: null },
    ],
  },
  {
    id: 'cutlery', name: 'Cutlery', blurb: 'Two ranges: Virtu is heavier with a flat handle, Zephyr is slimmer with a rounded handle.', kind: 'extra', max: 2000,
    items: [
      { id: 'mq-virtu-starter-knife', name: 'Virtu starter knife', detail: 'Starter knife from the heavier, flat-handled Virtu range.', unit: 'each', price: null },
      { id: 'mq-virtu-starter-fork', name: 'Virtu starter fork', detail: 'Starter fork from the Virtu range.', unit: 'each', price: null },
      { id: 'mq-virtu-mains-knife', name: 'Virtu mains knife', detail: 'Main-course knife from the Virtu range.', unit: 'each', price: null },
      { id: 'mq-virtu-mains-fork', name: 'Virtu mains fork', detail: 'Main-course fork from the Virtu range.', unit: 'each', price: null },
      { id: 'mq-virtu-dessert-spoon', name: 'Virtu dessert spoon', detail: 'Dessert spoon from the Virtu range.', unit: 'each', price: null },
      { id: 'mq-virtu-soup-spoon', name: 'Virtu soup spoon', detail: 'Round-bowled soup spoon from the Virtu range.', unit: 'each', price: null },
      { id: 'mq-zephyr-starter-knife', name: 'Zephyr starter knife', detail: 'Starter knife from the slimmer, rounded-handle Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-starter-fork', name: 'Zephyr starter fork', detail: 'Starter fork from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-mains-knife', name: 'Zephyr mains knife', detail: 'Main-course knife from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-mains-fork', name: 'Zephyr mains fork', detail: 'Main-course fork from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-dessert-spoon', name: 'Zephyr dessert spoon', detail: 'Dessert spoon from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-tea-spoon', name: 'Zephyr tea spoon', detail: 'Teaspoon from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-zephyr-soup-spoon', name: 'Zephyr soup spoon', detail: 'Soup spoon from the Zephyr range.', unit: 'each', price: null },
      { id: 'mq-pastry-fork', name: 'Pastry fork', detail: 'Small three-pronged fork for cake and pastries.', unit: 'each', price: null },
      { id: 'mq-cheese-knife', name: 'Cheese knife', detail: 'Small cheese knife with a forked tip.', unit: 'each', price: null },
      { id: 'mq-canape-spoon', name: 'Canapé spoon', detail: 'Black spoon for serving single canapés.', unit: 'each', price: null },
      { id: 'mq-serving-spoon', name: 'Serving spoon', detail: 'Large stainless steel spoon for serving.', unit: 'each', price: null },
      { id: 'mq-serving-fork', name: 'Serving fork', detail: 'Large stainless steel fork for serving.', unit: 'each', price: null },
      { id: 'mq-steak-knife', name: 'Steak knife', detail: 'Sharp steak knife with a wooden handle.', unit: 'each', price: null },
      { id: 'mq-tongs', name: 'Tongs', detail: 'Stainless steel serving tongs.', unit: 'each', price: null },
      { id: 'mq-bride-knife', name: 'Cake knife', detail: 'Long cake-cutting knife with a decorative white handle.', unit: 'each', price: null },
    ],
  },
  {
    id: 'tableware', name: 'Tableware', blurb: '', kind: 'extra', max: 500,
    items: [
      { id: 'mq-wine-bucket', name: 'Wine bucket', detail: 'Bucket for chilling a bottle of wine at the table.', unit: 'each', price: null },
      { id: 'mq-wine-cooler', name: 'Wine cooler', detail: 'Sleeve-style cooler that keeps one bottle cold.', unit: 'each', price: null },
      { id: 'mq-ice-bucket', name: 'Ice bucket', detail: 'Small bucket for ice.', unit: 'each', price: null },
      { id: 'mq-champagne-bowl', name: 'Champagne bowl', detail: 'Large bowl for chilling several bottles of champagne in ice.', unit: 'each', price: null },
      { id: 'mq-drinks-party-tub', name: 'Drinks party tub', detail: 'Clear tub for bottles and cans on ice.', unit: 'each', price: null },
      { id: 'mq-serving-tray', name: 'Serving tray', detail: 'Tray for serving drinks or canapés.', unit: 'each', price: null },
      { id: 'mq-table-number-stand', name: 'Table number stand', detail: 'Stand that holds a table number card.', unit: 'each', price: null },
      { id: 'mq-thermos-pot', name: 'Thermos pot', detail: 'Insulated flask pot for serving tea or coffee.', unit: 'each', price: null },
      { id: 'mq-bread-basket', name: 'Bread basket', detail: 'Basket for bread rolls.', unit: 'each', price: null },
      { id: 'mq-metal-cake-stand', name: 'Metal cake stand', detail: 'Metal stand for displaying a cake.', unit: 'each', price: null },
      { id: 'mq-cafetiere-12-cup', name: 'Cafetière, 12 cup', detail: 'Twelve-cup coffee press.', unit: 'each', price: null },
      { id: 'mq-rectangular-slate', name: 'Rectangular slate', detail: 'Rectangular slate board for serving.', unit: 'each', price: null },
    ],
  },
  {
    id: 'catering', name: 'Catering equipment', blurb: '', kind: 'extra', max: 20,
    items: [
      { id: 'mq-6-ring-gas-oven', name: 'Six-ring gas oven', detail: 'Commercial gas range with six burners over a double-door oven, on wheels.', unit: 'each', price: null },
      { id: 'mq-large-hot-cupboard-13amp', name: 'Large hot cupboard', detail: 'Electric heated cabinet that keeps plated food warm. Runs from a normal 13 amp socket.', unit: 'each', price: null },
      { id: 'mq-6ft-bbq-gas', name: 'Gas BBQ, 6ft', detail: 'Six-foot-wide gas barbecue for cooking in volume.', unit: 'each', price: null },
      { id: 'mq-8l-double-fryer', name: 'Double fryer, 8 litre', detail: 'Twin-tank deep fat fryer.', unit: 'each', price: null },
      { id: 'mq-water-urn-30-litre', name: 'Water urn, 30 litre', detail: '30-litre hot water boiler for tea and coffee.', unit: 'each', price: null },
      { id: 'mq-chaffing-dish', name: 'Chafing dish', detail: 'Lidded buffet warmer that keeps a tray of food hot.', unit: 'each', price: null },
    ],
  },
  {
    id: 'staging', name: 'Staging', blurb: '', kind: 'extra', max: 1,
    items: [
      { id: 'mq-stage', name: 'Stage', detail: 'A raised platform for a band, speeches or awards.', unit: 'stage', price: null },
    ],
  },
];
// MARQUEE-DATA-END

export const MARQUEE_ITEMS: MarqueeItem[] = MARQUEE_GROUPS.flatMap((g) => g.items);
export const findMarqueeItem = (id: string) => MARQUEE_ITEMS.find((i) => i.id === id) ?? null;
export const marqueeGroupOf = (id: string) => MARQUEE_GROUPS.find((g) => g.items.some((i) => i.id === id)) ?? null;

/** True when at least one marquee structure is in the quote. */
export function hasStructure(items: Readonly<Record<string, number>>): boolean {
  return MARQUEE_GROUPS.some((g) => g.kind === 'structure' && g.items.some((i) => (items[i.id] ?? 0) > 0));
}
