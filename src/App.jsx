import React, { useEffect, useRef, useState } from "react";
import chatImg from "./assets/chat.png";
import plansImg from "./assets/plans.png";
import alternativesImg from "./assets/alternatives.png";
import cartImg from "./assets/cart.png";
/* ----------------------------------------------------------------------
   Icons — small inline SVGs, no external dependencies
---------------------------------------------------------------------- */
const icon = (children, extra = {}) => (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="22"
    height="22"
    {...extra}
    {...props}
  >
    {children}
  </svg>
);

const IconCart = icon(
  <>
    <circle cx="9" cy="21" r="1.4" />
    <circle cx="18" cy="21" r="1.4" />
    <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
  </>
);
const IconBrain = icon(
  <>
    <path d="M9 2.5a3 3 0 0 0-3 3v.2A3 3 0 0 0 4 8.5v1A3 3 0 0 0 4.8 14a3 3 0 0 0 2.8 4.5h.4a2.5 2.5 0 0 0 2.5-2.5V5a2.5 2.5 0 0 0-1.5-2.5Z" />
    <path d="M15 2.5a3 3 0 0 1 3 3v.2A3 3 0 0 1 20 8.5v1A3 3 0 0 1 19.2 14a3 3 0 0 1-2.8 4.5h-.4A2.5 2.5 0 0 1 13.5 16V5A2.5 2.5 0 0 1 15 2.5Z" />
  </>
);
const IconList = icon(
  <>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4.5 6.5 5.5 7.5 7.5 5.2" />
    <path d="M4.5 12.5 5.5 13.5 7.5 11.2" />
    <path d="M4.5 18.5 5.5 19.5 7.5 17.2" />
  </>
);
const IconSearch = icon(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </>
);
const IconWallet = icon(
  <>
    <rect x="2.5" y="6" width="19" height="13" rx="2.2" />
    <path d="M2.5 10h19" />
    <circle cx="17" cy="14" r="1.1" fill="currentColor" stroke="none" />
  </>
);
const IconSliders = icon(
  <>
    <path d="M4 6h8M16 6h4M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="14" cy="6" r="2" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="16" cy="18" r="2" />
  </>
);
const IconZap = icon(<path d="M12 2 4 13h6l-1 9 8-11h-6l1-9Z" />);
const IconPlay = icon(<path d="M7 4.5v15l13-7.5L7 4.5Z" fill="currentColor" stroke="none" />);
const IconGithub = icon(
  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.92.68 1.85v2.75c0 .26.18.57.69.48A10 10 0 0 0 12 2Z" />
);
const IconArrowRight = icon(<path d="M5 12h13M13 6l6 6-6 6" />);
const IconMessage = icon(<path d="M21 11.5a8.4 8.4 0 0 1-1.05 4.06L21 21l-5.66-1.05A8.5 8.5 0 1 1 21 11.5Z" />);
const IconLayers = icon(
  <>
    <path d="M12 2 2.5 7 12 12l9.5-5L12 2Z" />
    <path d="M2.5 12 12 17l9.5-5" />
    <path d="M2.5 16.5 12 21.5l9.5-5" />
  </>
);
const IconChevronDown = icon(<path d="M6 9l6 6 6-6" />);
const IconStar = icon(<path d="M12 2.5l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 16.9l-5.7 3.1 1.1-6.3-4.6-4.5 6.4-.9L12 2.5Z" fill="currentColor" stroke="none" />);

/* ----------------------------------------------------------------------
   Reveal-on-scroll hook
---------------------------------------------------------------------- */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------------
   Hero demo data — goal → generated cart
---------------------------------------------------------------------- */
const DEMOS = [
  {
    goal: "Plan a 4-day Goa trip",
    items: [
      { name: "Quick-dry beachwear set", price: 1499 },
      { name: "Waterproof phone pouch", price: 399 },
      { name: "40L travel backpack", price: 2199 },
      { name: "Portable Bluetooth speaker", price: 1799 },
      { name: "Reef-safe sunscreen SPF 50", price: 449 },
    ],
  },
  {
    goal: "Set up a home office",
    items: [
      { name: "Adjustable laptop stand", price: 1299 },
      { name: "Ergonomic seat cushion", price: 899 },
      { name: "LED desk lamp", price: 749 },
      { name: "Cable management kit", price: 399 },
      { name: "Noise-cancelling headphones", price: 4999 },
    ],
  },
  {
    goal: "Start a fitness journey",
    items: [
      { name: "Yoga mat, 6mm", price: 899 },
      { name: "Adjustable dumbbell set", price: 2999 },
      { name: "Resistance band kit", price: 599 },
      { name: "Smart fitness band", price: 1999 },
      { name: "Insulated shaker bottle", price: 299 },
    ],
  },
  {
    goal: "Prepare for board exams",
    items: [
      { name: "Desk organiser set", price: 549 },
      { name: "Highlighter pack of 10", price: 199 },
      { name: "Study lamp with timer", price: 899 },
      { name: "Noise-isolating earplugs", price: 249 },
      { name: "Weekly planner whiteboard", price: 749 },
    ],
  },
];

