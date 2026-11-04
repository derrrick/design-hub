// Content for the home page lists and the five Square case studies.
// Images live in /public/images/work. A shot with `dark` swaps with the theme.

export type Inline = string | { text: string; href: string };
export type Rich = string | Inline[];

export type Shot = {
  src: string;
  dark?: string;
  alt: string;
  caption: string;
  narrow?: boolean;
};

export type Quote = { text: string; by: string };

export type Block =
  | {
      kind: "section";
      title: string;
      body: Rich[];
      ticks?: string[];
      defs?: [string, string][];
      quote?: Quote;
      pullquote?: string;
    }
  | { kind: "shot"; shot: Shot }
  | { kind: "pair"; shots: [Shot, Shot] };

export type CaseStudy = {
  slug: string;
  title: string;
  tag: string;
  years: string;
  lede: string;
  meta: [string, Rich][];
  stats: { value: string; label: string }[];
  hero: Shot;
  blocks: Block[];
  results: string[];
  kicker?: string;
};

export type SideProject = {
  title: string;
  href: string;
  note: string;
  platform: string;
};

const img = (name: string) => `/images/work/${name}.jpg`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "unified-ai-surfaces",
    title: "Unified AI Surfaces",
    tag: "AI",
    years: "2024–25",
    lede: "Square used to bury the phone number to keep support costs down. I made the opposite bet: put answers, AI and a real person one tap away, inside the product, and prove that self-serve could still carry most of the load.",
    meta: [
      ["Role", "Product design"],
      ["With", "Cynthia Wong, Marc Dennert, Josh Berzok, Katie Herzog, Kashyap Ivaturi"],
      ["Surfaces", "Dashboard, Dashboard App, Point of Sale, Register, Terminal"],
      ["Live in", "US, CA, GB, IE, FR, ES, JP"],
    ],
    stats: [
      { value: "9.6%", label: "fewer calls to CS" },
      { value: "38%", label: "Square AI engagement, from 6.78%" },
      { value: "5.65/7", label: "CSAT on support" },
      { value: "77%", label: "positive seller sentiment" },
    ],
    hero: {
      src: img("dashboard-light"),
      dark: img("dashboard-dark"),
      alt: "Dashboard flow: a seller opens the Care Blade, searches, and reaches live support without leaving the page",
      caption: "Care Blade in Dashboard: help without leaving the task.",
    },
    blocks: [
      {
        kind: "section",
        title: "The bet",
        body: [
          "Support had been designed as a wall. Every extra click before “contact us” was a saving on a spreadsheet and a frustration for the seller. Sellers told us the opposite: being able to reach an expert, onshore, was a reason they stayed.",
          "So we made chat, phone and email plainly visible, and put the right self-serve answer in front of the seller first, in context. Agents get fewer repeat questions and more time for the hard ones.",
        ],
      },
      {
        kind: "section",
        title: "The Care Blade",
        body: [
          "The first piece was an in-product support panel in Dashboard. It shows answers for the page the seller is on, with a clear path to a person when those aren’t enough. It shipped in the US in 2025, then rolled out internationally.",
        ],
      },
      {
        kind: "section",
        title: "One system, five surfaces",
        body: [
          "The same panel scaled to the Dashboard App, Point of Sale on iOS and Android, Register and Terminal. One information architecture, one shared component set, one escalation logic to live support. It now runs at 100% of traffic in seven markets.",
        ],
      },
      {
        kind: "shot",
        shot: {
          src: img("spos-tablet-light"),
          dark: img("spos-tablet-dark"),
          alt: "Square AI on Point of Sale tablet, from a suggested question to an answer",
          caption: "Point of Sale, tablet.",
        },
      },
      {
        kind: "pair",
        shots: [
          {
            src: img("spos-mobile-light"),
            dark: img("spos-mobile-dark"),
            alt: "Square AI on Point of Sale mobile: suggested replies, question and response",
            caption: "Point of Sale, mobile.",
          },
          {
            src: img("terminal-light"),
            dark: img("terminal-dark"),
            alt: "Square AI on Terminal: suggested replies, question and response",
            caption: "Terminal.",
          },
        ],
      },
      {
        kind: "shot",
        shot: {
          src: img("register-light"),
          dark: img("register-dark"),
          alt: "Square AI on Register, same pattern on a counter display",
          caption: "Register. Same pattern, same escalation, every surface.",
        },
      },
      {
        kind: "section",
        title: "AI, in context",
        body: [
          "With the Square AI team, I designed the triggers and entry points for AI-guided troubleshooting, then built a native iOS prototype of Point of Sale, with Square AI and voice input, to test it with sellers.",
          "Voice turned out to matter. Sellers were shy about talking to their POS with customers nearby, but for the moments that would otherwise mean typing forever on a tablet, it was perfect.",
        ],
        quote: {
          text: "“He built this WAY faster than what the eng implementation time would have been.”",
          by: "Joanna Vodopivec, UX Researcher",
        },
      },
      {
        kind: "section",
        title: "Managerbot",
        body: [
          "To show where this goes next, I built Managerbot, an agentic support demo. It takes common problems like a missing bank transfer and works them in the open: it states its plan, asks before it acts, troubleshoots issues it spots in the background, and hands off to a person cleanly when it should.",
          "Four people across Square cloned it as a starting point for their own projects.",
        ],
      },
    ],
    results: [
      "Support posture moved from deflection to seller-first access.",
      "One support system across Dashboard, Point of Sale, Register and Terminal.",
      "A reusable framework for contextual, AI-assisted self-service.",
      "Faster Square AI adoption across teams.",
    ],
  },
  {
    slug: "ai-driven-help",
    title: "AI-Driven Help",
    tag: "Support",
    years: "2024–25",
    lede: "Square’s Support Center was a library of static articles written for everyone. Sellers had to translate generic advice into their own problem. I turned it into a generative help experience that answers the seller’s actual question, and took it from prototype to real sellers in six weeks.",
    meta: [
      ["Role", "Product design and prototype build"],
      ["With", "Cynthia Wong, Bushi Zhang, Marc Dennert, Virginia Vickery, Linde Chen, Avinash Shekar"],
      ["Stack", "RAG over Square’s support knowledge base, Supabase auth"],
      ["Try it", [{ text: "The prototype I shared with eng", href: "https://ai-support-prototype.vercel.app/" }]],
    ],
    stats: [
      { value: "6 weeks", label: "from concept to real sellers" },
      { value: "~100", label: "sellers in the V0 beta" },
    ],
    hero: {
      src: img("adh-home"),
      alt: "Square AI help home: How can we help? with suggested questions and a link to a human",
      caption: "Start from the question, not the article.",
    },
    blocks: [
      {
        kind: "section",
        title: "Rethink it from the question",
        body: [
          "The old Support Center made sellers search, skim and adapt. The goal was the reverse: a dynamic answer for this seller and this problem, while keeping the static articles and their search traffic intact underneath.",
        ],
      },
      {
        kind: "shot",
        shot: {
          src: img("adh-response"),
          alt: "A generated answer to a duplicate charge refund question, with step-by-step guidance",
          caption: "A grounded answer, drawn only from Square’s own documentation.",
        },
      },
      {
        kind: "section",
        title: "Build to learn",
        body: [
          "Instead of months of planning, I built a working prototype in a couple of days. Not a clickable mockup: a real app on Square’s live support knowledge base.",
        ],
        ticks: [
          "Real sign-in, with conversation history saved per seller",
          "Answers generated from retrieved docs, not from the model’s memory",
          "Search that keeps your past questions",
          "Sources from written articles to YouTube videos",
        ],
        quote: {
          text: "“This work has effectively become reference code for engineering. They’re building directly to the UI and UX patterns in this app, referencing the prompt structure, the RAG setup, and matching the same generative approach.”",
          by: "Marc Dennert",
        },
      },
      {
        kind: "pair",
        shots: [
          {
            src: img("adh-handoff"),
            alt: "The assistant offers to connect the seller to a person",
            caption: "Handoff: one tap to a person.",
          },
          {
            src: img("adh-live"),
            alt: "A live agent joins the same conversation with full context",
            caption: "Live agent joins with the full conversation.",
          },
        ],
      },
      {
        kind: "section",
        title: "No handoff gap",
        body: [
          "Specs get interpreted, questions pile up, iterations multiply. A working prototype removes that translation step. Engineering read real code, saw the patterns running, and matched the prompt structure and retrieval setup directly. The prototype became documentation that was always current.",
        ],
      },
      {
        kind: "section",
        title: "Ship in steps",
        body: [
          "V0 went to about 100 volunteers from the Square Community, all logged-in US sellers, with async feedback and live sessions. We measured four things:",
        ],
        defs: [
          ["Primary", "More automation across chat, phone and email"],
          ["Secondary", "Less traffic to static article pages"],
          ["Guardrail", "Resolution rates on par with Square AI"],
          ["Engagement", "Session length, turns, return visits"],
        ],
      },
    ],
    results: [
      "Six weeks from first concept to real sellers.",
      "A design prototype became engineering’s reference implementation.",
      "The foundation for how Square’s 4M+ sellers get help.",
    ],
  },
  {
    slug: "pricing-and-packaging",
    title: "Pricing and Packaging",
    tag: "Strategy",
    years: "2024–25",
    lede: "Leadership had two options: take phone support away from 80% of sellers and save $11.9M a year, or keep it and save nothing. I found a third, and kept most of the money without cutting off sellers when they need help most.",
    meta: [
      ["Role", "Product design, owner of CS and AM access levels"],
      ["With", "Marc Dennert, Jennifer Hogan, Anna Zhang, Josh Berzok, Cynthia Wong"],
      ["Launched", "April 2025, Dashboard, Dashboard App and Point of Sale"],
    ],
    stats: [
      { value: "$10.2M", label: "annual savings, 86% of the target" },
      { value: "2.7×", label: "more contact from sellers in their first 90 days" },
      { value: "71%", label: "of sellers rate phone support as important" },
      { value: "5.65/7", label: "CSAT, above the 5.5 goal" },
    ],
    hero: {
      src: img("pp-hero"),
      alt: "Square’s new three-plan pricing page: Free, Plus and Premium",
      caption: "Square’s new plans: one free, two paid.",
    },
    blocks: [
      {
        kind: "section",
        title: "The pressure",
        body: [
          "Square was packaging every product into three plans, and my job was to decide where support fit. The case for cutting phone from the free plan looked strong: no competitor offered it, and conjoint analysis suggested removing it would push upgrades.",
          "The risk was hidden in the model. A 10% rise in churn would wipe out the entire saving, and processing fees were going up at the same time.",
        ],
      },
      {
        kind: "section",
        title: "Change the question",
        body: [
          "I moved the debate from “why offer phone when competitors don’t?” to “what does it cost to get churn wrong?” With Product, Research and CS Operations, we built the financial models to answer it.",
          "Early concepts tested upsells inside the help experience. They felt disingenuous, and sellers would have felt it too. Onboarding is where sellers pick products, set up correctly and decide whether Square is for them. Cutting help there undermines everything after.",
        ],
        pullquote: "Phone support is not a luxury feature. It’s the foundation of a trusting relationship.",
      },
      {
        kind: "shot",
        shot: {
          src: img("pp-plan"),
          alt: "Plan diagram: support channels included in Free, Plus, Premium and Pro",
          caption: "Support access by plan. Free includes phone for the first 90 days.",
        },
      },
      {
        kind: "section",
        title: "The third option",
        body: [
          "Every new seller gets 90 days of phone support, free. It covers the window where they need help most, and lets them feel the value of a real person before deciding whether to pay for it.",
          "The savings came from AI routing and automated first answers, not from taking phone away. That kept $10.2M of the $11.9M.",
        ],
      },
      {
        kind: "pair",
        shots: [
          {
            src: img("pp-web"),
            alt: "Public pricing page highlighting the support included in each plan",
            caption: "Public web: support, plainly stated per plan.",
          },
          {
            src: img("pp-email"),
            alt: "Trial expiration email explaining what changes and how to keep phone support",
            caption: "Trial end: no surprises.",
          },
        ],
      },
      {
        kind: "section",
        title: "A home for it",
        body: [
          "The 90-day model lived in the Care Blade, the in-dashboard support panel. It launched first to 8,447 upmarket food and beverage sellers: 28% engagement against a 6.78% baseline, and 5.65 out of 7 on satisfaction.",
        ],
        quote: {
          text: "“What I did like in the new dashboard of getting help is I can understand that person’s name, understand when they’re available and how to directly contact them.”",
          by: "Courtney, Villager Coffee",
        },
      },
      {
        kind: "pair",
        shots: [
          {
            src: img("pp-blade"),
            alt: "Care Blade contact options for Free, Plus and Premium sellers",
            caption: "Care Blade, by plan.",
          },
          {
            src: img("pp-clicks"),
            alt: "Chart of weekly support clicks trending upward since the April 2025 launch",
            caption: "Weekly support clicks since launch.",
          },
        ],
      },
      {
        kind: "section",
        title: "Launch",
        body: [
          "Leadership approved the third option, and it became a cornerstone of Square’s new pricing in April 2025. Every new seller now gets it by default.",
        ],
        defs: [
          ["Q1 2025", "Dashboard App, then the pricing launch"],
          ["Q2 2025", "All seller segments"],
          ["Q4 2025", "Point of Sale"],
        ],
        quote: { text: "“You killed it, Derrick. THANK YOU”", by: "Jennifer Hogan, Product Leadership" },
      },
    ],
    results: [
      "$10.2M a year saved, 86% of the maximum.",
      "Leadership moved from cutting phone to the 90-day model.",
      "New-seller onboarding protected where it matters most.",
      "A value-first precedent for pricing the rest of Square.",
    ],
    kicker: "Access to phone support isn’t a feature. It’s a promise.",
  },
  {
    slug: "sales-and-onboarding",
    title: "Sales and Onboarding",
    tag: "Enterprise",
    years: "2023–24",
    lede: "Square’s self-serve onboarding was built for small businesses. Larger sellers, with more locations, integrations and complexity, often churned within a year. I led the design work to spot them early, route them to Sales, and give them a hands-on start.",
    meta: [
      ["Role", "Design lead"],
      ["With", "Kirin Bettadapur, Abhi Basu, Daeus Jorento, Jason Papale, Rhiannon Zivin, Marc Dennert, Libby Canup"],
      ["Goal", "Find high-value sellers sooner, and activate them deeper"],
    ],
    stats: [],
    hero: {
      src: img("so-handoff-light"),
      dark: img("so-handoff-dark"),
      alt: "Upmarket handoff: a qualified seller is offered a call with a Square Pro",
      caption: "Upmarket handoff to Sales, mid-onboarding.",
    },
    blocks: [
      {
        kind: "section",
        title: "Route them early",
        body: [
          "“Upmarket Intercept” reads signals during sign-up, like business size, expected volume and what the seller says they’re trying to do. When a seller qualifies, they’re offered a direct line to a Square Pro and a personalized start instead of the self-serve path.",
        ],
      },
      {
        kind: "section",
        title: "Design the whole journey",
        body: [
          "Connect mapped the entire upmarket lifecycle, from first contact with Sales through activation and ongoing account management, with support, onboarding and retention touchpoints in one model.",
        ],
      },
      {
        kind: "section",
        title: "Prototype the conversation",
        body: [
          "With UX Research, I ran deep interviews and usability tests, then synthesized them with Sales and Operations so the design held up for sellers and for the people serving them. I also built generative AI prototypes of conversational onboarding that adapt to a seller’s business and technical needs.",
        ],
        quote: {
          text: "“Great job fostering, prioritizing, planning and executing on outstanding and groundbreaking research with Gen AI prototypes on Conversational Onboarding.”",
          by: "Gio, PM, Ecosystem Onboarding",
        },
      },
      {
        kind: "section",
        title: "Align the room",
        body: [
          "I worked with Sales leadership, Operations and Product Marketing on feasibility, KPIs and success metrics, and co-built the decks and prototypes used at the offsite where the strategy was set.",
        ],
      },
    ],
    results: [
      "A repeatable way to identify and serve high-value sellers.",
      "Lower onboarding churn risk for upmarket prospects.",
      "Product, Sales and Operations working from one plan.",
      "The design foundation for Square’s upmarket sales motion.",
    ],
  },
  {
    slug: "internal-tools",
    title: "Internal Tools and Operations",
    tag: "Ops",
    years: "2023–24",
    lede: "The tools behind Square’s Support and Sales teams shape what sellers experience as much as the product does. I redesigned four of them: a pricing tool that helps close deals, one view of every seller, a rebuilt live chat, and a way for designers to prototype in code.",
    meta: [
      ["Role", "Product design, research and prototyping"],
      ["With", "Charu Waghulde, Philip Martin, Zach Johnson, Eric Quach, Prabhu Ginesh"],
      ["For", "Support advocates, account managers, Sales, design teams"],
    ],
    stats: [
      { value: "32%", label: "of US Sales-closed wins with custom pricing use the TCO tool" },
      { value: "60%", label: "of Sales-closed GPV runs through those deals" },
    ],
    hero: {
      src: img("it-tco-light"),
      dark: img("it-tco-dark"),
      alt: "TCO tool: entering a prospect’s business basics, then their products and services",
      caption: "TCO tool: build the comparison in two steps.",
    },
    blocks: [
      {
        kind: "section",
        title: "TCO tool",
        body: [
          "Sales needed a credible way to show Square’s cost advantage against Toast, Clover and others. I designed, prototyped and researched a Total Cost of Ownership tool that pulls in a merchant’s data automatically and compares real costs, plan by plan, in real time.",
          "I ran feedback sessions with Sales to cut manual entry, and designed the seller-facing PDF that reps hand to prospects. It became core collateral for high-value and competitive deals.",
        ],
        quote: {
          text: "“The TCO tool gave Sales a credible, visual way to prove Square’s long-term value. It was pretty intuitive for a first version… this solved a real need.”",
          by: "Doug Foote, Sales",
        },
      },
      {
        kind: "shot",
        shot: {
          src: img("it-pdf-light"),
          dark: img("it-pdf-dark"),
          alt: "Seller-facing PDF: You’ll save $1,494 with Square, with a line-by-line comparison against competitors",
          caption: "The PDF a rep leaves with the prospect.",
          narrow: true,
        },
      },
      {
        kind: "section",
        title: "One view of the seller",
        body: [
          "With engineering and research, I reworked Regulator, the internal account tool, inside Seller360. Advocates, account managers and Sales now see a seller’s account, history and status in one place, with less switching between tools and faster answers.",
        ],
      },
      {
        kind: "shot",
        shot: {
          src: img("it-360-light"),
          dark: img("it-360-dark"),
          alt: "Seller360 business overview with risk alerts, open support cases and financial overview",
          caption: "Seller360: account, risk and open cases at a glance.",
        },
      },
      {
        kind: "section",
        title: "Live chat, rebuilt",
        body: [
          "I led design for both sides of chat, seller and advocate, during the move from Helpshift to an integrated Twilio system. Consistent patterns, escalation logic and accessibility standards meant faster responses, better reliability, and one less costly vendor.",
        ],
      },
      {
        kind: "section",
        title: "Teaching designers to build",
        body: [
          "Designers were stuck in static Figma files while AI tools made working prototypes cheap. I ran a hands-on workshop teaching the Trust design team to build with Claude Code, from setup to their first working prototype, and presented Claude Code and GitHub sessions in a design leadership prototyping series. The format became a framework other teams could reuse.",
        ],
      },
    ],
    results: [
      "Sales got a tool tied directly to revenue.",
      "Internal teams share one view of every seller.",
      "A scalable in-house chat platform replaced a vendor.",
      "Designers prototype in code without waiting on engineering.",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export const sideProjects: SideProject[] = [
  { title: "Cutline", href: "https://joincutline.com", note: "honest, human photo critique community", platform: "iOS, Web" },
  { title: "Punch", href: "https://thepunch.studio/", note: "independent type foundries, hand-picked", platform: "Web" },
  { title: "Artifact", href: "https://www.fartifact.space/", note: "sites that prove the web is still exciting", platform: "Web" },
  { title: "Vector", href: "https://www.vectordrop.app/", note: "drop a raster, get a clean SVG", platform: "macOS" },
  { title: "HPW", href: "https://healthpricewatch.com/", note: "price transparency compliance", platform: "SaaS, Web" },
];
