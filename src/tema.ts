export type Mod = 'acik' | 'koyu'

export type Tema = {
  mod: Mod
  renk: string
}

export const TEMA_RENKLERI = [
  { id: 'lacivert', ad: 'Lacivert', hex: '#1E4D8C' },
  { id: 'deniz', ad: 'Deniz', hex: '#0F766E' },
  { id: 'yesil', ad: 'Yeşil', hex: '#166534' },
  { id: 'mor', ad: 'Mor', hex: '#6D28D9' },
  { id: 'bakir', ad: 'Bakır', hex: '#9A3412' },
]

const ANAHTAR = 'noro.tema.v1'
const VARSAYILAN: Tema = { mod: 'acik', renk: TEMA_RENKLERI[0].hex }

export function temaGetir(): Tema {
  const ham = localStorage.getItem(ANAHTAR)
  if (!ham) return VARSAYILAN
  try {
    const okunan = JSON.parse(ham) as Partial<Tema>
    const mod = okunan.mod === 'koyu' ? 'koyu' : 'acik'
    const renk = typeof okunan.renk === 'string' && /^#[0-9A-Fa-f]{6}$/.test(okunan.renk) ? okunan.renk : VARSAYILAN.renk
    return { mod, renk }
  } catch {
    return VARSAYILAN
  }
}

export function temaKaydet(tema: Tema): void {
  localStorage.setItem(ANAHTAR, JSON.stringify(tema))
  temaUygula(tema)
}

export function temaUygula(tema: Tema): void {
  const kok = document.documentElement
  kok.dataset.mod = tema.mod
  kok.style.setProperty('--vurgu', tema.renk)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema.renk)
}
