import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { CheckCircle2, X, BarChart2, Target, Search, TrendingUp, Bell, FileText, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
          Google Ads API · Live data · No CSV exports
        </span>
        <h1 className="text-5xl font-semibold text-gray-900 leading-tight mb-5">
          Find exactly where your<br />
          <span className="text-blue-600">Google Ads budget is leaking</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          AdsAudit connects directly to your Google Ads account, runs 80+ automated checks,
          and tells you exactly what to fix — ranked by dollar impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Connect Google Ads free →
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            See sample report
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          ✓ No credit card &nbsp;·&nbsp; ✓ 1 free account audit &nbsp;·&nbsp; ✓ Results in 60 seconds &nbsp;·&nbsp; ✓ Read-only access
        </p>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '$1,840', label: 'avg wasted spend found', color: 'text-red-600' },
            { value: '80+',    label: 'automated checks',       color: 'text-gray-900' },
            { value: '<60s',   label: 'full audit time',        color: 'text-gray-900' },
            { value: '4.9★',  label: 'avg user rating',        color: 'text-green-600' },
          ].map(s => (
            <div key={s.label}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">The problem</p>
        <h2 className="text-3xl font-semibold text-gray-900 mb-10">
          Most Google Ads accounts waste<br />20–40% of their budget on fixable issues
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-red-700 mb-4">❌ What most accounts look like</p>
            {[
              'Broad match keywords eating budget on irrelevant queries',
              'No negative keywords updated in 6+ months',
              'Smart bidding running without enough conversion data',
              'Conversion tag firing on every page — inflated data',
              'Ad groups with 1 ad — no rotation or A/B testing',
            ].map(t => (
              <div key={t} className="flex items-start gap-2 text-sm text-red-700 mb-2">
                <X size={14} className="shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-green-700 mb-4">✅ After an AdsAudit fix pass</p>
            {[
              'Irrelevant spend eliminated — budget working harder',
              '47+ new negative keywords added in minutes',
              'Correct bidding strategy matched to each campaign',
              'Clean, accurate conversion data for smart bidding',
              'RSA ads rated "Excellent" with 3 variants per group',
            ].map(t => (
              <div key={t} className="flex items-start gap-2 text-sm text-green-700 mb-2">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audit modules ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Audit modules</p>
          <h2 className="text-3xl font-semibold text-gray-900 mb-10">
            7 audit dimensions. Every issue ranked by dollar impact.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target,    title: 'Campaign health', desc: 'Budget pacing, ad schedules, location targeting, zero-conversion campaigns.' },
              { icon: Search,    title: 'Keywords',        desc: 'Duplicate keywords, negative gaps, match type analysis, Quality Score audit.' },
              { icon: FileText,  title: 'Ad copy & assets',desc: 'RSA strength, extension coverage, ad variation per group, copy relevance.' },
              { icon: TrendingUp,title: 'Bidding & budget',desc: 'Smart bidding readiness, budget-limited campaigns, Target CPA/ROAS setup.' },
              { icon: BarChart2, title: 'Conversion tracking', desc: 'Tag accuracy, GA4 linking, conversion values, duplicate firing detection.' },
              { icon: Users,     title: 'Audiences',       desc: 'RLSA setup, Customer Match, in-market audiences, demographic gaps.' },
            ].map(m => (
              <div key={m.title} className="bg-white border border-gray-200 rounded-2xl p-5">
                <m.icon size={20} className="text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{m.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Pricing</p>
        <h2 className="text-3xl font-semibold text-gray-900 mb-10">Simple, honest pricing</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              name: 'Free', price: '$0', sub: '1 account audit',
              features: ['All 7 audit modules', 'Issue list with fix guides', 'One-time report'],
              cta: 'Get started free', href: '/dashboard', highlight: false,
            },
            {
              name: 'Pro', price: '$49', sub: 'per month · up to 5 accounts',
              features: ['Everything in Free', 'Scheduled weekly audits', 'PDF export', 'Slack & email alerts', 'Score history'],
              cta: 'Start Pro free', href: '/dashboard', highlight: true,
            },
            {
              name: 'Agency', price: '$149', sub: 'per month · unlimited accounts',
              features: ['Everything in Pro', 'White-label PDF reports', 'Client portal access', 'AI fix suggestions', 'MCC support'],
              cta: 'Start Agency free', href: '/dashboard', highlight: false,
            },
          ].map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'border-2 border-blue-500 bg-white'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.highlight && (
                <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full self-start mb-3">
                  Most popular
                </span>
              )}
              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">{plan.sub}</p>
              <div className="flex flex-col gap-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href={plan.href}
                className={`text-sm text-center py-2.5 rounded-xl font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">FAQ</p>
          <h2 className="text-3xl font-semibold text-gray-900 mb-10">Questions answered</h2>
          <div className="flex flex-col divide-y divide-gray-200">
            {[
              {
                q: 'Will AdsAudit make changes to my campaigns?',
                a: 'No. AdsAudit is strictly read-only. It connects via a read-only OAuth scope and cannot modify your campaigns, keywords, or bids. All fixes are recommendations you apply yourself.',
              },
              {
                q: "How is this different from Google's built-in recommendations?",
                a: "Google's recommendations are designed to increase your spend. AdsAudit is designed to reduce wasted spend and improve efficiency. We flag things Google would never flag — like conversion tracking errors, duplicate keywords, and smart bidding misconfigurations.",
              },
              {
                q: 'Do you support MCC / manager accounts?',
                a: 'Yes — on the Agency plan. Connect your MCC account and audit all child accounts from one dashboard.',
              },
              {
                q: 'How long does an audit take?',
                a: 'Most audits complete in under 60 seconds. The Google Ads API returns data near-instantly, and our audit engine processes results server-side.',
              },
              {
                q: 'What data do you store?',
                a: 'Audit results and issue lists are stored in your own Google Sheet — you own the data. We store only account metadata and your audit score history on our servers.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-5">
                <h3 className="font-medium text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">Find out where your budget is going</h2>
        <p className="text-gray-500 mb-8">Free audit. No credit card. Connects in 30 seconds.</p>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors inline-block"
        >
          Connect Google Ads free →
        </Link>
        <p className="text-xs text-gray-400 mt-4">No credit card required · Free forever plan · Upgrade when you need more</p>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <BarChart2 size={16} className="text-blue-600" />
            AdsAudit
          </div>
          <p className="text-xs text-gray-400">© 2026 AdsAudit. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-400">
            <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-700 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
