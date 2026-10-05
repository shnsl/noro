import { DMD_KAYNAK } from './kaynaklar'
import type { Egzersiz, Kombinasyon } from './tipler'

export const DMD_EGZERSIZ: Egzersiz[] = [
  {
    id: 'dmd-aero',
    ad: 'Hafif aerobik',
    hedef: 'Yormadan hareket',
    pozisyon: 'Su veya destekli bisiklet',
    adimlar: [
      'Yüzme veya destekli çevirme seçin.',
      'Tempo konuşmayı bozmasın.',
      'Yorulma, ağrı veya krampta hemen durun.',
    ],
    doz: 'Taslak: tolere edilen süre, sık mola. Ağır direnç yok.',
    onlem: 'Eksantrik ve yüksek dirençli kuvvet yasaktır. Kalp değerlendirmesi olmadan tempolu işe başlamayın.',
    kaynak: DMD_KAYNAK,
  },
  {
    id: 'dmd-germe',
    ad: 'Nazik germe',
    hedef: 'Ayak bileği, diz ve kalça',
    pozisyon: 'Sırtüstü veya oturma',
    adimlar: [
      'Ayak bileğini yavaşça yukarı çekin.',
      'Diz arkası ve kalça önünü ağrısız tutun.',
      'Zıplama olursa açıyı azaltın.',
    ],
    doz: 'Taslak: her bölge 20–30 saniye, günde birkaç kez düşünülebilir.',
    onlem: 'Kırık veya akut ağrıda germeyin.',
    kaynak: DMD_KAYNAK,
  },
  {
    id: 'dmd-oyun',
    ad: 'Dirençsiz oyun',
    hedef: 'Aktif hareket, yük yok',
    pozisyon: 'Oturma veya ayakta, çocuğun dönemine göre',
    adimlar: [
      'Hafif top, boyama veya masa oyunu seçin.',
      'Çocuk kendi kaldırabildiği kadar kaldırsın.',
      'Ağırlık, lastik ve yokuş eklemeyin.',
    ],
    doz: 'Taslak: keyif sürdüğü süre, yorgunlukta bırakın.',
    onlem: 'Ertesi gün artan ağrı varsa bir sonraki seansı kısaltın.',
    kaynak: DMD_KAYNAK,
  },
  {
    id: 'dmd-mola',
    ad: 'Enerji molası',
    hedef: 'Aşırı yorgunluğu kesmek',
    pozisyon: 'Oturma veya yatma',
    adimlar: [
      'İş bitince sırtı destekleyin.',
      'Nefes normale dönene kadar bekleyin.',
      'Aynı gün ikinci bir yorucu iş planlamayın.',
    ],
    doz: 'Taslak: her iş bloğundan sonra dinlenme.',
    onlem: 'Nefes darlığı veya çarpıntı geçmiyorsa seansı sonlandırın.',
    kaynak: DMD_KAYNAK,
  },
  {
    id: 'dmd-nefes',
    ad: 'Nefes çalışması',
    hedef: 'Solunum kaslarına nazik uyarı',
    pozisyon: 'Dik oturma',
    adimlar: [
      'Yavaş burundan alıp ağızdan verin.',
      'Üfleme oyunu kullanın, baş dönene kadar değil.',
      'Öksürük zayıfsa bunu ayrıca değerlendirin.',
    ],
    doz: 'Taslak: 5–8 sakin nefes.',
    onlem: 'Baş dönmesi veya göğüs ağrısında durun.',
    kaynak: DMD_KAYNAK,
  },
  {
    id: 'dmd-durus',
    ad: 'Destekli duruş',
    hedef: 'Ayakta pozisyon, yük bindirmeden',
    pozisyon: 'Ayakta durma cihazı veya iki kişi desteği',
    adimlar: [
      'Ayaklar desteklensin, dizler kilitlenmeye zorlanmasın.',
      'Kısa süre dik durun, sohbet ederek.',
      'Rahatsızlık olursa hemen oturtun.',
    ],
    doz: 'Taslak: tolere edilen birkaç dakika.',
    onlem: 'Kontraktür veya kırık riski yüksekse cihazı buna göre seçin. Ayakta durma bir kuvvet antrenmanı değildir.',
    kaynak: DMD_KAYNAK,
  },
]

