import { ExternalLink } from "@/components/external-link";

const posts = {
  vercel: "https://x.com/vercel/status/2116191290216124567",
  luke: "https://x.com/LukeW/status/2116554587964686777",
  lukeSystems: "https://www.lukew.com/ff/entry.asp?2164",
  emil: "https://x.com/emilkowalski/status/2116583281332503038",
  emilRepo: "https://github.com/emilkowalski/skills",
  jaimin: "https://x.com/jaimintf/status/2116566806982975848",
  abraham: "https://x.com/Abmankendrick/status/2116079274578821558",
  karri: "https://karrisaarinen.com/posts/brand-is-who-you-are/",
  canva: "https://x.com/canva/status/2115885750013321704",
  figma: "https://x.com/figma/status/2115894206409723946",
  figmaApproach: "https://www.figma.com/ai/our-approach/#model-training",
  soleio: "https://x.com/soleio/status/2116252889601695949",
  meng: "https://x.com/MengTo/status/2116404959277433240",
  luis: "https://x.com/LuisBizarro/status/2116314512718782552",
  rahul: "https://x.com/bhosale/status/2115928789104656747",
  chisa: "https://x.com/chisajoboson/status/2116264603281936592",
  hobday: "https://x.com/hobdaydesign/status/2115888457965084840",
  hobdayList: "https://anthonyhobday.com/sideprojects/interactionconcepts/",
  wuraola: "https://x.com/Wuraoladesigns/status/2116551748848345362",
  joel: "https://x.com/joellewenstein/status/2116221967225479331",
  josh: "https://x.com/joshpuckett/status/2116580060471967931",
  behzod: "https://behzod.com/blog/you-make-music",
  framer: "https://x.com/framer/status/2116283719023743400",
} as const;

function Cite({ href, children }: { href: string; children: string }) {
  return (
    <ExternalLink href={href} className="text-link">
      {children}
    </ExternalLink>
  );
}

