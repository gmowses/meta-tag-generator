import { useState } from 'react'
import { Copy, Sun, Moon, Languages, Tag } from 'lucide-react'

const translations = {
  en: {
    title: 'Meta Tag Generator',
    subtitle: 'Generate HTML meta tags: title, description, Open Graph and Twitter Card. Live preview included.',
    basicTab: 'Basic',
    ogTab: 'Open Graph',
    twitterTab: 'Twitter Card',
    pageTitle: 'Page Title',
    description: 'Description',
    keywords: 'Keywords (comma separated)',
    author: 'Author',
    robots: 'Robots',
    canonical: 'Canonical URL',
    ogTitle: 'OG Title',
    ogDescription: 'OG Description',
    ogImage: 'OG Image URL',
    ogUrl: 'OG URL',
    ogType: 'OG Type',
    ogSiteName: 'OG Site Name',
    twCard: 'Card Type',
    twTitle: 'Twitter Title',
    twDescription: 'Twitter Description',
    twImage: 'Twitter Image URL',
    twSite: 'Twitter @site',
    twCreator: 'Twitter @creator',
    output: 'Generated HTML',
    copy: 'Copy All',
    copied: 'Copied!',
    preview: 'Search Preview',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de Meta Tags',
    subtitle: 'Gere meta tags HTML: titulo, descricao, Open Graph e Twitter Card. Preview ao vivo incluso.',
    basicTab: 'Basico',
    ogTab: 'Open Graph',
    twitterTab: 'Twitter Card',
    pageTitle: 'Titulo da Pagina',
    description: 'Descricao',
    keywords: 'Palavras-chave (separadas por virgula)',
    author: 'Autor',
    robots: 'Robots',
    canonical: 'URL Canonica',
    ogTitle: 'Titulo OG',
    ogDescription: 'Descricao OG',
    ogImage: 'URL da Imagem OG',
    ogUrl: 'URL OG',
    ogType: 'Tipo OG',
    ogSiteName: 'Nome do Site OG',
    twCard: 'Tipo de Card',
    twTitle: 'Titulo Twitter',
    twDescription: 'Descricao Twitter',
    twImage: 'URL da Imagem Twitter',
    twSite: 'Twitter @site',
    twCreator: 'Twitter @creator',
    output: 'HTML Gerado',
    copy: 'Copiar Tudo',
    copied: 'Copiado!',
    preview: 'Preview de Busca',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations
type Tab = 'basic' | 'og' | 'twitter'

interface FormState {
  title: string; description: string; keywords: string; author: string
  robots: string; canonical: string
  ogTitle: string; ogDescription: string; ogImage: string; ogUrl: string; ogType: string; ogSiteName: string
  twCard: string; twTitle: string; twDescription: string; twImage: string; twSite: string; twCreator: string
}

function esc(s: string): string {
  return s.replace(/"/g, '&quot;')
}

function generateMeta(f: FormState): string {
  const lines: string[] = []
  if (f.title) lines.push(`<title>${f.title}</title>`)
  if (f.description) lines.push(`<meta name="description" content="${esc(f.description)}" />`)
  if (f.keywords) lines.push(`<meta name="keywords" content="${esc(f.keywords)}" />`)
  if (f.author) lines.push(`<meta name="author" content="${esc(f.author)}" />`)
  if (f.robots) lines.push(`<meta name="robots" content="${esc(f.robots)}" />`)
  if (f.canonical) lines.push(`<link rel="canonical" href="${esc(f.canonical)}" />`)
  lines.push('')
  // OG
  if (f.ogTitle) lines.push(`<meta property="og:title" content="${esc(f.ogTitle)}" />`)
  if (f.ogDescription) lines.push(`<meta property="og:description" content="${esc(f.ogDescription)}" />`)
  if (f.ogImage) lines.push(`<meta property="og:image" content="${esc(f.ogImage)}" />`)
  if (f.ogUrl) lines.push(`<meta property="og:url" content="${esc(f.ogUrl)}" />`)
  if (f.ogType) lines.push(`<meta property="og:type" content="${esc(f.ogType)}" />`)
  if (f.ogSiteName) lines.push(`<meta property="og:site_name" content="${esc(f.ogSiteName)}" />`)
  lines.push('')
  // Twitter
  if (f.twCard) lines.push(`<meta name="twitter:card" content="${esc(f.twCard)}" />`)
  if (f.twTitle) lines.push(`<meta name="twitter:title" content="${esc(f.twTitle)}" />`)
  if (f.twDescription) lines.push(`<meta name="twitter:description" content="${esc(f.twDescription)}" />`)
  if (f.twImage) lines.push(`<meta name="twitter:image" content="${esc(f.twImage)}" />`)
  if (f.twSite) lines.push(`<meta name="twitter:site" content="${esc(f.twSite)}" />`)
  if (f.twCreator) lines.push(`<meta name="twitter:creator" content="${esc(f.twCreator)}" />`)
  return lines.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n').trim()
}

export default function MetaTagGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [tab, setTab] = useState<Tab>('basic')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: 'My Awesome Page', description: 'A short description of my page for search engines.',
    keywords: 'react, typescript, web', author: '', robots: 'index, follow', canonical: '',
    ogTitle: 'My Awesome Page', ogDescription: 'A short description for social sharing.',
    ogImage: '', ogUrl: '', ogType: 'website', ogSiteName: '',
    twCard: 'summary_large_image', twTitle: '', twDescription: '', twImage: '', twSite: '', twCreator: '',
  })

  const t = translations[lang]

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const output = generateMeta(form)

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const inputClass = 'w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelClass = 'block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1'

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Tag size={18} className="text-white" />
            </div>
            <span className="font-semibold">Meta Tag Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/meta-tag-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="space-y-4">
              <div className="flex gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 w-fit">
                {([['basic', t.basicTab], ['og', t.ogTab], ['twitter', t.twitterTab]] as const).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setTab(m)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === m ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                {tab === 'basic' && (
                  <>
                    <div><label className={labelClass}>{t.pageTitle}</label><input value={form.title} onChange={set('title')} className={inputClass} /></div>
                    <div><label className={labelClass}>{t.description}</label><textarea value={form.description} onChange={set('description')} rows={3} className={inputClass + ' resize-none'} /></div>
                    <div><label className={labelClass}>{t.keywords}</label><input value={form.keywords} onChange={set('keywords')} className={inputClass} /></div>
                    <div><label className={labelClass}>{t.author}</label><input value={form.author} onChange={set('author')} className={inputClass} /></div>
                    <div><label className={labelClass}>{t.robots}</label>
                      <select value={form.robots} onChange={set('robots')} className={inputClass}>
                        <option>index, follow</option>
                        <option>index, nofollow</option>
                        <option>noindex, follow</option>
                        <option>noindex, nofollow</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>{t.canonical}</label><input value={form.canonical} onChange={set('canonical')} placeholder="https://example.com/page" className={inputClass} /></div>
                  </>
                )}
                {tab === 'og' && (
                  <>
                    <div><label className={labelClass}>{t.ogTitle}</label><input value={form.ogTitle} onChange={set('ogTitle')} className={inputClass} /></div>
                    <div><label className={labelClass}>{t.ogDescription}</label><textarea value={form.ogDescription} onChange={set('ogDescription')} rows={3} className={inputClass + ' resize-none'} /></div>
                    <div><label className={labelClass}>{t.ogImage}</label><input value={form.ogImage} onChange={set('ogImage')} placeholder="https://example.com/image.jpg" className={inputClass} /></div>
                    <div><label className={labelClass}>{t.ogUrl}</label><input value={form.ogUrl} onChange={set('ogUrl')} placeholder="https://example.com" className={inputClass} /></div>
                    <div><label className={labelClass}>{t.ogType}</label>
                      <select value={form.ogType} onChange={set('ogType')} className={inputClass}>
                        <option>website</option><option>article</option><option>product</option><option>profile</option><option>video.movie</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>{t.ogSiteName}</label><input value={form.ogSiteName} onChange={set('ogSiteName')} className={inputClass} /></div>
                  </>
                )}
                {tab === 'twitter' && (
                  <>
                    <div><label className={labelClass}>{t.twCard}</label>
                      <select value={form.twCard} onChange={set('twCard')} className={inputClass}>
                        <option value="summary_large_image">summary_large_image</option>
                        <option value="summary">summary</option>
                        <option value="app">app</option>
                        <option value="player">player</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>{t.twTitle}</label><input value={form.twTitle} onChange={set('twTitle')} className={inputClass} /></div>
                    <div><label className={labelClass}>{t.twDescription}</label><textarea value={form.twDescription} onChange={set('twDescription')} rows={3} className={inputClass + ' resize-none'} /></div>
                    <div><label className={labelClass}>{t.twImage}</label><input value={form.twImage} onChange={set('twImage')} placeholder="https://example.com/image.jpg" className={inputClass} /></div>
                    <div><label className={labelClass}>{t.twSite}</label><input value={form.twSite} onChange={set('twSite')} placeholder="@yoursite" className={inputClass} /></div>
                    <div><label className={labelClass}>{t.twCreator}</label><input value={form.twCreator} onChange={set('twCreator')} placeholder="@author" className={inputClass} /></div>
                  </>
                )}
              </div>

              {/* Search preview */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
                <h2 className="text-sm font-semibold">{t.preview}</h2>
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-1">
                  <div className="text-blue-600 dark:text-blue-400 text-base font-medium truncate">{form.title || 'Page Title'}</div>
                  <div className="text-green-700 dark:text-green-500 text-xs">{form.canonical || 'https://example.com/page'}</div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">{form.description || 'Page description appears here...'}</div>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{t.output}</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  <Copy size={12} />
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <pre className="min-h-[400px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 font-mono text-xs overflow-auto whitespace-pre text-zinc-700 dark:text-zinc-300 select-all">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
