import { aisEksikler, aisHesapla } from './ais'
import type { Cevaplar } from './ais'
import { skalaBul } from './skalalar'
import type { HastalikId } from './tipler'

export type Hesap = {
  sonucId: string
  etiket: string
  gerekce: string
  eksik: number
}

const KOL = [
  { id: 'kol-yok', evre: 1 },
  { id: 'kol-spast', evre: 2 },
  { id: 'kol-sinerji', evre: 3 },
  { id: 'kol-sirt', evre: 4 },
  { id: 'kol-onde', evre: 4 },
  { id: 'kol-yana', evre: 5 },
  { id: 'kol-izole', evre: 6 },
]

const BACAK = [
  { id: 'bacak-yok', evre: 1 },
  { id: 'bacak-spast', evre: 2 },
  { id: 'bacak-sinerji', evre: 3 },
  { id: 'bacak-diz', evre: 4 },
  { id: 'bacak-ayak', evre: 4 },
  { id: 'bacak-izole', evre: 5 },
  { id: 'bacak-normal', evre: 6 },
]

export function hesapla(hastalikId: HastalikId, cevap: Cevaplar): Hesap | null {
  if (hastalikId === 'parapleji') return hesapAis(cevap)
  if (hastalikId === 'hemipleji') return hesapEvre('hemipleji', brunnstromEvre(cevap))
  if (hastalikId === 'parkinson') return hesapEvre('parkinson', hoehnEvre(cevap))
  if (hastalikId === 'dmd') return hesapEvre('dmd', vignosEvre(cevap))
  return hesapEvre('serebral-palsi', gmfcsEvre(cevap))
}

function hesapAis(cevap: Cevaplar): Hesap | null {
  const eksik = aisEksikler(cevap).length
  const sonuc = aisHesapla(cevap)
  if (!sonuc) return { sonucId: '', etiket: '', gerekce: '', eksik }
  const etiket = skalaBul('parapleji')?.secenekler.find((secenek) => secenek.id === sonuc.sonucId)?.etiket ?? sonuc.sonucId
  return { sonucId: sonuc.sonucId, etiket, gerekce: sonuc.gerekce, eksik: 0 }
}

function hesapEvre(hastalikId: HastalikId, bulunan: { sonucId: string; gerekce: string; eksik: number } | null): Hesap | null {
  if (!bulunan) return null
  if (bulunan.eksik > 0) return { sonucId: '', etiket: '', gerekce: '', eksik: bulunan.eksik }
  const skala = skalaBul(hastalikId)
  const etiket = skala?.secenekler.find((secenek) => secenek.id === bulunan.sonucId)?.etiket ?? bulunan.sonucId
  return { sonucId: bulunan.sonucId, etiket, gerekce: bulunan.gerekce, eksik: 0 }
}

function evreFrom(maddeler: { id: string; evre: number }[], cevap: Cevaplar): { evre: number; eksik: number } {
  const eksik = maddeler.filter((madde) => !cevap[madde.id]).length
  const evet = maddeler.filter((madde) => cevap[madde.id] === 'evet')
  const evre = evet.length === 0 ? 1 : Math.max(...evet.map((madde) => madde.evre))
  return { evre, eksik }
}

function brunnstromEvre(cevap: Cevaplar): { sonucId: string; gerekce: string; eksik: number } {
  const kol = evreFrom(KOL, cevap)
  const bacak = evreFrom(BACAK, cevap)
  const eksik = kol.eksik + bacak.eksik
  const evre = Math.min(kol.evre, bacak.evre)
  return {
    sonucId: `b${evre}`,
    gerekce: `Kol evre ${kol.evre}, bacak evre ${bacak.evre}. Tedavi daha kısıtlı tarafa göre yazıldı.`,
    eksik,
  }
}

function hoehnEvre(cevap: Cevaplar): { sonucId: string; gerekce: string; eksik: number } | null {
  const alanlar = ['tek', 'iki', 'denge', 'yurur', 'yatak']
  const eksik = alanlar.filter((alan) => !cevap[alan]).length
  if (eksik > 0) return { sonucId: '', gerekce: '', eksik }
  if (cevap.yatak === 'evet') return { sonucId: 'hy5', gerekce: 'Gün sandalye veya yatakta geçiyor.', eksik: 0 }
  if (cevap.yurur === 'hayir') return { sonucId: 'hy4', gerekce: 'Yardımsız ayakta durup yürüyemiyor.', eksik: 0 }
  if (cevap.denge === 'evet') return { sonucId: 'hy3', gerekce: 'Çekme testinde denge bozuluyor, kişi hâlâ yürüyor.', eksik: 0 }
  if (cevap.iki === 'evet') return { sonucId: 'hy2', gerekce: 'Bulgular iki taraflı, denge bozukluğu yok.', eksik: 0 }
  if (cevap.tek === 'evet') return { sonucId: 'hy1', gerekce: 'Bulgular tek taraflı.', eksik: 0 }
  return { sonucId: '', gerekce: 'Bulgunun tek mi iki taraflı mı olduğunu işaretleyin.', eksik: 1 }
}

