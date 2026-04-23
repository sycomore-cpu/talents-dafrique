import type { Metadata } from 'next'
import Link from 'next/link'
import { CASES } from '@/lib/constants'

export const metadata: Metadata = {
  title: "Nos Cases | Talents d'Afrique",
  description: "Explorez les 8 espaces thématiques de la communauté Talents d'Afrique : beauté, maison, couture, saveurs, savoir, zen, assistance et aide à la personne.",
}

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mb-3">
            Nos 8 Cases
          </h1>
          <p className="text-brown/60 text-base max-w-xl mx-auto">
            Chaque Case regroupe des talents spécialisés dans un domaine. Choisissez la vôtre.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 ${c.color} hover:scale-[1.03] hover:shadow-md transition-all duration-200 group`}
            >
              <span className="text-4xl">{c.icon}</span>
              <div className="text-center">
                <p className="font-semibold text-brown text-sm leading-tight">{c.label}</p>
                <p className="text-xs text-brown/50 mt-1 leading-snug line-clamp-2">{c.description}</p>
              </div>
              <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
