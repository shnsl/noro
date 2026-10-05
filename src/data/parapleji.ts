import { SCIRE, WHO } from './kaynaklar'
import type { Egzersiz, Kombinasyon } from './tipler'

const cocuk: Egzersiz[] = [
  {
    id: 'par-c-eklem',
    ad: 'Oyunla eklem hareketi',
    hedef: 'Ayak bileği, diz ve kalça açıklığı',
    pozisyon: 'Sırtüstü veya kucak',
    adimlar: [
      'Ayağı yavaşça yukarı ve aşağı gezdirin.',
      'Dizi büküp açın, çocuk izin verirse.',
      'Kalçayı ağrısız aralıkta çevirin.',
    ],
    doz: 'Taslak: her eklem 5–8 yavaş tekrar.',
    onlem: 'Omurga tespiti veya ağrı varsa o bölgeyi atlayın.',
    kaynak: WHO,
  },
  {
    id: 'par-c-otur',
    ad: 'Destekli oturma',
    hedef: 'Baş ve gövdeyi dik tutmak',
    pozisyon: 'Destekli oturma',
    adimlar: [
      'Kalça arkada, ayaklar desteklensin.',
      'Öne konan oyuncağa kısa süre baksın.',
      'Yıkılırsa desteği artırın, süreyi kısaltın.',
    ],
    doz: 'Taslak: 1–3 dakika, birkaç kez.',
    onlem: 'Basınç noktası kızarıyorsa pozisyonu değiştirin.',
    kaynak: WHO,
  },
  {
    id: 'par-c-transfer',
    ad: 'Yataktan sandalyeye geçiş',
    hedef: 'Güvenli yer değiştirme',
    pozisyon: 'Yatak kenarı',
    adimlar: [
      'Ayakları yere veya basamağa indirin.',
      'Çocuk öne eğilsin, siz kalçayı kaydırın.',
      'Sandalyede oturunca deriyi kontrol edin.',
    ],
    doz: 'Taslak: 2–4 geçiş, ikinci kişi gerekebilir.',
    onlem: 'Omurga önlemi varsa düz çevirme kuralına uyun.',
    kaynak: WHO,
  },
  {
    id: 'par-c-nefes',
    ad: 'Nefes oyunu',
    hedef: 'Solunum',
    pozisyon: 'Yarı oturuş',
    adimlar: [
      'Tüy veya balon üfletin.',
      'Öksürmeyi teşvik edin, sekresyon varsa.',
      'Yorulunca sırtüstü dinlendirin.',
    ],
    doz: 'Taslak: 5–8 üfleme.',
    onlem: 'Morarma veya nefes darlığında durup değerlendirme yapın.',
    kaynak: WHO,
  },
  {
    id: 'par-c-itme',
    ad: 'Çalışan kaslarla itme',
    hedef: 'İşlevi kalan kaslar',
    pozisyon: 'Oturma veya sırtüstü',
    adimlar: [
      'Hangi kasların çalıştığını bilin.',
      'Hafif bir topu veya kolları ittirin.',
      'Çalışmayan kasa direnç vermeyin.',
    ],
    doz: 'Taslak: 6–10 tekrar, 1 set.',
    onlem: 'Otonomik disrefleksi belirtilerinde (baş ağrısı, terleme, tansiyon) durun.',
    kaynak: WHO,
  },
  {
    id: 'par-c-cilt',
    ad: 'Bası molası',
    hedef: 'Cilt',
    pozisyon: 'Otururken veya yatarken',
    adimlar: [
      'Kalçayı bir yana, sonra diğer yana boşaltın.',
      'Kızarıklık 15 dakikada geçmiyorsa o bölgeye yük vermeyin.',
      'Aileyi aynı molayı evde tekrarlaması için gösterin.',
    ],
    doz: 'Taslak: oturmada 15–30 dakikada bir mola.',
    onlem: 'Açık yara varsa o tarafın üzerine oturtmayın.',
    kaynak: WHO,
  },
]

