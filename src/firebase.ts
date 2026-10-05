import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore'
import { varsayilanFirebaseConfig, type FirebaseConfig } from './firebaseConfig'

const CONFIG_KEY = 'noro.firebase.config.v1'
const SIFRE_KEY = 'noro.sifre.v1'
export const ILK_SIFRE = '222222'

let appInstance: FirebaseApp | null = null
let dbInstance: Firestore | null = null

export function aktifConfigGetir(): FirebaseConfig {
  const yerel = localStorage.getItem(CONFIG_KEY)
  if (yerel) {
    try {
      const parsed = JSON.parse(yerel) as FirebaseConfig
      if (parsed && typeof parsed === 'object') {
        return { ...varsayilanFirebaseConfig, ...parsed }
      }
    } catch {
      // parse hatasında varsayılana dön
    }
  }
  return varsayilanFirebaseConfig
}

export function aktifConfigKaydet(cfg: FirebaseConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
  // Re-init
  appInstance = null
  dbInstance = null
  firebaseBaslat()
}

export function firebaseBaslat(): { app: FirebaseApp | null; db: Firestore | null; hata?: string } {
  if (dbInstance && appInstance) {
    return { app: appInstance, db: dbInstance }
  }

  const config = aktifConfigGetir()
  if (!config.apiKey || !config.projectId) {
    return { app: null, db: null }
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config)
    const db = getFirestore(app)
    appInstance = app
    dbInstance = db
    return { app, db }
  } catch (err) {
    const mesaj = err instanceof Error ? err.message : String(err)
    return { app: null, db: null, hata: mesaj }
  }
}

export function yerelSifreGetir(): string {
  return localStorage.getItem(SIFRE_KEY) || ILK_SIFRE
}

export async function sifreGetir(): Promise<string> {
  let yerel = yerelSifreGetir()
  const { db } = firebaseBaslat()

  if (!db) {
    return yerel
  }

  try {
    const docRef = doc(db, 'ayarlar', 'guvenlik')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data && typeof data.sifre === 'string' && data.sifre.trim().length > 0) {
        yerel = data.sifre
        localStorage.setItem(SIFRE_KEY, yerel)
        return yerel
      }
    } else {
      // Doküman henüz yoksa ilk şifreyi (222222) veya mevcut yerel şifreyi yazalım
      await setDoc(docRef, {
        sifre: yerel,
        olusturuldu: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.warn('Firebase şifre okuma/yazma hatası (yerel şifre kullanılıyor):', err)
  }

  return yerel
}

export async function sifreGuncelle(yeniSifre: string): Promise<{ basarili: boolean; hata?: string }> {
  const temiz = yeniSifre.trim()
  if (!temiz) {
    return { basarili: false, hata: 'Şifre boş olamaz.' }
  }

  // Yerelde güncelle
  localStorage.setItem(SIFRE_KEY, temiz)

  const { db } = firebaseBaslat()
  if (db) {
    try {
      const docRef = doc(db, 'ayarlar', 'guvenlik')
      await setDoc(
        docRef,
        {
          sifre: temiz,
          guncellendi: new Date().toISOString(),
        },
        { merge: true },
      )
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : String(err)
      console.warn('Firebase şifre güncellenemedi:', err)
      return { basarili: true, hata: `Şifre cihaza kaydedildi fakat sunucuya eşitlenemedi: ${mesaj}` }
    }
  }

  return { basarili: true }
}

export function firebaseDurumu(): {
  yapilandirilmis: boolean
  projeId: string | null
  hata?: string
} {
  const config = aktifConfigGetir()
  const yapilandirilmis = Boolean(config.apiKey && config.projectId)
  const baslatma = firebaseBaslat()
  return {
    yapilandirilmis,
    projeId: config.projectId || null,
    hata: baslatma.hata,
  }
}
