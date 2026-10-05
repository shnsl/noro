import { WHO } from './kaynaklar'
import type { Egzersiz, Kombinasyon } from './tipler'

const cocuk: Egzersiz[] = [
  {
    id: 'hem-c-el',
    ad: 'Etkilenen elle oyun',
    hedef: 'Etkilenen üst ekstremiteyi işe katmak',
    pozisyon: 'Masa başı, çocuk oturur',
    adimlar: [
      'Oyuncağı etkilenen elin görebileceği yere koyun.',
      'Çocuk uzanıp kavrasın, sonra kutuya bıraksın.',
      'Sağlam el yalnızca oyuncak düşerse yardım etsin.',
    ],
    doz: 'Taslak: 8–12 bırakma, yorulunca mola.',
    onlem: 'Ağrı, omuz askısı ihtiyacı veya ihmal varsa zorlamayın.',
    kaynak: WHO,
  },
  {
    id: 'hem-c-iki',
    ad: 'İki elle tutma',
    hedef: 'İki eli birlikte kullanmak',
    pozisyon: 'Oturma',
    adimlar: [
      'Topu veya kabı iki elle kavratın.',
      'Göğüs hizasından masaya, sonra tekrar yukarı taşıyın.',
      'Etkilenen el kayarsa tutuşu düzeltin, hareketi küçültün.',
    ],
    doz: 'Taslak: 6–10 taşıma.',
    onlem: 'Omuz ağrısında hareketi kısaltın.',
    kaynak: WHO,
  },
  {
    id: 'hem-c-yuru',
    ad: 'Kısa yürüyüş oyunu',
    hedef: 'Etkilenen bacakla adım',
    pozisyon: 'Ayakta, gerekirse tek el destek',
    adimlar: [
      'Yere renkli işaret koyun.',
      'Çocuk işaretten işarete adım atsın.',
      'Etkilenen ayağın yere basmasını bekleyin.',
    ],
    doz: 'Taslak: 2–4 kısa tur, düşme riski yoksa.',
    onlem: 'Denge yetersizse paralel bar veya el tutuşu kullanın.',
    kaynak: WHO,
  },
  {
    id: 'hem-c-denge',
    ad: 'Oturarak uzanma',
    hedef: 'Oturma dengesi',
    pozisyon: 'Desteksiz oturma, gerekirse arkadan destek',
    adimlar: [
      'Oyuncağı öne, sonra yanlara koyun.',
      'Çocuk gövdesini oynatmadan uzansın.',
      'Dönerse mesafeyi kısaltın.',
    ],
    doz: 'Taslak: her yöne 5 uzanma.',
    onlem: 'Düşme riskinde bir kişi arkada durur.',
    kaynak: WHO,
  },
  {
    id: 'hem-c-germe',
    ad: 'Nazik eklem gezdirme',
    hedef: 'Omuz, dirsek, bilek ve ayak bileği hareketi',
    pozisyon: 'Sırtüstü, rahat',
    adimlar: [
      'Eklemi ağrısız açıklıkta yavaş gezdirin.',
      'Çocuk kasını kasarsa bekleyin, zorlamayın.',
      'Her eklemde birkaç tekrar yeter.',
    ],
    doz: 'Taslak: her eklem 5–8 yavaş tekrar.',
    onlem: 'Omuz subluksasyonu şüphesinde kolu askıya alın, yukarı zorlamayın.',
    kaynak: WHO,
  },
  {
    id: 'hem-c-nefes',
    ad: 'Üfleme molası',
    hedef: 'Nefes ve yorgunluk arası',
    pozisyon: 'Oturma',
    adimlar: [
      'Tüy veya kağıt parçası üfletin.',
      'Üç nefesten sonra işe dönün.',
      'Baş dönmesi olursa durun.',
    ],
    doz: 'Taslak: işler arasında 4–6 nefes.',
    onlem: 'Hiperventilasyon yapmayın.',
    kaynak: WHO,
  },
]