const yetiskin: Egzersiz[] = [
  {
    id: 'par-y-kuvvet',
    ad: 'İşlevsel kas kuvveti',
    hedef: 'Çalışan büyük kas grupları',
    pozisyon: 'Sandalye veya yatak',
    adimlar: [
      'Çalışan omuz, dirsek ve varsa gövde kaslarını seçin.',
      'Orta-yüksek eforla 3 set uygulayın.',
      'Felçli kasa direnç beklemeyin.',
    ],
    doz: 'Taslak: SCIRE, haftada 2 gün, kas grubu başına 3 set.',
    onlem: 'Omuz ağrısında itme yükünü düşürün.',
    kaynak: SCIRE,
  },
  {
    id: 'par-y-aero',
    ad: 'Kol aerobiği',
    hedef: 'Dayanıklılık',
    pozisyon: 'Sandalye, kol ergometresi veya itme',
    adimlar: [
      'Konuşarak sürdürülen tempoda başlayın.',
      'Kesintisiz kol çevirme veya sandalye itme yapın.',
      'Nefes darlığı artarsa tempoyu düşürün.',
    ],
    doz: 'Taslak: SCIRE, en az 20 dk, orta-yüksek tempo, haftada 2 gün. Kardiyometabolik hedef düşünülüyorsa 30 dk, haftada 3 gün.',
    onlem: 'Boyun üstü yaralanmada disrefleksi ve aşırı ısınmayı izleyin.',
    kaynak: SCIRE,
  },
  {
    id: 'par-y-transfer',
    ad: 'Transfer',
    hedef: 'Yatak-sandalye geçişi',
    pozisyon: 'Yatak kenarı',
    adimlar: [
      'Ayakları yerleştirin, kaymayı önleyin.',
      'Öne eğilip kalçayı kaydırın, tahta gerekiyorsa kullanın.',
      'İnişten sonra cildi ve dengeyi kontrol edin.',
    ],
    doz: 'Taslak: 3–6 geçiş.',
    onlem: 'Yeni omurga kısıtı veya tansiyon düşmesi varsa ikinci kişi şart.',
    kaynak: WHO,
  },
  {
    id: 'par-y-germe',
    ad: 'Germe',
    hedef: 'Kalça, diz arkası ve ayak bileği',
    pozisyon: 'Sırtüstü',
    adimlar: [
      'Dizi düz tutup ayak bileğini yavaşça yukarı çekin.',
      'Kalçayı ağrısız açıklıkta bükün.',
      'Zıplama hissi olursa açıyı azaltın.',
    ],
    doz: 'Taslak: her bölge 20–30 saniye, 3 kez.',
    onlem: 'Heterotopik ossifikasyon ağrısında o eklemi zorlamayın.',
    kaynak: WHO,
  },
  {
    id: 'par-y-cilt',
    ad: 'Bası rahatlatma',
    hedef: 'Oturma yarasını önlemek',
    pozisyon: 'Tekerlekli sandalye',
    adimlar: [
      'Öne eğilerek veya yana kayarak kalçayı boşaltın.',
      'Kızarık bölgeyi aynayla kontrol ettirin.',
      'Aynı molayı ev programına yazın.',
    ],
    doz: 'Taslak: 15–30 dakikada bir, 1–2 dakika.',
    onlem: 'Açık yara varsa oturma süresini hekim planına bırakın.',
    kaynak: WHO,
  },
  {
    id: 'par-y-govde',
    ad: 'Gövde dengesi',
    hedef: 'Desteksiz oturma',
    pozisyon: 'Yatak kenarı',
    adimlar: [
      'Eller dizde, gövdeyi öne ve yanlara eğin.',
      'Topu yana uzatıp geri alın.',
      'Düşme başlarsa hareketi küçültün.',
    ],
    doz: 'Taslak: her yönde 8 tekrar.',
    onlem: 'Yüksek torakal veya servikal yaralanmada bir kişi arkada durur.',
    kaynak: WHO,
  },
]

export const PARAPLEJI_COCUK_EGZERSIZ = cocuk
export const PARAPLEJI_YETISKIN_EGZERSIZ = yetiskin

