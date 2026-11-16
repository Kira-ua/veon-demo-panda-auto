// Page behaviour: contact sheet, burger menu, #pidbir (tabs, brand, model → prepared WhatsApp message), phone bar.
// Everything here is progressive: without JS the links fall back to #kontakty and every brand's models are listed.

const WA = "https://wa.me/380950443443";
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const phone = window.matchMedia("(max-width: 767px)");

/* ---------- Contact sheet ---------- */
const sheet = document.querySelector<HTMLDialogElement>("[data-sheet]");
if (sheet && typeof sheet.showModal === "function") {
  document.querySelectorAll<HTMLAnchorElement>("[data-sheet-open]").forEach((a) => {
    a.setAttribute("aria-haspopup", "dialog");
    a.setAttribute("aria-controls", "napysaty");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      sheet.showModal();
    });
  });
  sheet.querySelector("[data-sheet-close]")?.addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) sheet.close();
  });
}

/* ---------- Burger menu ---------- */
const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
const mnav = document.querySelector<HTMLElement>("[data-mnav]");
function closeMenu(): void {
  if (!burger || !mnav || mnav.hidden) return;
  mnav.hidden = true;
  burger.setAttribute("aria-expanded", "false");
}
if (burger && mnav) {
  burger.addEventListener("click", () => {
    const open = mnav.hidden;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
  });
  mnav.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a[href^='#']")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mnav.hidden) {
      closeMenu();
      burger.focus();
    }
  });
}

/* ---------- #pidbir ---------- */
const root = document.querySelector<HTMLElement>("[data-pidbir]");
if (root) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-tabpanel]")];
  const brandBtns = [...root.querySelectorAll<HTMLButtonElement>("[data-brand]")];
  const groups = [...root.querySelectorAll<HTMLElement>("[data-models]")];
  const ask = root.querySelector<HTMLElement>("[data-ask]")!;
  const askHome = ask.parentElement!;
  const askCar = ask.querySelector<HTMLElement>("[data-ask-car]")!;
  const askWa = ask.querySelector<HTMLAnchorElement>("[data-ask-wa]")!;
  const askCatalog = ask.querySelector<HTMLElement>("[data-ask-catalog]")!;
  const slot = document.createElement("li");
  slot.className = "pask-li";
  const lastBrand: Record<string, string> = { china: "chery", ev: "byd" };
  let current = "";

  const restart = (el: HTMLElement, cls: string) => {
    if (reduce()) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  function resetModel(): void {
    root!.querySelectorAll<HTMLButtonElement>(".pmodel[aria-pressed='true']").forEach((b) => b.setAttribute("aria-pressed", "false"));
    ask.classList.remove("is-ready", "is-opening");
    askHome.append(ask);
    slot.remove();
  }

  function showTab(id: string, focus = false): void {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => (p.hidden = p.dataset.tabpanel !== id));
  }

  function showBrand(slug: string, animate = true): void {
    const group = groups.find((g) => g.dataset.models === slug);
    if (!group) return;
    const tab = group.dataset.group ?? "china";
    showTab(tab);
    lastBrand[tab] = slug;
    if (slug === current) return;
    current = slug;
    resetModel();
    brandBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.brand === slug)));
    groups.forEach((g) => (g.hidden = g !== group));
    if (animate) restart(group, "is-entering");
  }

  function pickModel(btn: HTMLButtonElement): void {
    const car = btn.dataset.car ?? "";
    root!.querySelectorAll<HTMLButtonElement>(".pmodel[aria-pressed='true']").forEach((b) => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    askCar.textContent = `Деталь на ${car}`;
    askWa.href = `${WA}?text=${encodeURIComponent(`Потрібна деталь на ${car}. VIN: `)}`;
    askCatalog.textContent = `Каталог запчастин ${car}`;
    if (phone.matches) {
      btn.closest("li")!.after(slot);
      slot.append(ask);
    } else {
      askHome.append(ask);
      slot.remove();
    }
    ask.classList.add("is-ready");
    restart(ask, "is-opening");
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => showBrand(lastBrand[t.dataset.tab!]));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      showBrand(lastBrand[next.dataset.tab!]);
      next.focus();
    });
  });
  brandBtns.forEach((b) => b.addEventListener("click", () => showBrand(b.dataset.brand!)));
  root.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".pmodel");
    if (btn) pickModel(btn);
  });

  // Brand links in the hero index (#pidbir-<slug>): preselect and scroll to the block.
  document.querySelectorAll<HTMLAnchorElement>("a[data-pick]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      showBrand(a.dataset.pick!);
      root.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", "#pidbir");
      brandBtns.find((b) => b.dataset.brand === a.dataset.pick)?.focus({ preventScroll: true });
    });
  });

  // The wall of model names in the hero: a mouse shortcut into #pidbir with the brand (and model) chosen.
  document.querySelector("[data-wall]")?.addEventListener("click", (e) => {
    const t = (e.target as Element).closest<SVGTextElement>("text[data-pick]");
    if (!t) return;
    const slug = t.dataset.pick!;
    showBrand(slug);
    const model = t.dataset.model;
    const btn = model ? groups.find((g) => g.dataset.models === slug)?.querySelector<HTMLButtonElement>(`.pmodel[data-model="${CSS.escape(model)}"]`) : null;
    if (btn) pickModel(btn);
    root.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#pidbir");
    (btn ?? brandBtns.find((b) => b.dataset.brand === slug))?.focus({ preventScroll: true });
  });

  const fromHash = location.hash.startsWith("#pidbir-") ? location.hash.slice(8) : "";
  showBrand(groups.some((g) => g.dataset.models === fromHash) ? fromHash : "chery", false);
  if (fromHash) root.scrollIntoView({ block: "start" });
}

/* ---------- Phone bar ---------- */
const bar = document.querySelector<HTMLElement>("[data-mbar]");
const hero = document.getElementById("top");
if (bar && hero && "IntersectionObserver" in window) {
  const set = (shown: boolean) => {
    bar.classList.toggle("is-shown", shown);
    bar.inert = !shown;
  };
  set(false);
  new IntersectionObserver(([entry]) => set(!entry.isIntersecting), { threshold: 0 }).observe(hero);
} else if (bar) {
  bar.classList.add("is-shown");
}
