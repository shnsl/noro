import { ASIA, BRUNNSTROM, GMFCS, HOEHN_YAHR, VIGNOS } from './kaynaklar'
import type { HastalikId, Kaynak, YasGrubu } from './tipler'

export type SkalaSecenek = {
  id: string
  etiket: string
  aciklama: string
  kombinasyonlar: Partial<Record<YasGrubu | 'tek', string[]>>
}

export type Skala = {
  id: string
  hastalikId: HastalikId
  ad: string
  ozet: string
  kaynak: Kaynak
  secenekler: SkalaSecenek[]
}

const brunnstrom: SkalaSecenek[] = [
  {
    id: 'b1',
    etiket: 'Evre 1',
    aciklama: 'Flask. İstemli hareket yok.',
    kombinasyonlar: { cocuk: ['hem-c-k3', 'hem-c-k4', 'hem-c-k5'], yetiskin: ['hem-y-k1', 'hem-y-k4', 'hem-y-k5'] },
  },
  {
    id: 'b2',
    etiket: 'Evre 2',
    aciklama: 'Spastisite başlar. İstemli hareket yok veya çok az.',
    kombinasyonlar: { cocuk: ['hem-c-k3', 'hem-c-k4', 'hem-c-k5'], yetiskin: ['hem-y-k1', 'hem-y-k4', 'hem-y-k5'] },
  },
  {
    id: 'b3',
    etiket: 'Evre 3',
    aciklama: 'Hareket temel olarak sinergi içindedir.',
    kombinasyonlar: { cocuk: ['hem-c-k1', 'hem-c-k6', 'hem-c-k7'], yetiskin: ['hem-y-k3', 'hem-y-k6', 'hem-y-k7'] },
  },
  {
    id: 'b4',
    etiket: 'Evre 4',
    aciklama: 'Sinergi dışına çıkan hareketler başlar.',
    kombinasyonlar: { cocuk: ['hem-c-k1', 'hem-c-k6', 'hem-c-k7'], yetiskin: ['hem-y-k3', 'hem-y-k6', 'hem-y-k7'] },
  },
  {
    id: 'b5',
    etiket: 'Evre 5',
    aciklama: 'Sinergiden daha bağımsız, seçici hareket vardır.',
    kombinasyonlar: { cocuk: ['hem-c-k2', 'hem-c-k8', 'hem-c-k9'], yetiskin: ['hem-y-k2', 'hem-y-k8', 'hem-y-k9'] },
  },
  {
    id: 'b6',
    etiket: 'Evre 6',
    aciklama: 'İzole eklem hareketi, normale yakın.',
    kombinasyonlar: { cocuk: ['hem-c-k2', 'hem-c-k8', 'hem-c-k9'], yetiskin: ['hem-y-k2', 'hem-y-k8', 'hem-y-k9'] },
  },
]

const asia: SkalaSecenek[] = [
  {
    id: 'ais-a',
    etiket: 'AIS A',
    aciklama: 'Tam yaralanma. Sakral duyu ve motor korunmamış.',
    kombinasyonlar: { cocuk: ['par-c-k2', 'par-c-k4', 'par-c-k5'], yetiskin: ['par-y-k2', 'par-y-k4', 'par-y-k5'] },
  },
  {
    id: 'ais-b',
    etiket: 'AIS B',
    aciklama: 'Duyu tam değil, motor tam. Sakral duyu var, motor yok.',
    kombinasyonlar: { cocuk: ['par-c-k2', 'par-c-k4', 'par-c-k5'], yetiskin: ['par-y-k2', 'par-y-k4', 'par-y-k5'] },
  },
  {
    id: 'ais-c',
    etiket: 'AIS C',
    aciklama: 'Motor tam değil. Seviye altındaki anahtar kasların yarısından fazlası 3’ün altında.',
    kombinasyonlar: { cocuk: ['par-c-k1', 'par-c-k6', 'par-c-k7'], yetiskin: ['par-y-k3', 'par-y-k6', 'par-y-k7'] },
  },
  {
    id: 'ais-d',
    etiket: 'AIS D',
    aciklama: 'Motor tam değil. Seviye altındaki anahtar kasların yarısı veya fazlası 3 ve üstü.',
    kombinasyonlar: { cocuk: ['par-c-k3', 'par-c-k8', 'par-c-k9'], yetiskin: ['par-y-k1', 'par-y-k8', 'par-y-k9'] },
  },
  {
    id: 'ais-e',
    etiket: 'AIS E',
    aciklama: 'Nörolojik muayene normal. Yakınma sürebilir.',
    kombinasyonlar: { cocuk: ['par-c-k3', 'par-c-k8', 'par-c-k9'], yetiskin: ['par-y-k1', 'par-y-k8', 'par-y-k9'] },
  },
]

