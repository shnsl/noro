import { useEffect, useState } from 'react'
import { MuayeneFormu } from './MuayeneFormu'
import type { Cevaplar } from './data/ais'
import { kovaBul, kombinasyonBul, seansSirasi } from './data/katalog'
import { SEANS_SURESI } from './data/tipler'
import { hesapla } from './data/hesap'
import { kombinasyonIdBul, skalaBul, secenekBul, uygunKombinasyonlar } from './data/skalalar'
import { HASTALIKLAR } from './data/tipler'
import type { Egzersiz, Hasta, HastalikId, Kombinasyon, YasGrubu } from './data/tipler'
import { hastaGetir, hastaKaydet, hastaSil, hastalariGetir, hastalariSenkronizeEt, yeniId } from './kayit'
import { webdenKombinasyon } from './webKatalog'
import { TEMA_RENKLERI, temaGetir, temaKaydet } from './tema'
import type { Mod } from './tema'
import { Giris, oturumVarMi, oturumKapat } from './Giris'
import { sifreGuncelle, yerelSifreGetir } from './firebase'

type Ekran =
  | { ad: 'liste' }
  | { ad: 'form' }
  | { ad: 'hasta'; id: string }
  | { ad: 'olc'; id: string }
  | { ad: 'ayar' }

export default function App() {
  const [oturum, setOturum] = useState<boolean>(oturumVarMi)
  const [yigin, setYigin] = useState<Ekran[]>([{ ad: 'liste' }])
  const ekran = yigin[yigin.length - 1]

  function git(sonraki: Ekran) {
    setYigin((liste) => [...liste, sonraki])
  }

  function geri() {
    setYigin((liste) => (liste.length > 1 ? liste.slice(0, -1) : liste))
  }

  function basa() {
    setYigin([{ ad: 'liste' }])
  }

  function cikisYap() {
    oturumKapat()
    setOturum(false)
    setYigin([{ ad: 'liste' }])
  }

  if (!oturum) {
    return (
      <main className="kabuk">
        <Giris onGiris={() => setOturum(true)} />
      </main>
    )
  }

  return (
    <main className="kabuk">
      {ekran.ad === 'liste' ? (
        <Liste hastaAc={(id) => git({ ad: 'hasta', id })} yeni={() => git({ ad: 'form' })} ayarlar={() => git({ ad: 'ayar' })} />
      ) : null}
      {ekran.ad === 'form' ? <Form geri={geri} kaydedildi={(id) => setYigin((liste) => [...liste.slice(0, -1), { ad: 'hasta', id }])} /> : null}
      {ekran.ad === 'hasta' ? (
        <HastaSayfa
          id={ekran.id}
          geri={geri}
          olc={() => git({ ad: 'olc', id: ekran.id })}
          silindi={basa}
        />
      ) : null}
      {ekran.ad === 'olc' ? <Olcum id={ekran.id} geri={geri} /> : null}
      {ekran.ad === 'ayar' ? <Ayarlar geri={geri} cikisYap={cikisYap} /> : null}
    </main>
  )
}

