import { tumMaddeler } from './degerlendirme'
import { kovaBul } from './katalog'
import type { Egzersiz, HastalikId, Ihtiyac, Kombinasyon, SeansKalemi, YasGrubu } from './tipler'
import { SEANS_SURESI } from './tipler'

export type Bulgu = {
  id: string
  bolge: string
  ihtiyac: Ihtiyac
  baslik: string
  deger: string
  sayi?: number
  oncelik: number
  gerekce: string
}

export type DinamikSeans = Kombinasyon & {
  bulgular: Bulgu[]
}

const ONCELIK: Record<Ihtiyac, number> = {
  agri: 100,
  cilt: 95,
  nefes: 90,
  germe: 80,
  transfer: 70,
  denge: 65,
  kuvvet: 55,
  motor: 50,
  yurume: 40,
}

function sayi(cevap: string | undefined): number | undefined {
  if (cevap === undefined || cevap === '') return undefined
  const n = Number(cevap)
  return Number.isFinite(n) ? n : undefined
}

function kisa(bolge: string, ne: string, n?: number): string {
  const b = bolge.replace(/-/g, ' ')
  if (ne === 'germe') return n !== undefined ? `${b} germesi (skor ${n})` : `${b} germesi`
  if (ne === 'kuvvet') return n !== undefined ? `${b} kuvveti (skor ${n})` : `${b} kuvveti`
  if (ne === 'ağrı') return `${b} ağrısı`
  if (ne === 'motor') return `${b} motor kontrol`
  return n !== undefined ? `${b} ${ne} (skor ${n})` : `${b} ${ne}`
}

