import {
  CORE_CP,
  CORE_GAIT,
  CORE_PD,
  CORE_STROKE,
  CORE_UCDAVIS,
  SCIRE,
} from './kaynaklar'
import {
  coreTemelKaydet,
  egzersizAdUygula,
  manuelCoreEgzersizleri,
  type KatalogEgzersiz,
} from './egzersizYonetim'
import { bulgulariCikar, type Bulgu } from './tedaviMotoru'
import type { Egzersiz, HastalikId, Ihtiyac, YasGrubu } from './tipler'

export { coreAdKaydet } from './egzersizYonetim'

export type EkOneri = Egzersiz & {
  neden: string
  kategori: 'core' | 'stabilizasyon' | 'mobilite'
}

type OneriSablon = Egzersiz & {
  kategori: EkOneri['kategori']
  hastaliklar: HastalikId[] | 'hepsi'
  tetikler: Ihtiyac[]
  bolgeler?: string[]
  engel?: (hastalikId: HastalikId, cevaplar: Record<string, string>, bulgular: Bulgu[]) => boolean
}

function o(
  id: string,
  ad: string,
  hedef: string,
  pozisyon: string,
  adimlar: string[],
  doz: string,
  onlem: string,
  kategori: EkOneri['kategori'],
  kaynak: Egzersiz['kaynak'],
  hastaliklar: OneriSablon['hastaliklar'],
  tetikler: Ihtiyac[],
  bolgeler?: string[],
  engel?: OneriSablon['engel'],
): OneriSablon {
  return {
    id,
    ad,
    hedef,
    pozisyon,
    adimlar,
    doz,
    onlem,
    kaynak,
    etiketler: tetikler.map((ihtiyac) => ({ bolge: 'govde', ihtiyac })),
    onerilenDk: 4,
    kategori,
    hastaliklar,
    tetikler,
    bolgeler,
    engel,
  }
}

