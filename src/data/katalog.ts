import { DMD_EGZERSIZ } from './dmd'
import { HEMIPLEJI_EGZERSIZ } from './hemipleji'
import { PARAPLEJI_EGZERSIZ } from './parapleji'
import { CP_EGZERSIZ } from './cp'
import { PARKINSON_EGZERSIZ } from './parkinson'
import { havuzGenislet } from './egzersizYonetim'
import type { HastalikId, Kova, YasGrubu } from './tipler'

export const KOVALAR: Kova[] = [
  { hastalikId: 'hemipleji', yas: 'cocuk', egzersizler: HEMIPLEJI_EGZERSIZ },
  { hastalikId: 'hemipleji', yas: 'yetiskin', egzersizler: HEMIPLEJI_EGZERSIZ },
  { hastalikId: 'parapleji', yas: 'cocuk', egzersizler: PARAPLEJI_EGZERSIZ },
  { hastalikId: 'parapleji', yas: 'yetiskin', egzersizler: PARAPLEJI_EGZERSIZ },
  { hastalikId: 'parkinson', egzersizler: PARKINSON_EGZERSIZ },
  { hastalikId: 'dmd', egzersizler: DMD_EGZERSIZ },
  { hastalikId: 'serebral-palsi', egzersizler: CP_EGZERSIZ },
]

export function kovaBul(hastalikId: HastalikId, yas?: YasGrubu): Kova | undefined {
  let kova: Kova | undefined
  if (yas) {
    kova = KOVALAR.find((k) => k.hastalikId === hastalikId && k.yas === yas)
  }
  if (!kova) kova = KOVALAR.find((k) => k.hastalikId === hastalikId)
  if (!kova) return undefined
  return { ...kova, egzersizler: havuzGenislet(kova.egzersizler) }
}