export function bulgulariCikar(hastalikId: HastalikId, cevaplar: Record<string, string>): Bulgu[] {
  const bulgular: Bulgu[] = []
  const maddeler = tumMaddeler(hastalikId)

  for (const m of maddeler) {
    const c = cevaplar[m.id]
    if (!c) continue
    const n = sayi(c)

    if (m.tur === 'spastisite' && n !== undefined && n >= 2) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'germe',
        baslik: m.baslik,
        deger: String(n),
        sayi: n,
        oncelik: ONCELIK.germe + n,
        gerekce: kisa(m.bolge, 'germe', n),
      })
    }
    if (m.tur === 'kuvvet' && n !== undefined && n <= 3) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'kuvvet',
        baslik: m.baslik,
        deger: String(n),
        sayi: n,
        oncelik: ONCELIK.kuvvet + (3 - n),
        gerekce: kisa(m.bolge, 'kuvvet', n),
      })
    }
    if (m.tur === 'agri' && (c === 'evet' || c === 'var')) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'agri',
        baslik: m.baslik,
        deger: c,
        oncelik: ONCELIK.agri,
        gerekce: kisa(m.bolge, 'ağrı'),
      })
    }
    if (m.tur === 'denge' && (c === 'evet' || c === 'var')) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'denge',
        baslik: m.baslik,
        deger: c,
        oncelik: ONCELIK.denge,
        gerekce: 'denge',
      })
    }
    if (m.tur === 'cilt' && (c === 'evet' || c === 'var')) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'cilt',
        baslik: m.baslik,
        deger: c,
        oncelik: ONCELIK.cilt,
        gerekce: 'bası',
      })
    }
    if (m.tur === 'nefes' && (c === 'evet' || c === 'var')) {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'nefes',
        baslik: m.baslik,
        deger: c,
        oncelik: ONCELIK.nefes,
        gerekce: 'solunum',
      })
    }
    if (m.tur === 'transfer' && (c === 'evet' || c === 'var' || c === 'hayir')) {
      const yardimGerek =
        (m.baslik.includes('gerekiyor') || m.baslik.includes('lazım')) && c === 'evet'
      const yapamiyor =
        (m.baslik.includes('yapabiliyor') || m.baslik.includes('yapar') || m.baslik.includes('dönebiliyor')) &&
        c === 'hayir'
      const zorlaniyor = m.baslik.includes('zorlan') && c === 'evet'
      if (yardimGerek || yapamiyor || zorlaniyor) {
        bulgular.push({
          id: m.id,
          bolge: m.bolge,
          ihtiyac: 'transfer',
          baslik: m.baslik,
          deger: c,
          oncelik: ONCELIK.transfer,
          gerekce: 'transfer',
        })
      }
    }
    if (m.tur === 'yurume') {
      if (m.baslik.includes('yürü') && (c === 'evet' || c === 'var')) {
        bulgular.push({
          id: m.id,
          bolge: m.bolge,
          ihtiyac: 'yurume',
          baslik: m.baslik,
          deger: c,
          oncelik: ONCELIK.yurume,
          gerekce: 'yürüyüş',
        })
      }
      if (
        (m.baslik.includes('donma') || m.baslik.includes('küçük') || m.baslik.includes('kısıt') || m.baslik.includes('cihaz')) &&
        c === 'evet'
      ) {
        bulgular.push({
          id: m.id,
          bolge: m.bolge,
          ihtiyac: 'yurume',
          baslik: m.baslik,
          deger: c,
          oncelik: ONCELIK.yurume + 5,
          gerekce: 'yürüyüş',
        })
      }
    }
    if (m.tur === 'motor' && c === 'hayir') {
      bulgular.push({
        id: m.id,
        bolge: m.bolge,
        ihtiyac: 'motor',
        baslik: m.baslik,
        deger: c,
        oncelik: ONCELIK.motor,
        gerekce: kisa(m.bolge, 'motor'),
      })
    }
  }

  if (cevaplar['hem-ayak-equinus'] === 'evet' || cevaplar['cp-equinus'] === 'evet') {
    bulgular.push({
      id: 'equinus',
      bolge: 'ayak-bilegi',
      ihtiyac: 'germe',
      baslik: 'Ekinus',
      deger: 'evet',
      sayi: 4,
      oncelik: ONCELIK.germe + 4,
      gerekce: 'Ekinus için ayak bileği germesi',
    })
  }
  if (cevaplar['dmd-yorgun'] === 'evet') {
    bulgular.push({
      id: 'dmd-yorgun-bulgu',
      bolge: 'genel',
      ihtiyac: 'nefes',
      baslik: 'Yorgunluk',
      deger: 'evet',
      oncelik: 85,
      gerekce: 'Yorgunluk yönetimi',
    })
  }
  if (cevaplar['cp-bas-kontrol'] === 'hayir') {
    bulgular.push({
      id: 'cp-bas',
      bolge: 'govde',
      ihtiyac: 'denge',
      baslik: 'Baş kontrolü',
      deger: 'hayir',
      oncelik: ONCELIK.denge + 10,
      gerekce: 'Baş kontrolü için oturma dengesi',
    })
  }

  bulgular.sort((a, b) => b.oncelik - a.oncelik)
  return tekillestir(bulgular)
}

function tekillestir(liste: Bulgu[]): Bulgu[] {
  const map = new Map<string, Bulgu>()
  for (const b of liste) {
    const anahtar = `${b.bolge}:${b.ihtiyac}`
    const onceki = map.get(anahtar)
    if (!onceki || b.oncelik > onceki.oncelik) map.set(anahtar, b)
  }
  return [...map.values()].sort((a, b) => b.oncelik - a.oncelik)
}

function egzersizEslesir(egz: Egzersiz, bulgu: Bulgu): boolean {
  return egz.etiketler.some((e) => {
    const ihtiyacUygun = e.ihtiyac === bulgu.ihtiyac
    if (!ihtiyacUygun) return false
    const bolgeUygun =
      e.bolge === bulgu.bolge ||
      e.bolge === 'genel' ||
      bulgu.bolge === 'genel' ||
      ['denge', 'yurume', 'transfer', 'nefes', 'cilt', 'agri'].includes(bulgu.ihtiyac)
    if (!bolgeUygun) return false
    if (e.esik && bulgu.sayi !== undefined) {
      if (e.esik.min !== undefined && bulgu.sayi < e.esik.min) return false
      if (e.esik.max !== undefined && bulgu.sayi > e.esik.max) return false
    }
    return true
  })
}