export const PARAPLEJI_COCUK_KOMBINASYON: Kombinasyon[] = [
  {
    id: 'par-c-k1',
    ad: 'Oturma ve nefes',
    hedef: 'Dik duruş ve solunum',
    plan: [
    { egzersizId: 'par-c-eklem', dakika: 10, tekrar: 'her eklem 6 tekrar' },
    { egzersizId: 'par-c-otur', dakika: 10, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
  ],
    seansNotu: 'Oturma kısalırsa nefes oyununu yatakta bitirin.',
  },
  {
    id: 'par-c-k2',
    ad: 'Güvenli geçiş',
    hedef: 'Transfer ve cilt',
    plan: [
    { egzersizId: 'par-c-transfer', dakika: 8, tekrar: '3 geçiş' },
    { egzersizId: 'par-c-cilt', dakika: 8, tekrar: '2 bası molası' },
    { egzersizId: 'par-c-otur', dakika: 7, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-nefes', dakika: 7, tekrar: 'bu sürede üfleme, aralarda mola' },
  ],
    seansNotu: 'Her geçişten sonra cilde bakın.',
  },
  {
    id: 'par-c-k3',
    ad: 'Çalışan kaslar',
    hedef: 'Kalan kuvvet',
    plan: [
    { egzersizId: 'par-c-itme', dakika: 10, tekrar: '2 set, 6 itme' },
    { egzersizId: 'par-c-otur', dakika: 10, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-cilt', dakika: 10, tekrar: '2 bası molası' },
  ],
    seansNotu: 'Yalnızca çalışan kaslara direnç verin.',
  },
  {
    id: 'par-c-k4',
    ad: 'Nefes ve cilt',
    hedef: 'Tam yaralanmada solunum ve bası',
    plan: [
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
    { egzersizId: 'par-c-cilt', dakika: 10, tekrar: '2 bası molası' },
    { egzersizId: 'par-c-eklem', dakika: 10, tekrar: 'her eklem 6 tekrar' },
  ],
    seansNotu: 'Ayakta durma yok. Her oturuştan sonra cilt.',
  },
  {
    id: 'par-c-k5',
    ad: 'Geçiş ve oturma',
    hedef: 'Yer değiştirme pratiği',
    plan: [
    { egzersizId: 'par-c-transfer', dakika: 10, tekrar: '3 geçiş' },
    { egzersizId: 'par-c-otur', dakika: 10, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-cilt', dakika: 10, tekrar: '2 bası molası' },
  ],
    seansNotu: 'İkinci kişi gerekebilir.',
  },
  {
    id: 'par-c-k6',
    ad: 'Oturma ve eklem',
    hedef: 'Dik duruş ve hareket açıklığı',
    plan: [
    { egzersizId: 'par-c-otur', dakika: 10, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-eklem', dakika: 10, tekrar: 'her eklem 6 tekrar' },
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
  ],
    seansNotu: 'Oturma kısa sürerse eklemi yatakta bitirin.',
  },
  {
    id: 'par-c-k7',
    ad: 'Hafif itme',
    hedef: 'Kalan kas ve nefes',
    plan: [
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
    { egzersizId: 'par-c-itme', dakika: 10, tekrar: '2 set, 6 itme' },
    { egzersizId: 'par-c-cilt', dakika: 10, tekrar: '2 bası molası' },
  ],
    seansNotu: 'Çalışmayan kasa direnç yok.',
  },
  {
    id: 'par-c-k8',
    ad: 'İtme ve oturma',
    hedef: 'İşlevsel kas ve denge',
    plan: [
    { egzersizId: 'par-c-itme', dakika: 10, tekrar: '2 set, 6 itme' },
    { egzersizId: 'par-c-otur', dakika: 10, tekrar: 'kısa dik oturma, yıkılınca mola' },
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
  ],
    seansNotu: 'Yorulunca oturma süresi kısalır.',
  },
  {
    id: 'par-c-k9',
    ad: 'Kas ve nefes',
    hedef: 'Kuvvet ile solunum arası',
    plan: [
    { egzersizId: 'par-c-itme', dakika: 10, tekrar: '2 set, 6 itme' },
    { egzersizId: 'par-c-nefes', dakika: 10, tekrar: 'bu sürede üfleme, aralarda mola' },
    { egzersizId: 'par-c-eklem', dakika: 10, tekrar: 'her eklem 6 tekrar' },
  ],
    seansNotu: 'İtme bloğundan sonra üfleme molası.',
  },
]

export const PARAPLEJI_YETISKIN_KOMBINASYON: Kombinasyon[] = [
  {
    id: 'par-y-k1',
    ad: 'Kuvvet ve aerobik',
    hedef: 'SCIRE temel doz',
    plan: [
    { egzersizId: 'par-y-kuvvet', dakika: 10, tekrar: '2 set, çalışan kas başına 8 tekrar' },
    { egzersizId: 'par-y-aero', dakika: 10, tekrar: 'kesintisiz kol çevirme veya itme' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Rehber kronik erişkin yaralanma içindir. İlk yıl, 65 yaş üstü ve ek hastalıkta hekime danışın.',
  },
  {
    id: 'par-y-k2',
    ad: 'Transfer ve germe',
    hedef: 'Yer değiştirme ve eklem',
    plan: [
    { egzersizId: 'par-y-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'par-y-transfer', dakika: 10, tekrar: '4 geçiş' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Transfer sayısı omuz ağrısına göre azalır.',
  },
  {
    id: 'par-y-k3',
    ad: 'Oturma dengesi',
    hedef: 'Gövde ve cilt',
    plan: [
    { egzersizId: 'par-y-govde', dakika: 8, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'par-y-kuvvet', dakika: 8, tekrar: '2 set, çalışan kas başına 8 tekrar' },
    { egzersizId: 'par-y-cilt', dakika: 7, tekrar: '2 bası molası öğretimi' },
    { egzersizId: 'par-y-germe', dakika: 7, tekrar: 'her bölge 3 kez, 20 saniye' },
  ],
    seansNotu: 'Denge bozulursa kollar destekte kalsın.',
  },
  {
    id: 'par-y-k4',
    ad: 'Germe ve cilt',
    hedef: 'Tam yaralanmada eklem ve bası',
    plan: [
    { egzersizId: 'par-y-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
    { egzersizId: 'par-y-govde', dakika: 10, tekrar: 'her yöne 8 tekrar' },
  ],
    seansNotu: 'Gövde yalnızca destekli oturmada.',
  },
  {
    id: 'par-y-k5',
    ad: 'Üst taraf kuvveti',
    hedef: 'Çalışan kaslar ve transfer',
    plan: [
    { egzersizId: 'par-y-kuvvet', dakika: 10, tekrar: '2 set, çalışan kas başına 8 tekrar' },
    { egzersizId: 'par-y-transfer', dakika: 10, tekrar: '4 geçiş' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Felçli bacağa direnç yok. Omuz ağrısında itmeyi azaltın.',
  },
  {
    id: 'par-y-k6',
    ad: 'Denge ve transfer',
    hedef: 'Oturma ile yer değiştirme',
    plan: [
    { egzersizId: 'par-y-govde', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'par-y-transfer', dakika: 10, tekrar: '4 geçiş' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Transfer sayısı omuz ağrısına göre azalır.',
  },
  {
    id: 'par-y-k7',
    ad: 'Kuvvet ve germe',
    hedef: 'Kalan kas ve eklem',
    plan: [
    { egzersizId: 'par-y-kuvvet', dakika: 10, tekrar: '2 set, çalışan kas başına 8 tekrar' },
    { egzersizId: 'par-y-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Önce germe, sonra kuvvet.',
  },
  {
    id: 'par-y-k8',
    ad: 'Aerobik ve denge',
    hedef: 'Dayanıklılık ve gövde',
    plan: [
    { egzersizId: 'par-y-aero', dakika: 10, tekrar: 'kesintisiz kol çevirme veya itme' },
    { egzersizId: 'par-y-govde', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'par-y-cilt', dakika: 10, tekrar: '2 bası molası öğretimi' },
  ],
    seansNotu: 'Aerobik konuşulabilir tempoda kalsın.',
  },
  {
    id: 'par-y-k9',
    ad: 'Kuvvet ve geçiş',
    hedef: 'Kas ile transfer',
    plan: [
    { egzersizId: 'par-y-kuvvet', dakika: 10, tekrar: '2 set, çalışan kas başına 8 tekrar' },
    { egzersizId: 'par-y-transfer', dakika: 10, tekrar: '4 geçiş' },
    { egzersizId: 'par-y-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
  ],
    seansNotu: 'SCIRE kuvvet dozu kronik erişkin içindir.',
  },
]
