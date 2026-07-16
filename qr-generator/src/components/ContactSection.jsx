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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim())
      return notify('Please fill in all fields', 'error')

    setSending(true)
    try {
      const res = await fetch(
        `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
        }
      )
      if (res.ok) {
        setForm({ name: '', email: '', message: '' })
        notify("Message sent! I'll get back to you soon.", 'success')
      } else {
        notify('Failed to send. Please try again.', 'error')
      }
    } catch {
      notify('Network error. Please try again.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div ref={ref} className="w-full max-w-xl md:max-w-2xl flex flex-col items-center gap-8 md:gap-10 lg:gap-12">

      {/* Heading */}
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
      <form onSubmit={handleSubmit}
            className="w-full glass glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-9 lg:p-10 flex flex-col gap-4 md:gap-5 lg:gap-6"
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
            <textarea rows={5} placeholder="Write your message..."
              value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm lg:text-base resize-none min-w-0" />
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