function puanla(egz: Egzersiz, bulgular: Bulgu[]): { puan: number; neden: string[] } {
  let puan = 0
  const neden: string[] = []
  for (const b of bulgular) {
    if (egzersizEslesir(egz, b)) {
      puan += b.oncelik
      neden.push(b.gerekce)
    }
  }
  return { puan, neden }
}

export function seansUret(hastalikId: HastalikId, yas: YasGrubu | undefined, cevaplar: Record<string, string>): DinamikSeans {
  const kova = kovaBul(hastalikId, yas)
  const havuz = kova?.egzersizler ?? []
  let bulgular = bulgulariCikar(hastalikId, cevaplar)

  if (cevaplar['par-ais'] === 'ais-a' || cevaplar['par-ais'] === 'ais-b') {
    bulgular = bulgular.filter((b) => b.ihtiyac !== 'yurume')
  }
  if (cevaplar['pk-yatak'] === 'evet' || cevaplar['dmd-yatak'] === 'evet' || cevaplar['cp-tasima'] === 'evet') {
    bulgular = bulgular.filter((b) => b.ihtiyac !== 'yurume')
  }

  const adaylar = havuz
    .map((egz) => {
      const { puan, neden } = puanla(egz, bulgular)
      return { egz, puan, neden }
    })
    .filter((x) => x.puan > 0)
    .sort((a, b) => b.puan - a.puan)

  if (adaylar.length === 0) {
    const yedek = havuz.filter((e) =>
      e.etiketler.some((t) => t.ihtiyac === 'germe' || t.ihtiyac === 'denge' || t.ihtiyac === 'nefes'),
    )
    for (const e of yedek.slice(0, 4)) {
      adaylar.push({ egz: e, puan: 10, neden: ['temel'] })
    }
  }

  const plan: SeansKalemi[] = []
  const gerekceler: string[] = []
  let kalan = SEANS_SURESI
  const kullanilan = new Set<string>()

  for (const aday of adaylar) {
    if (kalan <= 0) break
    if (kullanilan.has(aday.egz.id)) continue
    const dk = Math.min(aday.egz.onerilenDk ?? 5, Math.max(3, kalan))
    if (dk < 3) break
    plan.push({
      egzersizId: aday.egz.id,
      dakika: dk,
      tekrar: aday.egz.doz,
    })
    kullanilan.add(aday.egz.id)
    kalan -= dk
    if (aday.neden[0]) gerekceler.push(aday.neden[0])
  }

  if (kalan > 0 && plan.length > 0) {
    plan[plan.length - 1].dakika += kalan
  }
  if (plan.length === 0) {
    const ilk = havuz[0]
    if (ilk) plan.push({ egzersizId: ilk.id, dakika: SEANS_SURESI, tekrar: ilk.doz })
  }

  const ozetBulgular = bulgular.slice(0, 5)
  return {
    id: 'motor',
    ad: 'Seans',
    hedef: ozetBulgular.map((b) => b.gerekce).slice(0, 3).join(' · ') || 'Temel seans',
    plan,
    seansNotu: gerekceler.slice(0, 3).join(' · ') || 'Temel set',
    bulgular: ozetBulgular,
  }
}

export function seansEgzersizleri(
  hastalikId: HastalikId,
  yas: YasGrubu | undefined,
  plan: SeansKalemi[],
): { kalem: SeansKalemi; egzersiz: Egzersiz }[] {
  const havuz = kovaBul(hastalikId, yas)?.egzersizler ?? []
  return plan.flatMap((kalem) => {
    const egzersiz = havuz.find((e) => e.id === kalem.egzersizId)
    return egzersiz ? [{ kalem, egzersiz }] : []
  })
}
