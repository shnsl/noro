import { DERMATOMLAR, KASLAR, duyuAnahtar, kasAnahtar, kollariNormalDoldur } from './data/ais'
import type { Cevaplar } from './data/ais'
import { BACAK_MADDELERI, KOL_MADDELERI, hesapla } from './data/hesap'
import { skalaBul } from './data/skalalar'
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
  const hesap = hesapla(hastalikId, cevaplar)
  const skala = skalaBul(hastalikId)

  function isaret(anahtar: string, deger: string) {
    degistir({ ...cevaplar, [anahtar]: cevaplar[anahtar] === deger ? '' : deger })
  }

  return (
    <section className="cerceve">
      <span className="etiket">{skala?.ad}</span>
      <p className="not">Maddeleri hasta yanında işaretleyin. Derece bu işaretlerden hesaplanır, listeden seçilmez.</p>
      {hastalikId === 'parapleji' ? <AisForm cevaplar={cevaplar} isaret={isaret} degistir={degistir} /> : null}
      {hastalikId === 'hemipleji' ? (
        <>
          <EvetHayir baslik="Etkilenen kol" maddeler={KOL_MADDELERI} cevaplar={cevaplar} isaret={isaret} />
          <EvetHayir baslik="Etkilenen bacak" maddeler={BACAK_MADDELERI} cevaplar={cevaplar} isaret={isaret} />
        </>
      ) : null}
      {hastalikId === 'parkinson' ? <ParkinsonForm cevaplar={cevaplar} isaret={isaret} /> : null}
      {hastalikId === 'dmd' ? <DmdForm cevaplar={cevaplar} isaret={isaret} /> : null}
      {hastalikId === 'serebral-palsi' ? <CpForm cevaplar={cevaplar} isaret={isaret} /> : null}
      <div className="sonuc-serit">
        {hesap && hesap.eksik === 0 ? (
          <>
            <strong>
              {skala?.ad} {hesap.etiket}
            </strong>
            <span>{hesap.gerekce}</span>
          </>
        ) : (
          <strong>Eksik madde: {hesap?.eksik ?? '—'}</strong>
        )}
      </div>
    </section>
  )
}

function AisForm({
  cevaplar,
  isaret,
  degistir,
}: {
  cevaplar: Cevaplar
  isaret: (anahtar: string, deger: string) => void
  degistir: (sonraki: Cevaplar) => void
}) {
  const bolgeler = [
    { ad: 'Servikal duyu', liste: DERMATOMLAR.filter((seviye) => seviye.startsWith('C')) },
    { ad: 'Torakal duyu', liste: DERMATOMLAR.filter((seviye) => seviye.startsWith('T')) },
    { ad: 'Lumbosakral duyu', liste: DERMATOMLAR.filter((seviye) => !seviye.startsWith('C') && !seviye.startsWith('T')) },
  ]
  return (
    <>
      <button className="ikincil" type="button" onClick={() => degistir(kollariNormalDoldur(cevaplar))}>
        Kollar normal, bu hücreleri doldur
      </button>
      <h2 className="bolum">Anahtar kaslar, 0–5</h2>
      {KASLAR.map((kas) => (
        <article key={kas.id} className="muayene">
          <strong>{kas.ad}</strong>
          <YanSatir etiket="Sağ" secenekler={['0', '1', '2', '3', '4', '5']} deger={cevaplar[kasAnahtar('sag', kas.id)] ?? ''} sec={(deger) => isaret(kasAnahtar('sag', kas.id), deger)} />
          <YanSatir etiket="Sol" secenekler={['0', '1', '2', '3', '4', '5']} deger={cevaplar[kasAnahtar('sol', kas.id)] ?? ''} sec={(deger) => isaret(kasAnahtar('sol', kas.id), deger)} />
        </article>
      ))}
      {bolgeler.map((bolge) => (
        <div key={bolge.ad}>
          <h2 className="bolum">{bolge.ad}, 0 yok / 1 bozuk / 2 normal</h2>
          {bolge.liste.map((seviye) => (
            <article key={seviye} className="muayene">
              <strong>{seviye}</strong>
              <p className="mini">Hafif dokunma</p>
              <YanSatir etiket="Sağ" secenekler={['0', '1', '2']} deger={cevaplar[duyuAnahtar('lt', 'sag', seviye)] ?? ''} sec={(deger) => isaret(duyuAnahtar('lt', 'sag', seviye), deger)} />
              <YanSatir etiket="Sol" secenekler={['0', '1', '2']} deger={cevaplar[duyuAnahtar('lt', 'sol', seviye)] ?? ''} sec={(deger) => isaret(duyuAnahtar('lt', 'sol', seviye), deger)} />
              <p className="mini">İğne</p>
              <YanSatir etiket="Sağ" secenekler={['0', '1', '2']} deger={cevaplar[duyuAnahtar('pp', 'sag', seviye)] ?? ''} sec={(deger) => isaret(duyuAnahtar('pp', 'sag', seviye), deger)} />
              <YanSatir etiket="Sol" secenekler={['0', '1', '2']} deger={cevaplar[duyuAnahtar('pp', 'sol', seviye)] ?? ''} sec={(deger) => isaret(duyuAnahtar('pp', 'sol', seviye), deger)} />
            </article>
          ))}
        </div>
      ))}
      <h2 className="bolum">Sakral</h2>
      <EvetHayir
        baslik="Derin anal basınç"
        maddeler={[{ id: 'dap', metin: 'Derin anal basınç var' }]}
        cevaplar={cevaplar}
        isaret={isaret}
        evet="var"
        hayir="yok"
      />
      <EvetHayir
        baslik="İstemli anal kasılma"
        maddeler={[{ id: 'vac', metin: 'İstemli anal kasılma var' }]}
        cevaplar={cevaplar}
        isaret={isaret}
        evet="var"
        hayir="yok"
      />
    </>
  )
}

