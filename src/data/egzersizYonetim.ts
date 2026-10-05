import { CP_EGZERSIZ } from './cp'
import { DMD_EGZERSIZ } from './dmd'
import { HEMIPLEJI_EGZERSIZ } from './hemipleji'
import { PARAPLEJI_EGZERSIZ } from './parapleji'
import { PARKINSON_EGZERSIZ } from './parkinson'
import type { Egzersiz, EgzersizEtiketi, HastalikId, Ihtiyac, Kaynak, YasGrubu } from './tipler'

const ADLAR_ANAHTAR = 'noro.egz-adlar.v1'
const OZEL_ANAHTAR = 'noro.egz-ozel.v1'
/** Eski core ad anahtarı — bir kez göç */
const ESKI_CORE_AD = 'noro.core-adlar.v1'

export type EgzTur = 'core' | 'tedavi'

export type KatalogEgzersiz = Egzersiz & {
  tur: EgzTur
  bolge: string
  kategori?: 'core' | 'stabilizasyon' | 'mobilite'
  manuel?: boolean
}

export type ManuelEgzersizGirdi = {
  ad: string
  tur: EgzTur
  bolge: string
  hedef: string
  pozisyon: string
  doz: string
  adimlar: string[]
  onlem: string
  ihtiyac: Ihtiyac
  kategori?: 'core' | 'stabilizasyon' | 'mobilite'
}

export const BOLGE_FILTRELER: { id: string; ad: string }[] = [
  { id: 'hepsi', ad: 'Tümü' },
  { id: 'core', ad: 'Core' },
  { id: 'omuz', ad: 'Omuz' },
  { id: 'dirsek', ad: 'Dirsek' },
  { id: 'el-bilegi', ad: 'El bileği' },
  { id: 'el', ad: 'El' },
  { id: 'govde', ad: 'Gövde' },
  { id: 'kalca', ad: 'Kalça' },
  { id: 'diz', ad: 'Diz' },
  { id: 'ayak-bilegi', ad: 'Ayak bileği' },
  { id: 'denge', ad: 'Denge' },
  { id: 'transfer', ad: 'Transfer' },
  { id: 'yurume', ad: 'Yürüme' },
  { id: 'nefes', ad: 'Nefes' },
  { id: 'cilt', ad: 'Cilt' },
  { id: 'genel', ad: 'Genel' },
]

export const IHTIYAC_SECENEKLERI: { id: Ihtiyac; ad: string }[] = [
  { id: 'germe', ad: 'Germe' },
  { id: 'kuvvet', ad: 'Kuvvet' },
  { id: 'motor', ad: 'Motor' },
  { id: 'denge', ad: 'Denge' },
  { id: 'yurume', ad: 'Yürüme' },
  { id: 'nefes', ad: 'Nefes' },
  { id: 'transfer', ad: 'Transfer' },
  { id: 'agri', ad: 'Ağrı' },
  { id: 'cilt', ad: 'Cilt' },
]

const MANUEL_KAYNAK: Kaynak = {
  ad: 'Klinik ekleme (manuel)',
  yil: new Date().getFullYear().toString(),
  url: '',
  lisans: 'Yerel klinik kayıt',
}

function adlarOku(): Record<string, string> {
  try {
    const ham = localStorage.getItem(ADLAR_ANAHTAR)
    const mevcut = ham ? (JSON.parse(ham) as Record<string, string>) : {}
    const eskiHam = localStorage.getItem(ESKI_CORE_AD)
    if (eskiHam) {
      const eski = JSON.parse(eskiHam) as Record<string, string>
      const birlesik = { ...eski, ...mevcut }
      localStorage.setItem(ADLAR_ANAHTAR, JSON.stringify(birlesik))
      localStorage.removeItem(ESKI_CORE_AD)
      return birlesik
    }
    return mevcut && typeof mevcut === 'object' ? mevcut : {}
  } catch {
    return {}
  }
}

export function egzersizAdUygula(id: string, varsayilan: string): string {
  return adlarOku()[id]?.trim() || varsayilan
}

export function egzersizAdKaydet(id: string, ad: string): void {
  const temiz = ad.trim()
  const mevcut = adlarOku()
  if (!temiz) delete mevcut[id]
  else mevcut[id] = temiz
  localStorage.setItem(ADLAR_ANAHTAR, JSON.stringify(mevcut))
}

/** Geriye uyum */
export function coreAdKaydet(id: string, ad: string): void {
  egzersizAdKaydet(id, ad)
}

type OzelKayit = {
  id: string
  ad: string
  tur: EgzTur
  bolge: string
  hedef: string
  pozisyon: string
  doz: string
  adimlar: string[]
  onlem: string
  ihtiyac: Ihtiyac
  kategori?: 'core' | 'stabilizasyon' | 'mobilite'
}

