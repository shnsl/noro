import { maddeEksikSayisi } from './degerlendirme'
import { skalaBul } from './skalalar'
import type { HastalikId } from './tipler'

export type Hesap = {
  sonucId: string
  etiket: string
  gerekce: string
  eksik: number
}

export type Cevaplar = Record<string, string>

export function hesapla(hastalikId: HastalikId, cevap: Cevaplar): Hesap | null {
  const eksik = maddeEksikSayisi(hastalikId, cevap)
  if (hastalikId === 'parapleji') return ozet('parapleji', paraplejiOzet(cevap), eksik)
  if (hastalikId === 'hemipleji') return ozet('hemipleji', hemiplejiOzet(cevap), eksik)
  if (hastalikId === 'parkinson') return ozet('parkinson', parkinsonOzet(cevap), eksik)
  if (hastalikId === 'dmd') return ozet('dmd', dmdOzet(cevap), eksik)
  return ozet('serebral-palsi', cpOzet(cevap), eksik)
}

function ozet(
  hastalikId: HastalikId,
  bulunan: { sonucId: string; gerekce: string } | null,
  eksik: number,
): Hesap {
  if (eksik > 0) return { sonucId: '', etiket: '', gerekce: '', eksik }
  if (!bulunan) return { sonucId: '', etiket: '', gerekce: '', eksik: 1 }
  const skala = skalaBul(hastalikId)
  const etiket = skala?.secenekler.find((s) => s.id === bulunan.sonucId)?.etiket ?? bulunan.sonucId
  return { sonucId: bulunan.sonucId, etiket, gerekce: bulunan.gerekce, eksik: 0 }
}

function num(cevap: Cevaplar, id: string): number {
  const n = Number(cevap[id])
  return Number.isFinite(n) ? n : 0
}

function hemiplejiOzet(c: Cevaplar): { sonucId: string; gerekce: string } {
  const kuvvetler = [
    num(c, 'hem-omuz-kuvvet'),
    num(c, 'hem-dirsek-kuvvet'),
    num(c, 'hem-bilek-kuvvet'),
    num(c, 'hem-el-kuvvet'),
    num(c, 'hem-kalca-kuvvet'),
    num(c, 'hem-diz-kuvvet'),
    num(c, 'hem-ayak-kuvvet'),
  ]
  const spast = [
    num(c, 'hem-omuz-spast'),
    num(c, 'hem-dirsek-spast'),
    num(c, 'hem-bilek-spast'),
    num(c, 'hem-el-spast'),
    num(c, 'hem-kalca-spast'),
    num(c, 'hem-diz-spast'),
    num(c, 'hem-ayak-spast'),
  ]
  const ortK = kuvvetler.reduce((a, b) => a + b, 0) / kuvvetler.length
  const maxS = Math.max(...spast)
  const elKullanim = c['hem-el-kullanim'] === 'evet'
  const yurur = c['hem-yurur'] === 'evet'

  let evre = 1
  if (ortK < 0.5 && maxS < 1) evre = 1
  else if (ortK < 1.5 || (maxS >= 1 && ortK < 2)) evre = 2
  else if (ortK < 2.5) evre = 3
  else if (ortK < 3.5) evre = 4
  else if (ortK < 4.2 || !elKullanim) evre = 5
  else evre = 6

  if (yurur && evre < 4) {
    // yürüyüş varsa en az orta evre ipucu
  }

  return {
    sonucId: `b${evre}`,
    gerekce: `Evre ${evre} (kuvvet ${ortK.toFixed(1)}, spast ${maxS})`,
  }
}

function paraplejiOzet(c: Cevaplar): { sonucId: string; gerekce: string } {
  const ais = c['par-ais'] || 'ais-c'
  return {
    sonucId: ais,
    gerekce: ais.toUpperCase(),
  }
}

function parkinsonOzet(c: Cevaplar): { sonucId: string; gerekce: string } {
  if (c['pk-yatak'] === 'evet') return { sonucId: 'hy5', gerekce: 'HY 5' }
  if (c['pk-yurur'] === 'hayir') return { sonucId: 'hy4', gerekce: 'HY 4' }
  if (c['pk-denge-bozuk'] === 'evet') return { sonucId: 'hy3', gerekce: 'HY 3' }
  if (c['pk-ust-rijid'] && Number(c['pk-ust-rijid']) >= 2) {
    return { sonucId: 'hy2', gerekce: 'HY 2' }
  }
  return { sonucId: 'hy1', gerekce: 'HY 1' }
}

function dmdOzet(c: Cevaplar): { sonucId: string; gerekce: string } {
  let derece = 9
  if (c['dmd-yatak'] === 'evet') derece = 10
  else if (c['dmd-yurur'] === 'evet' && c['dmd-merdiven'] === 'yardimsiz') derece = 1
  else if (c['dmd-yurur'] === 'evet' && c['dmd-merdiven'] === 'trabzan') derece = 2
  else if (c['dmd-yurur'] === 'evet' && c['dmd-merdiven'] === 'yavas') derece = 3
  else if (c['dmd-yurur'] === 'evet' && c['dmd-merdiven'] === 'yok' && c['dmd-kalkar'] === 'evet') derece = 4
  else if (c['dmd-yurur'] === 'evet' && c['dmd-merdiven'] === 'yok') derece = 5
  else if (c['dmd-cihazla'] === 'evet') derece = 6
  else if (c['dmd-dik'] === 'evet' && c['dmd-gecis'] === 'evet') derece = 7
  else if (c['dmd-dik'] === 'evet') derece = 8
  return { sonucId: `v${derece}`, gerekce: `Vignos ${derece}` }
}

function cpOzet(c: Cevaplar): { sonucId: string; gerekce: string } {
  if (c['cp-tasima'] === 'evet') return { sonucId: 'g5', gerekce: 'GMFCS V' }
  if (c['cp-cihaz'] === 'evet') return { sonucId: 'g3', gerekce: 'GMFCS III' }
  if (c['cp-teker'] === 'evet' && c['cp-kendi'] === 'evet') return { sonucId: 'g4', gerekce: 'GMFCS IV' }
  if (c['cp-teker'] === 'evet' || c['cp-yurur'] === 'hayir') return { sonucId: 'g5', gerekce: 'GMFCS V' }
  if (c['cp-sinir'] === 'evet') return { sonucId: 'g2', gerekce: 'GMFCS II' }
  return { sonucId: 'g1', gerekce: 'GMFCS I' }
}