const yetiskin: Egzersiz[] = [
  {
    id: 'hem-y-kol',
    ad: 'Görev odaklı kol',
    hedef: 'Etkilenen kolla günlük iş',
    pozisyon: 'Masa başı oturma',
    adimlar: [
      'Bardağı etkilenen elle kavrayın.',
      'Masadan ağza doğru kaldırıp yerine bırakın.',
      'Kavrama olmazsa daha hafif bir nesne seçin.',
    ],
    doz: 'Taslak: 8–12 tekrar, 1–2 set.',
    onlem: 'Omuz ağrısı veya subluksasyonda yük bindirmeyin.',
    kaynak: WHO,
  },
  {
    id: 'hem-y-otur',
    ad: 'Oturarak ağırlık aktarma',
    hedef: 'Gövde dengesi',
    pozisyon: 'Yatak kenarı veya sandalye',
    adimlar: [
      'Eller dizde, gövdeyi sağa ve sola eğin.',
      'Etkilenen kalçaya güvenli yük verin.',
      'Düşecek gibi olursa hareketi küçültün.',
    ],
    doz: 'Taslak: her yöne 8 tekrar.',
    onlem: 'Arkada destek olsun.',
    kaynak: WHO,
  },
  {
    id: 'hem-y-yuru',
    ad: 'Yürüme çalışması',
    hedef: 'Adım uzunluğu ve topuk vuruşu',
    pozisyon: 'Ayakta, gerekirse yürüteç',
    adimlar: [
      'Düz ve engelsiz bir hat seçin.',
      'Etkilenen topuğun yere değmesini bekleyin.',
      'Yorulunca oturarak dinlenin.',
    ],
    doz: 'Taslak: 2–5 dakika, tolere edildiği kadar.',
    onlem: 'Yeni düşme, baş dönmesi veya göğüs ağrısında durun.',
    kaynak: WHO,
  },
  {
    id: 'hem-y-kuvvet',
    ad: 'Ağrısız kuvvet',
    hedef: 'Etkilenen taraf kasları',
    pozisyon: 'Oturma',
    adimlar: [
      'Dirsek bükme ve diz açmayı kendi gücüyle yaptırın.',
      'Hareket bitmiyorsa yalnızca görülen açıklıkta tekrarlayın.',
      'Nefesi tutmayın.',
    ],
    doz: 'Taslak: 8–10 tekrar, 1–2 set.',
    onlem: 'Ağrı ılımlının üstüne çıkarsa seti kesin.',
    kaynak: WHO,
  },
  {
    id: 'hem-y-ayak',
    ad: 'Ayakta ağırlık aktarma',
    hedef: 'Etkilenen bacağa yük',
    pozisyon: 'Ayakta, bir el destek',
    adimlar: [
      'Ağırlığı sağlam bacaktan etkilenen bacağa kaydırın.',
      'Diz kilitlenmesin, hafif yumuşak kalsın.',
      'Her iki yana küçük adım ekleyin.',
    ],
    doz: 'Taslak: 8–10 aktarma.',
    onlem: 'Tek başına ayakta duramıyorsa bu işi atlayın.',
    kaynak: WHO,
  },
  {
    id: 'hem-y-gunluk',
    ad: 'Günlük iş tekrarı',
    hedef: 'Giyinme veya mutfak hareketi',
    pozisyon: 'Kişinin kendi ortamı',
    adimlar: [
      'Tek bir iş seçin: düğme, bardak veya havlu.',
      'Aynı işi yavaş ve aynı sırayla tekrarlayın.',
      'Bitince nasıl kolaylaştığını not edin.',
    ],
    doz: 'Taslak: 5–8 tekrar.',
    onlem: 'Yorgunluk çabuk artıyorsa işi bölün.',
    kaynak: WHO,
  },
]

export const HEMIPLEJI_COCUK_EGZERSIZ = cocuk
export const HEMIPLEJI_YETISKIN_EGZERSIZ = yetiskin

