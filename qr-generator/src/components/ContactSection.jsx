import { useEffect, useRef, useState } from 'react'

export default function ContactSection({ notify }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim())
      return notify('Please fill in all fields', 'error')
    setSending(true)
    // simulate send — wire up to your backend / EmailJS / Formspree as needed
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', message: '' })
      notify('Message sent! I\'ll get back to you soon.', 'success')
    }, 1400)
  }

  const socials = [
    { label: 'Telegram', href: import.meta.env.VITE_TELEGRAM_URL, color: '#0088cc',
      icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.2c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.41-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.8-1.58 4.59-1.85 5.1-1.86.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06-.01.12-.02.19z"/> },
    { label: 'TikTok', href: import.meta.env.VITE_TIKTOK_URL, color: '#ff0050',
      icon: <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.3 0 .6.04.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/> },
    { label: 'Gmail', href: `mailto:${import.meta.env.VITE_GMAIL}`, color: '#ea4335',
      icon: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/> },
  ]

  return (
    <div ref={ref} className="w-full max-w-xl md:max-w-2xl flex flex-col items-center gap-8 md:gap-10 lg:gap-12">

      <div className="text-center"
           style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.6s ease' }}>
        <div className="inline-flex items-center gap-2 tag-badge mb-3 md:mb-4">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          CONTACT
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight"
            style={{ textShadow: '0 0 40px rgba(96,165,250,0.4)' }}>
          Get in Touch
        </h2>
        <p className="text-white/50 mt-2 md:mt-3 text-sm md:text-base max-w-sm md:max-w-md mx-auto">
          Have a question or just want to say hi? Drop a message.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full glass glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-9 lg:p-10 flex flex-col gap-4 md:gap-5 lg:gap-6"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.6s ease 0.15s' }}>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <Field label="Name" type="text" placeholder="Your name"
            value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Field label="Email" type="email" placeholder="your@email.com"
            value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        </div>

        <div className="flex flex-col gap-1.5 lg:gap-2">
          <label className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-white/60">Message</label>
          <div className="input-glass rounded-xl px-4 lg:px-5 py-3 lg:py-4">
            <textarea
              rows={5} placeholder="Write your message..."
              value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm lg:text-base resize-none min-w-0"
            />
          </div>
        </div>

        <button type="submit" disabled={sending}
          className="btn-shimmer w-full py-3.5 lg:py-5 rounded-xl text-white font-semibold text-sm lg:text-base uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,rgba(96,165,250,0.25),rgba(167,139,250,0.25))', border: '1px solid rgba(96,165,250,0.4)', boxShadow: '0 4px 24px rgba(96,165,250,0.2)' }}>
          {sending
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            : 'Send Message'}
        </button>
      </form>

      {/* Social links */}
      <div className="flex items-center gap-3 flex-wrap justify-center"
           style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.35s' }}>
        {socials.map(s => (
          <SocialBtn key={s.label} {...s} />
        ))}
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <label className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-white/60">{label}</label>
      <div className="input-glass rounded-xl flex items-center px-4 lg:px-5 py-3 lg:py-4">
        <input type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm lg:text-base min-w-0" />
      </div>
    </div>
  )
}

function SocialBtn({ label, href, color, icon }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} target="_blank" rel="noreferrer"
       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
       className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 no-underline"
       style={{
         color: hovered ? color : 'rgba(255,255,255,0.6)',
         background: hovered ? `${color}1a` : 'rgba(255,255,255,0.07)',
         border: hovered ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.12)',
         boxShadow: hovered ? `0 6px 20px ${color}33` : 'none',
         textDecoration: 'none',
       }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">{icon}</svg>
      {label}
    </a>
  )
}