function ParkinsonForm({ cevaplar, isaret }: { cevaplar: Cevaplar; isaret: (anahtar: string, deger: string) => void }) {
  return (
    <EvetHayir
      baslik="Hoehn ve Yahr için gözlem"
      maddeler={[
        { id: 'tek', metin: 'Bulgular yalnızca tek tarafta' },
        { id: 'iki', metin: 'Bulgular iki tarafta da var' },
        { id: 'denge', metin: 'Çekme testinde denge bozuluyor' },
        { id: 'yurur', metin: 'Yardımsız ayakta durup yürüyor' },
        { id: 'yatak', metin: 'Gününü sandalye veya yatakta geçiriyor' },
      ]}
      cevaplar={cevaplar}
      isaret={isaret}
    />
  )
}

function CpForm({ cevaplar, isaret }: { cevaplar: Cevaplar; isaret: (anahtar: string, deger: string) => void }) {
  return (
    <EvetHayir
      baslik="GMFCS için gözlem"
      maddeler={[
        { id: 'cp-yurur', metin: 'Elde tutulan cihaz olmadan yürür' },
        { id: 'cp-sinir', metin: 'Uzun mesafe, kalabalık veya engebede yürüyüş kısıtlanır' },
        { id: 'cp-cihaz', metin: 'Yürümek için yürüteç, değnek veya baston kullanır' },
        { id: 'cp-teker', metin: 'Günlük yer değiştirmenin çoğu tekerlekli sandalyededir' },
        { id: 'cp-kendi', metin: 'Sandalyeyi veya akülü sandalyeyi kendisi sürer' },
        { id: 'cp-tasima', metin: 'Baş ve gövde sınırlı, yer değiştirmek için taşınır' },
      ]}
      cevaplar={cevaplar}
      isaret={isaret}
    />
  )
}

function DmdForm({ cevaplar, isaret }: { cevaplar: Cevaplar; isaret: (anahtar: string, deger: string) => void }) {
  return (
    <>
      <EvetHayir
        baslik="Yürüme ve transfer"
        maddeler={[
          { id: 'yurur', metin: 'Yardımsız yürür' },
          { id: 'kalkar', metin: 'Sandalyeden yardımsız kalkar' },
          { id: 'cihazla', metin: 'Yalnızca yardımla veya cihazla yürür' },
          { id: 'dik', metin: 'Sandalyede desteksiz dik oturur' },
          { id: 'gecis', metin: 'Yatak ve sandalye geçişini kendisi yapar' },
          { id: 'yatak', metin: 'Gününü yatakta geçirir' },
        ]}
        cevaplar={cevaplar}
        isaret={isaret}
      />
      <article className="muayene">
        <strong>Merdiven</strong>
        {(
          [
            ['yardimsiz', 'Yardımsız çıkar'],
            ['trabzan', 'Trabzanla çıkar'],
            ['yavas', 'Trabzanla yavaş çıkar'],
            ['yok', 'Çıkamaz'],
          ] as const
        ).map(([id, metin]) => (
          <button key={id} type="button" className={cevaplar.merdiven === id ? 'secim secili' : 'secim'} onClick={() => isaret('merdiven', id)}>
            <strong>{metin}</strong>
          </button>
        ))}
      </article>
    </>
  )
}

function EvetHayir({
  baslik,
  maddeler,
  cevaplar,
  isaret,
  evet = 'evet',
  hayir = 'hayir',
}: {
  baslik: string
  maddeler: { id: string; metin: string }[]
  cevaplar: Cevaplar
  isaret: (anahtar: string, deger: string) => void
  evet?: string
  hayir?: string
}) {
  return (
    <div>
      <h2 className="bolum">{baslik}</h2>
      {maddeler.map((madde) => (
        <article key={madde.id} className="muayene">
          <strong>{madde.metin}</strong>
          <div className="puanlar">
            <Puan secili={cevaplar[madde.id] === evet} onClick={() => isaret(madde.id, evet)}>
              Evet
            </Puan>
            <Puan secili={cevaplar[madde.id] === hayir} onClick={() => isaret(madde.id, hayir)}>
              Hayır
            </Puan>
          </div>
        </article>
      ))}
    </div>
  )
}

function YanSatir({
  etiket,
  secenekler,
  deger,
  sec,
}: {
  etiket: string
  secenekler: string[]
  deger: string
  sec: (deger: string) => void
}) {
  return (
    <div className="yan">
      <span>{etiket}</span>
      <div className="puanlar">
        {secenekler.map((secenek) => (
          <Puan key={secenek} secili={deger === secenek} onClick={() => sec(secenek)}>
            {secenek}
          </Puan>
        ))}
      </div>
    </div>
  )
}

function Puan({ secili, onClick, children }: { secili: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" className={secili ? 'puan secili' : 'puan'} onClick={onClick}>
      {children}
    </button>
  )
}
