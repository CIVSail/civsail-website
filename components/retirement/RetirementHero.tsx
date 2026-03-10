import Image from 'next/image';

export default function RetirementHero() {
  return (
    <section className="relative w-full bg-gradient-to-r from-[#1e3a5f] to-[#3db4c0] py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-lg bg-white px-8 py-4 shadow-lg">
            <Image
              src="/images/high3team-logo.png"
              alt="High 3 Team - Your Partner for Understanding Your Federal Retirement Options"
              width={400}
              height={52}
              className="h-auto w-64 md:w-80"
              priority
            />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Plan Your CIVMAR Retirement with Confidence
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
          Expert guidance on FERS, TSP, military buybacks, and everything you need to navigate your federal retirement.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#articles"
            className="rounded-full bg-white px-8 py-3 font-semibold text-[#1e3a5f] shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
          >
            Read the Articles
          </a>
          <a
            href="#ask-question"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#1e3a5f]"
          >
            Ask a Question
          </a>
        </div>
      </div>
    </section>
  );
}