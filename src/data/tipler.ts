export type HastalikId = 'hemipleji' | 'parapleji' | 'parkinson' | 'dmd' | 'serebral-palsi'

export type YasGrubu = 'cocuk' | 'yetiskin'

export type Kaynak = {
  ad: string
  yil: string
  url: string
  lisans: string
}

export type Ihtiyac =
  | 'germe'
  | 'kuvvet'
  | 'motor'
  | 'denge'
  | 'yurume'
  | 'nefes'
  | 'cilt'
  | 'transfer'
  | 'agri'

export type EgzersizEtiketi = {
  bolge: string
  ihtiyac: Ihtiyac
  /** Spastisite / skor eşikleri (sayısal ölçeklerde) */
  esik?: { min?: number; max?: number }
}

export type Egzersiz = {
  id: string
  ad: string
  hedef: string
  pozisyon: string
  adimlar: string[]
  doz: string
  onlem: string
  kaynak: Kaynak
  etiketler: EgzersizEtiketi[]
  /** Seansa alınırken önerilen dakika */
  onerilenDk?: number
}

export const SEANS_SURESI = 30

export type SeansKalemi = {
  egzersizId: string
  dakika: number
  tekrar: string
}

export type Kombinasyon = {
  id: string
  ad: string
  hedef: string
  plan: SeansKalemi[]
  seansNotu: string
}

export type Kova = {
  hastalikId: HastalikId
  yas?: YasGrubu
  egzersizler: Egzersiz[]
}

export type Hasta = {
  id: string
  ad: string
  hastalikId: HastalikId
  yas?: YasGrubu
  skalaId: string
  sonucId: string
  /** Eski kayıt uyumu; artık motor üretir, sabit set yok */
  kombinasyonId: string
  cevaplar: Record<string, string>
  /** Ayarlardan seçilip hastaya atanan core egzersiz id’leri */
  atananCoreIds?: string[]
  guncellendi?: number
}

export const HASTALIKLAR: { id: HastalikId; ad: string; yasVar: boolean }[] = [
  { id: 'hemipleji', ad: 'Hemipleji', yasVar: true },
  { id: 'parapleji', ad: 'Parapleji', yasVar: true },
  { id: 'parkinson', ad: 'Parkinson', yasVar: false },
  { id: 'dmd', ad: 'DMD', yasVar: false },
  { id: 'serebral-palsi', ad: 'Serebral palsi', yasVar: false },
]
