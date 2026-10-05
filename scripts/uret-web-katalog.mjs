/**
 * Web katalog üreteci — yalnızca web-* ID’leri.
 * Kaynaklar: WHO M3, SCIRE, Verschuren CP PA, ParkinsonNet, APTA PD, Birnkrant DMD.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const WHO = {
  ad: 'WHO Rehabilitasyon müdahale paketi, Modül 3, Nörolojik durumlar',
  yil: '2023',
  url: 'https://www.who.int/publications/i/item/9789240071131',
  lisans: 'CC BY-NC-SA 3.0 IGO',
}
const SCIRE = {
  ad: 'SCIRE Community, omurilik yaralanmasında egzersiz rehberi',
  yil: '2018',
  url: 'https://community.scireproject.com/topic/exercise-guidelines/',
  lisans: 'CC BY-NC 4.0',
}
const CP_PA = {
  ad: 'Verschuren ve diğerleri, CP’de egzersiz ve fiziksel aktivite önerileri',
  yil: '2016',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4942358/',
  lisans: 'Açık erişim özet; dozlar özgün kısa taslaktır',
}
const PD_EU = {
  ad: 'Avrupa Parkinson Fizyoterapi Kılavuzu (ParkinsonNet)',
  yil: '2014',
  url: 'https://www.parkinsonnet.nl/app/uploads/sites/3/2019/11/eu_guideline_parkinson_guideline_for_pt_s1.pdf',
  lisans: 'Kılavuz özeti; alıştırmalar özgün kısa taslaktır',
}
const PD_APTA = {
  ad: 'APTA Parkinson hastalığı fizyoterapi klinik kılavuzu',
  yil: '2022',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9046970/',
  lisans: 'Açık erişim; öneriler özgün kısa taslaktır',
}
const DMD = {
  ad: 'Birnkrant ve diğerleri, Duchenne bakım önerileri',
  yil: '2018',
  url: 'https://www.cdc.gov/muscular-dystrophy/treatments/care-considerations.html',
  lisans: 'Kısa özgün taslak',
}

const eg = (id, ad, hedef, pozisyon, adimlar, doz, onlem, kaynak) => ({
  id, ad, hedef, pozisyon, adimlar, doz, onlem, kaynak,
})
const K = (egzersizId, dakika, tekrar) => ({ egzersizId, dakika, tekrar })
function plan(id, ad, hedef, kalemler, seansNotu) {
  const toplam = kalemler.reduce((a, x) => a + x.dakika, 0)
  if (toplam !== 30) throw new Error(`${id} toplam ${toplam}`)
  return { id, ad, hedef, plan: kalemler, seansNotu }
}

const egzersizler = [
  eg('web-hem-skapula', 'Kürek kemiği yerleştirme', 'Omuz kemeri aktif kontrol', 'Oturma', ['Kürek kemiğini aşağı–geri kaydırın.', '5 sn tutun.', 'Ağrıda kesin.'], '10×5 sn', 'Subluksasyonda pasif yük yok.', WHO),
  eg('web-hem-yuk', 'Masaya ağırlık aktarma', 'Üst ekstremiteye kontrollü yük', 'Masa başı', ['Etkilenen eli masaya koyun.', 'Gövdeyi yavaş o tarafa kaydırın.', 'Ağrı sınırında geri gelin.'], '8–10 aktarma', 'Omuz ağrısında durun.', WHO),
  eg('web-hem-kavrama', 'İşlevsel kavrama', 'Nesne tutma ve bırakma', 'Masa', ['Nesneleri kavrayıp hedefe bırakın.', 'Boyutu kademeli küçültün.', '2 set.'], '2×8 nesne', 'Ağrıda bırakın.', WHO),
  eg('web-hem-cimt', 'Kısa kısıtlı-kullanım bloğu', 'Etkilenen el zorunlu kullanım (CIMT ilkesi)', 'Oturma', ['Sağlam eli kısa süre sınırlayın.', 'Etkilenen elle görev yapın.', 'Yorulunca kısıtı kaldırın.'], '8–10 dk', 'Şiddetli ihmal/ajitasyonda yok.', WHO),
  eg('web-hem-sts', 'Oturup kalkma tekrarı', 'Transfer / alt ekstremite', 'Sandalye', ['Gövde öne, etkilenen bacak bassın.', 'Kontrollü oturun.', '8–10 tekrar.'], '8–10 tekrar', 'Diz ağrısında azaltın.', WHO),
  eg('web-hem-gait', 'Destekli yürüyüş eğitimi', 'Yürüme ve dayanıklılık', 'Paralel bar / yürüteç', ['Topuk temasını vurgulayın.', 'Kısa hatlar.', 'Yorulunca oturun.'], '8–10 dk', 'Refakatçi.', WHO),
  eg('web-hem-basamak', 'Alçak basamak', 'Kontrollü basamak', 'Basamak+trabzan', ['Trabzanla çık–in.', '6–8 tekrar.', 'Yorulunca düz zemin.'], '6–8 tekrar', 'Düşme riskinde eşlik.', WHO),
  eg('web-hem-denge', 'Ayakta ağırlık kaydırma', 'Denge', 'Ayakta, destekli', ['Sağ–sol kaydırma.', 'Küçük salınım.', '8–10 döngü.'], '8–10 döngü', 'Duramıyorsa atlayın.', WHO),

  eg('web-par-aero', 'Kol ergometresi aralıklı', 'Kalp–solunum dayanıklılığı', 'Sandalye', ['1 dk rahat / 30 sn tempo.', 'Konuşma bozulursa yavaşlayın.', 'Isıyı izleyin.'], '10–12 dk', 'Disrefleksi/aşırı ısıda durun.', SCIRE),
  eg('web-par-omuz', 'Kürek çekme ve omuz indirme', 'Korunan üst ekstremite kuvveti', 'Sandalye', ['Kürek kemiklerini yaklaştırın.', 'Masaya hafif şınav.', '2×8–10.'], '2×8–10', 'Omuz ağrısında azaltın.', SCIRE),
  eg('web-par-transfer', 'Transfer tekrarı', 'Yatak ↔ sandalye', 'Yatak kenarı', ['Tahta veya pivot seçin.', 'Öne eğilip kaydırın.', '3–5 geçiş.'], '3–5 geçiş', 'Cilt/omurga önlemi.', WHO),
  eg('web-par-basi', 'Zamanlı bası boşaltma', 'Basınç yarası önleme', 'Tekerlekli sandalye', ['30–60 sn boşaltın.', 'Her iki yana.', 'Kızarıklığı kontrol.'], '4–6 mola', 'Açık yaraya oturtmayın.', WHO),
  eg('web-par-rom', 'Alt ekstremite eklem hareketi', 'Kontraktür önleme', 'Sırtüstü', ['Ayak bileği, diz ve kalçayı yavaş hareket ettirin.', 'Spastisitede bekleyin.', '10 tekrar / eklem.'], '10 / eklem', 'Osteoporozda zorlamayın.', WHO),
  eg('web-par-govde', 'Uzun oturuş dengesi', 'Gövde kontrolü', 'Yatak kenarı', ['Destekli veya desteksiz kaydırma.', '8 aktarma.', 'Düşme kemeri gerekebilir.'], '8 aktarma', 'Düşme riski.', WHO),

  eg('web-pk-buyuk', 'Büyük genlikli hareket', 'Geniş amplitüdlü işlevsel hareket', 'Ayakta/oturma', ['Hareketleri abartılı geniş yapın.', '“Daha büyük” ipucu.', '8–10 dk.'], '8–10 dk', 'Denge bozuksa oturun.', PD_APTA),
  eg('web-pk-ipucu', 'İpuçlu yürüyüş', 'Ritim / bant ipucu', 'Bantlı koridor', ['Adım banda veya ritme uysun.', 'Donmada topuk stratejisi.', '4–6 tur.'], '4–6 tur', 'Refakatçi.', PD_EU),
  eg('web-pk-cift', 'Çift görev yürüyüşü', 'Dikkatli çift görev', 'Düz koridor', ['Önce yalnız yürüyüş.', 'Sonra sayarak yürüyüş.', 'Bozulursa görevi kesin.'], '3–4 tur', 'Sık donmada yok.', PD_EU),
  eg('web-pk-sts', 'Tekrarlı oturup kalkma', 'Transfer kapasitesi', 'Sandalye', ['5 hızlı güvenli kalkış × 2 set.', 'Arada dinlenin.', 'Baş dönmesinde durun.'], '2×5', 'Ortostatizmde yavaş.', PD_EU),
  eg('web-pk-denge', 'Ağırlık kaydırma dengesi', 'Denge çekirdeği', 'Sandalye tutarak', ['Ön–arka ve yan salınım.', '8–10 döngü.', 'Tek ayak opsiyonel.'], '8–10 döngü', 'Yeni düşmede tek ayak yok.', PD_EU),
  eg('web-pk-aero', 'Orta şiddette aerobik', 'Aerobik egzersiz', 'Yürüyüş/bisiklet', ['Konuşulabilir tempo.', '8–12 dk molalı.', 'Off dönemde zorlamayın.'], '8–12 dk', 'Göğüs ağrısında durun.', PD_APTA),
  eg('web-pk-yatak', 'Yatakta dönme stratejisi', 'Yatak mobilitesi', 'Yatak', ['Dizleri bükün.', 'Omuz–kalça birlikte.', 'Her yana 4–6.'], '4–6 / yan', 'Zorlamayın.', PD_EU),

  eg('web-cp-aero', 'Aerobik oyun / tempo', 'Aerobik kapasite', 'Düz zemin/bisiklet', ['2–3 dk çalış, 1 dk mola.', 'Konuşulabilir tempo.', '10–12 dk aktif.'], '10–12 dk aktif', 'Spastisite artarsa düşürün.', CP_PA),
  eg('web-cp-kuvvet', 'Fonksiyonel kuvvet', 'İşlevsel direnç', 'Sandalye/basamak', ['Oturup kalkma veya basamak.', '2×8–10.', 'Ağırlık yok veya çok hafif.'], '2×8–10', 'Eklem ağrısında kesin.', CP_PA),
  eg('web-cp-esnek', 'Esneklik bloğu', 'Esneklik', 'Sırtüstü/oturma', ['Baldır–hamstring–kalça 20–30 sn.', '3 tutuş.', 'Zıplatmayın.'], '3×20–30 sn', 'Yeni cerrahide atlayın.', WHO),
  eg('web-cp-el', 'İki elle masa işi', 'Üst ekstremite', 'Masa', ['İki elle taşıma/dizme.', 'Az kullanılan eli hedefleyin.', '8–10 dk.'], '8–10 dk', 'Omuz ağrısı.', WHO),
  eg('web-cp-gait', 'Düz zeminde yürüyüş ve dönüş', 'Yürüme eğitimi', 'Düz hat', ['Düz turlar.', 'Geniş yaylı dönüş.', 'Cihazla gerekirse.'], '8–10 dk', 'Refakat.', WHO),
  eg('web-cp-denge', 'Ayakta denge istasyonu', 'Postüral kontrol', 'Ayakta', ['Ağırlık aktarma.', 'Uzanma hedefleri.', '8–10 döngü.'], '8–10 döngü', 'IV–V’de oturarak.', WHO),
  eg('web-cp-otur', 'Oturma gövde kontrolü', 'Oturma dengesi', 'Sandalye', ['Sağ–sol kaydırma.', 'Öne uzanma.', '8–10.'], '8–10', 'Bası kızarıklığında kesin.', WHO),
  eg('web-cp-basamak', 'Trabzanlı basamak', 'İşlevsel basamak', 'Basamak', ['Trabzanla 6–8 çıkış–iniş.', 'Yavaş kontrol.', 'Yorulunca bırakın.'], '6–8', 'Eşlik.', WHO),

  eg('web-dmd-su', 'Su içi düşük yük', 'Submaksimal aerobik', 'Havuz', ['Göğüs hizası yürüyüş/yüzme.', 'Konuşulabilir tempo.', '8–12 dk.'], '8–12 dk', 'Eksantrik/yüksek direnç yok.', DMD),
  eg('web-dmd-el', 'Dirençsiz el oyunu', 'Üst ekstremite katılımı', 'Masa', ['Hafif nesne.', 'Zorlamayın.', '6–8 dk.'], '6–8 dk', 'Eksantrik yok.', DMD),
  eg('web-dmd-germe', 'Kontraktür germesi', 'Esneklik', 'Sırtüstü', ['3×20–30 sn.', 'Ağrıda bırakın.', 'Ev programına bağlayın.'], '3×20–30 sn', 'Kırık şüphesinde yok.', DMD),
  eg('web-dmd-nefes', 'Nefes farkındalığı', 'Solunum', 'Oturma', ['Yavaş nefes.', 'Hafif üfleme.', '5–8 tur.'], '5–8 tur', 'Baş dönmesinde durun.', DMD),
  eg('web-dmd-mola', 'Dinlenme aralığı', 'Yorgunluk yönetimi', 'Oturma/yatma', ['Destekli dinlenme.', 'Nefes normale dönünce devam.', 'İkinci yorucu iş yok.'], 'Bloklar arası', 'Semptom sürerse bitirin.', DMD),
]

const bantlar = {
  'hemi-c-erken': [
    plan('web-hem-c-1', 'Omuz kemeri + masaya yük', 'Erken üst ekstremite, oturarak', [
      K('web-hem-skapula', 10, '10×5 sn'), K('web-hem-yuk', 10, '8–10 aktarma'), K('web-hem-kavrama', 10, '2×8'),
    ], 'Brunnstrom 1–2. Yürüme yok.'),
    plan('web-hem-c-2', 'Kavrama ve omuz kemeri günü', 'İşlevsel el, oturarak', [
      K('web-hem-kavrama', 12, '2×10'), K('web-hem-skapula', 10, '10 tutuş'), K('web-hem-yuk', 8, '8 aktarma'),
    ], 'Brunnstrom 1–2.'),
  ],
  'hemi-c-orta': [
    plan('web-hem-c-3', 'Kısa CIMT + oturup kalkma', 'Kısıtlı kullanım + transfer', [
      K('web-hem-cimt', 10, '8–10 dk blok'), K('web-hem-sts', 10, '8–10'), K('web-hem-kavrama', 10, '2×8'),
    ], 'Brunnstrom 3–4. Ayakta uzun yürüyüş yok.'),
    plan('web-hem-c-4', 'Masaya yük ve denge hazırlığı', 'Üst yük → kısa ayakta kaydırma', [
      K('web-hem-yuk', 8, '8–10'), K('web-hem-sts', 8, '8 tekrar'), K('web-hem-denge', 8, '8–10'), K('web-hem-skapula', 6, 'omuz kemeri'),
    ], 'Brunnstrom 3–4.'),
  ],
  'hemi-c-secici': [
    plan('web-hem-c-5', 'Yürüyüş + basamak', 'Yürüme ve basamak görevi', [
      K('web-hem-gait', 12, 'aralıklı'), K('web-hem-basamak', 10, '6–8'), K('web-hem-denge', 8, 'denge'),
    ], 'Brunnstrom 5–6.'),
    plan('web-hem-c-6', 'CIMT sonrası yürüyüş', 'El bloğu + yürüyüş', [
      K('web-hem-cimt', 8, 'kısa blok'), K('web-hem-gait', 12, 'yürüyüş'), K('web-hem-kavrama', 10, 'oturarak el'),
    ], 'Brunnstrom 5–6.'),
  ],
  'hemi-y-erken': [
    plan('web-hem-y-1', 'Flask omuz–masa–kavrama', 'Oturarak üst ekstremite', [
      K('web-hem-skapula', 10, '10 tutuş'), K('web-hem-yuk', 12, '8–10'), K('web-hem-kavrama', 8, 'hafif'),
    ], 'Evre 1–2. Yürüme yok.'),
    plan('web-hem-y-2', 'Omuz kemeri ve oturup kalkma hazırlığı', 'Üst + erken transfer', [
      K('web-hem-skapula', 8, 'omuz kemeri'), K('web-hem-yuk', 8, 'yük'), K('web-hem-sts', 8, '6–8 yavaş'), K('web-hem-kavrama', 6, 'el'),
    ], 'Evre 1–2. Uzun yürüyüş yok.'),
  ],
  'hemi-y-orta': [
    plan('web-hem-y-3', 'İşlevsel el + oturup kalkma', 'El görevi + transfer', [
      K('web-hem-kavrama', 10, '2×8–10'), K('web-hem-cimt', 8, 'kısa'), K('web-hem-sts', 12, '8–10'),
    ], 'Evre 3–4.'),
    plan('web-hem-y-4', 'Denge ve masaya yük', 'Ayakta kaydırma + üst yük', [
      K('web-hem-yuk', 8, 'yük'), K('web-hem-denge', 10, '8–10'), K('web-hem-sts', 8, 'oturup kalkma'), K('web-hem-skapula', 4, 'omuz kemeri'),
    ], 'Evre 3–4.'),
  ],
  'hemi-y-secici': [
    plan('web-hem-y-5', 'Yürüyüş ve basamak', 'Yürüme + basamak', [
      K('web-hem-gait', 12, '8–10 dk'), K('web-hem-basamak', 10, '6–8'), K('web-hem-denge', 8, 'denge'),
    ], 'Evre 5–6.'),
    plan('web-hem-y-6', 'El + yürüyüş kombine', 'Üst görev sonrası yürüyüş', [
      K('web-hem-kavrama', 8, 'el'), K('web-hem-gait', 14, 'yürüyüş'), K('web-hem-sts', 8, 'oturup kalkma'),
    ], 'Evre 5–6.'),
  ],
  'para-c-tam': [
    plan('web-par-c-1', 'Eklem + bası + gövde', 'AIS A–B çocuk bakım', [
      K('web-par-rom', 10, '10/eklem'), K('web-par-basi', 8, 'molalar'), K('web-par-govde', 12, 'oturma'),
    ], 'AIS A–B. Ayakta yok.'),
    plan('web-par-c-2', 'Omuz kuvveti ve transfer', 'Üst güç + geçiş', [
      K('web-par-omuz', 12, '2×8–10'), K('web-par-transfer', 10, '3–4'), K('web-par-basi', 8, 'bası'),
    ], 'AIS A–B.'),
  ],
  'para-c-kismi': [
    plan('web-par-c-3', 'Gövde + omuz + transfer', 'AIS C mobilite', [
      K('web-par-govde', 10, 'denge'), K('web-par-omuz', 10, 'kuvvet'), K('web-par-transfer', 10, '3–5'),
    ], 'AIS C.'),
    plan('web-par-c-4', 'Eklem sonrası kuvvet', 'Açıklık + üst güç', [
      K('web-par-rom', 8, 'eklem'), K('web-par-omuz', 12, '2 set'), K('web-par-basi', 5, 'bası'), K('web-par-govde', 5, 'oturma'),
    ], 'AIS C.'),
  ],
  'para-c-yurur': [
    plan('web-par-c-5', 'Omuz dayanıklılık + gövde', 'AIS D–E üst fitness', [
      K('web-par-omuz', 12, '3×8'), K('web-par-govde', 10, 'denge'), K('web-par-transfer', 8, 'transfer'),
    ], 'AIS D–E.'),
    plan('web-par-c-6', 'Transfer yoğun', 'Fonksiyonel geçiş', [
      K('web-par-transfer', 12, '4–5'), K('web-par-omuz', 10, 'kuvvet'), K('web-par-basi', 8, 'bası eğitimi'),
    ], 'AIS D–E.'),
  ],
  'para-y-tam': [
    plan('web-par-y-1', 'SCIRE aerobik + bası', 'Kol ergometresi odaklı', [
      K('web-par-aero', 14, 'aralıklı'), K('web-par-basi', 8, 'bası'), K('web-par-rom', 8, 'eklem'),
    ], 'AIS A–B. SCIRE fitness.'),
    plan('web-par-y-2', 'Omuz + transfer + bası', 'Güç ve bakım', [
      K('web-par-omuz', 12, '2–3 set'), K('web-par-transfer', 10, '3–4'), K('web-par-basi', 8, 'bası'),
    ], 'AIS A–B.'),
  ],
  'para-y-kismi': [
    plan('web-par-y-3', 'Aerobik + gövde', 'Fitness + denge', [
      K('web-par-aero', 12, 'tempo'), K('web-par-govde', 10, 'denge'), K('web-par-basi', 8, 'bası'),
    ], 'AIS C.'),
    plan('web-par-y-4', 'Omuz + transfer', 'Güç ve geçiş', [
      K('web-par-omuz', 12, 'kuvvet'), K('web-par-transfer', 12, '4–5'), K('web-par-rom', 6, 'eklem'),
    ], 'AIS C.'),
  ],
  'para-y-yurur': [
    plan('web-par-y-5', 'Aerobik kapasite günü', 'SCIRE doz dilimi', [
      K('web-par-aero', 16, 'molalı'), K('web-par-govde', 8, 'denge'), K('web-par-basi', 6, 'bası'),
    ], 'AIS D–E.'),
    plan('web-par-y-6', 'Kuvvet + aerobik', 'Üst güç sonrası tempo', [
      K('web-par-omuz', 10, '2 set'), K('web-par-aero', 14, 'aerobik'), K('web-par-basi', 6, 'bası'),
    ], 'AIS D–E.'),
  ],
  'pk-hafif': [
    plan('web-pk-1', 'Büyük genlik + ipuçlu yürüyüş', 'Geniş hareket + ritim ipucu', [
      K('web-pk-buyuk', 10, 'geniş hareket'), K('web-pk-ipucu', 12, '4–6 tur'), K('web-pk-sts', 8, '2×5'),
    ], 'HY 1–2. Çift görev ayrı sette.'),
    plan('web-pk-2', 'Aerobik + büyük genlik', 'Aerobik + genlik', [
      K('web-pk-aero', 12, 'orta şiddet'), K('web-pk-buyuk', 10, 'geniş hareket'), K('web-pk-denge', 8, 'denge'),
    ], 'HY 1–2.'),
  ],
  'pk-denge': [
    plan('web-pk-3', 'Denge + oturup kalkma + ipucu', 'Denge, transfer, yürüyüş ipucu', [
      K('web-pk-denge', 10, '8–10'), K('web-pk-sts', 8, '2×5'), K('web-pk-ipucu', 12, 'yavaş ritim'),
    ], 'HY 3. Çift görev yok.'),
    plan('web-pk-4', 'Oturma stratejisi + kısa yürüyüş', 'Transfer odaklı', [
      K('web-pk-yatak', 8, 'yatak dönme'), K('web-pk-sts', 10, 'kalkış'), K('web-pk-denge', 6, 'denge'), K('web-pk-ipucu', 6, 'kısa yürüyüş'),
    ], 'HY 3.'),
  ],
  'pk-ileri': [
    plan('web-pk-5', 'Yatak ve oturma mobilitesi', 'İleri evre, yürüyüş yok', [
      K('web-pk-yatak', 12, 'dönme'), K('web-pk-sts', 10, 'yardımlı kalkış'), K('web-pk-buyuk', 8, 'oturarak genlik'),
    ], 'HY 4–5. Desteksiz yürüyüş yok.'),
    plan('web-pk-6', 'Yardımlı transfer günü', 'Oturup kalkma + yatak', [
      K('web-pk-yatak', 10, 'yatak'), K('web-pk-sts', 12, 'refakatli'), K('web-pk-denge', 8, 'oturarak/destekli'),
    ], 'HY 4–5.'),
  ],
  'dmd-erken': [
    plan('web-dmd-1', 'Germe + su içi aerobik', 'Germe + düşük yük aerobik', [
      K('web-dmd-germe', 8, '3 tutuş'), K('web-dmd-su', 12, 'konuşulabilir'), K('web-dmd-mola', 10, 'dinlenme'),
    ], 'Vignos 1–3. Eksantrik yok.'),
    plan('web-dmd-2', 'El + nefes + germe', 'Düşük yük üst + solunum', [
      K('web-dmd-el', 10, 'hafif'), K('web-dmd-nefes', 8, '5–8'), K('web-dmd-germe', 8, 'germe'), K('web-dmd-mola', 4, 'mola'),
    ], 'Vignos 1–3.'),
  ],
  'dmd-gec': [
    plan('web-dmd-3', 'Kısa su, uzun mola', 'Yorgunluk yönetimi', [
      K('web-dmd-su', 8, 'kısa'), K('web-dmd-mola', 12, 'dinlenme'), K('web-dmd-germe', 10, 'germe'),
    ], 'Vignos 4–6.'),
    plan('web-dmd-4', 'Germe ve el, yokuş yok', 'Kontraktür + katılım', [
      K('web-dmd-germe', 12, 'tutuş'), K('web-dmd-el', 10, 'el'), K('web-dmd-mola', 8, 'mola'),
    ], 'Vignos 4–6. Merdiven yok.'),
  ],
  'dmd-otur': [
    plan('web-dmd-5', 'Oturarak bakım', 'Yürüme yok', [
      K('web-dmd-germe', 12, 'germe'), K('web-dmd-el', 8, 'el'), K('web-dmd-nefes', 5, 'nefes'), K('web-dmd-mola', 5, 'mola'),
    ], 'Vignos 7–10. Ayakta yok.'),
    plan('web-dmd-6', 'Nefes ve germe günü', 'Solunum odaklı', [
      K('web-dmd-nefes', 10, 'nefes'), K('web-dmd-germe', 12, 'germe'), K('web-dmd-mola', 8, 'dinlenme'),
    ], 'Vignos 7–10.'),
  ],
  'cp-yurur': [
    plan('web-cp-1', 'Aerobik + fonksiyonel kuvvet', 'Aerobik + işlevsel direnç', [
      K('web-cp-aero', 12, 'molalı aerobik'), K('web-cp-kuvvet', 10, '2×8–10'), K('web-cp-esnek', 8, 'esneklik'),
    ], 'GMFCS I–II. Fitness odaklı; köprü/mekik/dizüstü zinciri değil.'),
    plan('web-cp-2', 'Yürüyüş + basamak + denge', 'Yürüme + basamak görevi', [
      K('web-cp-gait', 12, 'yürüyüş'), K('web-cp-basamak', 8, '6–8'), K('web-cp-denge', 10, 'denge'),
    ], 'GMFCS I–II.'),
  ],
  'cp-cihaz': [
    plan('web-cp-3', 'Cihazlı yürüyüş + kuvvet', 'Yürüteçli fitness', [
      K('web-cp-gait', 12, 'cihazla'), K('web-cp-kuvvet', 10, 'oturup kalkma'), K('web-cp-esnek', 8, 'germe'),
    ], 'GMFCS III.'),
    plan('web-cp-4', 'İki el + oturup kalkma + kısa yürüyüş', 'Üst + transfer + adım', [
      K('web-cp-el', 10, 'iki el'), K('web-cp-kuvvet', 10, 'oturup kalkma'), K('web-cp-gait', 10, 'kısa cihazlı'),
    ], 'GMFCS III.'),
  ],
  'cp-sandalye': [
    plan('web-cp-5', 'Oturma dengesi + el + esneklik', 'GMFCS IV oturarak', [
      K('web-cp-otur', 12, 'gövde'), K('web-cp-el', 10, 'masa'), K('web-cp-esnek', 8, 'germe'),
    ], 'GMFCS IV. Yürüme yok.'),
    plan('web-cp-6', 'Esneklik ve oturma kontrolü', 'Eklem + oturma', [
      K('web-cp-esnek', 12, 'esneklik'), K('web-cp-otur', 12, 'oturma'), K('web-cp-el', 6, 'kısa el'),
    ], 'GMFCS IV.'),
  ],
  'cp-tasima': [
    plan('web-cp-7', 'Esneklik + destekli oturma', 'GMFCS V bakım', [
      K('web-cp-esnek', 14, 'yavaş germe'), K('web-cp-otur', 10, 'yüksek destek'), K('web-cp-el', 6, 'kısa tutuş'),
    ], 'GMFCS V. Ayakta/dizüstü yok.'),
    plan('web-cp-8', 'Oturma ve hafif el', 'Orta hat / üst katılım', [
      K('web-cp-otur', 14, 'destekli'), K('web-cp-el', 8, 'el'), K('web-cp-esnek', 8, 'germe'),
    ], 'GMFCS V.'),
  ],
}

const ids = new Set(egzersizler.map((e) => e.id))
for (const [bant, list] of Object.entries(bantlar)) {
  for (const k of list) {
    for (const p of k.plan) {
      if (!ids.has(p.egzersizId)) throw new Error(`${bant}/${k.id} eksik ${p.egzersizId}`)
    }
  }
}

const out = join(root, 'public', 'katalog', 'ek.json')
writeFileSync(out, JSON.stringify({ egzersizler, bantlar }))
console.log('yazildi', out, 'egzersiz', egzersizler.length, 'bant', Object.keys(bantlar).length)
