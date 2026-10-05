import type { HastalikId } from './tipler'

export type Olcek = '0-5' | '0-2' | 'evet-hayir' | 'tek-secim'

export type DegerlendirmeMaddesi = {
  id: string
  baslik: string
  yardim?: string
  olcek: Olcek
  /** 0-5 ölçeğinde etiketler (kısa) */
  etiketler?: string[]
  /** tek-secim için seçenekler */
  secenekler?: { id: string; etiket: string }[]
  bolge: string
  /** Bulgu üretiminde kullanılır */
  tur: 'spastisite' | 'kuvvet' | 'agri' | 'denge' | 'yurume' | 'nefes' | 'cilt' | 'transfer' | 'motor' | 'genel'
}

export type DegerlendirmeBolumu = {
  id: string
  ad: string
  kisa: string
  maddeler: DegerlendirmeMaddesi[]
}

const SPAST = ['0', '1', '2', '3', '4', '5']
const KUVVET = ['0', '1', '2', '3', '4', '5']

function sp(id: string, baslik: string, bolge: string, yardim?: string): DegerlendirmeMaddesi {
  return { id, baslik, bolge, olcek: '0-5', etiketler: SPAST, tur: 'spastisite', yardim }
}

function kv(id: string, baslik: string, bolge: string, yardim?: string): DegerlendirmeMaddesi {
  return { id, baslik, bolge, olcek: '0-5', etiketler: KUVVET, tur: 'kuvvet', yardim }
}

function eh(id: string, baslik: string, bolge: string, tur: DegerlendirmeMaddesi['tur'], yardim?: string): DegerlendirmeMaddesi {
  return { id, baslik, bolge, olcek: 'evet-hayir', tur, yardim }
}

const hemipleji: DegerlendirmeBolumu[] = [
  {
    id: 'omuz',
    ad: 'Omuz',
    kisa: 'Omuz',
    maddeler: [
      sp('hem-omuz-spast', 'Spastisite 0–5', 'omuz'),
      kv('hem-omuz-kuvvet', 'Kaldırma kuvveti 0–5', 'omuz'),
      eh('hem-omuz-agri', 'Ağrı?', 'omuz', 'agri'),
      eh('hem-omuz-subluks', 'Subluksasyon?', 'omuz', 'agri'),
    ],
  },
  {
    id: 'dirsek',
    ad: 'Dirsek',
    kisa: 'Dirsek',
    maddeler: [
      sp('hem-dirsek-spast', 'Spastisite 0–5', 'dirsek'),
      kv('hem-dirsek-kuvvet', 'Açma kuvveti 0–5', 'dirsek'),
    ],
  },
  {
    id: 'el-bilegi',
    ad: 'El bileği',
    kisa: 'Bilek',
    maddeler: [
      sp('hem-bilek-spast', 'Spastisite 0–5', 'el-bilegi'),
      kv('hem-bilek-kuvvet', 'Ekstansiyon 0–5', 'el-bilegi'),
    ],
  },
  {
    id: 'el',
    ad: 'El ve kavrama',
    kisa: 'El',
    maddeler: [
      sp('hem-el-spast', 'Spastisite 0–5', 'el'),
      kv('hem-el-kuvvet', 'Kavrama 0–5', 'el'),
      eh('hem-el-kullanim', 'Günlük işte kullanıyor?', 'el', 'motor'),
    ],
  },
  {
    id: 'govde',
    ad: 'Gövde',
    kisa: 'Gövde',
    maddeler: [
      kv('hem-govde-otur', 'Oturma kontrolü 0–5', 'govde'),
      eh('hem-govde-donme', 'Yatakta dönebiliyor?', 'govde', 'transfer'),
    ],
  },
  {
    id: 'kalca',
    ad: 'Kalça',
    kisa: 'Kalça',
    maddeler: [
      sp('hem-kalca-spast', 'Spastisite 0–5', 'kalca'),
      kv('hem-kalca-kuvvet', 'Uzatma kuvveti 0–5', 'kalca'),
    ],
  },
  {
    id: 'diz',
    ad: 'Diz',
    kisa: 'Diz',
    maddeler: [
      sp('hem-diz-spast', 'Spastisite 0–5', 'diz'),
      kv('hem-diz-kuvvet', 'Ekstansiyon 0–5', 'diz'),
    ],
  },
  {
    id: 'ayak-bilegi',
    ad: 'Ayak bileği',
    kisa: 'Ayak',
    maddeler: [
      sp('hem-ayak-spast', 'Spastisite 0–5', 'ayak-bilegi'),
      kv('hem-ayak-kuvvet', 'Dorsifleksiyon 0–5', 'ayak-bilegi'),
      eh('hem-ayak-equinus', 'Ekinus / parmak ucu?', 'ayak-bilegi', 'spastisite'),
    ],
  },
  {
    id: 'denge-yurume',
    ad: 'Denge ve yürüme',
    kisa: 'Denge',
    maddeler: [
      eh('hem-denge-ayak', 'Ayakta denge bozuk?', 'denge', 'denge'),
      eh('hem-yurur', 'Kısa mesafe yürüyor?', 'yurume', 'yurume'),
      eh('hem-yurume-destek', 'Cihaz / yardım lazım?', 'yurume', 'yurume'),
      eh('hem-transfer', 'Kalkışta yardım lazım?', 'transfer', 'transfer'),
    ],
  },
]