const HAVUZ: OneriSablon[] = [
  o(
    'ek-kopru',
    'Kalça köprüsü',
    'Gövde ve kalça dengesini güçlendirmek',
    'Sırtüstü, dizler bükülü',
    ['Kalçayı kaldırıp 2 saniye tutun.', 'Orta hatta kontrollü inin.', 'Zayıf tarafı gerektiğinde destekleyin.'],
    '8–10 tekrar',
    'Bel ağrısı varsa kaldırmayı alçaltın.',
    'core',
    CORE_GAIT,
    'hepsi',
    ['kuvvet', 'denge', 'transfer', 'yurume'],
    ['govde', 'kalca'],
    (h, c) => h === 'dmd' && c['dmd-yorgun'] === 'evet',
  ),
  o(
    'ek-kus-kopek',
    'Kuş-köpek',
    'Karşıt kol–bacak ile gövde dengesini çalıştırmak',
    'Dört ayak üzerinde',
    ['Sırtı düz tutun.', 'Karşı kol ve bacağı uzatın.', '2 saniye tutup diğer tarafa geçin.'],
    '6–8 / taraf',
    'Diz ağrısı varsa minder kullanın veya oturarak uygulayın.',
    'stabilizasyon',
    CORE_UCDAVIS,
    ['hemipleji', 'parkinson', 'serebral-palsi'],
    ['kuvvet', 'denge', 'motor'],
    ['govde'],
    (_h, c, b) =>
      c['cp-bas-kontrol'] === 'hayir' ||
      c['cp-tasima'] === 'evet' ||
      b.some((x) => x.bolge === 'govde' && x.ihtiyac === 'kuvvet' && (x.sayi ?? 5) <= 1),
  ),
  o(
    'ek-olu-bocek',
    'Ölü böcek',
    'Derin karın kaslarını çalıştırmak',
    'Sırtüstü',
    ['Dizler 90°, kollar yukarıda olsun.', 'Karşı kol ve bacağı açın.', 'Belin yerden kalkmamasına dikkat edin.'],
    '6–8 / çapraz',
    'Bel kalkıyorsa hareketi küçültün.',
    'core',
    CORE_UCDAVIS,
    ['hemipleji', 'parkinson', 'serebral-palsi', 'parapleji'],
    ['kuvvet', 'denge', 'motor'],
    ['govde'],
  ),
  o(
    'ek-kedi-deve',
    'Kedi–deve',
    'Omurga hareketini artırmak',
    'Dört ayak üzerinde',
    ['Nefes alırken göğsü hafifçe aşağı bırakın.', 'Nefes verirken sırtı yuvarlayın.', 'Yavaş tempo ile 10 döngü yapın.'],
    '10 döngü',
    'Boyunu zorlamayın.',
    'mobilite',
    CORE_PD,
    ['parkinson', 'hemipleji', 'serebral-palsi'],
    ['germe', 'motor', 'transfer'],
    ['govde', 'omuz'],
    (_h, c) => c['cp-bas-kontrol'] === 'hayir' || c['cp-tasima'] === 'evet' || c['pk-yatak'] === 'evet',
  ),
  o(
    'ek-yan-kopru',
    'Yan köprü (diz üstü)',
    'Yan gövde kaslarını güçlendirmek',
    'Yan yatış',
    ['Dirsek omuzun altında olsun.', 'Kalçayı kaldırıp 10–15 saniye tutun.', 'Form bozulursa inin.'],
    '2×10–15 sn / taraf',
    'Omuz ağrısı varsa atlayın.',
    'stabilizasyon',
    CORE_UCDAVIS,
    ['hemipleji', 'parkinson', 'serebral-palsi'],
    ['denge', 'kuvvet'],
    ['govde'],
    (_h, c) =>
      c['hem-omuz-agri'] === 'evet' ||
      c['hem-omuz-subluks'] === 'evet' ||
      c['par-omuz-agri'] === 'evet' ||
      c['cp-tasima'] === 'evet',
  ),
  o(
    'ek-otur-kaydir',
    'Oturarak ağırlık kaydırma',
    'Oturma dengesini geliştirmek',
    'Sandalye',
    ['Ağırlığı sağa ve sola kaydırın.', '2 saniye tutun.', 'Öne kısa bir uzanma ekleyin.'],
    '8–10 tekrar',
    'Arkada destekleyen biri olsun.',
    'stabilizasyon',
    CORE_STROKE,
    'hepsi',
    ['denge', 'transfer', 'kuvvet'],
    ['govde'],
  ),
  o(
    'ek-govde-donus',
    'Oturarak gövde çevirme',
    'Gövde dönüşünü kolaylaştırmak',
    'Sandalye',
    ['Kalçalar sabit kalsın.', 'Gövdeyi yavaşça sağa ve sola çevirin.', 'Her yöne 8 tekrar yapın.'],
    '8 / yön',
    'Baş dönmesi olursa bırakın.',
    'mobilite',
    CORE_CP,
    ['hemipleji', 'serebral-palsi', 'parkinson', 'parapleji'],
    ['motor', 'denge', 'transfer'],
    ['govde'],
  ),
  o(
    'ek-diz-gogus',
    'Dizi göğüse çekme',
    'Alt karın ve kalça mobilitesini desteklemek',
    'Sırtüstü',
    ['Bir dizi göğüse doğru çekin.', '2 saniye tutup indirin.', 'Diğer bacakla tekrarlayın.'],
    '6–8 / bacak',
    'Bel ağrısı varsa azaltın.',
    'core',
    CORE_CP,
    ['serebral-palsi', 'hemipleji', 'dmd'],
    ['kuvvet', 'germe'],
    ['kalca', 'govde'],
    (h, c) => h === 'dmd' && Number(c['dmd-kalca-kuvvet'] ?? '5') <= 1,
  ),
  o(
    'ek-pelvik-tilt',
    'Pelvis eğme',
    'Bel–pelvis kontrolünü geliştirmek',
    'Sırtüstü, dizler bükülü',
    ['Beli yere doğru yapıştırın.', '3 saniye tutun.', 'Bırakıp tekrarlayın.'],
    '8–10 tekrar',
    'Ağrı olursa bırakın.',
    'core',
    CORE_STROKE,
    'hepsi',
    ['kuvvet', 'germe', 'agri'],
    ['govde'],
  ),
  o(
    'ek-otur-nefes-core',
    'Oturarak nefes ve gövde desteği',
    'Hafif gövde aktivasyonu',
    'Sandalye',
    ['Dik oturun, göbeği hafifçe içeri alın.', 'Yavaş nefes alın.', '8–10 tur yapın.'],
    '8–10 nefes',
    'Yorulunca bırakın.',
    'core',
    SCIRE,
    ['dmd', 'parapleji', 'serebral-palsi'],
    ['nefes', 'kuvvet', 'denge'],
    ['govde', 'nefes'],
  ),
]

function hastaligaUygun(s: OneriSablon, hastalikId: HastalikId): boolean {
  return s.hastaliklar === 'hepsi' || s.hastaliklar.includes(hastalikId)
}

function kisaNeden(b: Bulgu): string {
  const bolge = b.bolge.replace(/-/g, ' ')
  if (b.ihtiyac === 'germe') return `${bolge} spastisitesi için gövde desteği`
  if (b.ihtiyac === 'kuvvet') return `${bolge} zayıflığı için gövde desteği`
  if (b.ihtiyac === 'denge') return 'Denge için stabilizasyon'
  if (b.ihtiyac === 'yurume') return 'Yürüyüş için gövde desteği'
  if (b.ihtiyac === 'transfer') return 'Transfer için gövde desteği'
  return `${bolge} için ek öneri`
}

function puanla(s: OneriSablon, bulgular: Bulgu[]): { puan: number; neden: string } {
  let puan = 0
  let neden = 'gövde stabilitesi'
  for (const b of bulgular) {
    if (s.tetikler.includes(b.ihtiyac)) {
      puan += b.oncelik
      neden = kisaNeden(b)
    }
    if (s.bolgeler?.includes(b.bolge)) puan += 8
  }
  if (s.kategori === 'core' || s.kategori === 'stabilizasyon') puan += 5
  return { puan, neden }
}

