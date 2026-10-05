export const DERMATOMLAR = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4-5',
] as const

export const KASLAR = [
  { id: 'c5', seviye: 'C5', ad: 'C5 dirsek fleksörleri' },
  { id: 'c6', seviye: 'C6', ad: 'C6 el bileği ekstansörleri' },
  { id: 'c7', seviye: 'C7', ad: 'C7 dirsek ekstansörleri' },
  { id: 'c8', seviye: 'C8', ad: 'C8 parmak fleksörleri' },
  { id: 't1', seviye: 'T1', ad: 'T1 parmak abdüktörleri' },
  { id: 'l2', seviye: 'L2', ad: 'L2 kalça fleksörleri' },
  { id: 'l3', seviye: 'L3', ad: 'L3 diz ekstansörleri' },
  { id: 'l4', seviye: 'L4', ad: 'L4 ayak bileği dorsifleksörleri' },
  { id: 'l5', seviye: 'L5', ad: 'L5 başparmak ekstansörü' },
  { id: 's1', seviye: 'S1', ad: 'S1 ayak bileği plantar fleksörleri' },
] as const

const SIRA = ['C1', ...DERMATOMLAR]

export type Yan = 'sag' | 'sol'
export type Cevaplar = Record<string, string>

export function duyuAnahtar(tur: 'lt' | 'pp', yan: Yan, seviye: string): string {
  return `${tur}-${yan}-${seviye}`
}

export function kasAnahtar(yan: Yan, id: string): string {
  return `kas-${yan}-${id}`
}

function sira(seviye: string): number {
  return SIRA.indexOf(seviye)
}

function duyuSeviyesi(cevap: Cevaplar, yan: Yan): string | null {
  let seviye = 'C1'
  for (const dermatome of DERMATOMLAR) {
    const lt = cevap[duyuAnahtar('lt', yan, dermatome)]
    const pp = cevap[duyuAnahtar('pp', yan, dermatome)]
    if (!lt || !pp) return null
    if (lt === '2' && pp === '2') seviye = dermatome
    else break
  }
  return seviye
}

function motorSeviyesi(cevap: Cevaplar, yan: Yan, duyu: string): string | null {
  let seviye = 'C4'
  let hepsiBes = true
  for (let i = 0; i < KASLAR.length; i++) {
    const kas = KASLAR[i]
    const ham = cevap[kasAnahtar(yan, kas.id)]
    if (!ham) return null
    const puan = Number(ham)
    const onceki = i === 0 ? null : KASLAR[i - 1]
    if (onceki && Number(cevap[kasAnahtar(yan, onceki.id)]) < 5) {
      hepsiBes = false
      break
    }
    if (puan >= 5) {
      seviye = kas.seviye
      continue
    }
    hepsiBes = false
    if (puan >= 3) seviye = kas.seviye
    else if (!onceki) seviye = sira(duyu) < sira('C5') ? duyu : 'C4'
    else if (onceki.seviye === 'T1' && kas.seviye === 'L2') {
      seviye = sira(duyu) > sira('T1') && sira(duyu) < sira('L2') ? duyu : 'T1'
    } else seviye = onceki.seviye
    break
  }
  if (hepsiBes) seviye = sira(duyu) > sira('S1') ? duyu : 'S1'
  return seviye
}

function enRostral(seviyeler: string[]): string {
  return seviyeler.reduce((en, seviye) => (sira(seviye) < sira(en) ? seviye : en))
}

function sakralDuyu(cevap: Cevaplar): boolean {
  if (cevap.dap === 'var') return true
  for (const yan of ['sag', 'sol'] as const) {
    for (const tur of ['lt', 'pp'] as const) {
      const puan = cevap[duyuAnahtar(tur, yan, 'S4-5')]
      if (puan === '1' || puan === '2') return true
    }
  }
  return false
}

function kasSeviyeAlti(cevap: Cevaplar, yan: Yan, motor: string, fazla: number): boolean {
  return KASLAR.some((kas) => {
    const puan = Number(cevap[kasAnahtar(yan, kas.id)])
    return sira(kas.seviye) > sira(motor) + fazla && puan >= 1
  })
}