const parapleji: DegerlendirmeBolumu[] = [
  {
    id: 'ust',
    ad: 'Üst ekstremite',
    kisa: 'Üst',
    maddeler: [
      kv('par-omuz-kuvvet', 'Omuz / kürek 0–5', 'omuz'),
      eh('par-omuz-agri', 'Omuz ağrısı?', 'omuz', 'agri'),
    ],
  },
  {
    id: 'govde',
    ad: 'Gövde ve oturma',
    kisa: 'Gövde',
    maddeler: [
      kv('par-govde-otur', 'Oturma dengesi 0–5', 'govde'),
      eh('par-transfer', 'Transfer yapabiliyor?', 'transfer', 'transfer'),
    ],
  },
  {
    id: 'alt',
    ad: 'Alt ekstremite',
    kisa: 'Alt',
    maddeler: [
      sp('par-kalca-spast', 'Kalça spast. 0–5', 'kalca'),
      sp('par-diz-spast', 'Diz spast. 0–5', 'diz'),
      sp('par-ayak-spast', 'Ayak spast. 0–5', 'ayak-bilegi'),
      kv('par-kalca-kuvvet', 'Kalça kuvvet 0–5', 'kalca'),
      kv('par-diz-kuvvet', 'Diz kuvvet 0–5', 'diz'),
      kv('par-ayak-kuvvet', 'Ayak kuvvet 0–5', 'ayak-bilegi'),
    ],
  },
  {
    id: 'cilt-nefes',
    ad: 'Cilt ve solunum',
    kisa: 'Bakım',
    maddeler: [
      eh('par-basi', 'Bası riski?', 'cilt', 'cilt'),
      eh('par-nefes-zor', 'Solunum zorluğu?', 'nefes', 'nefes'),
    ],
  },
  {
    id: 'ais-ozet',
    ad: 'AIS özeti',
    kisa: 'AIS',
    maddeler: [
      {
        id: 'par-ais',
        baslik: 'AIS skoru',
        bolge: 'genel',
        olcek: 'tek-secim',
        tur: 'genel',
        secenekler: [
          { id: 'ais-a', etiket: 'A — tam' },
          { id: 'ais-b', etiket: 'B — duyu var' },
          { id: 'ais-c', etiket: 'C — motor zayıf' },
          { id: 'ais-d', etiket: 'D — motor güçlü' },
          { id: 'ais-e', etiket: 'E — normal' },
        ],
      },
      eh('par-yurur', 'Fonksiyonel yürüyüş?', 'yurume', 'yurume'),
    ],
  },
]

