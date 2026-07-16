import { useState, useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Notification from './components/Notification'
import Navbar from './components/Navbar'
import GithubSection from './components/GithubSection'
import ContactSection from './components/ContactSection'

export default function App() {
  const [url, setUrl]             = useState('')
  const [name, setName]           = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [progress, setProgress]   = useState(0)
  const [notif, setNotif]         = useState(null)
  const qrRef = useRef(null)
  const setQrRef = useCallback((node) => { qrRef.current = node }, [])

  const notify = (msg, type = 'info') => {
    setNotif({ msg, type })
    setTimeout(() => setNotif(null), 3200)
  }

  const handleGenerate = () => {
    if (!url.trim()) return notify('Please enter a URL', 'error')
    try { new URL(url) } catch {
      return notify('Enter a valid URL (e.g. https://example.com)', 'error')
    }
    setGenerated(false)
    setLoading(true)
    setProgress(0)
    let p = 0
    const iv = setInterval(() => {
      p += 12
      setProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(iv); setTimeout(() => { setLoading(false); setGenerated(true) }, 200) }
    }, 70)
  }

  const buildEnhancedCanvas = useCallback(() => {
    const source = qrRef.current?.querySelector('canvas')
    if (!source) return null
    const size = 420, pad = 44, r = 56, nh = name.trim() ? 56 : 0
    const c = document.createElement('canvas')
    c.width = size; c.height = size + nh
    const ctx = c.getContext('2d')
    const rr = (x, y, w, h, rad) => {
      ctx.beginPath()
      ctx.moveTo(x + rad, y)
      ctx.lineTo(x + w - rad, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rad)
      ctx.lineTo(x + w, y + h - rad); ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
      ctx.lineTo(x + rad, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rad)
      ctx.lineTo(x, y + rad); ctx.quadraticCurveTo(x, y, x + rad, y)
      ctx.closePath()
    }
    rr(0, 0, size, size + nh, r); ctx.fillStyle = '#ffffff'; ctx.fill()
    ctx.shadowColor = 'rgba(30,60,114,0.1)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8
    rr(6, 6, size - 12, size + nh - 12, r - 4); ctx.fillStyle = '#f8fafc'; ctx.fill()
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0
    ctx.drawImage(source, pad, pad, size - pad * 2, size - pad * 2)
    if (name.trim()) {
      ctx.font = 'bold 22px Inter, Arial, sans-serif'
      ctx.fillStyle = '#1e3c72'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(name.trim(), size / 2, size + nh / 2)
    }
    return c
  }, [name])

  const handleDownload = () => {
    const c = buildEnhancedCanvas()
    if (!c) return notify('Generate a QR code first', 'error')
    c.toBlob(blob => {
      const a = document.createElement('a')
      const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const pfx = name.trim() ? `${name.trim().replace(/[^a-zA-Z0-9]/g, '_')}-` : ''
      a.download = `${pfx}qr-${ts}.png`
      a.href = URL.createObjectURL(blob)
      a.click(); URL.revokeObjectURL(a.href)
      notify(`QR code${name.trim() ? ` for ${name.trim()}` : ''} downloaded!`, 'success')
    }, 'image/png', 1)
  }

  const handleCopy = async () => {
    const c = buildEnhancedCanvas()
    if (!c) return notify('Generate a QR code first', 'error')
    try {
      await new Promise(res => c.toBlob(async blob => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        res()
      }, 'image/png', 1))
      notify('Copied to clipboard!', 'success')
    } catch { notify('Copy failed — try right-clicking the QR code', 'error') }
  }

  const qrSize = typeof window !== 'undefined'
    ? window.innerWidth >= 1024 ? 280 : window.innerWidth >= 768 ? 256 : window.innerWidth < 380 ? 180 : 220
    : 220

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none" />
      <div className="orb fixed hidden sm:block w-[500px] h-[500px] bg-blue-400 -top-40 -left-40" />
      <div className="orb fixed hidden sm:block w-[440px] h-[440px] bg-violet-500 -bottom-36 -right-36" style={{ animationDelay: '-11s' }} />

      <Navbar />

      {/* ── HOME ── */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-24">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl flex flex-col gap-4 md:gap-5 lg:gap-7">

          {/* Header */}
          <div className="text-center mb-2 md:mb-3 lg:mb-5">
            <div className="inline-flex items-center gap-2 tag-badge mb-3 md:mb-4 md:text-sm md:px-4 md:py-1.5 lg:px-5 lg:py-2 lg:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              FREE TOOL
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight"
                style={{ textShadow: '0 0 40px rgba(96,165,250,0.4)' }}>
              QR Generator
            </h1>
            <p className="text-white/50 mt-2 md:mt-3 lg:mt-4 text-sm md:text-base lg:text-lg">
              Paste a link. Get a QR code. Done.
            </p>
          </div>

          {/* ── LAPTOP: 2 cards side by side | MOBILE+TABLET: 1 card ── */}
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">

            {/* LEFT card — URL input + generate + name + buttons */}
            <div className="glass glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-9 lg:p-10 flex flex-col gap-4 sm:gap-5 md:gap-6 flex-1 min-w-0">

              {/* URL Input */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-xs md:text-sm lg:text-base font-semibold uppercase tracking-widest text-white/60">Your URL</label>
                <div className="input-glass rounded-xl sm:rounded-2xl flex items-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 gap-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 015.656 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 01-5.656-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
                  </svg>
                  <input
                    type="url" value={url}
                    onChange={e => { setUrl(e.target.value); setGenerated(false) }}
                    onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                    placeholder="https://example.com"
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm md:text-base lg:text-lg min-w-0"
                  />
                </div>
              </div>

              {/* Progress */}
              {loading && (
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-75"
                       style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', boxShadow: '0 0 10px #60a5fa88' }} />
                </div>
              )}

              {/* Generate */}
              <button onClick={handleGenerate} disabled={loading}
                className="btn-shimmer w-full py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,rgba(96,165,250,0.25),rgba(167,139,250,0.25))', border: '1px solid rgba(96,165,250,0.4)', boxShadow: '0 4px 24px rgba(96,165,250,0.2)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </span>
                  : 'Generate QR Code'}
              </button>

              {/* Name + buttons — always visible after generate on mobile, in left card on laptop */}
              {generated && (
                <div className="fade-up flex flex-col gap-4 md:gap-5">
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-semibold uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Your Name (optional)
                    </label>
                    <div className="input-glass rounded-xl flex items-center px-4 md:px-5 py-3 md:py-4">
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleDownload()}
                        placeholder="Enter your name..." maxLength={30}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm md:text-base text-center min-w-0" />
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 md:gap-4">
                    <button onClick={handleDownload}
                      className="btn-shimmer flex items-center justify-center gap-2 py-3 sm:py-3.5 md:py-4 rounded-xl text-white text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                      style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.35)' }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                      Download
                    </button>
                    <button onClick={handleCopy}
                      className="btn-shimmer flex items-center justify-center gap-2 py-3 sm:py-3.5 md:py-4 rounded-xl text-white text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                      style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)' }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Copy
                    </button>
                  </div>

                  {/* QR shown inside left card on mobile/tablet only */}
                  <div className="lg:hidden flex flex-col items-center gap-3 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Your QR Code</span>
                    <div ref={setQrRef} className="qr-pop p-4 sm:p-5 rounded-2xl bg-white shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                      <QRCodeCanvas value={url} size={qrSize}
                        fgColor="#1e3c72" bgColor="#ffffff" level="H"
                        style={{ borderRadius: 8, display: 'block' }} />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-xs font-semibold"
                         style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      High Quality · {qrSize} × {qrSize}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT card — QR only, visible on laptop only */}
            {generated && (
              <div className="hidden lg:flex glass glass-border rounded-3xl p-10 flex-col items-center justify-center gap-5 flex-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Your QR Code</span>
                <div ref={setQrRef} className="qr-pop p-6 rounded-2xl bg-white shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <QRCodeCanvas value={url} size={qrSize}
                    fgColor="#1e3c72" bgColor="#ffffff" level="H"
                    style={{ borderRadius: 8, display: 'block' }} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-xs font-semibold"
                     style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  High Quality · {qrSize} × {qrSize}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── GITHUB ── */}
      <section id="github" className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-24">
        <GithubSection notify={notify} />
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-24">
        <ContactSection notify={notify} />
      </section>

      {notif && <Notification message={notif.msg} type={notif.type} />}
    </div>
  )
}
