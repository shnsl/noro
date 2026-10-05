import { useState, useEffect } from 'react'
import { sifreGetir, yerelSifreGetir } from './firebase'

const OTURUM_KEY = 'noro.oturum.v1'

export function oturumVarMi(): boolean {
  return localStorage.getItem(OTURUM_KEY) === 'acik' || sessionStorage.getItem(OTURUM_KEY) === 'acik'
}

export function oturumAc(beniHatirla: boolean): void {
  if (beniHatirla) {
    localStorage.setItem(OTURUM_KEY, 'acik')
  } else {
    sessionStorage.setItem(OTURUM_KEY, 'acik')
  }
}

export function oturumKapat(): void {
  localStorage.removeItem(OTURUM_KEY)
  sessionStorage.removeItem(OTURUM_KEY)
}

export function Giris({ onGiris }: { onGiris: () => void }) {
  const [girilenSifre, setGirilenSifre] = useState('')
  const [hata, setHata] = useState('')
  const [beniHatirla, setBeniHatirla] = useState(true)
  const [bekleniyor, setBekleniyor] = useState(false)

  // Sayfa açıldığında Firestore'daki güncel şifreyi arka planda çekip yerel önbelleği tazele
  useEffect(() => {
    void sifreGetir()
  }, [])

  async function girisYap() {
    if (!girilenSifre) {
      setHata('Lütfen şifrenizi girin.')
      return
    }

    setBekleniyor(true)
    setHata('')

    try {
      // Önce yerel önbelleğe bak (hızlı giriş), sonra Firestore'dan teyit al
      let gercekSifre = yerelSifreGetir()
      if (girilenSifre === gercekSifre) {
        oturumAc(beniHatirla)
        onGiris()
        return
      }

      // Yerelde tutmadıysa Firebase'den güncel şifreyi çekmeyi dene
      gercekSifre = await sifreGetir()
      if (girilenSifre === gercekSifre) {
        oturumAc(beniHatirla)
        onGiris()
      } else {
        setHata('Hatalı şifre. Lütfen tekrar deneyin.')
      }
    } catch {
      setHata('Giriş kontrolü sırasında bir hata oluştu.')
    } finally {
      setBekleniyor(false)
    }
  }

  function tusaBas(tus: string) {
    setHata('')
    if (tus === 'C') {
      setGirilenSifre('')
    } else if (tus === 'DEL') {
      setGirilenSifre((onceki) => onceki.slice(0, -1))
    } else {
      if (girilenSifre.length < 12) {
        setGirilenSifre((onceki) => onceki + tus)
      }
    }
  }

  return (
    <div className="giris-kapsayici">
      <div className="giris-kutu">
        <div className="giris-logo">
          <div className="giris-ikon">N</div>
        </div>
        <h1 className="sayfa-baslik" style={{ textAlign: 'center', marginBottom: 4 }}>
          NEURO
        </h1>
        <p className="yardim" style={{ textAlign: 'center', marginBottom: 20 }}>
          Giriş yapmak için şifrenizi girin
        </p>

        <div className="giris-girdi-alani">
          <input
            type="password"
            className="girdi"
            value={girilenSifre}
            onChange={(e) => {
              setHata('')
              setGirilenSifre(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void girisYap()
            }}
            placeholder="Şifre"
            inputMode="numeric"
            autoFocus
            style={{ textAlign: 'center', fontSize: 22, letterSpacing: 6, fontWeight: '700' }}
          />
        </div>

        {/* PIN Numpad */}
        <div className="pin-klavye">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((tus) => (
            <button
              key={tus}
              type="button"
              className="pin-tus"
              onClick={() => tusaBas(tus)}
            >
              {tus === 'DEL' ? '⌫' : tus === 'C' ? 'Sil' : tus}
            </button>
          ))}
        </div>

        <div className="hatirla-satiri">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={beniHatirla}
              onChange={(e) => setBeniHatirla(e.target.checked)}
            />
            <span>Bu cihazda oturumu açık tut</span>
          </label>
        </div>

        {hata ? <p className="hata" style={{ textAlign: 'center', marginTop: 10 }}>{hata}</p> : null}

        <button
          className="ana"
          type="button"
          onClick={() => void girisYap()}
          disabled={bekleniyor}
          style={{ marginTop: 12, marginBottom: 0 }}
        >
          {bekleniyor ? 'Kontrol ediliyor…' : 'Giriş Yap'}
        </button>
      </div>
    </div>
  )
}