const hoehn: SkalaSecenek[] = [
  {
    id: 'hy1',
    etiket: 'Evre 1',
    aciklama: 'Tek taraflı bulgular. Denge bozukluğu yok.',
    kombinasyonlar: { tek: ['pk-k1', 'pk-k5', 'pk-k3'] },
  },
  {
    id: 'hy2',
    etiket: 'Evre 2',
    aciklama: 'İki taraflı bulgular. Denge bozukluğu yok.',
    kombinasyonlar: { tek: ['pk-k3', 'pk-k1', 'pk-k5'] },
  },
  {
    id: 'hy3',
    etiket: 'Evre 3',
    aciklama: 'Denge bozulur. Kişi fiziksel olarak hâlâ bağımsızdır.',
    kombinasyonlar: { tek: ['pk-k2', 'pk-k6', 'pk-k7'] },
  },
  {
    id: 'hy4',
    etiket: 'Evre 4',
    aciklama: 'Şiddetli tutulma. Ayakta durabilir, günlük işte yardım gerekir.',
    kombinasyonlar: { tek: ['pk-k4', 'pk-k8'] },
  },
  {
    id: 'hy5',
    etiket: 'Evre 5',
    aciklama: 'Sandalyeye veya yatağa bağımlı.',
    kombinasyonlar: { tek: ['pk-k8', 'pk-k9'] },
  },
]

const gmfcs: SkalaSecenek[] = [
  {
    id: 'g1',
    etiket: 'GMFCS I',
    aciklama: 'Cihazsız yürür, belirgin kısıt yok.',
    kombinasyonlar: { tek: ['cp-k1', 'cp-k2', 'cp-k3'] },
  },
  {
    id: 'g2',
    etiket: 'GMFCS II',
    aciklama: 'Cihazsız yürür, mesafe veya zeminde kısıt var.',
    kombinasyonlar: { tek: ['cp-k1', 'cp-k2', 'cp-k3'] },
  },
  {
    id: 'g3',
    etiket: 'GMFCS III',
    aciklama: 'Yürümek için yürüteç, değnek veya baston kullanır.',
    kombinasyonlar: { tek: ['cp-k4', 'cp-k5', 'cp-k6'] },
  },
  {
    id: 'g4',
    etiket: 'GMFCS IV',
    aciklama: 'Yer değiştirmenin çoğu sandalyede, sandalyeyi kendisi sürer.',
    kombinasyonlar: { tek: ['cp-k7', 'cp-k8', 'cp-k9'] },
  },
  {
    id: 'g5',
    etiket: 'GMFCS V',
    aciklama: 'Taşınır. Baş ve gövde kontrolü sınırlıdır.',
    kombinasyonlar: { tek: ['cp-k10', 'cp-k11', 'cp-k12'] },
  },
]