const parkinson: DegerlendirmeBolumu[] = [
  {
    id: 'ust',
    ad: 'Üst ekstremite',
    kisa: 'Üst',
    maddeler: [
      sp('pk-ust-rijid', 'Rijidite 0–5', 'omuz'),
      eh('pk-tremor', 'Tremor belirgin?', 'el', 'motor'),
      kv('pk-ust-genlik', 'Geniş hareket 0–5', 'omuz'),
    ],
  },
  {
    id: 'govde',
    ad: 'Gövde ve yatak',
    kisa: 'Gövde',
    maddeler: [
      eh('pk-yatak-donme', 'Yatakta dönme zor?', 'govde', 'transfer'),
      kv('pk-govde-donus', 'Gövde dönüş 0–5', 'govde'),
    ],
  },
  {
    id: 'alt',
    ad: 'Alt ekstremite ve transfer',
    kisa: 'Alt',
    maddeler: [
      sp('pk-alt-rijid', 'Bacak rijidite 0–5', 'kalca'),
      eh('pk-sts-zor', 'Otur–kalk zor?', 'transfer', 'transfer'),
      kv('pk-sts-kuvvet', 'Otur–kalk 0–5', 'transfer'),
    ],
  },
  {
    id: 'denge',
    ad: 'Denge',
    kisa: 'Denge',
    maddeler: [
      eh('pk-denge-bozuk', 'Denge bozuk?', 'denge', 'denge'),
      eh('pk-dusme', 'Son 3 ay düşme?', 'denge', 'denge'),
    ],
  },
  {
    id: 'yurume',
    ad: 'Yürüme',
    kisa: 'Yürüme',
    maddeler: [
      eh('pk-yurur', 'Yardımsız yürüyor?', 'yurume', 'yurume'),
      eh('pk-donma', 'Donma var mı?', 'yurume', 'yurume'),
      eh('pk-kucuk-adim', 'Küçük adım?', 'yurume', 'yurume'),
      eh('pk-yatak', 'Sandalyede / yatakta mı?', 'genel', 'genel'),
    ],
  },
]

const dmd: DegerlendirmeBolumu[] = [
  {
    id: 'germe',
    ad: 'Kontraktür riski',
    kisa: 'Germe',
    maddeler: [
      sp('dmd-ayak-kisa', 'Aşil kısalığı 0–5', 'ayak-bilegi'),
      sp('dmd-diz-kisa', 'Hamstring kısalığı 0–5', 'diz'),
      sp('dmd-kalca-kisa', 'Kalça kısalığı 0–5', 'kalca'),
      sp('dmd-dirsek-kisa', 'Dirsek kısalığı 0–5', 'dirsek'),
    ],
  },
  {
    id: 'kuvvet',
    ad: 'Kuvvet ve yorgunluk',
    kisa: 'Kuvvet',
    maddeler: [
      kv('dmd-kalca-kuvvet', 'Kalça / gövde 0–5', 'kalca'),
      kv('dmd-el-kuvvet', 'El aktivitesi 0–5', 'el'),
      eh('dmd-yorgun', 'Çabuk yoruluyor?', 'genel', 'genel'),
    ],
  },
  {
    id: 'mobilite',
    ad: 'Mobilite',
    kisa: 'Mobilite',
    maddeler: [
      eh('dmd-yurur', 'Yardımsız yürür?', 'yurume', 'yurume'),
      {
        id: 'dmd-merdiven',
        baslik: 'Merdiven',
        bolge: 'yurume',
        olcek: 'tek-secim',
        tur: 'yurume',
        secenekler: [
          { id: 'yardimsiz', etiket: 'Yardımsız' },
          { id: 'trabzan', etiket: 'Trabzan' },
          { id: 'yavas', etiket: 'Yavaş' },
          { id: 'yok', etiket: 'Yok' },
        ],
      },
      eh('dmd-kalkar', 'Sandalyeden kalkar?', 'transfer', 'transfer'),
      eh('dmd-cihazla', 'Cihazla mı yürür?', 'yurume', 'yurume'),
      eh('dmd-dik', 'Dik oturur?', 'govde', 'denge'),
      eh('dmd-gecis', 'Transfer kendi yapar?', 'transfer', 'transfer'),
      eh('dmd-yatak', 'Yatağa bağımlı?', 'genel', 'genel'),
    ],
  },
  {
    id: 'nefes',
    ad: 'Solunum',
    kisa: 'Nefes',
    maddeler: [
      eh('dmd-nefes-zor', 'Solunum zorluğu?', 'nefes', 'nefes'),
    ],
  },
]

