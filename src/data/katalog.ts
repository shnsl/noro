import {
  DMD_EGZERSIZ,
  DMD_KOMBINASYON,
} from './dmd'
import {
  HEMIPLEJI_COCUK_EGZERSIZ,
  HEMIPLEJI_COCUK_KOMBINASYON,
  HEMIPLEJI_YETISKIN_EGZERSIZ,
  HEMIPLEJI_YETISKIN_KOMBINASYON,
} from './hemipleji'
import {
  PARAPLEJI_COCUK_EGZERSIZ,
  PARAPLEJI_COCUK_KOMBINASYON,
  PARAPLEJI_YETISKIN_EGZERSIZ,
  PARAPLEJI_YETISKIN_KOMBINASYON,
} from './parapleji'
import { CP_EGZERSIZ, CP_KOMBINASYON } from './cp'
import { PARKINSON_EGZERSIZ, PARKINSON_KOMBINASYON } from './parkinson'
import { SEANS_SURESI, type Egzersiz, type HastalikId, type Kombinasyon, type Kova, type SeansKalemi, type YasGrubu } from './tipler'

export const KOVALAR: Kova[] = [
  {
    hastalikId: 'hemipleji',
    yas: 'cocuk',
    egzersizler: HEMIPLEJI_COCUK_EGZERSIZ,
    kombinasyonlar: HEMIPLEJI_COCUK_KOMBINASYON,
  },
  {
    hastalikId: 'hemipleji',
    yas: 'yetiskin',
    egzersizler: HEMIPLEJI_YETISKIN_EGZERSIZ,
    kombinasyonlar: HEMIPLEJI_YETISKIN_KOMBINASYON,
  },
  {
    hastalikId: 'parapleji',
    yas: 'cocuk',
    egzersizler: PARAPLEJI_COCUK_EGZERSIZ,
    kombinasyonlar: PARAPLEJI_COCUK_KOMBINASYON,
  },
  {
    hastalikId: 'parapleji',
    yas: 'yetiskin',
    egzersizler: PARAPLEJI_YETISKIN_EGZERSIZ,
    kombinasyonlar: PARAPLEJI_YETISKIN_KOMBINASYON,
  },
  {
    hastalikId: 'parkinson',
    egzersizler: PARKINSON_EGZERSIZ,
    kombinasyonlar: PARKINSON_KOMBINASYON,
  },
  {
    hastalikId: 'dmd',
    egzersizler: DMD_EGZERSIZ,
    kombinasyonlar: DMD_KOMBINASYON,
  },
  {
    hastalikId: 'serebral-palsi',
    egzersizler: CP_EGZERSIZ,
    kombinasyonlar: CP_KOMBINASYON,
  },
]

export function kovaBul(hastalikId: HastalikId, yas?: YasGrubu): Kova | undefined {
  return KOVALAR.find((kova) => kova.hastalikId === hastalikId && kova.yas === yas)
}

export function kombinasyonBul(
  hastalikId: HastalikId,
  yas: YasGrubu | undefined,
  kombinasyonId: string,
): { kova: Kova; kombinasyon: Kombinasyon } | undefined {
  const kova = kovaBul(hastalikId, yas)
  const kombinasyon = kova?.kombinasyonlar.find((kart) => kart.id === kombinasyonId)
  if (!kova || !kombinasyon) return undefined
  return { kova, kombinasyon }
}

export function seansSirasi(
  kova: Kova,
  plan: SeansKalemi[],
  ek: Egzersiz[] = [],
): { kalem: SeansKalemi; egzersiz: Egzersiz }[] {
  return plan.flatMap((kalem) => {
    const egzersiz =
      kova.egzersizler.find((kart) => kart.id === kalem.egzersizId) ?? ek.find((kart) => kart.id === kalem.egzersizId)
    return egzersiz ? [{ kalem, egzersiz }] : []
  })
}

for (const kova of KOVALAR) {
  for (const kombinasyon of kova.kombinasyonlar) {
    const toplam = kombinasyon.plan.reduce((sure, kalem) => sure + kalem.dakika, 0)
    if (toplam !== SEANS_SURESI) {
      throw new Error(`${kombinasyon.id} seansı ${toplam} dk, ${SEANS_SURESI} olmalı`)
    }
  }
}
