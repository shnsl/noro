export type HastalikId = 'hemipleji' | 'parapleji' | 'parkinson' | 'dmd' | 'serebral-palsi'

export type YasGrubu = 'cocuk' | 'yetiskin'

export type Kaynak = {
  ad: string
  yil: string
  url: string
  lisans: string
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
  kombinasyonlar: Kombinasyon[]
}

export type Hasta = {
  id: string
  ad: string
  hastalikId: HastalikId
  yas?: YasGrubu
  skalaId: string
  sonucId: string
  kombinasyonId: string
  cevaplar: Record<string, string>
  guncellendi?: number
}

export const HASTALIKLAR: { id: HastalikId; ad: string; yasVar: boolean }[] = [
  { id: 'hemipleji', ad: 'Hemipleji', yasVar: true },
  { id: 'parapleji', ad: 'Parapleji', yasVar: true },
  { id: 'parkinson', ad: 'Parkinson', yasVar: false },
  { id: 'dmd', ad: 'DMD', yasVar: false },
  { id: 'serebral-palsi', ad: 'Serebral palsi', yasVar: false },
]
