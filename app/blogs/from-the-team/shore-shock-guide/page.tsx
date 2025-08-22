'use client';

import Link from 'next/link';

export default function ShoreShockBlogPost() {
  const blogPost = {
    title:
      'Shore Shock: What Happens After You Stop Sailing and How to Prepare',
    excerpt:
      "Leaving MSC is the plan for most, but no one talks about what happens next. Here's what to expect, and how to move forward on your terms.",
    author: 'The CIVSail Team',
    authorRole: 'Maritime Veterans & Founders',
    authorBio:
      'The CIVSail team consists of former mariners who have navigated the transition from sea to shore. We understand the unique challenges facing merchant mariners and are building resources to support the maritime community.',
    date: '2025-07-01',
    readTime: '15 min read',
    category: 'Career Transition',
    tags: [
      'Shore Transition',
      'Career Planning',
      'Mental Health',
      'Financial Planning',
      'MSC',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/70 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">→</span>
            <Link href="/blogs" className="hover:text-white transition-colors">
              Blogs
            </Link>
            <span className="mx-2">→</span>
            <Link
              href="/blogs/from-the-team"
              className="hover:text-white transition-colors"
            >
              From the Team
            </Link>
            <span className="mx-2">→</span>
            <span className="text-white">Shore Shock</span>
          </div>

          {/* Article Header */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium">
                {blogPost.category}
              </span>
              <span className="text-white/60">{blogPost.readTime}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {blogPost.title}
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              {blogPost.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {blogPost.author}
                  </div>
                  <div className="text-white/70">{blogPost.authorRole}</div>
                  <div className="text-white/60 text-sm">
                    Published{' '}
                    {new Date(blogPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm"
                >
                  #{tag.replace(' ', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12">
          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none article-content">
            <p className="lead">
              You spent years at sea, and you're finally home — but it doesn't
              feel the way you thought it would. The new freedom feels good…
              until it doesn't.
            </p>

            <p>The paychecks stop.</p>
            <p>The adventure fades.</p>
            <p>
              And the very parts of shore side life you went to sea to avoid
              start becoming reality again.
            </p>

            <p>
              That's Shore Shock and it hits harder than most mariners ever
              expect. One of the biggest, least talked-about challenges of a
              sailing career is what happens after you leave. MSC and sailing
              isn't just a job, it's a lifestyle. It consumes your time, your
              energy and eventually, your identity.
            </p>

            <p>
              You spend years at sea, sailing all over the world, disappearing
              from your friends and family for months at a time to come home
              with stories, cash in the bank and a feeling that you're doing
              something way cooler than your friends "working a typical 9–5."
              Sailing is more than a paycheck. It's a rhythm. A purpose. It's a
              life that's hard to explain to anyone who hasn't lived it.
            </p>

            <blockquote>
              "When you're out there, you wish you were home. But when you're
              home… you kinda wish you were out there."
            </blockquote>

            <p>
              That push-pull feeling? It's been talked about for decades in the
              veteran world. There are programs, nonprofits, entire networks
              built around helping military personnel transition back into
              civilian life. But despite sailing on the same ships, supporting
              the same missions and often deploying more frequently — mariners
              get none of that.
            </p>

            <p>
              Maybe your plan was to "sail for a few years, then come ashore."
              Great idea — in theory. Finding a job today can be difficult and
              applying for jobs, building a network and going to interviews is
              nearly impossible when you're standing watch, jumping time zones
              and wrestling the ship's internet.
            </p>

            <div className="callout-warning">
              <h4>⚠️ The Reality Check</h4>
              <p>
                Few mariners walk directly into a job after MSC, and almost all
                will take a substantial pay cut. They jump first, then figure it
                out.
              </p>
            </div>

            <p>
              For many, leaving MSC feels less like a career move and more like
              ripping a band-aid off. You go on leave... and just don't come
              back.
            </p>

            <p>
              As frustrating as MSC is, it is familiar. It is the devil you
              knew. And now, back on land, you start looking at your old ship
              like that crazy ex — unpredictable, exhausting... but weirdly kind
              of exciting. You find yourself wondering: "Was she really that
              bad?" Maybe you just needed space. Maybe you should've stuck it
              out.
            </p>

            <h2>Why It Hits So Hard</h2>

            <p>When Shore Shock hits, it hits hard.</p>

            <p>
              You knew coming ashore would mean a pay cut — but damn. You start
              browsing job listings and think, "Where's the rest of the salary?"
            </p>

            <p>
              On top of that, now you're paying for food and rent — no more
              contract hotel on S&Q. For gas and a car— no more duty driver.
              Health insurance? That ends too, and surprise: it's insanely
              expensive.
            </p>

            <div className="expense-breakdown">
              <h3>💸 New Shore Expenses</h3>
              <ul>
                <li>
                  <strong>Housing:</strong> Rent/mortgage payments you forgot
                  existed
                </li>
                <li>
                  <strong>Food:</strong> No more galley meals
                </li>
                <li>
                  <strong>Transportation:</strong> Car payments, gas, insurance
                </li>
                <li>
                  <strong>Healthcare:</strong> Expensive insurance premiums
                </li>
                <li>
                  <strong>Utilities:</strong> Electric, water, internet, phone
                </li>
              </ul>
            </div>

            <p>
              You start running the numbers, and yeah — it's not mathing. That
              pile of cash you spent years building? It's already chipping away,
              and fast.
            </p>

            <p>
              You look at the new MSC pay scales and think, "Wait… did my ex
              just get a boob job?" Suddenly that chaotic ship life you swore
              you were done with doesn't look so bad, and you know she would
              take you back.
            </p>

            <blockquote className="reflection">
              "Did I really sacrifice all those years just to come back broke
              and uncertain?"
            </blockquote>

            <p>
              You think back to the bottle service in Dubai. The gifts you sent
              home. The toys you splurged on. You were throwing money around
              when you were sailing. And now? Now you feel like just another
              person trying to figure it out.
            </p>

            <p>
              After two weeks of being home for good the novelty of you being
              home will wear off. Your friends will stop asking about your last
              trip. Your family starts asking what you're doing next. You start
              to feel like "that guy who can't stop talking about boats."
            </p>

            <p>
              And meanwhile, your mind hasn't caught up. You're still wired for
              the ship. Still waiting for the orders to show up in your email.
              Still halfway expecting to pack up and fly to your next vessel.
              But it's not coming.
            </p>

            <div className="identity-crisis">
              <h3>🔄 The Identity Crisis</h3>
              <p>
                You weren't just earning money. You were living a version of
                yourself that felt sharp, useful, respected and even
                adventurous. Now that version is gone… and you're left wondering
                who's standing in your shoes.
              </p>
            </div>

            <h2>How to Do It Right: Tools & Tactics</h2>

            <h3>
              Reframe the Feeling - Experiencing Shore Shock Does Not Mean You
              Failed
            </h3>

            <p>
              Experiencing Shore Shock doesn't mean you failed or made the wrong
              choice by leaving. It just means you're going through a completely
              normal — and wildly under-discussed — adjustment period.
            </p>

            <p>
              So, reframe your perspective. Shore Shock is real, but so was your
              plan. If you always intended to sail for a few years, then this
              phase was always going to come. That doesn't make it easy. But it
              does make it manageable.
            </p>

            <div className="reframe-box">
              <h4>🧠 Mindset Shift</h4>
              <p>
                <strong>You are not behind, you're shifting gears.</strong> That
                midlife crisis everyone else is hurtling toward? You already
                handled it. You've got unique experiences, money in the bank,
                and a clean slate.
              </p>
            </div>

            <h3>Have a Plan While Still Sailing</h3>

            <p>
              If you're still sailing, make sure you have a plan before you
              leave.
            </p>

            <p>
              Know your goals. Know your timeline. Know what you want your
              landing to look like.
            </p>

            <p>
              Sailing with MSC is like playing with fire. It can either light
              your future or burn you out. If you've been out there, you've seen
              it: the ones who stayed too long, lost steam and left not by
              choice but by sheer exhaustion.
            </p>

            <div className="planning-checklist">
              <h4>📋 Pre-Departure Checklist</h4>
              <ul>
                <li>Track your qualifications and evaluations</li>
                <li>Update your resume with maritime accomplishments</li>
                <li>Research target industries and job markets</li>
                <li>Identify transferable skills</li>
                <li>Set up LinkedIn profile</li>
                <li>Use leave time for networking and interviews</li>
              </ul>
            </div>

            <p>
              Because once you're off that last ship, you're not on leave
              anymore — you're back in the real world. And if your future feels
              intimidating? That's probably because it's undefined. Fear lives
              in the vague. So define it.
            </p>

            <h3>Avoid Lifestyle Creep</h3>

            <p>
              Here's a hard truth: your finances are likely going to take a hit
              when you come ashore.
            </p>

            <p>
              That six-figure salary you got used to? That's much harder to find
              on land, and it often requires years of experience within a
              company and a very specific career track. You got a rare
              opportunity with MSC. Protect what you earned.
            </p>

            <div className="financial-warning">
              <h4>💰 The Lifestyle Trap</h4>
              <p>
                You're at sea, looking at an overtime-laden LES, browsing Zillow
                thinking, "That $5,000/month mortgage doesn't look so bad..."
                But that mortgage is 30 years. Do you really want to sail for
                three decades just to afford a shore life you built in a moment
                of overtime-fueled optimism?
              </p>
            </div>

            <p>
              MSC didn't just give you a paycheck. It gave you breathing room.
              For 8–10 months out of the year, your savings grew because your
              expenses were nearly zero. That's where the real financial edge
              came from.
            </p>

            <p>
              <strong>
                It's not about what you make — it's about what you keep.
              </strong>
            </p>

            <h3>Don't Believe What Social Media Is Telling You</h3>

            <p>Social media isn't real life.</p>

            <p>
              Don't let the "grind season" fit-fluencer make you feel like
              you're failing because you're not flipping properties, lifting at
              4 a.m. and building a business in Bali. Don't scroll through
              Instagram thinking you've missed out on everything while you were
              at sea. You didn't.
            </p>

            <p>
              Too much time online, especially while you're transitioning, will
              mess with your head. It amplifies Shore Shock and makes it feel
              like everyone has it figured out but you. They don't. Half of them
              are broke, bored or bluffing.
            </p>

            <h3>Remember Why You Did It</h3>

            <p>
              Maybe you left to spend more time with your family. There's no
              price tag on that.
            </p>

            <p>
              Maybe it was to be home for birthdays, weddings or just regular
              Tuesday dinners. Those things matter. Those things are worth it.
              No one's going to question your decision to leave MSC.
            </p>

            <h2>Final Word: This is Your Exit Plan</h2>

            <p>You don't have to sail forever — but you do have to plan.</p>

            <p>
              Sailing is a tool. Like fire, it can keep you warm or burn you
              out. It's the wild ex — the one who leaves you hooked, broke and
              paying child support in multiple countries.
            </p>

            <p>
              Sailing is more than a paycheck. It's an experience that makes you
              more capable, more self-reliant and more interesting. For many, it
              takes time to fully walk away from and recover from. That's
              normal.
            </p>

            <p>
              You'll always have sea stories. You'll always get that starry-eyed
              reaction the first time you tell someone, "Yeah, I used to sail."
              It'll always make for a damn good conversation.
            </p>

            <h2>You're Not a Veteran — But You Still Deserve Support</h2>

            <p>
              Despite the public's confusion, we're not the Navy. We're not the
              Coast Guard. We are Merchant Mariners, not the Marines.
            </p>

            <p>
              We're not "veterans" on paper even though we supported the same
              missions, missed the same holidays and deployed side by side.
            </p>

            <p>
              Yet, when it comes to transition, resources, nonprofit programs,
              and institutional support are not available to us. So maybe — just
              maybe — if there's an entire network built to support them… It's
              time something was built for ourselves.
            </p>

            <div className="civsail-cta">
              <h3>⚓ That's What CIVSail.com Is For</h3>
              <p>
                Mariners face a unique set of challenges. And this platform
                exists to tackle them head-on. If there's a solution you want to
                see, a resource you wish existed, a community you want to be
                part of — let us know. We're building this together.
              </p>
              <p>
                <strong>
                  You know MSC won't do it — so we're building it ourselves.
                </strong>
              </p>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-white font-bold text-xl">CT</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    About The CIVSail Team
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {blogPost.authorBio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-white/20 flex justify-between">
            <Link
              href="/blogs/from-the-team"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center"
            >
              ← Back to Articles
            </Link>
            <Link
              href="/blogs/from-the-team"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center"
            >
              More Articles →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .article-content h2 {
          color: white;
          font-size: 1.875rem;
          font-weight: bold;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid rgba(59, 130, 246, 0.5);
          padding-bottom: 0.5rem;
        }

        .article-content h3 {
          color: rgb(147, 197, 253);
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .article-content h4 {
          color: rgb(147, 197, 253);
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .article-content p {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .article-content .lead {
          font-size: 1.25rem;
          color: rgb(147, 197, 253);
          font-weight: 500;
          margin-bottom: 2rem;
          border-left: 4px solid rgb(59, 130, 246);
          padding-left: 1rem;
          background: rgba(59, 130, 246, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .article-content ul,
        .article-content ol {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content strong {
          color: rgb(147, 197, 253);
          font-weight: 600;
        }

        .article-content blockquote {
          background: rgba(59, 130, 246, 0.1);
          border-left: 4px solid rgb(59, 130, 246);
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 0.5rem;
          font-style: italic;
          color: rgb(191, 219, 254);
        }

        .article-content blockquote.reflection {
          background: rgba(239, 68, 68, 0.1);
          border-left-color: rgb(239, 68, 68);
          color: rgb(252, 165, 165);
        }

        .callout-warning {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .callout-warning h4 {
          color: rgb(251, 191, 36);
          margin-top: 0;
          margin-bottom: 0.75rem;
        }

        .expense-breakdown,
        .planning-checklist {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .expense-breakdown h3,
        .planning-checklist h4 {
          color: rgb(52, 211, 153);
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .financial-warning {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .financial-warning h4 {
          color: rgb(248, 113, 113);
          margin-top: 0;
          margin-bottom: 0.75rem;
        }

        .identity-crisis,
        .reframe-box {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .identity-crisis h3,
        .reframe-box h4 {
          color: rgb(167, 139, 250);
          margin-top: 0;
          margin-bottom: 0.75rem;
        }

        .civsail-cta {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.2),
            rgba(147, 51, 234, 0.2)
          );
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
          text-align: center;
        }

        .civsail-cta h3 {
          color: rgb(96, 165, 250);
          margin-top: 0;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
