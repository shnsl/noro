import { ASIA, BRUNNSTROM, GMFCS, HOEHN_YAHR, VIGNOS } from './kaynaklar'
import type { HastalikId, Kaynak } from './tipler'

export type SkalaSecenek = {
  id: string
  etiket: string
  aciklama: string
}

export type Skala = {
  id: string
  hastalikId: HastalikId
  ad: string
  ozet: string
  kaynak: Kaynak
  secenekler: SkalaSecenek[]
}

export const SKALALAR: Skala[] = [
  {
    id: 'brunnstrom',
    hastalikId: 'hemipleji',
    ad: 'Brunnstrom (özet)',
    ozet: 'Bölgesel skorlardan tahmini motor evre. Tedavi evreye değil bölge bulgularına bağlıdır.',
    kaynak: BRUNNSTROM,
    secenekler: [
      { id: 'b1', etiket: 'Evre 1', aciklama: 'Flask. İstemli hareket yok.' },
      { id: 'b2', etiket: 'Evre 2', aciklama: 'Spastisite başlar.' },
      { id: 'b3', etiket: 'Evre 3', aciklama: 'Sinergi içinde hareket.' },
      { id: 'b4', etiket: 'Evre 4', aciklama: 'Sinergi dışı hareketler.' },
      { id: 'b5', etiket: 'Evre 5', aciklama: 'Seçici hareket.' },
      { id: 'b6', etiket: 'Evre 6', aciklama: 'Normale yakın.' },
    ],
  },
  {
    id: 'ais',
    hastalikId: 'parapleji',
    ad: 'ASIA (özet)',
    ozet: 'Kullanıcının girdiği AIS özeti. Tedavi spastisite, cilt, transfer skorlarına bağlıdır.',
    kaynak: ASIA,
    secenekler: [
      { id: 'ais-a', etiket: 'AIS A', aciklama: 'Tam yaralanma.' },
      { id: 'ais-b', etiket: 'AIS B', aciklama: 'Duyu korunmuş, motor yok.' },
      { id: 'ais-c', etiket: 'AIS C', aciklama: 'Motor zayıf.' },
      { id: 'ais-d', etiket: 'AIS D', aciklama: 'Motor daha güçlü.' },
      { id: 'ais-e', etiket: 'AIS E', aciklama: 'Normal muayene.' },
    ],
  },
  {
    id: 'hoehn-yahr',
    hastalikId: 'parkinson',
    ad: 'Hoehn ve Yahr (özet)',
    ozet: 'Mobilite cevaplarından tahmini evre.',
    kaynak: HOEHN_YAHR,
    secenekler: [
      { id: 'hy1', etiket: 'Evre 1', aciklama: 'Tek taraflı.' },
      { id: 'hy2', etiket: 'Evre 2', aciklama: 'İki taraflı, denge iyi.' },
      { id: 'hy3', etiket: 'Evre 3', aciklama: 'Denge bozuk.' },
      { id: 'hy4', etiket: 'Evre 4', aciklama: 'Ciddi, yardımla yürür.' },
      { id: 'hy5', etiket: 'Evre 5', aciklama: 'Yatağa / sandalyeye bağımlı.' },
    ],
  },
  {
    id: 'vignos',
    hastalikId: 'dmd',
    ad: 'Vignos (özet)',
    ozet: 'Mobilite cevaplarından tahmini derece.',
    kaynak: VIGNOS,
    secenekler: Array.from({ length: 10 }, (_, i) => ({
      id: `v${i + 1}`,
      etiket: String(i + 1),
      aciklama: `Vignos ${i + 1}`,
    })),
  },
  {
    id: 'gmfcs',
    hastalikId: 'serebral-palsi',
    ad: 'GMFCS (özet)',
    ozet: 'Mobilite cevaplarından tahmini seviye. Tedavi spastisite/kuvvet skorlarına bağlıdır.',
    kaynak: GMFCS,
    secenekler: [
      { id: 'g1', etiket: 'GMFCS I', aciklama: 'Cihazsız yürür.' },
      { id: 'g2', etiket: 'GMFCS II', aciklama: 'Kısıtlı yürüyüş.' },
      { id: 'g3', etiket: 'GMFCS III', aciklama: 'Cihazlı yürüyüş.' },
      { id: 'g4', etiket: 'GMFCS IV', aciklama: 'Sandalye ağırlıklı.' },
      { id: 'g5', etiket: 'GMFCS V', aciklama: 'Taşınma gerekir.' },
    ],
  },
]

export function skalaBul(hastalikId: HastalikId): Skala | undefined {
  return SKALALAR.find((skala) => skala.hastalikId === hastalikId)
}

export function secenekBul(skalaId: string, sonucId: string): SkalaSecenek | undefined {
  return SKALALAR.find((skala) => skala.id === skalaId)?.secenekler.find((secenek) => secenek.id === sonucId)
}