export function aisEksikler(cevap: Cevaplar): string[] {
  const eksik: string[] = []
  for (const kas of KASLAR) {
    for (const yan of ['sag', 'sol'] as const) {
      const anahtar = kasAnahtar(yan, kas.id)
      if (!cevap[anahtar]) eksik.push(anahtar)
    }
  }
  for (const dermatome of DERMATOMLAR) {
    for (const tur of ['lt', 'pp'] as const) {
      for (const yan of ['sag', 'sol'] as const) {
        const anahtar = duyuAnahtar(tur, yan, dermatome)
        if (!cevap[anahtar]) eksik.push(anahtar)
      }
    }
  }
  if (!cevap.dap) eksik.push('dap')
  if (!cevap.vac) eksik.push('vac')
  return eksik
}

export function aisHesapla(cevap: Cevaplar): { sonucId: string; gerekce: string } | null {
  if (aisEksikler(cevap).length > 0) return null
  const duyuSag = duyuSeviyesi(cevap, 'sag')
  const duyuSol = duyuSeviyesi(cevap, 'sol')
  if (!duyuSag || !duyuSol) return null
  const motorSag = motorSeviyesi(cevap, 'sag', duyuSag)
  const motorSol = motorSeviyesi(cevap, 'sol', duyuSol)
  if (!motorSag || !motorSol) return null

  const hepsiNormal =
    DERMATOMLAR.every((dermatome) =>
      (['sag', 'sol'] as const).every(
        (yan) => cevap[duyuAnahtar('lt', yan, dermatome)] === '2' && cevap[duyuAnahtar('pp', yan, dermatome)] === '2',
      ),
    ) &&
    KASLAR.every((kas) => (['sag', 'sol'] as const).every((yan) => cevap[kasAnahtar(yan, kas.id)] === '5')) &&
    cevap.dap === 'var' &&
    cevap.vac === 'var'
  if (hepsiNormal) return { sonucId: 'ais-e', gerekce: 'Duyu ve motor tüm seviyelerde normal.' }

  const duyuVar = sakralDuyu(cevap)
  const motorVar = cevap.vac === 'var'
  if (!duyuVar && !motorVar) return { sonucId: 'ais-a', gerekce: 'S4-5 duyu, derin anal basınç ve istemli anal kasılma yok.' }

  const ucAlti =
    kasSeviyeAlti(cevap, 'sag', motorSag, 3) ||
    kasSeviyeAlti(cevap, 'sol', motorSol, 3) ||
    (cevap.vac === 'var' && (sira('S4-5') > sira(motorSag) + 3 || sira('S4-5') > sira(motorSol) + 3))
  if (!motorVar && !ucAlti) {
    return { sonucId: 'ais-b', gerekce: 'Sakral duyu var. Motor, nörolojik seviyenin üç düzey altını geçmiyor.' }
  }

  const nli = enRostral([duyuSag, duyuSol, motorSag, motorSol])
  const asagi = KASLAR.flatMap((kas) =>
    sira(kas.seviye) > sira(nli)
      ? [Number(cevap[kasAnahtar('sag', kas.id)]), Number(cevap[kasAnahtar('sol', kas.id)])]
      : [],
  )
  if (asagi.length === 0 || asagi.filter((puan) => puan >= 3).length * 2 < asagi.length) {
    return { sonucId: 'ais-c', gerekce: 'Motor tam değil. Seviye altındaki anahtar kasların yarısından azı 3 ve üstü.' }
  }
  return { sonucId: 'ais-d', gerekce: 'Motor tam değil. Seviye altındaki anahtar kasların en az yarısı 3 ve üstü.' }
}

export function kollariNormalDoldur(cevap: Cevaplar): Cevaplar {
  const sonraki = { ...cevap }
  for (const dermatome of DERMATOMLAR) {
    if (sira(dermatome) > sira('T1')) continue
    for (const tur of ['lt', 'pp'] as const) {
      for (const yan of ['sag', 'sol'] as const) sonraki[duyuAnahtar(tur, yan, dermatome)] = '2'
    }
  }
  for (const kas of KASLAR) {
    if (sira(kas.seviye) > sira('T1')) continue
    for (const yan of ['sag', 'sol'] as const) sonraki[kasAnahtar(yan, kas.id)] = '5'
  }
  return sonraki
}