export const DMD_KOMBINASYON: Kombinasyon[] = [
  {
    id: 'dmd-k1',
    ad: 'Hafif aerobik',
    hedef: 'Yormadan dayanıklılık',
    plan: [
    { egzersizId: 'dmd-aero', dakika: 10, tekrar: 'konuşulabilir tempo, yorulunca dur' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
    { egzersizId: 'dmd-nefes', dakika: 10, tekrar: '6 sakin nefes' },
  ],
    seansNotu: 'Tempo konuşulabilir kalsın. Ağır direnç eklemeyin.',
  },
  {
    id: 'dmd-k2',
    ad: 'Germe ve nefes',
    hedef: 'Eklem ve solunum',
    plan: [
    { egzersizId: 'dmd-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'dmd-nefes', dakika: 10, tekrar: '6 sakin nefes' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Germe yavaştır, zıplatmayın.',
  },
  {
    id: 'dmd-k3',
    ad: 'Oyun ve duruş',
    hedef: 'Katılım ve pozisyon',
    plan: [
    { egzersizId: 'dmd-oyun', dakika: 8, tekrar: 'yük yok, keyif sürdükçe' },
    { egzersizId: 'dmd-durus', dakika: 8, tekrar: 'kısa dik duruş, sonra otur' },
    { egzersizId: 'dmd-mola', dakika: 7, tekrar: 'sırt destekli dinlenme' },
    { egzersizId: 'dmd-germe', dakika: 7, tekrar: 'her bölge 3 kez, 20 saniye' },
  ],
    seansNotu: 'Çocuk yorulursa duruşu atlayın.',
  },
  {
    id: 'dmd-k4',
    ad: 'Oyunlu aerobik',
    hedef: 'Yük olmadan oyun ve dayanıklılık',
    plan: [
    { egzersizId: 'dmd-oyun', dakika: 10, tekrar: 'yük yok, keyif sürdükçe' },
    { egzersizId: 'dmd-aero', dakika: 10, tekrar: 'konuşulabilir tempo, yorulunca dur' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Ağır top ve yokuş yok.',
  },
  {
    id: 'dmd-k5',
    ad: 'Aerobik ve germe',
    hedef: 'Hafif tempo ve eklem',
    plan: [
    { egzersizId: 'dmd-aero', dakika: 10, tekrar: 'konuşulabilir tempo, yorulunca dur' },
    { egzersizId: 'dmd-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Önce germe, sonra yüzme veya çevirme.',
  },
  {
    id: 'dmd-k6',
    ad: 'Oyun ve germe',
    hedef: 'Yürüme zorlaşınca katılım',
    plan: [
    { egzersizId: 'dmd-oyun', dakika: 10, tekrar: 'yük yok, keyif sürdükçe' },
    { egzersizId: 'dmd-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Merdiven ve yokuş eklemeyin.',
  },
  {
    id: 'dmd-k7',
    ad: 'Duruş ve nefes',
    hedef: 'Kısa dik duruş',
    plan: [
    { egzersizId: 'dmd-durus', dakika: 10, tekrar: 'kısa dik duruş, sonra otur' },
    { egzersizId: 'dmd-nefes', dakika: 10, tekrar: '6 sakin nefes' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Duruş bir kuvvet işi değildir.',
  },
  {
    id: 'dmd-k8',
    ad: 'Oturarak germe',
    hedef: 'Yürüme yokken eklem',
    plan: [
    { egzersizId: 'dmd-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
    { egzersizId: 'dmd-oyun', dakika: 10, tekrar: 'yük yok, keyif sürdükçe' },
  ],
    seansNotu: 'Ayakta durma cihazı bu sette yok.',
  },
  {
    id: 'dmd-k9',
    ad: 'Nefes günü',
    hedef: 'Solunum ve nazik germe',
    plan: [
    { egzersizId: 'dmd-nefes', dakika: 10, tekrar: '6 sakin nefes' },
    { egzersizId: 'dmd-germe', dakika: 10, tekrar: 'her bölge 3 kez, 20 saniye' },
    { egzersizId: 'dmd-mola', dakika: 10, tekrar: 'sırt destekli dinlenme' },
  ],
    seansNotu: 'Üfleme baş döndürmesin.',
  },
]