function Liste({
  hastaAc,
  yeni,
  ayarlar,
}: {
  hastaAc: (id: string) => void
  yeni: () => void
  ayarlar: () => void
}) {
  const hastalar = useSyncHastalar()
  return (
    <div className="ana-sayfa">
      <header className="ana-ust">
        <div className="ana-marka">
          <span className="ana-marka-ikon" aria-hidden>
            N
          </span>
          <span className="ana-marka-ad">NEURO</span>
        </div>
        <button className="ana-ayar" type="button" onClick={ayarlar} aria-label="Ayarlar">
          Ayarlar
        </button>
      </header>

      <section className="ana-hero">
        <p className="ana-hero-ust">Nörolojik rehabilitasyon</p>
        <h1 className="ana-hero-baslik">NEURO</h1>
        <p className="ana-hero-metin">
          Değerlendir, 30 dakikalık seti seç, seansı yönet. Kayıtlar bu cihazda ve bulutta tutulur.
        </p>
      </section>

      <section className="ana-liste">
        <div className="ana-liste-bas">
          <h2>Hastalar</h2>
          <div className="ana-liste-sag">
            <span className="ana-sayac">{hastalar.length}</span>
            {hastalar.length > 0 ? (
              <button className="ana-ekle" type="button" onClick={yeni} aria-label="Hasta ekle">
                +
              </button>
            ) : null}
          </div>
        </div>

        {hastalar.length === 0 ? (
          <div className="ana-bos">
            <button className="ana-bos-ikon" type="button" onClick={yeni} aria-label="Hasta ekle">
              +
            </button>
            <p className="ana-bos-baslik">Henüz hasta yok</p>
            <p className="ana-bos-metin">
              + ile hasta ekleyin. Kayıtlar bu cihazda ve Firebase’de saklanır.
            </p>
          </div>
        ) : (
          <ul className="ana-hasta-listesi">
            {hastalar.map((hasta, sira) => (
              <li key={hasta.id} style={{ animationDelay: `${Math.min(sira, 8) * 40}ms` }}>
                <button className="ana-hasta" type="button" onClick={() => hastaAc(hasta.id)}>
                  <span className="ana-hasta-avatar" aria-hidden>
                    {hasta.ad.trim().charAt(0).toLocaleUpperCase('tr-TR')}
                  </span>
                  <span className="ana-hasta-metin">
                    <strong>{hasta.ad}</strong>
                    <span>{hastaOzeti(hasta)}</span>
                  </span>
                  <span className="ana-hasta-ok" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Form({ geri, kaydedildi }: { geri: () => void; kaydedildi: (id: string) => void }) {
  const [ad, setAd] = useState('')
  const [hastalikId, setHastalikId] = useState<HastalikId>('hemipleji')
  const [yas, setYas] = useState<YasGrubu>('yetiskin')
  const [cevaplar, setCevaplar] = useState<Cevaplar>({})
  const [hata, setHata] = useState('')
  const hastalik = HASTALIKLAR.find((kart) => kart.id === hastalikId)
  const skala = skalaBul(hastalikId)
  const hesap = hesapla(hastalikId, cevaplar)

  function hastalikSec(id: HastalikId) {
    setHastalikId(id)
    setCevaplar({})
  }

  async function kaydet() {
    const adTemiz = ad.trim()
    if (!adTemiz) {
      setHata('Hasta adı gerekli.')
      return
    }
    if (!skala || !hesap || hesap.eksik > 0 || !hesap.sonucId) {
      setHata('Değerlendirmede eksik madde var.')
      return
    }
    const yasGrubu = hastalik?.yasVar ? yas : undefined
    const kombinasyonId = kombinasyonIdBul(hastalikId, yasGrubu, hesap.sonucId)
    if (!kombinasyonId) {
      setHata('Bu sonuca tedavi seti bağlanamadı.')
      return
    }
    const hasta: Hasta = {
      id: yeniId(),
      ad: adTemiz,
      hastalikId,
      yas: yasGrubu,
      skalaId: skala.id,
      sonucId: hesap.sonucId,
      kombinasyonId,
      cevaplar,
    }
    await hastaKaydet(hasta)
    kaydedildi(hasta.id)
  }

  return (
    <>
      <Ust baslik="Yeni hasta" geri={geri} />
      <label className="etiket" htmlFor="ad">
        Ad soyad
      </label>
      <input id="ad" className="girdi" value={ad} onChange={(olay) => setAd(olay.target.value)} placeholder="Örn. Ayşe Demir" />
      <span className="etiket">Hastalık</span>
      <div className="hastaliklar">
        {HASTALIKLAR.map((kart) => (
          <button
            key={kart.id}
            type="button"
            className={kart.id === hastalikId ? 'secim secili' : 'secim'}
            onClick={() => hastalikSec(kart.id)}
          >
            <strong>{kart.ad}</strong>
          </button>
        ))}
      </div>
      {hastalik?.yasVar ? (
        <>
          <span className="etiket">Yaş grubu</span>
          <button type="button" className={yas === 'cocuk' ? 'secim secili' : 'secim'} onClick={() => setYas('cocuk')}>
            <strong>Çocuk</strong>
          </button>
          <button type="button" className={yas === 'yetiskin' ? 'secim secili' : 'secim'} onClick={() => setYas('yetiskin')}>
            <strong>Yetişkin</strong>
          </button>
        </>
      ) : null}
      <MuayeneFormu hastalikId={hastalikId} cevaplar={cevaplar} degistir={setCevaplar} />
      {hata ? <p className="hata">{hata}</p> : null}
      <button className="ana" type="button" onClick={() => void kaydet()}>
        Kaydet
      </button>
    </>
  )
}

function HastaSayfa({
  id,
  geri,
  olc,
  silindi,
}: {
  id: string
  geri: () => void
  olc: () => void
  silindi: () => void
}) {
  const hasta = hastaGetir(id)
  const [seciliId, setSeciliId] = useState(hasta?.kombinasyonId ?? '')
  const [ekKombinasyon, setEkKombinasyon] = useState<Kombinasyon[]>([])
  const [ekEgzersiz, setEkEgzersiz] = useState<Egzersiz[]>([])
  const [webMesaj, setWebMesaj] = useState('')
  const [webYukleniyor, setWebYukleniyor] = useState(false)
  const [acikId, setAcikId] = useState<string | undefined>()
  const [silOnay, setSilOnay] = useState(false)
  if (!hasta) return <p className="not">Hasta kaydı bulunamadı.</p>
  const kayit = hasta

  const kova = kovaBul(kayit.hastalikId, kayit.yas)
  const uygun = uygunKombinasyonlar(kayit.hastalikId, kayit.yas, kayit.sonucId)
  const yerlesik = kova?.kombinasyonlar.filter((kart) => uygun.includes(kart.id)) ?? []
  const liste = [...yerlesik, ...ekKombinasyon.filter((kart) => !yerlesik.some((eski) => eski.id === kart.id))]
  const kombinasyon =
    liste.find((kart) => kart.id === seciliId) ??
    liste[0] ??
    kombinasyonBul(kayit.hastalikId, kayit.yas, seciliId)?.kombinasyon

  function kombinasyonDegistir(kombinasyonId: string) {
    void hastaKaydet({ ...kayit, kombinasyonId })
    setSeciliId(kombinasyonId)
    setAcikId(undefined)
  }
  const egzersizler = kova && kombinasyon ? seansSirasi(kova, kombinasyon.plan, ekEgzersiz) : []

  async function webdenGetir() {
    setWebYukleniyor(true)
    setWebMesaj('')
    try {
      const paket = await webdenKombinasyon(kayit.hastalikId, kayit.yas, kayit.sonucId)
      const yeni = paket.kombinasyonlar.filter((kart) => !liste.some((eski) => eski.id === kart.id))
      setEkEgzersiz(paket.egzersizler)
      setEkKombinasyon((onceki) => [...onceki, ...yeni])
      setWebMesaj(yeni.length > 0 ? `${yeni.length} yeni kombinasyon eklendi.` : 'Bu evre için webde başka set kalmadı.')
    } catch {
      setWebMesaj('Webden alınamadı. Bağlantıyı kontrol edin.')
    } finally {
      setWebYukleniyor(false)
    }
  }
  const sonuc = secenekBul(hasta.skalaId, hasta.sonucId)
  const skala = skalaBul(hasta.hastalikId)
  const hesap = hesapla(hasta.hastalikId, hasta.cevaplar)

  return (
    <>
      <Ust baslik="Hasta" geri={geri} />
      <h1 className="sayfa-baslik">{hasta.ad}</h1>
      <p className="yardim">{hastaOzeti(hasta)}</p>
      <span className="etiket">Bu evrenin kombinasyonları</span>
      <button className="ikincil" type="button" onClick={() => void webdenGetir()} disabled={webYukleniyor}>
        {webYukleniyor ? 'Getiriliyor…' : 'Webden kombinasyon getir'}
      </button>
      {webMesaj ? <p className="not">{webMesaj}</p> : null}
      {liste.map((kart) => (
        <button
          key={kart.id}
          type="button"
          className={kart.id === kombinasyon?.id ? 'secim secili' : 'secim'}
          onClick={() => kombinasyonDegistir(kart.id)}
        >
          <strong>{kart.ad}</strong>
          <span>{kart.hedef}</span>
        </button>
      ))}
      <section className="kart">
        <p className="ust-not">
          {skala?.ad ?? 'Skala'} · {sonuc?.etiket ?? 'sonuç yok'}
        </p>
        {hesap?.gerekce ? <p className="not">{hesap.gerekce}</p> : null}
        <h2>{kombinasyon?.ad ?? 'Tedavi'}</h2>
        {kombinasyon ? <p className="not">{kombinasyon.hedef}</p> : null}
        {egzersizler.map(({ kalem, egzersiz }, index) => {
          const acik = acikId === egzersiz.id
          return (
            <div key={egzersiz.id}>
              <button
                type="button"
                className="egzersiz"
                onClick={() => setAcikId(acik ? undefined : egzersiz.id)}
              >
                <span className="sira">{index + 1}</span>
                <span>
                  <strong>
                    {kalem.dakika} dk · {egzersiz.ad}
                  </strong>
                  <span>{kalem.tekrar}</span>
                </span>
              </button>
              {acik ? (
                <div className="adim">
                  <p>{egzersiz.pozisyon}</p>
                  {egzersiz.adimlar.map((adim) => (
                    <p key={adim}>· {adim}</p>
                  ))}
                  <p>{egzersiz.onlem}</p>
                  <p>Kaynak taslağı: {egzersiz.doz}</p>
                  <p className="kaynak">
                    {egzersiz.kaynak.ad} · {egzersiz.kaynak.yil} · {egzersiz.kaynak.lisans}
                    <br />
                    <a href={egzersiz.kaynak.url} target="_blank" rel="noreferrer">
                      Kaynak
                    </a>
                  </p>
                </div>
              ) : null}
            </div>
          )
        })}
      </section>
      {kombinasyon ? (
        <p className="not">
          Toplam {SEANS_SURESI} dk. {kombinasyon.seansNotu}
        </p>
      ) : null}
      <button className="ikincil" type="button" onClick={olc}>
        Değerlendirmeyi güncelle
      </button>
      {silOnay ? (
        <>
          <p className="hata">Bu hasta cihazdan ve buluttan silinsin mi?</p>
          <button
            className="tehlike"
            type="button"
            onClick={() => {
              void hastaSil(hasta.id).then(() => silindi())
            }}
          >
            Evet, sil
          </button>
          <button className="ikincil" type="button" onClick={() => setSilOnay(false)}>
            Vazgeç
          </button>
        </>
      ) : (
        <button className="tehlike" type="button" onClick={() => setSilOnay(true)}>
          Hastayı sil
        </button>
      )}
    </>
  )
}

function Olcum({ id, geri }: { id: string; geri: () => void }) {
  const hasta = hastaGetir(id)
  const [cevaplar, setCevaplar] = useState<Cevaplar>(hasta?.cevaplar ?? {})
  const [hata, setHata] = useState('')
  if (!hasta) return <p className="not">Hasta kaydı bulunamadı.</p>
  const kayit = hasta
  const skala = skalaBul(kayit.hastalikId)
  const hesap = hesapla(kayit.hastalikId, cevaplar)
  if (!skala) return <p className="not">Bu hastalık için skala yok.</p>

  async function kaydet() {
    if (!hesap || hesap.eksik > 0 || !hesap.sonucId || !skala) {
      setHata('Değerlendirmede eksik madde var.')
      return
    }
    const uygun = uygunKombinasyonlar(kayit.hastalikId, kayit.yas, hesap.sonucId)
    const kombinasyonId = uygun.includes(kayit.kombinasyonId) ? kayit.kombinasyonId : uygun[0]
    if (!kombinasyonId) return
    await hastaKaydet({ ...kayit, skalaId: skala.id, sonucId: hesap.sonucId, kombinasyonId, cevaplar })
    geri()
  }

  return (
    <>
      <Ust baslik={skala.ad} geri={geri} />
      <MuayeneFormu hastalikId={kayit.hastalikId} cevaplar={cevaplar} degistir={setCevaplar} />
      {hata ? <p className="hata">{hata}</p> : null}
      <button className="ana" type="button" onClick={() => void kaydet()}>
        Tedaviyi güncelle
      </button>
    </>
  )
}

function Ayarlar({ geri, cikisYap }: { geri: () => void; cikisYap: () => void }) {
  const [tema, setTema] = useState(temaGetir)
  const [eskiSifre, setEskiSifre] = useState('')
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [sifreMesaj, setSifreMesaj] = useState('')
  const [sifreHata, setSifreHata] = useState('')
  const [kaydediliyor, setKaydediliyor] = useState(false)

  function guncelle(mod: Mod, renk: string) {
    const sonraki = { mod, renk }
    setTema(sonraki)
    temaKaydet(sonraki)
  }

  async function sifreyiDegistir() {
    setSifreMesaj('')
    setSifreHata('')

    const guncel = yerelSifreGetir()
    if (eskiSifre !== guncel) {
      setSifreHata('Mevcut şifre hatalı.')
      return
    }

    if (!yeniSifre || yeniSifre.trim().length < 4) {
      setSifreHata('Yeni şifre en az 4 karakter olmalıdır.')
      return
    }

    if (yeniSifre !== yeniSifreTekrar) {
      setSifreHata('Yeni şifreler birbiriyle eşleşmiyor.')
      return
    }

    setKaydediliyor(true)
    try {
      const sonuc = await sifreGuncelle(yeniSifre)
      if (sonuc.basarili) {
        setSifreMesaj('Şifreniz başarıyla güncellendi.')
        setEskiSifre('')
        setYeniSifre('')
        setYeniSifreTekrar('')
      } else {
        setSifreHata(sonuc.hata || 'Şifre güncellenemedi.')
      }
    } catch {
      setSifreHata('Şifre kaydedilirken bir hata oluştu.')
    } finally {
      setKaydediliyor(false)
    }
  }

  const seciliRenkAdi =
    TEMA_RENKLERI.find((kart) => kart.hex.toLowerCase() === tema.renk.toLowerCase())?.ad ?? 'Özel'

  return (
    <div className="ayar-sayfa">
      <header className="ayar-ust">
        <div>
          <p className="ayar-ust-etiket">NEURO</p>
          <h1 className="ayar-baslik">Ayarlar</h1>
        </div>
        <button className="ana-ayar" type="button" onClick={geri}>
          Geri
        </button>
      </header>

      <section className="ayar-bolum">
        <div className="ayar-bolum-bas">
          <h2>Görünüm</h2>
          <p>Açık veya koyu arayüz</p>
        </div>
        <div className="ayar-modlar">
          <button
            type="button"
            className={tema.mod === 'acik' ? 'ayar-mod secili' : 'ayar-mod'}
            onClick={() => guncelle('acik', tema.renk)}
          >
            <span className="ayar-mod-ikon" aria-hidden>
              ○
            </span>
            <strong>Açık</strong>
            <span>Gündüz</span>
          </button>
          <button
            type="button"
            className={tema.mod === 'koyu' ? 'ayar-mod secili' : 'ayar-mod'}
            onClick={() => guncelle('koyu', tema.renk)}
          >
            <span className="ayar-mod-ikon" aria-hidden>
              ●
            </span>
            <strong>Koyu</strong>
            <span>Gece</span>
          </button>
        </div>
      </section>

      <section className="ayar-bolum">
        <div className="ayar-bolum-bas">
          <h2>Tema rengi</h2>
          <p>Seçili: {seciliRenkAdi}</p>
        </div>
        <div className="ayar-renkler">
          {TEMA_RENKLERI.map((kart) => (
            <button
              key={kart.id}
              type="button"
              className={tema.renk.toLowerCase() === kart.hex.toLowerCase() ? 'ayar-renk secili' : 'ayar-renk'}
              style={{ background: kart.hex }}
              aria-label={kart.ad}
              onClick={() => guncelle(tema.mod, kart.hex)}
            />
          ))}
          <label className="ayar-renk-ozel" htmlFor="ozel-renk" title="Özel renk">
            <input
              id="ozel-renk"
              type="color"
              value={tema.renk}
              onChange={(olay) => guncelle(tema.mod, olay.target.value)}
            />
            <span>+</span>
          </label>
        </div>
      </section>

      <section className="ayar-bolum">
        <div className="ayar-bolum-bas">
          <h2>Güvenlik</h2>
          <p>Giriş şifresini güncelle</p>
        </div>
        <div className="ayar-form">
          <label className="etiket" htmlFor="eski-sifre">
            Mevcut şifre
          </label>
          <input
            id="eski-sifre"
            type="password"
            className="girdi"
            value={eskiSifre}
            onChange={(e) => setEskiSifre(e.target.value)}
            placeholder="••••"
            inputMode="numeric"
          />

          <label className="etiket" htmlFor="yeni-sifre">
            Yeni şifre
          </label>
          <input
            id="yeni-sifre"
            type="password"
            className="girdi"
            value={yeniSifre}
            onChange={(e) => setYeniSifre(e.target.value)}
            placeholder="En az 4 karakter"
            inputMode="numeric"
          />

          <label className="etiket" htmlFor="yeni-sifre-tekrar">
            Yeni şifre tekrar
          </label>
          <input
            id="yeni-sifre-tekrar"
            type="password"
            className="girdi"
            value={yeniSifreTekrar}
            onChange={(e) => setYeniSifreTekrar(e.target.value)}
            placeholder="Tekrar girin"
            inputMode="numeric"
          />

          {sifreHata ? <p className="hata">{sifreHata}</p> : null}
          {sifreMesaj ? <p className="ayar-basari">{sifreMesaj}</p> : null}

          <button
            className="ana"
            type="button"
            onClick={() => void sifreyiDegistir()}
            disabled={kaydediliyor}
          >
            {kaydediliyor ? 'Kaydediliyor…' : 'Şifreyi değiştir'}
          </button>
        </div>
      </section>

      <section className="ayar-bolum ayar-tehlike-bolum">
        <div className="ayar-bolum-bas">
          <h2>Oturum</h2>
          <p>Uygulamayı kilitle</p>
        </div>
        <button className="tehlike" type="button" onClick={cikisYap}>
          Oturumu kapat
        </button>
      </section>
    </div>
  )
}

function useSyncHastalar(): Hasta[] {
  const [hastalar, setHastalar] = useState(hastalariGetir)
  useEffect(() => {
    let iptal = false
    void hastalariSenkronizeEt().then((liste) => {
      if (!iptal) setHastalar(liste)
    })
    return () => {
      iptal = true
    }
  }, [])
  return hastalar
}

function Ust({ baslik, geri }: { baslik: string; geri: () => void }) {
  return (
    <header className="ust">
      <span />
      <h1>{baslik}</h1>
      <button className="geri" type="button" onClick={geri}>
        Geri
      </button>
    </header>
  )
}

function hastaOzeti(hasta: Hasta): string {
  const ad = HASTALIKLAR.find((kart) => kart.id === hasta.hastalikId)?.ad ?? hasta.hastalikId
  const sonuc = secenekBul(hasta.skalaId, hasta.sonucId)?.etiket
  const yas =
    hasta.yas === 'cocuk' ? 'Çocuk' : hasta.yas === 'yetiskin' ? 'Yetişkin' : undefined
  return [ad, yas, sonuc].filter(Boolean).join(' · ')
}
