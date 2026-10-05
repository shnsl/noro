import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import type { Hasta } from './data/tipler'
import { firebaseBaslat } from './firebase'

const ANAHTAR = 'noro.hastalar.v2'
const KOLEKSIYON = 'hastalar'

export function hastalariGetir(): Hasta[] {
  const ham = localStorage.getItem(ANAHTAR)
  if (!ham) return []
  const okunan: unknown = JSON.parse(ham)
  if (!Array.isArray(okunan)) return []
  return okunan.filter(hastaMi).sort(yenidenEskiye)
}

function yerelKaydet(liste: Hasta[]): void {
  localStorage.setItem(ANAHTAR, JSON.stringify(liste.sort(yenidenEskiye)))
}

export async function hastaKaydet(hasta: Hasta): Promise<void> {
  const kayit: Hasta = { ...hasta, guncellendi: Date.now() }
  const liste = hastalariGetir()
  const index = liste.findIndex((item) => item.id === kayit.id)
  if (index >= 0) liste[index] = kayit
  else liste.unshift(kayit)
  yerelKaydet(liste)

  const { db } = firebaseBaslat()
  if (!db) return
  try {
    await setDoc(doc(db, KOLEKSIYON, kayit.id), temizHasta(kayit))
  } catch (err) {
    console.warn('Hasta buluta yazılamadı (yerelde duruyor):', err)
  }
}

export async function hastaSil(id: string): Promise<void> {
  yerelKaydet(hastalariGetir().filter((kayit) => kayit.id !== id))

  const { db } = firebaseBaslat()
  if (!db) return
  try {
    await deleteDoc(doc(db, KOLEKSIYON, id))
  } catch (err) {
    console.warn('Hasta buluttan silinemedi:', err)
  }
}

export function hastaGetir(id: string): Hasta | undefined {
  return hastalariGetir().find((kayit) => kayit.id === id)
}

export function yeniId(): string {
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Yerel ve Firestore listesini birleştirir; eksik olanları karşı tarafa yazar. */
export async function hastalariSenkronizeEt(): Promise<Hasta[]> {
  const yerel = hastalariGetir()
  const { db } = firebaseBaslat()
  if (!db) return yerel

  try {
    const snapshot = await getDocs(collection(db, KOLEKSIYON))
    const bulutHarita = new Map<string, Hasta>()
    snapshot.forEach((dokuman) => {
      const veri = { id: dokuman.id, ...dokuman.data() }
      if (hastaMi(veri)) bulutHarita.set(veri.id, veri)
    })

    const birlesik = new Map<string, Hasta>()
    for (const kayit of yerel) birlesik.set(kayit.id, kayit)
    for (const [id, bulut] of bulutHarita) {
      const yerelKayit = birlesik.get(id)
      if (!yerelKayit) {
        birlesik.set(id, bulut)
        continue
      }
      const yerelZaman = yerelKayit.guncellendi ?? 0
      const bulutZaman = bulut.guncellendi ?? 0
      birlesik.set(id, bulutZaman >= yerelZaman ? bulut : yerelKayit)
    }

    const sonuc = [...birlesik.values()].sort(yenidenEskiye)
    yerelKaydet(sonuc)

    const yazmalar: Promise<void>[] = []
    for (const kayit of sonuc) {
      const bulut = bulutHarita.get(kayit.id)
      const yerelZaman = kayit.guncellendi ?? 0
      const bulutZaman = bulut?.guncellendi ?? 0
      if (!bulut || yerelZaman > bulutZaman) {
        yazmalar.push(setDoc(doc(db, KOLEKSIYON, kayit.id), temizHasta(kayit)))
      }
    }
    if (yazmalar.length > 0) {
      await Promise.allSettled(yazmalar)
    }

    return sonuc
  } catch (err) {
    console.warn('Hasta senkronu başarısız, yerel liste kullanılıyor:', err)
    return yerel
  }
}

function temizHasta(hasta: Hasta): Hasta {
  const temiz: Hasta = {
    id: hasta.id,
    ad: hasta.ad,
    hastalikId: hasta.hastalikId,
    skalaId: hasta.skalaId,
    sonucId: hasta.sonucId,
    kombinasyonId: hasta.kombinasyonId,
    cevaplar: hasta.cevaplar,
    guncellendi: hasta.guncellendi ?? Date.now(),
  }
  if (hasta.yas) temiz.yas = hasta.yas
  return temiz
}

function yenidenEskiye(a: Hasta, b: Hasta): number {
  return (b.guncellendi ?? 0) - (a.guncellendi ?? 0)
}

function hastaMi(kayit: unknown): kayit is Hasta {
  if (!kayit || typeof kayit !== 'object') return false
  const ham = kayit as Hasta
  return (
    typeof ham.id === 'string' &&
    typeof ham.ad === 'string' &&
    typeof ham.skalaId === 'string' &&
    typeof ham.sonucId === 'string' &&
    typeof ham.kombinasyonId === 'string' &&
    !!ham.cevaplar &&
    typeof ham.cevaplar === 'object'
  )
}
