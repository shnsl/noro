import type { Egzersiz, HastalikId, Kombinasyon, YasGrubu } from './data/tipler'
import { SEANS_SURESI } from './data/tipler'

const ADRES = '/katalog/ek.json'
const ONBELLEK = 'noro.webkatalog.v1'

type Paket = {
  egzersizler: Egzersiz[]
  bantlar: Record<string, Kombinasyon[]>
}

const BANT: Record<string, string> = {
  'hemipleji:cocuk:b1': 'hemi-c-erken',
  'hemipleji:cocuk:b2': 'hemi-c-erken',
  'hemipleji:cocuk:b3': 'hemi-c-orta',
  'hemipleji:cocuk:b4': 'hemi-c-orta',
  'hemipleji:cocuk:b5': 'hemi-c-secici',
  'hemipleji:cocuk:b6': 'hemi-c-secici',
  'hemipleji:yetiskin:b1': 'hemi-y-erken',
  'hemipleji:yetiskin:b2': 'hemi-y-erken',
  'hemipleji:yetiskin:b3': 'hemi-y-orta',
  'hemipleji:yetiskin:b4': 'hemi-y-orta',
  'hemipleji:yetiskin:b5': 'hemi-y-secici',
  'hemipleji:yetiskin:b6': 'hemi-y-secici',
  'parapleji:cocuk:ais-a': 'para-c-tam',
  'parapleji:cocuk:ais-b': 'para-c-tam',
  'parapleji:cocuk:ais-c': 'para-c-kismi',
  'parapleji:cocuk:ais-d': 'para-c-yurur',
  'parapleji:cocuk:ais-e': 'para-c-yurur',
  'parapleji:yetiskin:ais-a': 'para-y-tam',
  'parapleji:yetiskin:ais-b': 'para-y-tam',
  'parapleji:yetiskin:ais-c': 'para-y-kismi',
  'parapleji:yetiskin:ais-d': 'para-y-yurur',
  'parapleji:yetiskin:ais-e': 'para-y-yurur',
  'parkinson:tek:hy1': 'pk-hafif',
  'parkinson:tek:hy2': 'pk-hafif',
  'parkinson:tek:hy3': 'pk-denge',
  'parkinson:tek:hy4': 'pk-ileri',
  'parkinson:tek:hy5': 'pk-ileri',
  'dmd:tek:v1': 'dmd-erken',
  'dmd:tek:v2': 'dmd-erken',
  'dmd:tek:v3': 'dmd-erken',
  'dmd:tek:v4': 'dmd-gec',
  'dmd:tek:v5': 'dmd-gec',
  'dmd:tek:v6': 'dmd-gec',
  'dmd:tek:v7': 'dmd-otur',
  'dmd:tek:v8': 'dmd-otur',
  'dmd:tek:v9': 'dmd-otur',
  'dmd:tek:v10': 'dmd-otur',
  'serebral-palsi:tek:g1': 'cp-yurur',
  'serebral-palsi:tek:g2': 'cp-yurur',
  'serebral-palsi:tek:g3': 'cp-cihaz',
  'serebral-palsi:tek:g4': 'cp-sandalye',
  'serebral-palsi:tek:g5': 'cp-tasima',
}

export function bantAnahtari(hastalikId: HastalikId, yas: YasGrubu | undefined, sonucId: string): string {
  return BANT[`${hastalikId}:${yas ?? 'tek'}:${sonucId}`] ?? ''
}

export async function webdenKombinasyon(hastalikId: HastalikId, yas: YasGrubu | undefined, sonucId: string): Promise<{
  egzersizler: Egzersiz[]
  kombinasyonlar: Kombinasyon[]
}> {
  const paket = await paketGetir()
  const bant = bantAnahtari(hastalikId, yas, sonucId)
  const kombinasyonlar = (paket.bantlar[bant] ?? []).filter(gecerliPlan)
  return { egzersizler: paket.egzersizler, kombinasyonlar }
}

async function paketGetir(): Promise<Paket> {
  const kayitli = localStorage.getItem(ONBELLEK)
  if (kayitli) {
    const paket = paketOku(kayitli)
    if (paket) return paket
  }
  const yanit = await fetch(ADRES)
  if (!yanit.ok) throw new Error('katalog alinamadi')
  const metin = await yanit.text()
  const paket = paketOku(metin)
  if (!paket) throw new Error('katalog bozuk')
  localStorage.setItem(ONBELLEK, metin)
  return paket
}

function paketOku(metin: string): Paket | null {
  try {
    const okunan = JSON.parse(metin) as Paket
    if (!okunan || !Array.isArray(okunan.egzersizler) || !okunan.bantlar) return null
    return okunan
  } catch {
    return null
  }
}

function gecerliPlan(kombinasyon: Kombinasyon): boolean {
  if (!Array.isArray(kombinasyon.plan) || kombinasyon.plan.length === 0) return false
  const toplam = kombinasyon.plan.reduce((sure, kalem) => sure + kalem.dakika, 0)
  return toplam === SEANS_SURESI
}