function vignosEvre(cevap: Cevaplar): { sonucId: string; gerekce: string; eksik: number } | null {
  const alanlar = ['yurur', 'merdiven', 'kalkar', 'cihazla', 'dik', 'gecis', 'yatak']
  const eksik = alanlar.filter((alan) => !cevap[alan]).length
  if (eksik > 0) return { sonucId: '', gerekce: '', eksik }
  let derece = 9
  if (cevap.yatak === 'evet') derece = 10
  else if (cevap.yurur === 'evet' && cevap.merdiven === 'yardimsiz') derece = 1
  else if (cevap.yurur === 'evet' && cevap.merdiven === 'trabzan') derece = 2
  else if (cevap.yurur === 'evet' && cevap.merdiven === 'yavas') derece = 3
  else if (cevap.yurur === 'evet' && cevap.merdiven === 'yok' && cevap.kalkar === 'evet') derece = 4
  else if (cevap.yurur === 'evet' && cevap.merdiven === 'yok') derece = 5
  else if (cevap.cihazla === 'evet') derece = 6
  else if (cevap.dik === 'evet' && cevap.gecis === 'evet') derece = 7
  else if (cevap.dik === 'evet') derece = 8
  return { sonucId: `v${derece}`, gerekce: `Vignos ${derece}. Yürüme ve transfer cevaplarından hesaplandı.`, eksik: 0 }
}

function gmfcsEvre(cevap: Cevaplar): { sonucId: string; gerekce: string; eksik: number } | null {
  const alanlar = ['cp-yurur', 'cp-sinir', 'cp-cihaz', 'cp-teker', 'cp-kendi', 'cp-tasima']
  const eksik = alanlar.filter((alan) => !cevap[alan]).length
  if (eksik > 0) return { sonucId: '', gerekce: '', eksik }
  if (cevap['cp-tasima'] === 'evet') {
    return { sonucId: 'g5', gerekce: 'Baş ve gövde sınırlı, yer değiştirme için taşınıyor. GMFCS V.', eksik: 0 }
  }
  if (cevap['cp-cihaz'] === 'evet') {
    return { sonucId: 'g3', gerekce: 'Yürümek için elde tutulan cihaz kullanıyor. GMFCS III.', eksik: 0 }
  }
  if (cevap['cp-teker'] === 'evet' && cevap['cp-kendi'] === 'evet') {
    return { sonucId: 'g4', gerekce: 'Yer değiştirmenin çoğu sandalyede ve sandalyeyi kendisi sürüyor. GMFCS IV.', eksik: 0 }
  }
  if (cevap['cp-teker'] === 'evet' || cevap['cp-yurur'] === 'hayir') {
    return { sonucId: 'g5', gerekce: 'Bağımsız yürüme yok. GMFCS V.', eksik: 0 }
  }
  if (cevap['cp-sinir'] === 'evet') {
    return { sonucId: 'g2', gerekce: 'Cihazsız yürüyor, mesafe veya zeminde kısıt var. GMFCS II.', eksik: 0 }
  }
  return { sonucId: 'g1', gerekce: 'Cihazsız ve kısıtlanmadan yürüyor. GMFCS I.', eksik: 0 }
}

export const KOL_MADDELERI = [
  { id: 'kol-yok', metin: 'İstemli kol hareketi yok' },
  { id: 'kol-spast', metin: 'Spastisite var, istemli hareket çok az' },
  { id: 'kol-sinerji', metin: 'Omuz, dirsek ve el birlikte, sinergi içinde hareket ediyor' },
  { id: 'kol-sirt', metin: 'Elini bele veya sırta götürüyor' },
  { id: 'kol-onde', metin: 'Kol önde 90° iken dirseği açıyor' },
  { id: 'kol-yana', metin: 'Kol yana 90°, dirsek düz, önkol dönebiliyor' },
  { id: 'kol-izole', metin: 'Eklemleri ayrı ayrı, normale yakın hızda oynatıyor' },
]

export const BACAK_MADDELERI = [
  { id: 'bacak-yok', metin: 'İstemli bacak hareketi yok' },
  { id: 'bacak-spast', metin: 'Spastisite var, istemli hareket çok az' },
  { id: 'bacak-sinerji', metin: 'Kalça, diz ve ayak bileği birlikte bükülüyor' },
  { id: 'bacak-diz', metin: 'Otururken dizini 90° üzerine büküyor' },
  { id: 'bacak-ayak', metin: 'Topuk yerdeyken ayağını yukarı çekiyor' },
  { id: 'bacak-izole', metin: 'Kalça düzken dizini ayrı büküyor' },
  { id: 'bacak-normal', metin: 'Eklemleri ayrı ayrı, normale yakın' },
]
