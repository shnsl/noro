import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import type { Hasta } from './data/tipler'
import { firebaseBaslat } from './firebase'

const YEREL_ANAHTAR = 'noro.hastalar.v2'
const KOLEKSIYON = 'hastalar'

/** Oturum içi bellek — kalıcı depolama yok, kaynak yalnızca Firebase */
let bellek: Hasta[] = []

/** Eski cihaz kopyasını sil (cihazlar arası karışıklığı önler) */
function yerelTemizle(): void {
  try {
    localStorage.removeItem(YEREL_ANAHTAR)
  } catch {
    // yok say
  }
}

export function hastalariGetir(): Hasta[] {
  return [...bellek].sort(yenidenEskiye)
}

export function hastaGetir(id: string): Hasta | undefined {
  return bellek.find((kayit) => kayit.id === id)
}

export function yeniId(): string {
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Firebase’den yükle; yerel hasta verisi kullanılmaz / silinir */
export async function hastalariYukle(): Promise<Hasta[]> {
  yerelTemizle()
  const { db } = firebaseBaslat()
  if (!db) {
    bellek = []
    throw new Error('Firebase bağlı değil')
  }

  const snapshot = await getDocs(collection(db, KOLEKSIYON))
  const liste: Hasta[] = []
  snapshot.forEach((dokuman) => {
    const veri = { id: dokuman.id, ...dokuman.data() }
    if (hastaMi(veri)) liste.push(veri)
  })
  bellek = liste.sort(yenidenEskiye)
  return hastalariGetir()
}

/** Geriye uyum: yalnızca Firebase’den okur, yerel ile birleştirmez */
export async function hastalariSenkronizeEt(): Promise<Hasta[]> {
  return hastalariYukle()
}

export async function hastaKaydet(hasta: Hasta): Promise<void> {
  const kayit = temizHasta({ ...hasta, guncellendi: Date.now() })
  const { db } = firebaseBaslat()
  if (!db) throw new Error('Firebase bağlı değil; kayıt yapılamadı')

  await setDoc(doc(db, KOLEKSIYON, kayit.id), kayit)

  const index = bellek.findIndex((item) => item.id === kayit.id)
  if (index >= 0) bellek[index] = kayit
  else bellek.unshift(kayit)
  bellek = bellek.sort(yenidenEskiye)
  yerelTemizle()
}

export async function hastaSil(id: string): Promise<void> {
  const { db } = firebaseBaslat()
  if (!db) throw new Error('Firebase bağlı değil; silinemedi')

  await deleteDoc(doc(db, KOLEKSIYON, id))
  bellek = bellek.filter((kayit) => kayit.id !== id)
  yerelTemizle()
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
  if (hasta.atananCoreIds?.length) temiz.atananCoreIds = [...hasta.atananCoreIds]
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

// Uygulama açılışında eski yerel kopyayı hemen sil
yerelTemizle()
