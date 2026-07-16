import { useState, useEffect } from 'react'

const links = [
  { label: 'Home',    href: '#home' },
  { label: 'GitHub',  href: '#github' },
  { label: 'Contact', href: '#contact' },
]

function scrollTo(id) {
  const el = document.querySelector(id)
  if (!el) return
  const offset = 64
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [activeId,  setActiveId]  = useState('home')

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      // highlight active section
      const ids = ['home', 'github', 'contact']
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && el.getBoundingClientRect().top <= 80) {
          setActiveId(ids[i]); break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'rgba(10,15,40,0.80)' : 'rgba(10,15,40,0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.35)' : 'none',
        transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">

        {/* Logo */}
        <button onClick={() => scrollTo('#home')}
          className="flex items-center gap-2.5 group bg-transparent border-none cursor-pointer p-0">
          <img src="/logo.jpg" alt="Demlee logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ boxShadow: '0 0 16px rgba(96,165,250,0.5)' }} />
          <span className="text-white font-bold text-base sm:text-lg tracking-tight"
                style={{ textShadow: '0 0 20px rgba(96,165,250,0.4)' }}>
            Dem<span style={{ color: '#60a5fa' }}>lee</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link, i) => (
            <NavLink key={link.label} link={link} delay={i * 80}
              mounted={mounted} active={activeId === link.href.slice(1)} />
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg transition-all duration-300"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          aria-label="Toggle menu">
          <span className="w-4 h-0.5 bg-white/80 rounded-full transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
          <span className="w-4 h-0.5 bg-white/80 rounded-full transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="w-4 h-0.5 bg-white/80 rounded-full transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? '200px' : '0px',
          opacity: menuOpen ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}>
        <div className="px-4 py-3 flex flex-col gap-1">
          {links.map((link, i) => (
            <button key={link.label}
              onClick={() => { scrollTo(link.href); setMenuOpen(false) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left"
              style={{
                color: activeId === link.href.slice(1) ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                background: activeId === link.href.slice(1) ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)',
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-12px)',
                border: 'none', cursor: 'pointer',
              }}>
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ link, delay, mounted, active }) {
  const [hovered, setHovered] = useState(false)
  const highlight = hovered || active

  return (
    <button
      onClick={() => scrollTo(link.href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-none cursor-pointer"
      style={{
        color: highlight ? '#fff' : 'rgba(255,255,255,0.6)',
        background: highlight ? 'rgba(96,165,250,0.12)' : 'transparent',
        border: highlight ? '1px solid rgba(96,165,250,0.25)' : '1px solid transparent',
        transform: mounted ? 'translateY(0)' : 'translateY(-8px)',
        opacity: mounted ? 1 : 0,
        transition: `color 0.2s, background 0.2s, border-color 0.2s, transform 0.5s ease ${delay + 300}ms, opacity 0.5s ease ${delay + 300}ms`,
      }}
    >
      {link.label}
      {/* active dot */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300"
        style={{ background: '#60a5fa', opacity: active ? 1 : 0, transform: `translateX(-50%) scale(${active ? 1 : 0})` }} />
    </button>
  )
}