export const HEMIPLEJI_COCUK_KOMBINASYON: Kombinasyon[] = [
  {
    id: 'hem-c-k1',
    ad: 'El oyunu',
    hedef: 'Etkilenen eli işe katmak',
    plan: [
    { egzersizId: 'hem-c-el', dakika: 10, tekrar: '2 set, 8 bırakma' },
    { egzersizId: 'hem-c-iki', dakika: 10, tekrar: '2 set, 6 taşıma' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Oyun bitince üfleme molası verin.',
  },
  {
    id: 'hem-c-k2',
    ad: 'Yürüme oyunu',
    hedef: 'Kısa ve güvenli adım',
    plan: [
    { egzersizId: 'hem-c-germe', dakika: 8, tekrar: 'her eklem 6 yavaş tekrar' },
    { egzersizId: 'hem-c-yuru', dakika: 8, tekrar: '2 tur, tur arası oturma' },
    { egzersizId: 'hem-c-denge', dakika: 7, tekrar: 'her yöne 6 uzanma' },
    { egzersizId: 'hem-c-nefes', dakika: 7, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Önce eklem, sonra adım, en sonda oturma.',
  },
  {
    id: 'hem-c-k3',
    ad: 'Denge ve mola',
    hedef: 'Oturma ve yorgunluk',
    plan: [
    { egzersizId: 'hem-c-denge', dakika: 10, tekrar: 'her yöne 6 uzanma' },
    { egzersizId: 'hem-c-iki', dakika: 10, tekrar: '2 set, 6 taşıma' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Düşme riski yüksekse yalnızca oturma işleri kalsın.',
  },
  {
    id: 'hem-c-k4',
    ad: 'Pozisyon ve nefes',
    hedef: 'Erken evrede eklem ve solunum',
    plan: [
    { egzersizId: 'hem-c-germe', dakika: 10, tekrar: 'her eklem 6 yavaş tekrar' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
    { egzersizId: 'hem-c-denge', dakika: 10, tekrar: 'her yöne 6 uzanma' },
  ],
    seansNotu: 'Ayakta durma yok. Denge yalnızca destekli oturmada.',
  },
  {
    id: 'hem-c-k5',
    ad: 'İki elle oturma',
    hedef: 'Yük bindirmeden iki el',
    plan: [
    { egzersizId: 'hem-c-iki', dakika: 10, tekrar: '2 set, 6 taşıma' },
    { egzersizId: 'hem-c-germe', dakika: 10, tekrar: 'her eklem 6 yavaş tekrar' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Yürüme oyunu bu evrede yok.',
  },
  {
    id: 'hem-c-k6',
    ad: 'Sinergi ve oturma',
    hedef: 'Birlikte hareket ve denge',
    plan: [
    { egzersizId: 'hem-c-el', dakika: 10, tekrar: '2 set, 8 bırakma' },
    { egzersizId: 'hem-c-denge', dakika: 10, tekrar: 'her yöne 6 uzanma' },
    { egzersizId: 'hem-c-iki', dakika: 10, tekrar: '2 set, 6 taşıma' },
  ],
    seansNotu: 'Hareket sinergiden çıkmaya zorlanmaz.',
  },
  {
    id: 'hem-c-k7',
    ad: 'El ve eklem',
    hedef: 'Oyun ile hareket açıklığı',
    plan: [
    { egzersizId: 'hem-c-el', dakika: 10, tekrar: '2 set, 8 bırakma' },
    { egzersizId: 'hem-c-germe', dakika: 10, tekrar: 'her eklem 6 yavaş tekrar' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Oyun bitince eklem gezdirmesi.',
  },
  {
    id: 'hem-c-k8',
    ad: 'Adım ve el',
    hedef: 'Yürüme ile elin birlikte kullanımı',
    plan: [
    { egzersizId: 'hem-c-yuru', dakika: 10, tekrar: '2 tur, tur arası oturma' },
    { egzersizId: 'hem-c-el', dakika: 10, tekrar: '2 set, 8 bırakma' },
    { egzersizId: 'hem-c-nefes', dakika: 10, tekrar: 'bu sürede yavaş nefes, aralarda mola' },
  ],
    seansNotu: 'Adım bozulursa eli oturarak çalışın.',
  },
  {
    id: 'hem-c-k9',
    ad: 'Denge yürüyüşü',
    hedef: 'Oturma dengesi ve kısa adım',
    plan: [
    { egzersizId: 'hem-c-denge', dakika: 10, tekrar: 'her yöne 6 uzanma' },
    { egzersizId: 'hem-c-yuru', dakika: 10, tekrar: '2 tur, tur arası oturma' },
    { egzersizId: 'hem-c-iki', dakika: 10, tekrar: '2 set, 6 taşıma' },
  ],
    seansNotu: 'Önce oturma, sonra işaretler arası adım.',
  },
]

export const HEMIPLEJI_YETISKIN_KOMBINASYON: Kombinasyon[] = [
  {
    id: 'hem-y-k1',
    ad: 'Kol ve denge',
    hedef: 'Üst taraf ve oturma',
    plan: [
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-otur', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'hem-y-kuvvet', dakika: 10, tekrar: '2 set, 8 tekrar' },
  ],
    seansNotu: 'Omuz ağrısı varsa kuvvet setini çıkarın.',
  },
  {
    id: 'hem-y-k2',
    ad: 'Yürüme',
    hedef: 'Ayakta duruş ve adım',
    plan: [
    { egzersizId: 'hem-y-ayak', dakika: 8, tekrar: '8 ağırlık aktarma' },
    { egzersizId: 'hem-y-yuru', dakika: 8, tekrar: 'yürüme, kalan süre oturma molası' },
    { egzersizId: 'hem-y-otur', dakika: 7, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'hem-y-gunluk', dakika: 7, tekrar: '6 tekrar, tek bir iş' },
  ],
    seansNotu: 'Yürüme dakikasını düşme öyküsüne göre kısaltın.',
  },
  {
    id: 'hem-y-k3',
    ad: 'Günlük iş',
    hedef: 'Ev içi tekrar',
    plan: [
    { egzersizId: 'hem-y-gunluk', dakika: 10, tekrar: '6 tekrar, tek bir iş' },
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-kuvvet', dakika: 10, tekrar: '2 set, 8 tekrar' },
  ],
    seansNotu: 'Tek bir günlük iş seçmek yeter.',
  },
  {
    id: 'hem-y-k4',
    ad: 'Oturma ve kol',
    hedef: 'Flask evrede ayakta durmadan kol',
    plan: [
    { egzersizId: 'hem-y-otur', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-gunluk', dakika: 10, tekrar: '6 tekrar, tek bir iş' },
  ],
    seansNotu: 'Yürüme ve ayakta yük bu evrede yok.',
  },
  {
    id: 'hem-y-k5',
    ad: 'Ağrısız tekrar',
    hedef: 'Oturarak kuvvet ve kol',
    plan: [
    { egzersizId: 'hem-y-kuvvet', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-otur', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
  ],
    seansNotu: 'Ağrı artarsa yalnızca oturma dengesi kalsın.',
  },
  {
    id: 'hem-y-k6',
    ad: 'Görev ve denge',
    hedef: 'Günlük iş ile gövde',
    plan: [
    { egzersizId: 'hem-y-gunluk', dakika: 10, tekrar: '6 tekrar, tek bir iş' },
    { egzersizId: 'hem-y-otur', dakika: 10, tekrar: 'her yöne 8 tekrar' },
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
  ],
    seansNotu: 'Sinergi dışına çıkan hareket zorlanmaz.',
  },
  {
    id: 'hem-y-k7',
    ad: 'Kuvvet ve iş',
    hedef: 'Seçici harekete hazırlık',
    plan: [
    { egzersizId: 'hem-y-kuvvet', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-gunluk', dakika: 10, tekrar: '6 tekrar, tek bir iş' },
    { egzersizId: 'hem-y-otur', dakika: 10, tekrar: 'her yöne 8 tekrar' },
  ],
    seansNotu: 'Tek bir ev işi seçin, seti bölün.',
  },
  {
    id: 'hem-y-k8',
    ad: 'Adım ve kol',
    hedef: 'Yürüme ile üst ekstremite',
    plan: [
    { egzersizId: 'hem-y-yuru', dakika: 10, tekrar: 'yürüme, kalan süre oturma molası' },
    { egzersizId: 'hem-y-kol', dakika: 10, tekrar: '2 set, 8 tekrar' },
    { egzersizId: 'hem-y-ayak', dakika: 10, tekrar: '8 ağırlık aktarma' },
  ],
    seansNotu: 'Yürüme yorulunca kola oturarak dönün.',
  },
  {
    id: 'hem-y-k9',
    ad: 'Günlük yürüyüş',
    hedef: 'İş ve adım birlikte',
    plan: [
    { egzersizId: 'hem-y-gunluk', dakika: 10, tekrar: '6 tekrar, tek bir iş' },
    { egzersizId: 'hem-y-yuru', dakika: 10, tekrar: 'yürüme, kalan süre oturma molası' },
    { egzersizId: 'hem-y-kuvvet', dakika: 10, tekrar: '2 set, 8 tekrar' },
  ],
    seansNotu: 'Önce iş, sonra kısa yürüyüş.',
  },
]
