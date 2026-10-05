import { useEffect, useMemo, useState } from 'react'
import type { Cevaplar } from './data/hesap'
import { hesapla } from './data/hesap'
import {
  bolumTamamMi,
  degerlendirmeBolumleri,
  type DegerlendirmeBolumu,
  type DegerlendirmeMaddesi,
} from './data/degerlendirme'
import { bulgulariCikar } from './data/tedaviMotoru'
import type { HastalikId } from './data/tipler'

export function MuayeneFormu({
  hastalikId,
  cevaplar,
  degistir,
}: {
  hastalikId: HastalikId
  cevaplar: Cevaplar
  degistir: (sonraki: Cevaplar) => void
}) {
  const bolumler = useMemo(() => degerlendirmeBolumleri(hastalikId), [hastalikId])
  const [bolumIx, setBolumIx] = useState(0)
  const [maddeIx, setMaddeIx] = useState(0)

  useEffect(() => {
    setBolumIx(0)
    setMaddeIx(0)
  }, [hastalikId])

  const bolum = bolumler[Math.min(bolumIx, bolumler.length - 1)]
  const madde = bolum?.maddeler[Math.min(maddeIx, (bolum?.maddeler.length ?? 1) - 1)]
  const toplamMadde = bolumler.reduce((a, b) => a + b.maddeler.length, 0)
  const bitenMadde = bolumler
    .flatMap((b) => b.maddeler)
    .filter((m) => Boolean(cevaplar[m.id])).length
  const yuzde = toplamMadde ? Math.round((bitenMadde / toplamMadde) * 100) : 0

  const hesap = hesapla(hastalikId, cevaplar)
  const bulgular = bulgulariCikar(hastalikId, cevaplar)

  function isaret(anahtar: string, deger: string) {
    degistir({ ...cevaplar, [anahtar]: deger })
    if (bolum) {
      window.setTimeout(() => ileri(bolum, maddeIx), 160)
    }
  }

  function ileri(b: DegerlendirmeBolumu = bolum!, mIx = maddeIx) {
    if (mIx + 1 < b.maddeler.length) {
      setMaddeIx(mIx + 1)
      return
    }
    if (bolumIx + 1 < bolumler.length) {
      setBolumIx(bolumIx + 1)
      setMaddeIx(0)
    }
  }

  function geriMadde() {
    if (maddeIx > 0) {
      setMaddeIx(maddeIx - 1)
      return
    }
    if (bolumIx > 0) {
      const onceki = bolumler[bolumIx - 1]
      setBolumIx(bolumIx - 1)
      setMaddeIx(onceki.maddeler.length - 1)
    }
  }

  function bolumSec(ix: number) {
    setBolumIx(ix)
    setMaddeIx(0)
  }

  if (!bolum || !madde) return null

  return (
    <section className="dg-kabuk">
      <div className="dg-ust">
        <div className="dg-ust-metin">
          <strong>
            {bolum.ad}
            <span>
              {' '}
              · {maddeIx + 1}/{bolum.maddeler.length}
            </span>
          </strong>
        </div>
        <span className="dg-yuzde">{yuzde}%</span>
      </div>
      <div className="dg-bar" aria-hidden>
        <i style={{ width: `${yuzde}%` }} />
      </div>

      <div className="dg-bolum-serit">
        {bolumler.map((b, ix) => {
          const tamam = bolumTamamMi(b, cevaplar)
          const aktif = ix === bolumIx
          return (
            <button
              key={b.id}
              type="button"
              className={`dg-bolum-chip${aktif ? ' aktif' : ''}${tamam ? ' tamam' : ''}`}
              onClick={() => bolumSec(ix)}
            >
              {b.kisa}
            </button>
          )
        })}
      </div>

      <article className="dg-kart">
        <h2 className="dg-soru">{madde.baslik}</h2>
        <MaddeCevap madde={madde} deger={cevaplar[madde.id] ?? ''} isaret={isaret} />
      </article>

      <div className="dg-nav">
        <button type="button" className="dg-nav-btn" onClick={geriMadde} disabled={bolumIx === 0 && maddeIx === 0}>
          Geri
        </button>
        <button
          type="button"
          className="dg-nav-btn birincil"
          onClick={() => ileri()}
          disabled={bolumIx === bolumler.length - 1 && maddeIx === bolum.maddeler.length - 1}
        >
          İleri
        </button>
      </div>

      <div className="dg-ozet">
        {hesap && hesap.eksik === 0 ? (
          <strong>
            {hesap.etiket}
            {bulgular.length ? ` · ${bulgular.length} bulgu` : ''}
          </strong>
        ) : (
          <strong>Eksik: {hesap?.eksik ?? '—'}</strong>
        )}
      </div>
    </section>
  )
}

function MaddeCevap({
  madde,
  deger,
  isaret,
}: {
  madde: DegerlendirmeMaddesi
  deger: string
  isaret: (anahtar: string, deger: string) => void
}) {
  if (madde.olcek === 'evet-hayir') {
    return (
      <div className="dg-puanlar buyuk">
        <Puan secili={deger === 'evet'} onClick={() => isaret(madde.id, 'evet')} buyuk>
          Evet
        </Puan>
        <Puan secili={deger === 'hayir'} onClick={() => isaret(madde.id, 'hayir')} buyuk>
          Hayır
        </Puan>
      </div>
    )
  }
  if (madde.olcek === 'tek-secim' && madde.secenekler) {
    return (
      <div className="dg-secim-listesi">
        {madde.secenekler.map((s) => (
          <button
            key={s.id}
            type="button"
            className={deger === s.id ? 'dg-secim secili' : 'dg-secim'}
            onClick={() => isaret(madde.id, s.id)}
          >
            {s.etiket}
          </button>
        ))}
      </div>
    )
  }
  // 0-5 veya 0-2
  const max = madde.olcek === '0-2' ? 2 : 5
  const sayilar = Array.from({ length: max + 1 }, (_, i) => String(i))
  return (
    <div className="dg-puanlar">
      {sayilar.map((s) => (
        <button
          key={s}
          type="button"
          className={deger === s ? 'dg-skor secili' : 'dg-skor'}
          onClick={() => isaret(madde.id, s)}
          title={madde.etiketler?.[Number(s)]}
        >
          <strong>{s}</strong>
          {madde.etiketler?.[Number(s)] ? <span>{madde.etiketler[Number(s)]}</span> : null}
        </button>
      ))}
    </div>
  )
}

function Puan({
  secili,
  onClick,
  children,
  buyuk,
}: {
  secili: boolean
  onClick: () => void
  children: string
  buyuk?: boolean
}) {
  return (
    <button type="button" className={`dg-eh${buyuk ? ' buyuk' : ''}${secili ? ' secili' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
