import { DERMATOMLAR, aisHesapla, duyuAnahtar, kasAnahtar } from './ais.ts'
import type { Cevaplar } from './ais.ts'

function bos(): Cevaplar {
  const cevap: Cevaplar = { dap: 'yok', vac: 'yok' }
  for (const dermatome of DERMATOMLAR) {
    for (const tur of ['lt', 'pp'] as const) {
      for (const yan of ['sag', 'sol'] as const) cevap[duyuAnahtar(tur, yan, dermatome)] = '0'
    }
  }
  for (const id of ['c5', 'c6', 'c7', 'c8', 't1', 'l2', 'l3', 'l4', 'l5', 's1']) {
    for (const yan of ['sag', 'sol'] as const) cevap[kasAnahtar(yan, id)] = '0'
  }
  return cevap
}

function duyuTam(cevap: Cevaplar, kadar: string) {
  let yaz = true
  for (const dermatome of DERMATOMLAR) {
    if (!yaz) break
    for (const tur of ['lt', 'pp'] as const) {
      for (const yan of ['sag', 'sol'] as const) cevap[duyuAnahtar(tur, yan, dermatome)] = '2'
    }
    if (dermatome === kadar) yaz = false
  }
}

function kasAyarla(cevap: Cevaplar, idler: string[], puan: string) {
  for (const id of idler) {
    for (const yan of ['sag', 'sol'] as const) cevap[kasAnahtar(yan, id)] = puan
  }
}

const tam = bos()
if (aisHesapla(tam)?.sonucId !== 'ais-a') throw new Error(`bos A degil: ${aisHesapla(tam)?.sonucId}`)

const duyu = bos()
duyu.dap = 'var'
if (aisHesapla(duyu)?.sonucId !== 'ais-b') throw new Error(`dap B degil: ${aisHesapla(duyu)?.sonucId}`)

const kollar = ['c5', 'c6', 'c7', 'c8', 't1']
const bacaklar = ['l2', 'l3', 'l4', 'l5', 's1']
const t10 = bos()
duyuTam(t10, 'T10')
kasAyarla(t10, kollar, '5')
if (aisHesapla(t10)?.sonucId !== 'ais-a') throw new Error(`t10 A degil: ${aisHesapla(t10)?.sonucId}`)

const t10b = bos()
duyuTam(t10b, 'T10')
kasAyarla(t10b, kollar, '5')
t10b.dap = 'var'
if (aisHesapla(t10b)?.sonucId !== 'ais-b') throw new Error(`t10b B degil: ${aisHesapla(t10b)?.sonucId}`)

const t10c = structuredClone(t10b)
t10c[kasAnahtar('sag', 'l2')] = '2'
if (aisHesapla(t10c)?.sonucId !== 'ais-c') throw new Error(`t10c C degil: ${aisHesapla(t10c)?.sonucId}`)

const t10d = structuredClone(t10b)
kasAyarla(t10d, bacaklar, '4')
t10d.vac = 'var'
if (aisHesapla(t10d)?.sonucId !== 'ais-d') throw new Error(`t10d D degil: ${aisHesapla(t10d)?.sonucId}`)

const normal = bos()
duyuTam(normal, 'S4-5')
kasAyarla(normal, [...kollar, ...bacaklar], '5')
normal.dap = 'var'
normal.vac = 'var'
if (aisHesapla(normal)?.sonucId !== 'ais-e') throw new Error(`normal E degil: ${aisHesapla(normal)?.sonucId}`)

console.log('ais tamam')