const vignos: SkalaSecenek[] = [
  { id: 'v1', etiket: '1', aciklama: 'Yardımsız yürür ve merdiven çıkar.', kombinasyonlar: { tek: ['dmd-k1', 'dmd-k4', 'dmd-k5'] } },
  { id: 'v2', etiket: '2', aciklama: 'Trabzan yardımıyla merdiven çıkar.', kombinasyonlar: { tek: ['dmd-k1', 'dmd-k4', 'dmd-k5'] } },
  { id: 'v3', etiket: '3', aciklama: 'Trabzanla yavaş merdiven çıkar.', kombinasyonlar: { tek: ['dmd-k1', 'dmd-k4', 'dmd-k5'] } },
  { id: 'v4', etiket: '4', aciklama: 'Yürür ve sandalyeden kalkar, merdiven çıkamaz.', kombinasyonlar: { tek: ['dmd-k3', 'dmd-k6', 'dmd-k7'] } },
  { id: 'v5', etiket: '5', aciklama: 'Yürür; sandalyeden kalkamaz, merdiven çıkamaz.', kombinasyonlar: { tek: ['dmd-k3', 'dmd-k6', 'dmd-k7'] } },
  { id: 'v6', etiket: '6', aciklama: 'Yalnızca yardımla veya cihazla yürür.', kombinasyonlar: { tek: ['dmd-k3', 'dmd-k6', 'dmd-k7'] } },
  { id: 'v7', etiket: '7', aciklama: 'Sandalyede dik oturur, yatağa ve sandalyeye kendisi geçer.', kombinasyonlar: { tek: ['dmd-k2', 'dmd-k8', 'dmd-k9'] } },
  { id: 'v8', etiket: '8', aciklama: 'Sandalyede dik oturur, yatağa ve sandalyeye yardım gerekir.', kombinasyonlar: { tek: ['dmd-k2', 'dmd-k8', 'dmd-k9'] } },
  { id: 'v9', etiket: '9', aciklama: 'Sandalyede ancak destekle dik durur.', kombinasyonlar: { tek: ['dmd-k2', 'dmd-k8', 'dmd-k9'] } },
  { id: 'v10', etiket: '10', aciklama: 'Yatağa bağımlı, günlük iş için yardım şart.', kombinasyonlar: { tek: ['dmd-k2', 'dmd-k8', 'dmd-k9'] } },
]

export const SKALALAR: Skala[] = [
  {
    id: 'brunnstrom',
    hastalikId: 'hemipleji',
    ad: 'Brunnstrom',
    ozet: 'Etkilenen tarafın motor evresi. Tedavi evreye göre gelir.',
    kaynak: BRUNNSTROM,
    secenekler: brunnstrom,
  },
  {
    id: 'ais',
    hastalikId: 'parapleji',
    ad: 'ASIA Bozukluk Skalası',
    ozet: 'Nörolojik tamlık derecesi. Yürüme potansiyeli tedavi setini değiştirir.',
    kaynak: ASIA,
    secenekler: asia,
  },
  {
    id: 'hoehn-yahr',
    hastalikId: 'parkinson',
    ad: 'Hoehn ve Yahr',
    ozet: 'Hastalık evresi. Denge bozuldukça set destekli tarafa kayar.',
    kaynak: HOEHN_YAHR,
    secenekler: hoehn,
  },
  {
    id: 'vignos',
    hastalikId: 'dmd',
    ad: 'Vignos',
    ozet: 'Alt ekstremite fonksiyonu. Yürüme sürdükçe aerobik, kaybolunca germe ve nefes öne çıkar.',
    kaynak: VIGNOS,
    secenekler: vignos,
  },
  {
    id: 'gmfcs',
    hastalikId: 'serebral-palsi',
    ad: 'GMFCS',
    ozet: 'Kaba motor seviye. Yürüme biçimi tedavi setini değiştirir.',
    kaynak: GMFCS,
    secenekler: gmfcs,
  },
]

export function skalaBul(hastalikId: HastalikId): Skala | undefined {
  return SKALALAR.find((skala) => skala.hastalikId === hastalikId)
}

export function secenekBul(skalaId: string, sonucId: string): SkalaSecenek | undefined {
  return SKALALAR.find((skala) => skala.id === skalaId)?.secenekler.find((secenek) => secenek.id === sonucId)
}

export function uygunKombinasyonlar(hastalikId: HastalikId, yas: YasGrubu | undefined, sonucId: string): string[] {
  const skala = skalaBul(hastalikId)
  const secenek = skala?.secenekler.find((kart) => kart.id === sonucId)
  if (!secenek) return []
  return (yas ? secenek.kombinasyonlar[yas] : secenek.kombinasyonlar.tek) ?? []
}

export function kombinasyonIdBul(hastalikId: HastalikId, yas: YasGrubu | undefined, sonucId: string): string | undefined {
  return uygunKombinasyonlar(hastalikId, yas, sonucId)[0]
}