function ozelOku(): OzelKayit[] {
  try {
    const ham = localStorage.getItem(OZEL_ANAHTAR)
    if (!ham) return []
    const parsed = JSON.parse(ham) as OzelKayit[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function ozelYaz(liste: OzelKayit[]): void {
  localStorage.setItem(OZEL_ANAHTAR, JSON.stringify(liste))
}

function ozeldenEgzersiz(k: OzelKayit): KatalogEgzersiz {
  const etiketler: EgzersizEtiketi[] = [{ bolge: k.bolge === 'core' ? 'govde' : k.bolge, ihtiyac: k.ihtiyac }]
  return {
    id: k.id,
    ad: egzersizAdUygula(k.id, k.ad),
    hedef: k.hedef,
    pozisyon: k.pozisyon,
    adimlar: k.adimlar,
    doz: k.doz,
    onlem: k.onlem,
    kaynak: MANUEL_KAYNAK,
    etiketler,
    onerilenDk: 4,
    tur: k.tur,
    bolge: k.tur === 'core' ? 'core' : k.bolge,
    kategori: k.kategori ?? (k.tur === 'core' ? 'core' : undefined),
    manuel: true,
  }
}

function tedaviTemelListe(): KatalogEgzersiz[] {
  const map = new Map<string, KatalogEgzersiz>()
  const kaynaklar = [
    ...HEMIPLEJI_EGZERSIZ,
    ...PARAPLEJI_EGZERSIZ,
    ...PARKINSON_EGZERSIZ,
    ...DMD_EGZERSIZ,
    ...CP_EGZERSIZ,
  ]
  for (const egz of kaynaklar) {
    if (map.has(egz.id)) continue
    const bolge = egz.etiketler[0]?.bolge ?? 'genel'
    map.set(egz.id, {
      ...egz,
      ad: egzersizAdUygula(egz.id, egz.ad),
      tur: 'tedavi',
      bolge,
    })
  }
  return [...map.values()]
}

/** Core şablonları — ekOneriler HAVUZ’dan çağıran taraf doldurur */
let coreTemelSaglayici: (() => KatalogEgzersiz[]) | null = null

export function coreTemelKaydet(fn: () => KatalogEgzersiz[]): void {
  coreTemelSaglayici = fn
}

export function tumEgzersizKatalogu(): KatalogEgzersiz[] {
  const tedavi = tedaviTemelListe()
  const core = (coreTemelSaglayici?.() ?? []).map((e) => ({
    ...e,
    ad: egzersizAdUygula(e.id, e.ad),
  }))
  const ozel = ozelOku().map(ozeldenEgzersiz)
  const map = new Map<string, KatalogEgzersiz>()
  for (const e of [...tedavi, ...core, ...ozel]) map.set(e.id, e)
  return [...map.values()].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
}

export function katalogFiltrele(bolgeId: string): KatalogEgzersiz[] {
  const hepsi = tumEgzersizKatalogu()
  if (bolgeId === 'hepsi') return hepsi
  if (bolgeId === 'core') return hepsi.filter((e) => e.tur === 'core')
  return hepsi.filter(
    (e) =>
      e.tur !== 'core' &&
      (e.bolge === bolgeId || e.etiketler.some((t) => t.bolge === bolgeId)),
  )
}

export function katalogBul(id: string): KatalogEgzersiz | undefined {
  return tumEgzersizKatalogu().find((e) => e.id === id)
}

export function manuelEgzersizEkle(girdi: ManuelEgzersizGirdi): KatalogEgzersiz {
  const id = `manuel-${girdi.tur}-${Date.now().toString(36)}`
  const kayit: OzelKayit = {
    id,
    ad: girdi.ad.trim(),
    tur: girdi.tur,
    bolge: girdi.bolge,
    hedef: girdi.hedef.trim() || girdi.ad.trim(),
    pozisyon: girdi.pozisyon.trim() || '—',
    doz: girdi.doz.trim() || '8–10',
    adimlar: girdi.adimlar.map((a) => a.trim()).filter(Boolean),
    onlem: girdi.onlem.trim() || 'Ağrıda dur.',
    ihtiyac: girdi.ihtiyac,
    kategori: girdi.kategori ?? (girdi.tur === 'core' ? 'core' : undefined),
  }
  if (kayit.adimlar.length === 0) kayit.adimlar = ['Hareketi kontrollü uygula.']
  ozelYaz([...ozelOku(), kayit])
  return ozeldenEgzersiz(kayit)
}

export function manuelCoreEgzersizleri(): KatalogEgzersiz[] {
  return ozelOku().filter((k) => k.tur === 'core').map(ozeldenEgzersiz)
}

export function manuelTedaviEgzersizleri(): Egzersiz[] {
  return ozelOku()
    .filter((k) => k.tur === 'tedavi')
    .map((k) => {
      const e = ozeldenEgzersiz(k)
      const { tur: _t, bolge: _b, kategori: _k, manuel: _m, ...egz } = e
      return egz
    })
}

/** Hastalık kovasına manuel tedavi + ad override uygula */
export function havuzGenislet(egzersizler: Egzersiz[]): Egzersiz[] {
  const ekstra = manuelTedaviEgzersizleri()
  const map = new Map<string, Egzersiz>()
  for (const e of [...egzersizler, ...ekstra]) {
    map.set(e.id, { ...e, ad: egzersizAdUygula(e.id, e.ad) })
  }
  return [...map.values()]
}

export function bolgeEtiket(bolgeId: string): string {
  return BOLGE_FILTRELER.find((b) => b.id === bolgeId)?.ad ?? bolgeId.replace(/-/g, ' ')
}

export type { HastalikId, YasGrubu }
