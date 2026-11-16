// Client facts for the demo homepage. Source of truth: veon/client.json (copied here so site/ builds on its own).
// Never add a fact that is not in client.json.

export type BrandGroup = "china" | "ev";

export interface Brand {
  slug: string;
  name: string;
  /** Label in the hero index and the brand list. */
  label: string;
  group: BrandGroup;
  models: string[];
}

/** C-025 (models by brand, menu «Машини» of the current site) and C-005 (brands). */
export const brands: Brand[] = [
  { slug: "chery", name: "Chery", label: "Chery", group: "china", models: ["Amulet", "Forza", "QQ", "Kimo", "Jaggi", "M11", "Elara", "E5", "Tiggo", "Tiggo FL", "Tiggo 2", "Tiggo 2 Pro", "Tiggo 3", "Tiggo 4", "Tiggo 4 Pro", "Tiggo 5", "Tiggo 7", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Eastar", "Crosseastar", "Beat", "Karry", "Arrizo 3"] },
  { slug: "jetour", name: "Jetour", label: "Jetour", group: "china", models: ["X50", "X70", "X70 FL", "X70 Plus", "X90 Plus", "Dashing"] },
  { slug: "geely", name: "Geely", label: "Geely", group: "china", models: ["CK", "CK1F", "CK2", "Emgrand EC7", "Emgrand EC7RV", "MK", "MK2", "MK2 Cross", "LC", "LC Cross", "GC5", "GC6", "GC7", "FC", "SL", "Emgrand EX7", "Emgrand EC8", "Atlas Pro", "Monjaro", "Coolray"] },
  { slug: "great-wall", name: "Great Wall", label: "Great Wall / Haval", group: "china", models: ["Hover", "Safe", "Haval H2", "H3", "H5", "H6", "H6 III", "M2", "M4", "Jolion", "Dargo", "Voleex C10", "C30", "C50", "Pegasus", "Deer", "Wingle", "Wingle 5", "Wingle 6", "Wingle 7"] },
  { slug: "lifan", name: "Lifan", label: "Lifan", group: "china", models: ["320", "520", "620", "X50", "X60"] },
  { slug: "faw", name: "FAW", label: "FAW", group: "china", models: ["V5", "X40", "X80"] },
  { slug: "ravon", name: "Ravon", label: "Ravon", group: "china", models: ["R2", "R4"] },
  { slug: "zaz", name: "ZAZ", label: "ZAZ", group: "china", models: ["Vida"] },
  { slug: "chana", name: "Chana", label: "Chana", group: "china", models: ["Benni"] },
  { slug: "byd", name: "BYD", label: "BYD", group: "ev", models: ["Song Plus", "Song Plus EV", "Song Pro", "Song L", "Yuan Plus", "Yuan Up", "Yuan Pro", "Sea Lion 05", "Sea Lion 05 EV", "Sea Lion 06", "Sea Lion 06 EV", "Sea Lion 07", "Sea Lion 07 EV", "Seagull", "Leopard 3", "Leopard 5", "F3", "F6", "S6"] },
  { slug: "zeekr", name: "Zeekr", label: "Zeekr", group: "ev", models: ["001", "001 FL", "007", "009", "X", "7X", "8X", "9X"] },
  { slug: "tesla", name: "Tesla", label: "Tesla", group: "ev", models: ["Model S", "Model 3", "Model X", "Model Y"] },
  { slug: "volkswagen", name: "Volkswagen", label: "Volkswagen ID", group: "ev", models: ["ID.4", "ID.4X", "ID.5", "ID.6", "ID.6X", "ID.UNYX"] },
];

/** Order of the wall in the hero: the catalogue order of C-025. */
export const wallOrder = ["chery", "jetour", "geely", "great-wall", "byd", "zeekr", "volkswagen", "tesla", "lifan", "faw", "ravon", "zaz", "chana"];

export const modelCount = brands.reduce((n, b) => n + b.models.length, 0);

/** Ukrainian plural: 1 модель, 2–4 моделі, 5+ моделей. */
export function modelsWord(n: number): string {
  const d = n % 10;
  const h = n % 100;
  if (d === 1 && h !== 11) return "модель";
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return "моделі";
  return "моделей";
}

const WA = "https://wa.me/380950443443";
/** WhatsApp with a prepared message; the model text is filled in by pidbir. */
export function waLink(car?: string): string {
  const text = car ? `Потрібна деталь на ${car}. VIN: ` : "Потрібна деталь. VIN: ";
  return `${WA}?text=${encodeURIComponent(text)}`;
}

/** company.contacts (client.json). */
export const contacts = {
  phones: [
    { text: "095-044-34-43", href: "tel:+380950443443" },
    { text: "096-044-34-43", href: "tel:+380960443443" },
  ],
  email: { text: "pandapartsua@gmail.com", href: "mailto:pandapartsua@gmail.com" },
  telegram: "https://t.me/panda_auto_ua",
  viber: { text: "+380 93 488 39 68", href: "viber://chat?number=%2B380934883968" },
  /** C-009 */
  callCenter: [
    { days: "Пн–Пт", time: "9:00–20:00" },
    { days: "Сб", time: "9:00–17:00" },
    { days: "Нд", time: "9:00–16:00" },
  ],
};

/** company.contacts.addresses. Uzhhorod without a house number until the client decides (R-113). */
export const points = [
  {
    city: "Ужгород",
    address: "вул. Героїв 128-ї бригади",
    note: "Пункт видачі та склад",
    hours: [
      { days: "Пн–Пт", time: "9:00–18:00" },
      { days: "Сб", time: "9:00–15:00" },
      { days: "Нд", time: "вихідний" },
    ],
    map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Ужгород, вул. Героїв 128-ї бригади"),
  },
  {
    city: "Харків",
    address: "пл. Ю. Кононенка, 1, магазин «Периметр 9»",
    note: "Пункт видачі та склад",
    hours: [
      { days: "Пн–Пт", time: "10:00–13:00" },
      { days: "Сб", time: "10:00–12:00" },
      { days: "Нд", time: "вихідний" },
    ],
    map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Харків, пл. Ю. Кононенка, 1"),
  },
];

/** socials with status confirmed. */
export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/panda_auto.ua/" },
  { name: "Facebook", href: "https://www.facebook.com/panda.auto.ua/" },
  { name: "TikTok", href: "https://www.tiktok.com/@panda_autoparts" },
  { name: "YouTube", href: "https://www.youtube.com/@PandaAutoParts" },
];

/** products_services[1], business_lines[1]. */
export const groups = [
  "Двигун і вихлоп",
  "Запчастини для ТО",
  "Комплекти",
  "КПП",
  "Кузов і скло",
  "Охолодження",
  "Підвіска і рульове",
  "Гальма",
  "Електрика",
  "Автотовари",
];

export const FUTURE = "Розділ у розробці";
