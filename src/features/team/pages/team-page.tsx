import { Linkedin, Mail } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { teamMembers } from "@/data/team";

export function TeamPage() {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        description="Your original members page is now a reusable team grid with cleaner cards and room for future profile data."
        title="Meet the Team"
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <Card
            className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            key={member.name}
          >
            <img
              alt={member.name}
              className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-72"
              src={member.image}
            />
            <div className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold sm:text-xl">{member.name}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{member.role}</p>
              <div className="mt-5 flex gap-2">
                <button
                  aria-label={`Email ${member.name}`}
                  className="rounded-2xl bg-slate-100 p-2 text-slate-700 transition hover:bg-brand-100 hover:text-brand-700 dark:bg-slate-900 dark:text-slate-200"
                  title={`Email ${member.name}`}
                  type="button"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  aria-label={`View ${member.name} LinkedIn profile`}
                  className="rounded-2xl bg-slate-100 p-2 text-slate-700 transition hover:bg-brand-100 hover:text-brand-700 dark:bg-slate-900 dark:text-slate-200"
                  title={`View ${member.name} LinkedIn profile`}
                  type="button"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