const cp: DegerlendirmeBolumu[] = [
  {
    id: 'ust',
    ad: 'Üst ekstremite',
    kisa: 'Üst',
    maddeler: [
      sp('cp-omuz-spast', 'Omuz spast. 0–5', 'omuz'),
      sp('cp-el-spast', 'El spast. 0–5', 'el'),
      kv('cp-el-kuvvet', 'İki el kullanım 0–5', 'el'),
      eh('cp-el-is', 'İki el işi yapıyor?', 'el', 'motor'),
    ],
  },
  {
    id: 'alt',
    ad: 'Alt ekstremite',
    kisa: 'Alt',
    maddeler: [
      sp('cp-kalca-spast', 'Kalça spast. 0–5', 'kalca'),
      sp('cp-diz-spast', 'Diz spast. 0–5', 'diz'),
      sp('cp-ayak-spast', 'Ayak spast. 0–5', 'ayak-bilegi'),
      kv('cp-kalca-kuvvet', 'Bacak kuvvet 0–5', 'kalca'),
      eh('cp-equinus', 'Ekinus?', 'ayak-bilegi', 'spastisite'),
    ],
  },
  {
    id: 'govde',
    ad: 'Gövde ve oturma',
    kisa: 'Gövde',
    maddeler: [
      kv('cp-otur-denge', 'Oturma dengesi 0–5', 'govde'),
      eh('cp-bas-kontrol', 'Baş kontrolü yeterli?', 'govde', 'motor'),
    ],
  },
  {
    id: 'mobilite',
    ad: 'Mobilite',
    kisa: 'Mobilite',
    maddeler: [
      eh('cp-yurur', 'Cihazsız yürür?', 'yurume', 'yurume'),
      eh('cp-sinir', 'Mesafe kısıtı?', 'yurume', 'yurume'),
      eh('cp-cihaz', 'Yürüteç kullanır?', 'yurume', 'yurume'),
      eh('cp-teker', 'Çoğunlukla sandalyede?', 'transfer', 'transfer'),
      eh('cp-kendi', 'Sandalyeyi sürer?', 'transfer', 'transfer'),
      eh('cp-tasima', 'Taşınma gerekir?', 'genel', 'genel'),
      eh('cp-denge-ayak', 'Ayakta denge bozuk?', 'denge', 'denge'),
    ],
  },
]

const HARITA: Record<HastalikId, DegerlendirmeBolumu[]> = {
  hemipleji,
  parapleji,
  parkinson,
  dmd,
  'serebral-palsi': cp,
}

export function degerlendirmeBolumleri(hastalikId: HastalikId): DegerlendirmeBolumu[] {
  return HARITA[hastalikId] ?? []
}

export function tumMaddeler(hastalikId: HastalikId): DegerlendirmeMaddesi[] {
  return degerlendirmeBolumleri(hastalikId).flatMap((b) => b.maddeler)
}

export function maddeEksikSayisi(hastalikId: HastalikId, cevaplar: Record<string, string>): number {
  return tumMaddeler(hastalikId).filter((m) => !cevaplar[m.id]).length
}

export function bolumTamamMi(bolum: DegerlendirmeBolumu, cevaplar: Record<string, string>): boolean {
  return bolum.maddeler.every((m) => Boolean(cevaplar[m.id]))
}