export function HeadingEssay() {
  return (
    <div className="prose">
      <p>
        Twenty posts is not the field. It is one morning on X, bent toward people with something to
        announce. Likes measure who already has an audience. They are a bad ranking of what the work
        is becoming. The line above is counted from whatever was filed. The reading under it was
        written against 31 Oct 2026. A new morning changes the counts. It does not automatically
        rewrite this, and it should not. An argument that regenerates itself overnight sands itself
        smooth.
      </p>
      <p>
        On that morning the post that traveled was{" "}
        <Cite href={posts.vercel}>Vercel shipping Geist Serif</Cite>. A type release from a company
        designers already watch. The post with a claim about the business was{" "}
        <Cite href={posts.luke}>Luke Wroblewski</Cite>, quoting the old line that there are only two
        ways to make money in software, bundling and unbundling, and saying AI is speed-running the
        bundling phase. Seven likes, in the same file as a serif with thousands. If this is the
        daily pass, read past the reach.
      </p>
      <p>
        Luke’s point is the one to keep. When adding a surface gets cheap, products bundle faster
        than anyone is paid to refuse a feature. The interface problem is the refusal. Almost
        everything else in that file is an addition: an agent, a model, a connector, a font, a list
        of menu-bar apps. <Cite href={posts.emil}>Emil Kowalski’s note</Cite> is the rare
        subtraction. Remove the animations, then improve what is left, then check that it is
        actually fast. The{" "}
        <Cite href={posts.emilRepo}>skills</Cite> are public. The tools add motion. The work is
        taking it back out.
      </p>
      <p>
        “Unslop” is the same admission in a worse word. <Cite href={posts.jaimin}>Jaimin</Cite>{" "}
        posted it over vibe-coded phone apps. Taste, in that sentence, means quality control after
        the generator. It is not a point of view. The dressed-up version is{" "}
        <Cite href={posts.abraham}>Abraham John’s folder of DESIGN.md files</Cite>, Apple, Airbnb,
        Tesla, Shopify, Stripe, Notion, offered so a coding agent can be given “better design
        taste.” It cannot. It can be handed someone else’s measurements.{" "}
        <Cite href={posts.karri}>Karri Saarinen wrote</Cite>, the same month, that a logo and a set
        of colors only express a brand. The brand is what you stand for, and whether that belief
        changes what you ship when nobody is asking. You can hire the identity and skip the
        questions. It will look impressive and feel hollow. A markdown file of Stripe’s type ramp
        is that hire. This applies Karri to a post he did not write. His piece is about companies
        copying a maturity they have not earned. Early Linear, he says, called the product issue
        tracking instead of borrowing an older company’s surface. The fit is a reading. The warning
        is his.
      </p>
      <p>
        The more serious tool posts are a retreat from the idea that a prompt produces a product.{" "}
        <Cite href={posts.canva}>Canva’s Brush</Cite> is described, in their own post, as a model
        that sees layout, layers, and the existing design, and edits inside it. One line of text, or
        a whole deck, but against a file that already exists.{" "}
        <Cite href={posts.figma}>Figma says</Cite> specialized post-training can compete with
        frontier models on design editing, and that they score the work dimension by dimension.
        Their <Cite href={posts.figmaApproach}>note on how they train</Cite> is a narrower claim
        than a keynote, and more believable. “Make it good” does not survive a real file.{" "}
        <Cite href={posts.lukeSystems}>Luke’s piece on design systems for agents</Cite> is the
        organizational version. He has watched systems describe a product that no longer exists,
        usually “fixed” with more headcount or more review meetings. Now anyone can have an agent
        ship a page in its own voice, unless the type, the grid, and the components are what the
        agent reads every time. He is right about the failure. He is optimistic about the fix. A
        steering layer holds only if someone with judgment defined it and is still allowed to
        change it when the product moves. On his Intent site the code became the source of truth
        after the Figma file was translated, which is an admission that the design tool was not the
        system. The borrowed DESIGN.md skips the person and keeps the hex values.
      </p>
      <p>
        <Cite href={posts.soleio}>Soleio posted one sentence and a link</Cite>: the future belongs
        to designers who build. <Cite href={posts.meng}>Meng To’s three.js trailer</Cite>, made with
        Opus, is the kind of artifact that makes the sentence feel settled. He says some people
        thought the game was not real, so he posted more footage. A demonstration can be true and
        still be ahead of practice. <Cite href={posts.luis}>Luis Bizarro</Cite>, writing about
        designers opening pull requests with agents, is less flattering and more useful. Do not let
        the model write the description. Make it put a before and an after on the table. The first
        slop is often not the interface. It is the story the tool tells about what changed.{" "}
        <Cite href={posts.rahul}>Rahul’s post</Cite> that the lines have disappeared, brand
        designers learning 3D, product designers making films, motion designers shipping apps, is a
        real widening. It is also a job that ate three roles and got vaguer. Range is not a plan.
        “Designers who build” hides the split by naming it as one career. Generating and editing
        inside an existing file is one kind of work. Deciding what not to bundle, and whether the
        motion should exist, is another. Some people will do both. Most teams will not. Hiring as
        if the demo is the job is how the backlog gets a slogan and no owner.
      </p>
      <p>
        The craft in the file is not gone. It is just not what got launched.{" "}
        <Cite href={posts.chisa}>Chisa</Cite> posted two hours of type practice, reference beside
        outcome, and did not mention a model. <Cite href={posts.hobday}>Anthony Hobday</Cite> added
        one concept to a <Cite href={posts.hobdayList}>long public list</Cite>: noun then verb, or
        verb then noun. Select the text and then highlight it, or turn highlighting on and then
        select. Four likes. <Cite href={posts.wuraola}>Wuraola</Cite> is sketching dials, modals,
        and what she calls agentic thinking states. That last one is a real new surface: what the
        software looks like while it does not know yet. Most of the agent announcements skip the
        waiting and show the result. <Cite href={posts.joel}>Joel Lewenstein</Cite>, who leads
        design at Anthropic, posted a thread of small changes in the Claude app and opened it by
        saying Claude wrote the joke. Under the joke the standard is the old one. Each change is
        small. Together they are polish, stability, and joy. That post traveled. Reach and
        substance land in the same place sometimes. It is not the median of this file, and a daily
        feed is a median.
      </p>
      <p>
        <Cite href={posts.josh}>Josh Puckett</Cite> read <Cite href={posts.behzod}>Behzod Sirjani</Cite>{" "}
        and recognized a week of collaboration in it. Behzod’s essay is easy to inflate. He is
        describing his own work since leaving Slack, not handing product teams a process. Who do
        you want to play with. What do you want to make. Stop performing someone else’s sheet
        music. Let the shape of the project show up while you are already working. Labels like
        advisor and fractional describe the contract, not the work. Puckett’s sentence is the
        extension: when trust and skill are high, process falls away. Both can be true. Neither is
        a feature. <Cite href={posts.framer}>Framer’s post</Cite> about pointing ChatGPT at a Slack
        thread and having MCP apply the feedback to the live site is a sale of speed. Speed is
        useful. It does not create the trust, and it will not wait for it.
      </p>
      <p>
        The shelf under Resources is a different pile, and it should stay one. A lot of what got
        saved is galleries, generators, and lists of apps. Fine on a Tuesday. Useless as a theory
        of the next five years. The two pieces on the shelf that argue with that morning are
        Luke’s, because a system nobody is accountable for will not steer an agent, and Karri’s,
        because an identity with nothing behind it is a costume, whether a person draws it or a
        model does. The feed will keep preferring launches. That is the medium. It is not the job.
      </p>
      <p>
        Where it is heading, if one biased morning is allowed to be a sample and not an oracle: a
        split, papered over with slogans. Public credit goes to the launch and the demo. The
        product stays bearable when someone refuses a surface, deletes the motion, puts a before
        and after in the pull request, and designs the state where the model is still wrong. Those
        are not the same career because they showed up in one timeline before breakfast.
      </p>
      <p className="sources">
        Read outside the file: <Cite href={posts.behzod}>Behzod Sirjani, You make music</Cite>
        {" · "}
        <Cite href={posts.karri}>Karri Saarinen, Brand is who you are</Cite>
        {" · "}
        <Cite href={posts.lukeSystems}>Luke Wroblewski, Design systems for AI agents</Cite>.
      </p>
    </div>
  );
}