export function ekOnerileriSec(
  hastalikId: HastalikId,
  _yas: YasGrubu | undefined,
  cevaplar: Record<string, string>,
  anaPlanIds: string[] = [],
  limit = 4,
): EkOneri[] {
  const bulgular = bulgulariCikar(hastalikId, cevaplar)
  const disarida = new Set(anaPlanIds)

  const adaylar = [...HAVUZ, ...manuelCoreSablonlari()]
    .filter((s) => hastaligaUygun(s, hastalikId))
    .filter((s) => !disarida.has(s.id))
    .filter((s) => !(s.engel?.(hastalikId, cevaplar, bulgular) ?? false))
    .map((s) => {
      const { puan, neden } = puanla(s, bulgular)
      return { s, puan, neden }
    })
    .filter((x) => x.puan > 0)
    .sort((a, b) => b.puan - a.puan)

  const liste =
    adaylar.length > 0
      ? adaylar
      : HAVUZ.filter(
          (s) =>
            hastaligaUygun(s, hastalikId) &&
            (s.id === 'ek-pelvik-tilt' || s.id === 'ek-otur-kaydir' || s.id === 'ek-kopru'),
        )
          .filter((s) => !(s.engel?.(hastalikId, cevaplar, bulgular) ?? false))
          .map((s) => ({ s, puan: 1, neden: 'temel gövde' }))

  return liste.slice(0, limit).map(({ s, neden }) => ({
    id: s.id,
    ad: egzersizAdUygula(s.id, s.ad),
    hedef: s.hedef,
    pozisyon: s.pozisyon,
    adimlar: s.adimlar,
    doz: s.doz,
    onlem: s.onlem,
    kaynak: s.kaynak,
    etiketler: s.etiketler,
    onerilenDk: s.onerilenDk,
    kategori: s.kategori,
    neden,
  }))
}

function manuelCoreSablonlari(): OneriSablon[] {
  return manuelCoreEgzersizleri().map((e) => ({
    ...e,
    kategori: e.kategori ?? 'core',
    hastaliklar: 'hepsi' as const,
    tetikler: e.etiketler.map((t) => t.ihtiyac),
    bolgeler: ['govde'],
  }))
}

function coreTemelListe(): KatalogEgzersiz[] {
  return HAVUZ.map((s) => ({
    id: s.id,
    ad: s.ad,
    hedef: s.hedef,
    pozisyon: s.pozisyon,
    adimlar: s.adimlar,
    doz: s.doz,
    onlem: s.onlem,
    kaynak: s.kaynak,
    etiketler: s.etiketler,
    onerilenDk: s.onerilenDk,
    tur: 'core' as const,
    bolge: 'core',
    kategori: s.kategori,
  }))
}

coreTemelKaydet(coreTemelListe)

/** Ayarlar listesi: tüm core / stabilizasyon çeşitleri */
export function coreKatalog(): {
  id: string
  ad: string
  kategori: EkOneri['kategori']
  hedef: string
  pozisyon: string
  doz: string
  adimlar: string[]
  onlem: string
  kaynak: Egzersiz['kaynak']
}[] {
  const temel = HAVUZ.map((s) => ({
    id: s.id,
    ad: egzersizAdUygula(s.id, s.ad),
    kategori: s.kategori,
    hedef: s.hedef,
    pozisyon: s.pozisyon,
    doz: s.doz,
    adimlar: s.adimlar,
    onlem: s.onlem,
    kaynak: s.kaynak,
  }))
  const ozel = manuelCoreEgzersizleri().map((e) => ({
    id: e.id,
    ad: e.ad,
    kategori: (e.kategori ?? 'core') as EkOneri['kategori'],
    hedef: e.hedef,
    pozisyon: e.pozisyon,
    doz: e.doz,
    adimlar: e.adimlar,
    onlem: e.onlem,
    kaynak: e.kaynak,
  }))
  return [...temel, ...ozel]
}

export function coreBul(id: string): EkOneri | undefined {
  const s = HAVUZ.find((x) => x.id === id)
  if (s) {
    return {
      id: s.id,
      ad: egzersizAdUygula(s.id, s.ad),
      hedef: s.hedef,
      pozisyon: s.pozisyon,
      adimlar: s.adimlar,
      doz: s.doz,
      onlem: s.onlem,
      kaynak: s.kaynak,
      etiketler: s.etiketler,
      onerilenDk: s.onerilenDk,
      kategori: s.kategori,
      neden: 'atanan',
    }
  }
  const manuel = manuelCoreEgzersizleri().find((x) => x.id === id)
  if (!manuel) return undefined
  return {
    id: manuel.id,
    ad: manuel.ad,
    hedef: manuel.hedef,
    pozisyon: manuel.pozisyon,
    adimlar: manuel.adimlar,
    doz: manuel.doz,
    onlem: manuel.onlem,
    kaynak: manuel.kaynak,
    etiketler: manuel.etiketler,
    onerilenDk: manuel.onerilenDk,
    kategori: manuel.kategori ?? 'core',
    neden: 'atanan',
  }
}

export function atananCoreListesi(ids: string[] | undefined): EkOneri[] {
  if (!ids?.length) return []
  return ids.map(coreBul).filter((x): x is EkOneri => Boolean(x))
}
