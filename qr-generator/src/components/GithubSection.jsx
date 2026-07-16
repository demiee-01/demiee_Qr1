import { useEffect, useRef, useState } from 'react'

const REPO_URL    = import.meta.env.VITE_GITHUB_REPO_URL
const CLONE_SSH   = import.meta.env.VITE_CLONE_SSH
const CLONE_HTTPS = import.meta.env.VITE_CLONE_HTTPS

function CloneRow({ label, value, notify }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      notify('Copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      notify('Copy failed', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</span>
      <div className="flex items-center gap-2 input-glass rounded-xl px-4 py-2.5">
        <span className="flex-1 text-white/70 text-xs font-mono truncate min-w-0 select-all">{value}</span>
        <button
          onClick={copy}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(96,165,250,0.15)',
            border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(96,165,250,0.3)',
            color: copied ? '#10b981' : '#93c5fd',
          }}
        >
          {copied
            ? <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>Copied</>
            : <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>Copy</>
          }
        </button>
      </div>
    </div>
  )
}

export default function GithubSection({ notify }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full max-w-2xl md:max-w-2xl lg:max-w-3xl flex flex-col items-center gap-8 md:gap-10 lg:gap-12">

      <div className="text-center"
           style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.6s ease' }}>
        <div className="inline-flex items-center gap-2 tag-badge mb-3 md:mb-4">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GITHUB
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight"
            style={{ textShadow: '0 0 40px rgba(96,165,250,0.4)' }}>
          My Projects
        </h2>
        <p className="text-white/50 mt-2 md:mt-3 text-sm md:text-base max-w-sm md:max-w-md mx-auto">
          Open-source tools and experiments. Feel free to explore, fork, and contribute.
        </p>
      </div>

      {/* Source code card */}
      <div className="w-full glass glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col gap-5 md:gap-6 lg:gap-7"
           style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.6s ease 0.15s' }}>

        {/* Repo header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.25)' }}>
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm md:text-base">{import.meta.env.VITE_REPO_DISPLAY}</p>
              <p className="text-white/40 text-xs md:text-sm mt-0.5">QR Code Generator · v2.1</p>
            </div>
          </div>
          <a href={REPO_URL} target="_blank" rel="noreferrer"
             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 transition-all duration-200 hover:text-white no-underline"
             style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Clone rows */}
        <div className="flex flex-col gap-3">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-white/50">Clone this repo</p>
          <CloneRow label="SSH"   value={CLONE_SSH}   notify={notify} />
          <CloneRow label="HTTPS" value={CLONE_HTTPS} notify={notify} />
        </div>
      </div>

      {/* CTA */}
      <a href={import.meta.env.VITE_GITHUB_URL} target="_blank" rel="noreferrer"
         className="btn-shimmer flex items-center gap-2 px-7 py-3.5 md:px-8 md:py-4 rounded-xl text-white text-sm md:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 no-underline"
         style={{
           background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
           opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
           transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s, background 0.2s, border-color 0.2s',
         }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        View my GitHub
      </a>
    </div>
  )
}