function HeroDemo() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];
    const demo = DEMOS[demoIndex];

    setTypedText("");
    setVisibleCount(0);

    for (let i = 1; i <= demo.goal.length; i++) {
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setTypedText(demo.goal.slice(0, i));
        }, 40 * i)
      );
    }

    const typeDuration = demo.goal.length * 40 + 500;

    demo.items.forEach((_, idx) => {
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setVisibleCount(idx + 1);
        }, typeDuration + idx * 340)
      );
    });

    const total = typeDuration + demo.items.length * 340 + 2600;
    timeouts.push(
      setTimeout(() => {
        if (!cancelled) setDemoIndex((demoIndex + 1) % DEMOS.length);
      }, total)
    );

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [demoIndex]);

  const demo = DEMOS[demoIndex];
  const total = demo.items
    .slice(0, visibleCount)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="device">
      <div className="device__bar">
        <span className="device__dot device__dot--r" />
        <span className="device__dot device__dot--y" />
        <span className="device__dot device__dot--g" />
        <span className="device__url">quickcart.app</span>
      </div>

      <div className="device__body">
        <div className="qc-prompt">
          <span className="qc-prompt__label">Your goal</span>
          <div className="qc-prompt__input">
            <IconMessage width="18" height="18" />
            <span>
              {typedText}
              <span className="qc-cursor" />
            </span>
          </div>
        </div>

        <div className="qc-plan">
          <div className="qc-plan__head">
            <span>Generated plan</span>
            <span className="qc-pill">{visibleCount} of {demo.items.length} items</span>
          </div>

          <ul className="qc-plan__list">
            {demo.items.map((item, idx) => (
              <li
                key={`${demoIndex}-${idx}`}
                className={`qc-plan__item ${idx < visibleCount ? "is-in" : ""}`}
              >
                <span className="qc-plan__check">
                  <IconArrowRight width="0" height="0" style={{ display: "none" }} />
                  {idx < visibleCount && (
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5 9.5 17 19 7" />
                    </svg>
                  )}
                </span>
                <span className="qc-plan__name">{item.name}</span>
                <span className="qc-plan__price">₹{item.price.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>

          <div className="qc-plan__foot">
            <div className="qc-plan__total">
              <span>Estimated total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            <button className="qc-plan__cta" type="button">
              Add plan to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   Content data
---------------------------------------------------------------------- */
const PROBLEMS = [
  {
    icon: IconSearch,
    title: "Search is product-first",
    body: "You know the outcome you want — a trip, a workout routine, a tidy desk — but the search box only understands SKUs and keywords.",
  },
  {
    icon: IconList,
    title: "Plans live outside the store",
    body: "Checklists end up in notes apps, spreadsheets and group chats, completely disconnected from the place you'll actually buy things.",
  },
  {
    icon: IconWallet,
    title: "Budgets break one tab at a time",
    body: "Without a running total across categories, it's easy to over-buy on one thing and forget another essential entirely.",
  },
];

const FEATURES = [
  {
    icon: IconBrain,
    title: "Goal understanding",
    body: "Reads open-ended goals like “set up a home office” and extracts the intent, context and any constraints you mention.",
  },
  {
    icon: IconList,
    title: "Smart checklists",
    body: "Breaks the goal into a categorised, quantity-aware shopping list — the same way an experienced friend would plan it.",
  },
  {
    icon: IconSearch,
    title: "Product matching",
    body: "Searches the catalog for each item and ranks options by price, rating and relevance to your goal.",
  },
  {
    icon: IconWallet,
    title: "Budget aware",
    body: "Set a spending cap and QuickCart fits the whole plan within it, flagging trade-offs when something has to give.",
  },
  {
    icon: IconSliders,
    title: "Fully editable",
    body: "Swap, remove or resize any item before it touches your cart — QuickCart proposes, you decide.",
  },
  {
    icon: IconCart,
    title: "One-tap cart",
    body: "Sends the finished, approved plan straight to your Amazon cart — ready for checkout in a single tap.",
  },
];

const ARCHITECTURE = [
  {
    title: "Goal input",
    body: "User types a plain-language goal — a trip, a routine, a project — with any extra context like dates or budget.",
  },
  {
    title: "Goal parser",
    body: "A language model extracts intent, categories, quantities and constraints from the sentence and structures them.",
  },
  {
    title: "Checklist generator",
    body: "Converts the structured intent into an itemised shopping list, grouped by category and priority.",
  },
  {
    title: "Catalog search & ranking",
    body: "Each item is matched against the product catalog and ranked by price, rating and relevance.",
  },
  {
    title: "Cart assembler",
    body: "Builds a draft cart that fits the stated budget, surfacing trade-offs when items don't fit.",
  },
  {
    title: "Cart hand-off",
    body: "On approval, the finished plan is pushed to the cart for checkout in one step.",
  },
];

const SCREENSHOTS = [
  {
    title: "AI Shopping Assistant",
    tag: "01 · Goal Planning",
    image: chatImg,
  },
  {
    title: "Smart Plans",
    tag: "02 · Planning Dashboard",
    image: plansImg,
  },
  {
    title: "Alternative Recommendations",
    tag: "03 · Cost Optimization",
    image: alternativesImg,
  },
  {
    title: "Final Shopping Cart",
    tag: "04 · Checkout Ready",
    image: cartImg,
  },
];

const TEAM = [
  { name: "Shreya Baboota", role: "Team lead · Backend & APIs", initials: "SB", gradient: "var(--g-orange)" },
  { name: "Deepshika Singh", role: "Frontend & UX", initials: "DS", gradient: "var(--g-blue)" },
  { name: "Vaishnavi Tripathi", role: "Recommendation Engine", initials: "VT", gradient: "var(--g-dark)" },
];

/* ----------------------------------------------------------------------
   Reusable screenshot mockup (pure CSS, no images)
---------------------------------------------------------------------- */
function ScreenshotMockup({ variant }) {
  switch (variant) {
    case 0:
      return (
        <div className="mock mock--chat">
          <div className="mock__bubble mock__bubble--user">Plan a 4-day Goa trip, budget ₹8,000</div>
          <div className="mock__bubble mock__bubble--ai">
            <span className="mock__line mock__line--60" />
            <span className="mock__line mock__line--80" />
            <span className="mock__line mock__line--40" />
          </div>
          <div className="mock__input">
            <span className="mock__line mock__line--30" />
            <span className="mock__chip">Send</span>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="mock mock--list">
          {["Beachwear", "Travel essentials", "Electronics", "Health & care"].map((cat, i) => (
            <div className="mock__group" key={cat}>
              <span className="mock__group-title">{cat}</span>
              <div className="mock__rows">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div className="mock__row" key={j}>
                    <span className="mock__check" />
                    <span className={`mock__line mock__line--${50 + ((i + j) % 3) * 10}`} />
                    <span className="mock__price" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case 2:
      return (
        <div className="mock mock--grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="mock__card" key={i}>
              <span className="mock__thumb" />
              <span className="mock__line mock__line--70" />
              <span className="mock__line mock__line--40" />
              <div className="mock__meta">
                <span className="mock__price" />
                <span className="mock__rating" />
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="mock mock--cart">
          <div className="mock__cart-rows">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="mock__cart-row" key={i}>
                <span className="mock__thumb mock__thumb--sm" />
                <span className={`mock__line mock__line--${60 + (i % 2) * 15}`} />
                <span className="mock__price" />
              </div>
            ))}
          </div>
          <div className="mock__budget">
            <div className="mock__budget-head">
              <span className="mock__line mock__line--40" />
              <span className="mock__line mock__line--20" />
            </div>
            <div className="mock__budget-bar">
              <span className="mock__budget-fill" />
            </div>
          </div>
        </div>
      );
  }
}

/* ----------------------------------------------------------------------
   Main component
---------------------------------------------------------------------- */
export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="qc">
      <Styles />

      {/* ---------------- Header ---------------- */}
      <header className="qc-header">
        <div className="qc-container qc-header__inner">
          <a href="#top" className="qc-logo">
            <span className="qc-logo__mark">
              <IconCart width="18" height="18" />
            </span>
            QuickCart
          </a>

          <nav className={`qc-nav ${navOpen ? "is-open" : ""}`}>
            <a href="#problem" onClick={() => setNavOpen(false)}>Problem</a>
            <a href="#solution" onClick={() => setNavOpen(false)}>Solution</a>
            <a href="#features" onClick={() => setNavOpen(false)}>Features</a>
            <a href="#architecture" onClick={() => setNavOpen(false)}>Architecture</a>
            <a href="#team" onClick={() => setNavOpen(false)}>Team</a>
            <a href="#demo" className="qc-nav__cta" onClick={() => setNavOpen(false)}>Try the demo</a>
          </nav>

          <button
            className={`qc-burger ${navOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section id="top" className="qc-hero">
        <div className="qc-container qc-hero__grid">
          <div className="qc-hero__content">
            <span className="qc-eyebrow">
              <IconStar width="13" height="13" />
              Built for Amazon HackOn 2026
            </span>
            <h1 className="qc-h1">
              Tell it your goal.
              <br />
              <span className="qc-h1__accent">It builds the cart.</span>
            </h1>
            <p className="qc-lead">
              QuickCart turns a single sentence — a trip, a workout plan, an exam season,
              a new desk setup — into a complete, editable shopping plan with real
              products, quantities and a budget that adds up.
            </p>

            <div className="qc-hero__actions">
 <a
  href="https://quick-cart-chi-rosy.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="qc-btn qc-btn--primary"
>
  <IconPlay width="16" height="16" />
  Launch QuickCart
</a>

<a
  href="#architecture"
  className="qc-btn qc-btn--ghost"
>
  How It Works
</a>
</div>
<p
  style={{
    marginTop: "12px",
    color: "#6b7280",
    fontSize: "0.95rem",
    fontWeight: "500"
  }}
>
</p>

            <div className="qc-hero__tags">
              <span>Powered by</span>
              <span className="qc-tag">Amazon Product Catalog API</span>
              <span className="qc-tag">Amazon Cart API</span>
              <span className="qc-tag">LLM goal parsing</span>
            </div>
          </div>

          <div className="qc-hero__visual">
            <HeroDemo />
            <div className="qc-hero__glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ---------------- Problem ---------------- */}
      <section id="problem" className="qc-section">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">The problem</span>
            <h2 className="qc-h2">
              Shopping for a goal, not a product, is still
              <br className="qc-br-desktop" /> twenty tabs and a spreadsheet
            </h2>
            <p className="qc-lead qc-lead--center">
              Online stores are built around search and SKUs. The moment your need is a
              bigger goal — “get ready for a trip”, “start working out” — the experience
              falls apart into research, comparison and guesswork.
            </p>
          </Reveal>

          <div className="qc-grid-3">
            {PROBLEMS.map((p, i) => (
              <Reveal as="article" className="qc-card qc-card--problem" key={p.title} style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="qc-card__icon qc-card__icon--muted">
                  <p.icon />
                </div>
                <h3 className="qc-h3">{p.title}</h3>
                <p className="qc-body">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Solution ---------------- */}
      <section id="solution" className="qc-section qc-section--soft">
        <div className="qc-container">
          <div className="qc-split">
            <Reveal className="qc-split__text">
              <span className="qc-eyebrow qc-eyebrow--muted">The solution</span>
              <h2 className="qc-h2 qc-h2--left">One sentence becomes one cart</h2>
              <p className="qc-body">
                Describe what you're trying to do, in your own words. QuickCart's
                language model figures out what you actually need, builds a structured
                checklist, finds matching products for every item, and assembles a
                ready-to-edit cart that respects your budget.
              </p>
              <p className="qc-body">
                You stay in control the whole time — every item can be swapped,
                resized or removed before anything is added to your real Amazon cart.
              </p>
            </Reveal>

            <Reveal className="qc-flow" style={{ transitionDelay: "120ms" }}>
              <div className="qc-flow__step">
                <div className="qc-flow__icon">
                  <IconMessage />
                </div>
                <span className="qc-flow__label">Describe your goal</span>
              </div>
              <IconArrowRight className="qc-flow__arrow" />
              <div className="qc-flow__step">
                <div className="qc-flow__icon qc-flow__icon--accent">
                  <IconBrain />
                </div>
                <span className="qc-flow__label">QuickCart builds the plan</span>
              </div>
              <IconArrowRight className="qc-flow__arrow" />
              <div className="qc-flow__step">
                <div className="qc-flow__icon">
                  <IconCart />
                </div>
                <span className="qc-flow__label">Review & send to cart</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="qc-section">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">What's inside</span>
            <h2 className="qc-h2">Everything a goal needs to become a cart</h2>
          </Reveal>

          <div className="qc-grid-3">
            {FEATURES.map((f, i) => (
              <Reveal as="article" className="qc-card" key={f.title} style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                <div className="qc-card__icon">
                  <f.icon />
                </div>
                <h3 className="qc-h3">{f.title}</h3>
                <p className="qc-body">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Architecture ---------------- */}
      <section id="architecture" className="qc-section qc-section--soft">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">Under the hood</span>
            <h2 className="qc-h2">From sentence to checkout, in six steps</h2>
            <p className="qc-lead qc-lead--center">
              A straightforward pipeline connects natural language to Amazon's product
              and cart infrastructure.
            </p>
          </Reveal>

          <div className="qc-timeline">
            {ARCHITECTURE.map((step, i) => (
              <Reveal as="div" className="qc-timeline__item" key={step.title} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="qc-timeline__marker">
                  <span className="qc-timeline__num">{String(i + 1).padStart(2, "0")}</span>
                  {i < ARCHITECTURE.length - 1 && <span className="qc-timeline__line" />}
                </div>
                <div className="qc-timeline__content">
                  <h3 className="qc-h3">{step.title}</h3>
                  <p className="qc-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Screenshots ---------------- */}
      <section id="screens" className="qc-section">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">See it in action</span>
            <h2 className="qc-h2">From a sentence to a finished plan</h2>
          </Reveal>

          <div className="qc-grid-2">
            {SCREENSHOTS.map((s, i) => (
              <Reveal as="figure" className="qc-screenshot" key={s.title} style={{ transitionDelay: `${(i % 2) * 100}ms` }}>
                <div className="qc-screenshot__frame">
                  <div className="qc-screenshot__bar">
                    <span className="device__dot device__dot--r" />
                    <span className="device__dot device__dot--y" />
                    <span className="device__dot device__dot--g" />
                  </div>
                  <div className="qc-screenshot__body">
                    <img
  src={s.image}
  alt={s.title}
  className="real-screenshot"
/>
                  </div>
                </div>
                <figcaption>
                  <span className="qc-screenshot__tag">{s.tag}</span>
                  <span className="qc-screenshot__title">{s.title}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Demo video ---------------- */}
      <section id="demo" className="qc-section qc-section--soft">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">Watch it work</span>
            <h2 className="qc-h2">A three-minute walkthrough</h2>
            <p className="qc-lead qc-lead--center">
              From “plan a Goa trip” to a finished, budgeted cart — recorded end to end.
            </p>
          </Reveal>

          <Reveal className="qc-video">
  <iframe
    src="https://drive.google.com/file/d/1n6PGSRD4XtBHYEf01krgzcziB7eTv3ia/preview"
    width="100%"
    height="100%"
    allow="autoplay"
    style={{
      border: "none",
      borderRadius: "24px",
      width: "100%",
      height: "100%"
    }}
  />
</Reveal>
        </div>
      </section>

      {/* ---------------- Team ---------------- */}
      <section id="team" className="qc-section">
        <div className="qc-container">
          <Reveal className="qc-section__head">
            <span className="qc-eyebrow qc-eyebrow--muted">The team</span>
            <h2 className="qc-h2">Built in 48 hours, by three people</h2>
          </Reveal>

          <div className="qc-grid-4">
            {TEAM.map((member, i) => (
              <Reveal as="article" className="qc-card qc-card--team" key={member.name} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="qc-avatar" style={{ background: member.gradient }}>
                  {member.initials}
                </div>
                <h3 className="qc-h3 qc-h3--center">{member.name}</h3>
                <p className="qc-body qc-body--center">{member.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="qc-footer">
        <div className="qc-container qc-footer__inner">
          <a href="#top" className="qc-logo qc-logo--footer">
            <span className="qc-logo__mark">
              <IconCart width="18" height="18" />
            </span>
            QuickCart
          </a>
          <p className="qc-footer__tag">
            From goal to cart — a concept built for Amazon HackOn 2026.
          </p>
          <div className="qc-footer__links">
            <a href="#problem">Problem</a>
            <a href="#features">Features</a>
            <a href="#architecture">Architecture</a>
            <a href="#team">Team</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------------------------------------------------
   Styles
---------------------------------------------------------------------- */
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      :root {
        --white: #ffffff;
        --bg-soft: #F7F7F5;
        --ink: #131A22;
        --ink-soft: #565959;
        --ink-faint: #9aa3ab;
        --orange: #FF9900;
        --orange-dark: #E07F00;
        --orange-soft: #FFF4E0;
        --blue: #146EB4;
        --green: #067D62;
        --border: #E7E9EC;
        --radius-sm: 10px;
        --radius-md: 16px;
        --radius-lg: 26px;
        --shadow-sm: 0 1px 2px rgba(19,26,34,0.05), 0 1px 1px rgba(19,26,34,0.04);
        --shadow-md: 0 12px 28px rgba(19,26,34,0.08);
        --shadow-lg: 0 28px 64px rgba(19,26,34,0.14);
        --container: 1180px;
        --font-display: 'Space Grotesk', 'Inter', sans-serif;
        --font-body: 'Inter', sans-serif;
        --font-mono: 'JetBrains Mono', monospace;

        --g-orange: linear-gradient(135deg, #FF9900, #E07F00);
        --g-blue: linear-gradient(135deg, #2A9CDB, #146EB4);
        --g-dark: linear-gradient(135deg, #3B4754, #131A22);
        --g-green: linear-gradient(135deg, #2FAE8E, #067D62);
      }

      *, *::before, *::after { box-sizing: border-box; }

      .qc {
        font-family: var(--font-body);
        color: var(--ink);
        background: var(--white);
        line-height: 1.55;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      .qc h1, .qc h2, .qc h3 {
        font-family: var(--font-display);
        line-height: 1.15;
        margin: 0;
        letter-spacing: -0.01em;
      }

      .qc p { margin: 0; }

      .qc a { color: inherit; text-decoration: none; }

      .qc-container {
        max-width: var(--container);
        margin: 0 auto;
        padding: 0 24px;
      }

      /* ---------------- Reveal animation ---------------- */
      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.7s cubic-bezier(.22,.61,.36,1), transform 0.7s cubic-bezier(.22,.61,.36,1);
      }
      .reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1; transform: none; transition: none; }
      }

      /* ---------------- Header ---------------- */
      .qc-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(255,255,255,0.82);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
      }
      .qc-header__inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
        gap: 24px;
      }
      .qc-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.15rem;
        color: var(--ink);
        white-space: nowrap;
      }
      .qc-logo__mark {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: var(--orange);
        color: var(--white);
        flex-shrink: 0;
      }
      .qc-nav {
        display: flex;
        align-items: center;
        gap: 28px;
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--ink-soft);
      }
      .qc-nav a { transition: color 0.2s ease; }
      .qc-nav a:hover { color: var(--ink); }
      .qc-nav__cta {
        padding: 10px 18px;
        border-radius: 999px;
        background: var(--ink);
        color: var(--white) !important;
        font-weight: 600;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .qc-nav__cta:hover { background: var(--orange); transform: translateY(-1px); }

      .qc-burger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--white);
        cursor: pointer;
        padding: 0;
      }
      .qc-burger span {
        display: block;
        width: 18px;
        height: 2px;
        margin: 0 auto;
        background: var(--ink);
        border-radius: 2px;
        transition: transform 0.25s ease, opacity 0.25s ease;
      }
      .qc-burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .qc-burger.is-open span:nth-child(2) { opacity: 0; }
      .qc-burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

      /* ---------------- Buttons ---------------- */
      .qc-btn {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 14px 26px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.98rem;
        border: 1px solid transparent;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
      .qc-btn--primary {
        background: var(--orange);
        color: var(--white);
        box-shadow: 0 10px 24px rgba(255,153,0,0.32);
      }
      .qc-btn--primary:hover {
        background: var(--orange-dark);
        transform: translateY(-2px);
        box-shadow: 0 14px 30px rgba(255,153,0,0.4);
      }
      .qc-btn--ghost {
        background: var(--white);
        color: var(--ink);
        border-color: var(--border);
      }
      .qc-btn--ghost:hover {
        border-color: var(--ink);
        transform: translateY(-2px);
      }

      /* ---------------- Eyebrow / headings ---------------- */
      .qc-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 14px;
        border-radius: 999px;
        background: var(--orange-soft);
        color: var(--orange-dark);
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        font-family: var(--font-mono);
        text-transform: uppercase;
      }
      .qc-eyebrow--muted {
        background: var(--bg-soft);
        color: var(--ink-soft);
      }

      .qc-h1 {
        font-size: clamp(2.6rem, 5.4vw, 4.4rem);
        font-weight: 700;
        margin: 22px 0 20px;
      }
      .qc-h1__accent { color: var(--orange); }

      .qc-h2 {
        font-size: clamp(1.8rem, 3.4vw, 2.6rem);
        font-weight: 700;
        margin-top: 14px;
        text-align: center;
          color: #131A22;
        
      }
      .qc-h2--left { text-align: left; }

      .qc-h3 {
        font-size: 1.15rem;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .qc-h3--center { text-align: center; }

      .qc-lead {
        font-size: 1.08rem;
        color: var(--ink-soft);
        max-width: 560px;
      }
      .qc-lead--center {
        max-width: 680px;
        margin: 18px auto 0;
        text-align: center;
      }

      .qc-body {
  font-size: 1rem;
  color: #374151;
  line-height: 1.8;
}
      .qc-body--center { text-align: center; }

      .qc-br-desktop { display: none; }
      @media (min-width: 760px) { .qc-br-desktop { display: inline; } }

      /* ---------------- Hero ---------------- */
      .qc-hero {
        padding: 64px 0 96px;
        position: relative;
      }
      .qc-hero__grid {
        display: grid;
        grid-template-columns: 1.05fr 1fr;
        gap: 64px;
        align-items: center;
      }
      .qc-hero__content { max-width: 560px; }

      .qc-hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 30px;
      }

      .qc-hero__tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 36px;
        font-size: 0.85rem;
        color: var(--ink-faint);
      }
      .qc-tag {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        padding: 6px 11px;
        border-radius: 8px;
        border: 1px solid var(--border);
        color: var(--ink-soft);
        background: var(--bg-soft);
      }

      .qc-hero__visual {
        position: relative;
        display: flex;
        justify-content: center;
      }
      .qc-hero__glow {
        position: absolute;
        width: 460px;
        height: 460px;
        right: -120px;
        top: 30%;
        background: radial-gradient(circle, rgba(255,153,0,0.16), transparent 70%);
        z-index: -1;
        pointer-events: none;
      }

      /* ---------------- Device mockup ---------------- */
      .device {
        width: 100%;
        max-width: 420px;
        border-radius: var(--radius-lg);
        background: var(--white);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        animation: floatY 6s ease-in-out infinite;
      }
      @keyframes floatY {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .device { animation: none; }
      }

      .device__bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
        background: var(--bg-soft);
      }
      .device__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
      }
      .device__dot--r { background: #FF5F57; }
      .device__dot--y { background: #FEBC2E; }
      .device__dot--g { background: #28C840; }
      .device__url {
        margin-left: 8px;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--ink-faint);
      }

      .device__body { padding: 22px; }

      .qc-prompt { margin-bottom: 18px; }
      .qc-prompt__label {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ink-faint);
        margin-bottom: 8px;
      }
      .qc-prompt__input {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--bg-soft);
        color: var(--ink);
        font-weight: 600;
        font-size: 0.98rem;
        min-height: 52px;
      }
      .qc-prompt__input svg { color: var(--orange); flex-shrink: 0; }

      .qc-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        margin-left: 2px;
        background: var(--orange);
        vertical-align: text-bottom;
        animation: blink 1s step-end infinite;
      }
      @keyframes blink { 50% { opacity: 0; } }

      .qc-plan {
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        overflow: hidden;
      }
      .qc-plan__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 16px;
        font-weight: 600;
        font-size: 0.92rem;
        border-bottom: 1px solid var(--border);
      }
      .qc-pill {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 500;
        padding: 4px 9px;
        border-radius: 999px;
        background: var(--orange-soft);
        color: var(--orange-dark);
      }
      .qc-plan__list {
        list-style: none;
        margin: 0;
        padding: 6px 8px;
        min-height: 196px;
      }
      .qc-plan__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 8px;
        border-radius: 10px;
        font-size: 0.88rem;
        opacity: 0;
        transform: translateX(-10px);
        transition: opacity 0.35s ease, transform 0.35s ease, background 0.2s ease;
      }
      .qc-plan__item.is-in {
        opacity: 1;
        transform: translateX(0);
      }
      .qc-plan__item.is-in:hover { background: var(--bg-soft); }
      .qc-plan__check {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1.5px solid var(--border);
        display: grid;
        place-items: center;
        color: var(--green);
        flex-shrink: 0;
        transition: border-color 0.2s ease;
      }
      .qc-plan__item.is-in .qc-plan__check {
        border-color: var(--green);
        background: rgba(6,125,98,0.08);
      }
      .qc-plan__name {
        flex: 1;
        color: var(--ink);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .qc-plan__price {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: var(--ink-soft);
        flex-shrink: 0;
      }
      .qc-plan__foot {
        padding: 14px 16px;
        border-top: 1px solid var(--border);
        background: var(--bg-soft);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      .qc-plan__total {
        display: flex;
        flex-direction: column;
        font-size: 0.82rem;
        color: var(--ink-soft);
      }
      .qc-plan__total strong {
        font-family: var(--font-mono);
        font-size: 1.2rem;
        color: var(--ink);
      }
      .qc-plan__cta {
        padding: 11px 18px;
        border-radius: 999px;
        border: none;
        background: var(--ink);
        color: var(--white);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: background 0.2s ease;
        white-space: nowrap;
      }
      .qc-plan__cta:hover { background: var(--orange); }

      /* ---------------- Section layout ---------------- */
      .qc-section { padding: 88px 0; }
      .qc-section--soft { background: var(--bg-soft); }
      .qc-section__head {
        text-align: center;
        max-width: 760px;
        margin: 0 auto 56px;
      }

      .qc-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .qc-grid-4 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
      .qc-grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }

      .qc-card {
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 28px;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .qc-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: transparent;
      }
      .qc-card--problem { background: var(--bg-soft); }
      .qc-card--problem:hover { background: var(--white); }

      .qc-card__icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: var(--orange-soft);
        color: var(--orange-dark);
        margin-bottom: 18px;
      }
      .qc-card__icon--muted { background: var(--white); color: var(--ink-soft); border: 1px solid var(--border); }

      .qc-card--team {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .qc-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--white);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 16px;
      }

      /* ---------------- Solution split ---------------- */
      .qc-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 56px;
        align-items: center;
      }
      .qc-split__text .qc-body { margin-top: 16px; }

      .qc-flow {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 28px;
        box-shadow: var(--shadow-sm);
      }
      .qc-flow__step {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        background: var(--bg-soft);
      }
      .qc-flow__icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--white);
        border: 1px solid var(--border);
        display: grid;
        place-items: center;
        color: var(--ink-soft);
        flex-shrink: 0;
      }
      .qc-flow__icon--accent {
        background: var(--orange);
        color: var(--white);
        border-color: var(--orange);
      }
      .qc-flow__label { font-weight: 600; font-size: 0.96rem; }
      .qc-flow__arrow {
        color: var(--ink-faint);
        align-self: center;
        transform: rotate(90deg);
      }

      /* ---------------- Architecture timeline ---------------- */
      .qc-timeline {
        max-width: 760px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }
      .qc-timeline__item {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: 24px;
      }
      .qc-timeline__marker {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .qc-timeline__num {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: var(--white);
        border: 1.5px solid var(--orange);
        color: var(--orange-dark);
        font-family: var(--font-mono);
        font-weight: 600;
        font-size: 0.9rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }
      .qc-timeline__line {
        flex: 1;
        width: 1.5px;
        background: var(--border);
        margin: 6px 0;
        min-height: 36px;
      }
      .qc-timeline__content { padding-bottom: 36px; }

      /* ---------------- Screenshots ---------------- */
      .qc-screenshot__frame {
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        overflow: hidden;
        background: var(--white);
        box-shadow: var(--shadow-sm);
        transition: box-shadow 0.25s ease, transform 0.25s ease;
      }
      .qc-screenshot:hover .qc-screenshot__frame {
        box-shadow: var(--shadow-md);
        transform: translateY(-4px);
      }
      .qc-screenshot__bar {
        display: flex;
        gap: 8px;
        padding: 12px 14px;
        background: var(--bg-soft);
        border-bottom: 1px solid var(--border);
      }
      .qc-screenshot__body {
  padding: 0;
  min-height: 320px;
  background: var(--white);
}
  .real-screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
      .qc-screenshot figcaption {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-top: 14px;
        flex-wrap: wrap;
      }
      .qc-screenshot__tag {
        font-family: var(--font-mono);
        font-size: 0.74rem;
        color: var(--orange-dark);
        background: var(--orange-soft);
        padding: 3px 9px;
        border-radius: 999px;
        flex-shrink: 0;
      }
      .qc-screenshot__title { font-weight: 600; font-size: 0.95rem; }

      /* ----- mock content shapes ----- */
      .mock__line {
        display: block;
        height: 9px;
        border-radius: 5px;
        background: var(--border);
      }
      .mock__line--20 { width: 20%; }
      .mock__line--30 { width: 30%; }
      .mock__line--40 { width: 40%; }
      .mock__line--50 { width: 50%; }
      .mock__line--60 { width: 60%; }
      .mock__line--70 { width: 70%; }
      .mock__line--80 { width: 80%; }

      .mock--chat { display: flex; flex-direction: column; gap: 14px; height: 100%; justify-content: flex-end; }
      .mock__bubble {
        max-width: 80%;
        padding: 12px 14px;
        border-radius: 14px;
        font-size: 0.8rem;
      }
      .mock__bubble--user {
        align-self: flex-end;
        background: var(--orange);
        color: var(--white);
        font-weight: 600;
      }
      .mock__bubble--ai {
        align-self: flex-start;
        background: var(--bg-soft);
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 70%;
      }
      .mock__input {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 14px;
        border: 1px solid var(--border);
        border-radius: 999px;
      }
      .mock__chip {
        margin-left: auto;
        font-size: 0.74rem;
        font-weight: 600;
        background: var(--ink);
        color: var(--white);
        padding: 5px 12px;
        border-radius: 999px;
      }

      .mock--list { display: flex; flex-direction: column; gap: 14px; }
      .mock__group-title {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--ink-faint);
        margin-bottom: 8px;
      }
      .mock__rows { display: flex; flex-direction: column; gap: 8px; }
      .mock__row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--bg-soft);
      }
      .mock__check {
        width: 14px;
        height: 14px;
        border-radius: 4px;
        border: 1.5px solid var(--green);
        background: rgba(6,125,98,0.1);
        flex-shrink: 0;
      }
      .mock__price {
        width: 44px;
        height: 9px;
        border-radius: 5px;
        background: var(--orange-soft);
        margin-left: auto;
      }

      .mock--grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .mock__card {
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .mock__thumb {
        display: block;
        width: 100%;
        height: 48px;
        border-radius: 6px;
        background: linear-gradient(135deg, var(--orange-soft), var(--bg-soft));
      }
      .mock__thumb--sm { width: 36px; height: 36px; flex-shrink: 0; }
      .mock__meta { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
      .mock__rating { width: 28px; height: 9px; border-radius: 5px; background: var(--bg-soft); }

      .mock--cart { display: flex; flex-direction: column; gap: 18px; height: 100%; justify-content: space-between; }
      .mock__cart-rows { display: flex; flex-direction: column; gap: 10px; }
      .mock__cart-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid var(--border);
      }
      .mock__budget {
        border-top: 1px solid var(--border);
        padding-top: 14px;
      }
      .mock__budget-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .mock__budget-bar {
        height: 8px;
        border-radius: 999px;
        background: var(--bg-soft);
        overflow: hidden;
      }
      .mock__budget-fill {
        display: block;
        width: 72%;
        height: 100%;
        background: var(--orange);
        border-radius: 999px;
      }

      /* ---------------- Video ---------------- */
      .qc-video {
        position: relative;
        max-width: 880px;
        margin: 0 auto;
        aspect-ratio: 16 / 9;
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, #1c2530, #131A22 60%, #2a1d0f);
        display: grid;
        place-items: center;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      }
      .qc-video__shine {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 30%, rgba(255,153,0,0.25), transparent 55%);
        pointer-events: none;
      }
      .qc-video__play {
        position: relative;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        border: none;
        background: var(--orange);
        color: var(--white);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 0 0 0 rgba(255,153,0,0.5);
      }
      .qc-video__play:hover {
        transform: scale(1.08);
      }
      .qc-video__play::after {
        content: "";
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        border: 1.5px solid rgba(255,153,0,0.4);
        animation: pulseRing 2.4s ease-out infinite;
      }
      @keyframes pulseRing {
        0% { transform: scale(0.9); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      .qc-video__duration {
        position: absolute;
        bottom: 18px;
        right: 22px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.35);
        padding: 5px 11px;
        border-radius: 999px;
      }

      /* ---------------- Footer ---------------- */
      .qc-footer {
        border-top: 1px solid var(--border);
        padding: 48px 0;
      }
      .qc-footer__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
      }
      .qc-logo--footer { font-size: 1.05rem; }
      .qc-footer__tag {
        color: var(--ink-soft);
        font-size: 0.92rem;
        max-width: 420px;
      }
      .qc-footer__links {
        display: flex;
        gap: 22px;
        font-size: 0.88rem;
        color: var(--ink-soft);
        flex-wrap: wrap;
        justify-content: center;
      }
      .qc-footer__links a:hover { color: var(--orange-dark); }

      /* ====================================================================
         Responsive
      ==================================================================== */
      @media (max-width: 1024px) {
        .qc-hero__grid { grid-template-columns: 1fr; gap: 48px; }
        .qc-hero__content { max-width: 640px; margin: 0 auto; text-align: center; }
        .qc-hero__actions, .qc-hero__tags { justify-content: center; }
        .qc-lead { margin: 0 auto; }
        .qc-hero__visual { order: -1; }
        .qc-split { grid-template-columns: 1fr; gap: 40px; }
        .qc-split__text { text-align: center; }
        .qc-h2--left { text-align: center; }
        .qc-split__text .qc-body { margin: 16px auto 0; max-width: 560px; }
        .qc-grid-3 { grid-template-columns: repeat(2, 1fr); }
        .qc-grid-4 { grid-template-columns: repeat(2, 1fr); }
      }

      @media (max-width: 860px) {
        .qc-nav {
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 12px 24px 18px;
          transform: translateY(-12px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .qc-nav a { padding: 10px 0; width: 100%; }
        .qc-nav.is-open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .qc-nav__cta { margin-top: 6px; text-align: center; }
        .qc-burger { display: flex; }
      }

      @media (max-width: 720px) {
        .qc-section { padding: 64px 0; }
        .qc-hero { padding: 40px 0 64px; }
        .qc-grid-3 { grid-template-columns: 1fr; }
        .qc-grid-4 { grid-template-columns: repeat(2, 1fr); }
        .qc-grid-2 { grid-template-columns: 1fr; }
        .qc-section__head { margin-bottom: 40px; }
        .qc-timeline__item { grid-template-columns: 48px 1fr; gap: 16px; }
        .qc-timeline__num { width: 40px; height: 40px; font-size: 0.8rem; }
      }

      @media (max-width: 480px) {
        .qc-h1 { font-size: clamp(2.2rem, 9vw, 2.8rem); }
        .qc-h2 { font-size: 1.6rem; }
        .device__body { padding: 16px; }
        .qc-plan__list { min-height: 220px; }
        .qc-grid-4 { grid-template-columns: 1fr; }
        .mock--grid { grid-template-columns: repeat(2, 1fr); }
        .qc-btn { width: 100%; justify-content: center; }
        .qc-hero__actions { flex-direction: column; }
      }
    `}</style>
  );
}