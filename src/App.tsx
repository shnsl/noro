import { useEffect, useRef, useState } from 'react'
import { MuayeneFormu } from './MuayeneFormu'
import type { Cevaplar } from './data/hesap'
import { SEANS_SURESI } from './data/tipler'
import { hesapla } from './data/hesap'
import { skalaBul, secenekBul } from './data/skalalar'
import { atananCoreListesi, coreKatalog, ekOnerileriSec } from './data/ekOneriler'
import {
  BOLGE_FILTRELER,
  IHTIYAC_SECENEKLERI,
  bolgeEtiket,
  egzersizAdKaydet,
  katalogBul,
  katalogFiltrele,
  manuelEgzersizEkle,
  tumEgzersizKatalogu,
  type EgzTur,
  type KatalogEgzersiz,
} from './data/egzersizYonetim'
import type { Ihtiyac } from './data/tipler'
import { bulgulariCikar, seansEgzersizleri, seansUret } from './data/tedaviMotoru'
import { HASTALIKLAR } from './data/tipler'
import type { Hasta, HastalikId, YasGrubu } from './data/tipler'
import { hastaGetir, hastaKaydet, hastaSil, hastalariGetir, hastalariYukle, yeniId } from './kayit'
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
  const { hastalar, yukleniyor, hata } = useFirebaseHastalar()
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
        <p className="ana-hero-metin">Değerlendir → seans planı.</p>
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

        {yukleniyor ? (
          <p className="not">Yükleniyor…</p>
        ) : hata ? (
          <p className="hata">{hata}</p>
        ) : hastalar.length === 0 ? (
          <div className="ana-bos">
            <button className="ana-bos-ikon" type="button" onClick={yeni} aria-label="Hasta ekle">
              +
            </button>
            <p className="ana-bos-baslik">Henüz hasta yok</p>
            <p className="ana-bos-metin">+ ile yeni hasta ekleyin.</p>
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
    const hasta: Hasta = {
      id: yeniId(),
      ad: adTemiz,
      hastalikId,
      yas: yasGrubu,
      skalaId: skala.id,
      sonucId: hesap.sonucId,
      kombinasyonId: 'motor',
      cevaplar,
    }
    try {
      await hastaKaydet(hasta)
      kaydedildi(hasta.id)
    } catch {
      setHata('Firebase’e yazılamadı. Bağlantıyı kontrol edin.')
    }
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
  const [hasta, setHasta] = useState(() => hastaGetir(id))
  const [yukleniyor, setYukleniyor] = useState(!hastaGetir(id))
  const [acikId, setAcikId] = useState<string | undefined>()
  const [ekAcikId, setEkAcikId] = useState<string | undefined>()
  const [silOnay, setSilOnay] = useState(false)

  useEffect(() => {
    const mevcut = hastaGetir(id)
    if (mevcut) {
      setHasta(mevcut)
      setYukleniyor(false)
      return
    }
    let iptal = false
    setYukleniyor(true)
    void hastalariYukle()
      .then(() => {
        if (!iptal) setHasta(hastaGetir(id))
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false)
      })
    return () => {
      iptal = true
    }
  }, [id])

  if (yukleniyor) return <p className="not">Yükleniyor…</p>
  if (!hasta) return <p className="not">Hasta kaydı bulunamadı.</p>

  const seans = seansUret(hasta.hastalikId, hasta.yas, hasta.cevaplar)
  const egzersizler = seansEgzersizleri(hasta.hastalikId, hasta.yas, seans.plan)
  const sonuc = secenekBul(hasta.skalaId, hasta.sonucId)
  const skala = skalaBul(hasta.hastalikId)
  const bulgular = bulgulariCikar(hasta.hastalikId, hasta.cevaplar).slice(0, 2)
  const atananlar = atananCoreListesi(hasta.atananCoreIds)
  const atananIdSet = new Set(atananlar.map((x) => x.id))
  const ekOneriler = ekOnerileriSec(
    hasta.hastalikId,
    hasta.yas,
    hasta.cevaplar,
    [...seans.plan.map((p) => p.egzersizId), ...atananIdSet],
    4,
  ).filter((x) => !atananIdSet.has(x.id))

  return (
    <>
      <Ust baslik="Hasta" geri={geri} />
      <h1 className="sayfa-baslik">{hasta.ad}</h1>
      <p className="yardim">{hastaOzeti(hasta)}</p>

      <section className="seans-kutu">
        <div className="seans-ust">
          <div>
            <p className="ust-not">
              {skala?.ad ?? 'Skala'} · {sonuc?.etiket ?? '—'}
              {bulgular[0] ? ` · ${bulgular[0].bolge}` : ''}
            </p>
            <h2 className="seans-baslik">Seans</h2>
          </div>
          <span className="seans-sure">{SEANS_SURESI} dk</span>
        </div>

        <div className="seans-plan">
          {egzersizler.map(({ kalem, egzersiz }, index) => {
            const anahtar = `${egzersiz.id}-${index}`
            const acik = acikId === anahtar
            return (
              <div key={anahtar} className={acik ? 'seans-madde acik' : 'seans-madde'}>
                <button
                  type="button"
                  className="seans-madde-btn"
                  onClick={() => setAcikId(acik ? undefined : anahtar)}
                >
                  <span className="sira">{index + 1}</span>
                  <span className="seans-madde-metin">
                    <strong>{egzersiz.ad}</strong>
                    <span className="seans-madde-meta">
                      <em>{kalem.dakika} dk</em>
                      <em>{egzersiz.doz}</em>
                    </span>
                  </span>
                  <span className="ana-hasta-ok" aria-hidden>
                    {acik ? '▾' : '›'}
                  </span>
                </button>
                {acik ? (
                  <div className="adim seans-adim">
                    {egzersiz.adimlar.map((adim) => (
                      <p key={adim}>· {adim}</p>
                    ))}
                    <p className="mini">{egzersiz.onlem}</p>
                    <a href={egzersiz.kaynak.url} target="_blank" rel="noreferrer">
                      Kaynak
                    </a>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>

      {atananlar.length > 0 ? (
        <section className="ek-kutu atanan">
          <div className="ek-ust">
            <h2 className="ek-baslik">Atanan core</h2>
            <span className="ek-alt">{atananlar.length}</span>
          </div>
          <div className="ek-liste">
            {atananlar.map((oneri) => {
              const acik = ekAcikId === oneri.id
              return (
                <div key={oneri.id} className={acik ? 'ek-madde acik' : 'ek-madde'}>
                  <button
                    type="button"
                    className="ek-madde-btn"
                    onClick={() => setEkAcikId(acik ? undefined : oneri.id)}
                  >
                    <span className="ek-madde-metin">
                      <strong>{oneri.ad}</strong>
                      <em>{oneri.kategori}</em>
                    </span>
                    <span aria-hidden>{acik ? '▾' : '›'}</span>
                  </button>
                  {acik ? (
                    <div className="adim ek-adim">
                      <p className="mini">
                        {oneri.pozisyon} · {oneri.doz}
                      </p>
                      {oneri.adimlar.map((adim) => (
                        <p key={adim}>· {adim}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {ekOneriler.length > 0 ? (
        <section className="ek-kutu">
          <div className="ek-ust">
            <h2 className="ek-baslik">Ek öneriler</h2>
            <span className="ek-alt">otomatik</span>
          </div>
          <div className="ek-liste">
            {ekOneriler.map((oneri) => {
              const acik = ekAcikId === `oto-${oneri.id}`
              return (
                <div key={oneri.id} className={acik ? 'ek-madde acik' : 'ek-madde'}>
                  <button
                    type="button"
                    className="ek-madde-btn"
                    onClick={() => setEkAcikId(acik ? undefined : `oto-${oneri.id}`)}
                  >
                    <span className="ek-madde-metin">
                      <strong>{oneri.ad}</strong>
                      <em>{oneri.neden}</em>
                    </span>
                    <span aria-hidden>{acik ? '▾' : '›'}</span>
                  </button>
                  {acik ? (
                    <div className="adim ek-adim">
                      <p className="mini">
                        {oneri.pozisyon} · {oneri.doz}
                      </p>
                      {oneri.adimlar.map((adim) => (
                        <p key={adim}>· {adim}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
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
              void hastaSil(hasta.id)
                .then(() => silindi())
                .catch(() => undefined)
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
    try {
      await hastaKaydet({
        ...kayit,
        skalaId: skala.id,
        sonucId: hesap.sonucId,
        kombinasyonId: 'motor',
        cevaplar,
      })
      geri()
    } catch {
      setHata('Firebase’e yazılamadı.')
    }
  }

  return (
    <>
      <Ust baslik="Değerlendirme" geri={geri} />
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
  const [hastalar, setHastalar] = useState(hastalariGetir)
  const [hastaId, setHastaId] = useState('')
  const [seciliCore, setSeciliCore] = useState<string[]>([])
  const [coreMesaj, setCoreMesaj] = useState('')
  const [detayId, setDetayId] = useState<string | undefined>()
  const [adDuzenle, setAdDuzenle] = useState(false)
  const [adTaslak, setAdTaslak] = useState('')
  const [katalogSurum, setKatalogSurum] = useState(0)
  const [bolgeFiltre, setBolgeFiltre] = useState('hepsi')
  const [yeniAcik, setYeniAcik] = useState(false)
  const [yeniTur, setYeniTur] = useState<EgzTur>('tedavi')
  const [yeniAd, setYeniAd] = useState('')
  const [yeniBolge, setYeniBolge] = useState('govde')
  const [yeniHedef, setYeniHedef] = useState('')
  const [yeniPozisyon, setYeniPozisyon] = useState('')
  const [yeniDoz, setYeniDoz] = useState('8–10')
  const [yeniAdimlar, setYeniAdimlar] = useState('')
  const [yeniOnlem, setYeniOnlem] = useState('Ağrıda dur.')
  const [yeniIhtiyac, setYeniIhtiyac] = useState<Ihtiyac>('kuvvet')
  const [acikPanel, setAcikPanel] = useState<Record<string, boolean>>({
    gorunum: false,
    tema: false,
    sifre: false,
    oturum: false,
  })
  const liste = katalogFiltrele(bolgeFiltre)
  const toplamEgzersiz = tumEgzersizKatalogu().length
  void katalogSurum
  const basiliRef = useRef<{ id: string; zaman: number } | null>(null)
  const uzunBasildiRef = useRef(false)

  function panelAcKapa(id: string) {
    setAcikPanel((onceki) => ({ ...onceki, [id]: !onceki[id] }))
  }

  useEffect(() => {
    void hastalariYukle().then(setHastalar).catch(() => setHastalar([]))
  }, [])

  useEffect(() => {
    const kayit = hastalariGetir().find((h) => h.id === hastaId)
    setSeciliCore(kayit?.atananCoreIds ?? [])
    setCoreMesaj('')
  }, [hastaId])

  function guncelle(mod: Mod, renk: string) {
    const sonraki = { mod, renk }
    setTema(sonraki)
    temaKaydet(sonraki)
  }

  function coreToggle(id: string) {
    setSeciliCore((onceki) => (onceki.includes(id) ? onceki.filter((x) => x !== id) : [...onceki, id]))
  }

  function basildi(id: string) {
    uzunBasildiRef.current = false
    basiliRef.current = { id, zaman: window.setTimeout(() => {
      uzunBasildiRef.current = true
      detayAc(id)
      basiliRef.current = null
    }, 450) }
  }

  function birakildi(id: string, tur: EgzTur) {
    const kayit = basiliRef.current
    if (kayit) {
      window.clearTimeout(kayit.zaman)
      basiliRef.current = null
    }
    if (uzunBasildiRef.current) return
    if (tur === 'core' && hastaId) {
      coreToggle(id)
    } else {
      detayAc(id)
    }
  }

  function iptalBasili() {
    const kayit = basiliRef.current
    if (kayit) {
      window.clearTimeout(kayit.zaman)
      basiliRef.current = null
    }
  }

  function detayAc(id: string) {
    setDetayId(id)
    setAdDuzenle(false)
    setAdTaslak('')
  }

  function adDuzenlemeyiAc(mevcut: string) {
    setAdTaslak(mevcut)
    setAdDuzenle(true)
  }

  function adKaydet() {
    if (!detayId) return
    const temiz = adTaslak.trim()
    if (temiz) {
      egzersizAdKaydet(detayId, temiz)
      setKatalogSurum((n) => n + 1)
    }
    setAdDuzenle(false)
  }

  function yeniKaydet() {
    if (!yeniAd.trim()) return
    const eklenen = manuelEgzersizEkle({
      ad: yeniAd,
      tur: yeniTur,
      bolge: yeniTur === 'core' ? 'core' : yeniBolge,
      hedef: yeniHedef || yeniAd,
      pozisyon: yeniPozisyon,
      doz: yeniDoz,
      adimlar: yeniAdimlar.split('\n').map((s) => s.trim()).filter(Boolean),
      onlem: yeniOnlem,
      ihtiyac: yeniIhtiyac,
      kategori: yeniTur === 'core' ? 'core' : undefined,
    })
    setKatalogSurum((n) => n + 1)
    setYeniAcik(false)
    setYeniAd('')
    setYeniHedef('')
    setYeniPozisyon('')
    setYeniAdimlar('')
    setBolgeFiltre(yeniTur === 'core' ? 'core' : yeniBolge)
    detayAc(eklenen.id)
  }

  async function coreAta() {
    const kayit = hastalariGetir().find((h) => h.id === hastaId)
    if (!kayit) {
      setCoreMesaj('Hasta seçin.')
      return
    }
    try {
      await hastaKaydet({ ...kayit, atananCoreIds: seciliCore })
      setHastalar(hastalariGetir())
      setCoreMesaj(`${kayit.ad}: ${seciliCore.length} core atandı.`)
    } catch {
      setCoreMesaj('Firebase’e yazılamadı.')
    }
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
        <button
          type="button"
          className="ayar-bolum-bas ayar-bolum-toggle"
          aria-expanded={acikPanel.gorunum}
          onClick={() => panelAcKapa('gorunum')}
        >
          <span>
            <h2>Görünüm</h2>
            <p>Açık veya koyu arayüz</p>
          </span>
          <span className="ayar-chevron" aria-hidden>
            {acikPanel.gorunum ? '▾' : '›'}
          </span>
        </button>
        {acikPanel.gorunum ? (
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
        ) : null}
      </section>

      <section className="ayar-bolum">
        <button
          type="button"
          className="ayar-bolum-bas ayar-bolum-toggle"
          aria-expanded={acikPanel.tema}
          onClick={() => panelAcKapa('tema')}
        >
          <span>
            <h2>Tema rengi</h2>
            <p>Seçili: {seciliRenkAdi}</p>
          </span>
          <span className="ayar-chevron" aria-hidden>
            {acikPanel.tema ? '▾' : '›'}
          </span>
        </button>
        {acikPanel.tema ? (
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
        ) : null}
      </section>

      <section className="ayar-bolum">
        <button
          type="button"
          className="ayar-bolum-bas ayar-bolum-toggle"
          aria-expanded={acikPanel.sifre}
          onClick={() => panelAcKapa('sifre')}
        >
          <span>
            <h2>Güvenlik</h2>
            <p>Giriş şifresini güncelle</p>
          </span>
          <span className="ayar-chevron" aria-hidden>
            {acikPanel.sifre ? '▾' : '›'}
          </span>
        </button>
        {acikPanel.sifre ? (
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
        ) : null}
      </section>

      <section className="ayar-bolum ayar-tehlike-bolum">
        <button
          type="button"
          className="ayar-bolum-bas ayar-bolum-toggle"
          aria-expanded={acikPanel.oturum}
          onClick={() => panelAcKapa('oturum')}
        >
          <span>
            <h2>Oturum</h2>
            <p>Uygulamayı kilitle</p>
          </span>
          <span className="ayar-chevron" aria-hidden>
            {acikPanel.oturum ? '▾' : '›'}
          </span>
        </button>
        {acikPanel.oturum ? (
          <button className="tehlike" type="button" onClick={cikisYap}>
            Oturumu kapat
          </button>
        ) : null}
      </section>

      <section className="ayar-bolum">
        <div className="ayar-bolum-bas">
          <h2>Egzersizler</h2>
          <p>
            Toplam {toplamEgzersiz} · filtrede {liste.length} · basılı tut: detay
          </p>
        </div>

        <div className="bolge-filtre" role="tablist" aria-label="Bölge">
          {BOLGE_FILTRELER.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={bolgeFiltre === b.id}
              className={bolgeFiltre === b.id ? 'bolge-chip secili' : 'bolge-chip'}
              onClick={() => setBolgeFiltre(b.id)}
            >
              {b.ad}
            </button>
          ))}
        </div>

        <button className="ana-ayar yeni-egz-btn" type="button" onClick={() => setYeniAcik(true)}>
          + Yeni egzersiz
        </button>

        {(bolgeFiltre === 'core' || bolgeFiltre === 'hepsi') && (
          <>
            <label className="etiket" htmlFor="core-hasta">
              Core hasta ata
            </label>
            <select
              id="core-hasta"
              className="girdi"
              value={hastaId}
              onChange={(e) => setHastaId(e.target.value)}
            >
              <option value="">Seçin…</option>
              {hastalar.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.ad}
                  {h.atananCoreIds?.length ? ` (${h.atananCoreIds.length})` : ''}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="core-liste" key={katalogSurum}>
          {liste.map((egz) => {
            const secili = egz.tur === 'core' && seciliCore.includes(egz.id)
            return (
              <button
                key={egz.id}
                type="button"
                className={[
                  'core-satir',
                  secili ? 'secili' : '',
                  egz.manuel ? 'manuel' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerDown={() => basildi(egz.id)}
                onPointerUp={() => birakildi(egz.id, egz.tur)}
                onPointerLeave={iptalBasili}
                onPointerCancel={iptalBasili}
                onContextMenu={(e) => e.preventDefault()}
              >
                {egz.tur === 'core' ? (
                  <span className="core-check" aria-hidden>
                    {secili ? '✓' : ''}
                  </span>
                ) : (
                  <span className="core-check bolge-isaret" aria-hidden>
                    ·
                  </span>
                )}
                <span className="core-satir-metin">
                  <strong>{egz.ad}</strong>
                  <em>
                    {egz.tur === 'core' ? 'core' : bolgeEtiket(egz.bolge)}
                    {egz.manuel ? ' · manuel' : ''} · {egz.doz}
                  </em>
                </span>
              </button>
            )
          })}
        </div>

        {(bolgeFiltre === 'core' || bolgeFiltre === 'hepsi') && (
          <>
            <button className="ana" type="button" onClick={() => void coreAta()} disabled={!hastaId}>
              Core ata ({seciliCore.length})
            </button>
            {coreMesaj ? <p className="ayar-basari">{coreMesaj}</p> : null}
          </>
        )}
      </section>

      {yeniAcik ? (
        <div className="core-detay-maske" role="dialog" onClick={() => setYeniAcik(false)}>
          <div
            className="core-detay-frame"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="core-detay-ust">
              <strong>Yeni egzersiz</strong>
              <button type="button" className="ana-ayar" onClick={() => setYeniAcik(false)}>
                Kapat
              </button>
            </div>

            <label className="etiket" htmlFor="yeni-tur">
              Tür
            </label>
            <select
              id="yeni-tur"
              className="girdi"
              value={yeniTur}
              onChange={(e) => setYeniTur(e.target.value as EgzTur)}
            >
              <option value="tedavi">Tedavi</option>
              <option value="core">Core</option>
            </select>

            <label className="etiket" htmlFor="yeni-ad">
              Ad
            </label>
            <input
              id="yeni-ad"
              className="girdi"
              value={yeniAd}
              onChange={(e) => setYeniAd(e.target.value)}
              placeholder="Egzersiz adı"
            />

            {yeniTur === 'tedavi' ? (
              <>
                <label className="etiket" htmlFor="yeni-bolge">
                  Bölge
                </label>
                <select
                  id="yeni-bolge"
                  className="girdi"
                  value={yeniBolge}
                  onChange={(e) => setYeniBolge(e.target.value)}
                >
                  {BOLGE_FILTRELER.filter((b) => b.id !== 'hepsi' && b.id !== 'core').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.ad}
                    </option>
                  ))}
                </select>
              </>
            ) : null}

            <label className="etiket" htmlFor="yeni-ihtiyac">
              İhtiyaç
            </label>
            <select
              id="yeni-ihtiyac"
              className="girdi"
              value={yeniIhtiyac}
              onChange={(e) => setYeniIhtiyac(e.target.value as Ihtiyac)}
            >
              {IHTIYAC_SECENEKLERI.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.ad}
                </option>
              ))}
            </select>

            <label className="etiket" htmlFor="yeni-hedef">
              Hedef
            </label>
            <input
              id="yeni-hedef"
              className="girdi"
              value={yeniHedef}
              onChange={(e) => setYeniHedef(e.target.value)}
              placeholder="Kısa hedef"
            />

            <label className="etiket" htmlFor="yeni-pozisyon">
              Pozisyon
            </label>
            <input
              id="yeni-pozisyon"
              className="girdi"
              value={yeniPozisyon}
              onChange={(e) => setYeniPozisyon(e.target.value)}
              placeholder="Örn. oturarak"
            />

            <label className="etiket" htmlFor="yeni-doz">
              Doz
            </label>
            <input
              id="yeni-doz"
              className="girdi"
              value={yeniDoz}
              onChange={(e) => setYeniDoz(e.target.value)}
            />

            <label className="etiket" htmlFor="yeni-adimlar">
              Adımlar (satır satır)
            </label>
            <textarea
              id="yeni-adimlar"
              className="girdi"
              rows={3}
              value={yeniAdimlar}
              onChange={(e) => setYeniAdimlar(e.target.value)}
              placeholder={'1. adım\n2. adım'}
            />

            <label className="etiket" htmlFor="yeni-onlem">
              Önlem
            </label>
            <input
              id="yeni-onlem"
              className="girdi"
              value={yeniOnlem}
              onChange={(e) => setYeniOnlem(e.target.value)}
            />

            <button className="ana" type="button" onClick={yeniKaydet} disabled={!yeniAd.trim()}>
              Kaydet
            </button>
          </div>
        </div>
      ) : null}

      {detayId ? (
        <div
          className="core-detay-maske"
          role="dialog"
          onClick={() => {
            setDetayId(undefined)
            setAdDuzenle(false)
          }}
        >
          <div
            className={
              katalogBul(detayId)?.manuel ? 'core-detay-frame manuel' : 'core-detay-frame'
            }
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {(() => {
              const egz: KatalogEgzersiz | undefined = katalogBul(detayId)
              if (!egz) return null
              return (
                <>
                  <div className="core-detay-ust">
                    {adDuzenle ? (
                      <input
                        className="girdi core-ad-girdi"
                        value={adTaslak}
                        autoFocus
                        aria-label="Egzersiz adı"
                        onChange={(e) => setAdTaslak(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') adKaydet()
                          if (e.key === 'Escape') setAdDuzenle(false)
                        }}
                        onBlur={adKaydet}
                      />
                    ) : (
                      <strong>{egz.ad}</strong>
                    )}
                    <div className="core-detay-aksiyon">
                      <button
                        type="button"
                        className="core-ikon-btn"
                        aria-label="Adı düzenle"
                        onClick={() => (adDuzenle ? adKaydet() : adDuzenlemeyiAc(egz.ad))}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                          <path
                            fill="currentColor"
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm14.71-9.04a1 1 0 0 0 0-1.41l-2.51-2.51a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.99-1.66z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="ana-ayar"
                        onClick={() => {
                          setDetayId(undefined)
                          setAdDuzenle(false)
                        }}
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                  <p className="mini">
                    {egz.tur === 'core' ? 'Core' : bolgeEtiket(egz.bolge)} · {egz.pozisyon} · {egz.doz}
                  </p>
                  {egz.adimlar.map((adim) => (
                    <p key={adim}>· {adim}</p>
                  ))}
                  <p className="mini">{egz.onlem}</p>
                </>
              )
            })()}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function useFirebaseHastalar(): { hastalar: Hasta[]; yukleniyor: boolean; hata: string } {
  const [hastalar, setHastalar] = useState<Hasta[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')
  useEffect(() => {
    let iptal = false
    setYukleniyor(true)
    void hastalariYukle()
      .then((liste) => {
        if (!iptal) {
          setHastalar(liste)
          setHata('')
        }
      })
      .catch(() => {
        if (!iptal) {
          setHastalar([])
          setHata('Firebase’den okunamadı.')
        }
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false)
      })
    return () => {
      iptal = true
    }
  }, [])
  return { hastalar, yukleniyor, hata }
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
  const bulguSayisi = bulgulariCikar(hasta.hastalikId, hasta.cevaplar).length
  const bulgu = bulguSayisi > 0 ? `${bulguSayisi} bulgu` : undefined
  return [ad, yas, sonuc, bulgu].filter(Boolean).join(' · ')
}
