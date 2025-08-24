import { Reveal } from "./animations/reveal";

export function LogoSection() {
  const companies = [
    { name: "TechCorp", color: "from-blue-500 to-cyan-500" },
    { name: "DesignPro", color: "from-purple-500 to-pink-500" },
    { name: "BuildMax", color: "from-emerald-500 to-teal-500" },
    { name: "ArchStudio", color: "from-orange-500 to-red-500" },
    { name: "FutureSpace", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <section className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/10 py-10">
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-sm font-medium text-muted-foreground mb-12">
              Trusted by leading companies worldwide
            </p>
          </Reveal>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companies.map((company, index) => (
              <Reveal delay={0.15 * (index + 1)} key={index}>
                <div
                  key={index}
                  className="group flex items-center space-x-3 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
                >
                  <div className="relative">
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${company.color} shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                    />
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${company.color} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40`}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {company.name}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
