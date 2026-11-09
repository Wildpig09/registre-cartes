/*
 * Données de DÉMONSTRATION (fictives) — fichier généré par outils/generer-donnees-demo.js.
 * Les noms de clubs sont réels (https://frso.be/les-clubs/) ; tout le reste est inventé :
 * cartes, numéros de cadastre, contours (approximatifs), contacts, cartographes.
 * Les périodes d'accès sont au format "JJ-MM" (jour-mois), répétées chaque année.
 */
window.DONNEES_DEMO = {
 "clubs": [
  {
   "id": "altair",
   "nom": "Altaïr",
   "abrev": "ALT",
   "site": "https://www.altair-co.be/"
  },
  {
   "id": "ardoc",
   "nom": "ARDOC",
   "abrev": "ARDOC",
   "site": "https://www.ardoc.be/"
  },
  {
   "id": "asub",
   "nom": "ASUB Orientation",
   "abrev": "ASUB",
   "site": "https://www.asub-orientation.org/"
  },
  {
   "id": "balise10",
   "nom": "Balise 10",
   "abrev": "B10",
   "site": "http://www.balise10.be/"
  },
  {
   "id": "coliege",
   "nom": "CO Liège",
   "abrev": "COL",
   "site": "https://www.coliege.be/"
  },
  {
   "id": "comb",
   "nom": "CO Militaire Belge",
   "abrev": "COMB",
   "site": "https://sites.google.com/site/comilitairebelge/"
  },
  {
   "id": "herma",
   "nom": "HERMA",
   "abrev": "HERMA",
   "site": "http://www.herma-co.be/"
  },
  {
   "id": "hoc",
   "nom": "HOC",
   "abrev": "HOC",
   "site": "http://hoc-net.be/"
  },
  {
   "id": "lost",
   "nom": "LOST",
   "abrev": "LOST",
   "site": "https://www.lostorientation.be/"
  },
  {
   "id": "olveifel",
   "nom": "OLV Eifel",
   "abrev": "OLV",
   "site": "https://www.olv-eifel.be/"
  },
  {
   "id": "pegase",
   "nom": "Pégase CO",
   "abrev": "PEG",
   "site": "https://www.xn--pgaseco-bya.be/"
  },
  {
   "id": "sudolux",
   "nom": "Sudolux",
   "abrev": "SUD",
   "site": "http://sudolux.be/"
  },
  {
   "id": "thor",
   "nom": "ThOR",
   "abrev": "THOR",
   "site": "https://www.thor-sport.be/"
  }
 ],
 "cartes": [
  {
   "id": "c001",
   "cadastre": 1000,
   "nom": "Forêt de Soignes – Boitsfort",
   "clubId": "asub",
   "commune": "Watermael-Boitsfort",
   "province": "BRU",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 1998,
   "anneeMaj": 2019,
   "cartographe": "J. Dumont",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt de Soignes – Boitsfort.",
    "nl": "Demokaart – Forêt de Soignes – Boitsfort."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Sophie Fictif",
    "email": "cartes@asub.example",
    "telephone": "+32 470 00 10 12"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.41396,
       50.80051
      ],
      [
       4.40212,
       50.79727
      ],
      [
       4.39308,
       50.794
      ],
      [
       4.39355,
       50.78998
      ],
      [
       4.39308,
       50.7848
      ],
      [
       4.40884,
       50.78418
      ],
      [
       4.42305,
       50.78482
      ],
      [
       4.43251,
       50.78828
      ],
      [
       4.43576,
       50.79209
      ],
      [
       4.4403,
       50.7969
      ],
      [
       4.42986,
       50.80039
      ],
      [
       4.41396,
       50.80051
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c002",
   "cadastre": 1038,
   "nom": "Bois de la Cambre",
   "clubId": "asub",
   "commune": "Bruxelles",
   "province": "BRU",
   "type": "parc",
   "echelle": 7500,
   "equidistance": 2.5,
   "anneeCreation": 2005,
   "anneeMaj": 2022,
   "cartographe": "M. Lambert",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Sophie Exemple",
    "email": "cartes@asub.example",
    "telephone": "+32 470 00 11 12"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.37862,
       50.81284
      ],
      [
       4.37528,
       50.81395
      ],
      [
       4.3715,
       50.81414
      ],
      [
       4.36899,
       50.81248
      ],
      [
       4.36562,
       50.81061
      ],
      [
       4.36744,
       50.8079
      ],
      [
       4.37003,
       50.80539
      ],
      [
       4.3747,
       50.80483
      ],
      [
       4.37773,
       50.80681
      ],
      [
       4.38111,
       50.80814
      ],
      [
       4.38011,
       50.81067
      ],
      [
       4.37862,
       50.81284
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c003",
   "cadastre": 1076,
   "nom": "Campus de la Plaine",
   "clubId": "asub",
   "commune": "Ixelles",
   "province": "BRU",
   "type": "ecole",
   "echelle": 2000,
   "equidistance": 2,
   "anneeCreation": 2016,
   "anneeMaj": 2016,
   "cartographe": "P. Peeters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Campus de la Plaine.",
    "nl": "Demokaart – Campus de la Plaine."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Sophie Démo",
    "email": "cartes@asub.example",
    "telephone": "+32 470 00 12 12"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.39854,
       50.82206
      ],
      [
       4.3967,
       50.82167
      ],
      [
       4.39553,
       50.82033
      ],
      [
       4.39534,
       50.81883
      ],
      [
       4.39572,
       50.81752
      ],
      [
       4.39624,
       50.81549
      ],
      [
       4.39848,
       50.81543
      ],
      [
       4.4004,
       50.81653
      ],
      [
       4.40129,
       50.81831
      ],
      [
       4.4016,
       50.8202
      ],
      [
       4.40037,
       50.82161
      ],
      [
       4.39854,
       50.82206
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c004",
   "cadastre": 1114,
   "nom": "Forêt de Soignes – Rouge-Cloître",
   "clubId": "comb",
   "commune": "Auderghem",
   "province": "BRU",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2003,
   "anneeMaj": 2018,
   "cartographe": "C. Dubois",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt de Soignes – Rouge-Cloître.",
    "nl": "Demokaart – Forêt de Soignes – Rouge-Cloître."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Pierre Modèle",
    "email": "cartes@comb.example",
    "telephone": "+32 470 00 13 15"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.43621,
       50.81245
      ],
      [
       4.4287,
       50.81346
      ],
      [
       4.42078,
       50.8126
      ],
      [
       4.41852,
       50.80839
      ],
      [
       4.42107,
       50.8044
      ],
      [
       4.42355,
       50.80008
      ],
      [
       4.43149,
       50.79926
      ],
      [
       4.43921,
       50.79875
      ],
      [
       4.44404,
       50.80176
      ],
      [
       4.44459,
       50.80575
      ],
      [
       4.44129,
       50.80933
      ],
      [
       4.43621,
       50.81245
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c005",
   "cadastre": 1152,
   "nom": "Parc de Laeken",
   "clubId": "comb",
   "commune": "Bruxelles",
   "province": "BRU",
   "type": "parc",
   "echelle": 5000,
   "equidistance": 2.5,
   "anneeCreation": 2010,
   "anneeMaj": 2020,
   "cartographe": "A. Janssens",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Parc de Laeken.",
    "nl": "Demokaart – Parc de Laeken."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Pierre Fictif",
    "email": "cartes@comb.example",
    "telephone": "+32 470 00 14 15"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.35554,
       50.89432
      ],
      [
       4.35047,
       50.89532
      ],
      [
       4.34987,
       50.89049
      ],
      [
       4.34948,
       50.8861
      ],
      [
       4.35324,
       50.88322
      ],
      [
       4.35664,
       50.88035
      ],
      [
       4.36152,
       50.87937
      ],
      [
       4.36277,
       50.88409
      ],
      [
       4.36501,
       50.88754
      ],
      [
       4.36262,
       50.89162
      ],
      [
       4.35937,
       50.89461
      ],
      [
       4.35554,
       50.89432
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c006",
   "cadastre": 1190,
   "nom": "Bois du Laerbeek",
   "clubId": "comb",
   "commune": "Jette",
   "province": "BRU",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2001,
   "anneeMaj": 2001,
   "cartographe": "L. Martin",
   "statut": "ancienne",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-02",
     "au": "31-03"
    },
    {
     "du": "01-06",
     "au": "15-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Pierre Exemple",
    "email": "cartes@comb.example",
    "telephone": "+32 470 00 15 15"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.30944,
       50.89294
      ],
      [
       4.30634,
       50.89439
      ],
      [
       4.30191,
       50.89328
      ],
      [
       4.29877,
       50.8922
      ],
      [
       4.29635,
       50.89057
      ],
      [
       4.29439,
       50.8883
      ],
      [
       4.29684,
       50.88679
      ],
      [
       4.30026,
       50.88635
      ],
      [
       4.30416,
       50.8865
      ],
      [
       4.30763,
       50.8882
      ],
      [
       4.30802,
       50.8904
      ],
      [
       4.30944,
       50.89294
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c007",
   "cadastre": 1228,
   "nom": "Louvain-la-Neuve centre",
   "clubId": "lost",
   "commune": "Ottignies-Louvain-la-Neuve",
   "province": "BW",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2008,
   "anneeMaj": 2023,
   "cartographe": "S. Wouters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Louvain-la-Neuve centre.",
    "nl": "Demokaart – Louvain-la-Neuve centre."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Nadia Démo",
    "email": "cartes@lost.example",
    "telephone": "+32 470 00 16 18"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.61931,
       50.67554
      ],
      [
       4.61491,
       50.67434
      ],
      [
       4.6107,
       50.67338
      ],
      [
       4.60673,
       50.67013
      ],
      [
       4.60677,
       50.66656
      ],
      [
       4.60801,
       50.664
      ],
      [
       4.61045,
       50.66176
      ],
      [
       4.61507,
       50.66385
      ],
      [
       4.6198,
       50.66584
      ],
      [
       4.62051,
       50.66973
      ],
      [
       4.6219,
       50.67345
      ],
      [
       4.61931,
       50.67554
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c008",
   "cadastre": 1266,
   "nom": "Bois de Lauzelle (1996)",
   "clubId": "lost",
   "commune": "Ottignies-Louvain-la-Neuve",
   "province": "BW",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 1996,
   "anneeMaj": 2009,
   "cartographe": "F. Leclercq",
   "statut": "ancienne",
   "remplaceePar": "c009",
   "description": {
    "fr": "Carte de démonstration – Bois de Lauzelle (1996).",
    "nl": "Demokaart – Bois de Lauzelle (1996)."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Nadia Modèle",
    "email": "cartes@lost.example",
    "telephone": "+32 470 00 17 18"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.58755,
       50.68694
      ],
      [
       4.58381,
       50.68381
      ],
      [
       4.58708,
       50.67884
      ],
      [
       4.5928,
       50.67516
      ],
      [
       4.59917,
       50.67279
      ],
      [
       4.60515,
       50.67289
      ],
      [
       4.60955,
       50.67485
      ],
      [
       4.61046,
       50.67882
      ],
      [
       4.60712,
       50.68356
      ],
      [
       4.59988,
       50.68552
      ],
      [
       4.59332,
       50.68802
      ],
      [
       4.58755,
       50.68694
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c009",
   "cadastre": 1304,
   "nom": "Bois de Lauzelle",
   "clubId": "lost",
   "commune": "Ottignies-Louvain-la-Neuve",
   "province": "BW",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2021,
   "anneeMaj": 2024,
   "cartographe": "H. Schmitz",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de Lauzelle.",
    "nl": "Demokaart – Bois de Lauzelle."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Nadia Fictif",
    "email": "cartes@lost.example",
    "telephone": "+32 470 00 18 18"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.61422,
       50.68127
      ],
      [
       4.6103,
       50.68571
      ],
      [
       4.60496,
       50.68889
      ],
      [
       4.59731,
       50.69122
      ],
      [
       4.59251,
       50.68644
      ],
      [
       4.58769,
       50.68316
      ],
      [
       4.58863,
       50.67853
      ],
      [
       4.59204,
       50.67447
      ],
      [
       4.5987,
       50.67323
      ],
      [
       4.60549,
       50.67358
      ],
      [
       4.61225,
       50.67607
      ],
      [
       4.61422,
       50.68127
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c010",
   "cadastre": 1342,
   "nom": "Bois des Rêves",
   "clubId": "lost",
   "commune": "Ottignies-Louvain-la-Neuve",
   "province": "BW",
   "type": "parc",
   "echelle": 7500,
   "equidistance": 2.5,
   "anneeCreation": 2012,
   "anneeMaj": 2019,
   "cartographe": "N. Renard",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Nadia Exemple",
    "email": "cartes@lost.example",
    "telephone": "+32 470 00 19 18"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.5904,
       50.6593
      ],
      [
       4.58991,
       50.66136
      ],
      [
       4.58529,
       50.66224
      ],
      [
       4.58073,
       50.66178
      ],
      [
       4.57647,
       50.66126
      ],
      [
       4.57507,
       50.65956
      ],
      [
       4.57289,
       50.6576
      ],
      [
       4.57692,
       50.65638
      ],
      [
       4.58125,
       50.65622
      ],
      [
       4.58595,
       50.65593
      ],
      [
       4.58879,
       50.65754
      ],
      [
       4.5904,
       50.6593
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c011",
   "cadastre": 1380,
   "nom": "Parc de la Dodaine",
   "clubId": "balise10",
   "commune": "Nivelles",
   "province": "BW",
   "type": "parc",
   "echelle": 5000,
   "equidistance": 2.5,
   "anneeCreation": 2014,
   "anneeMaj": 2021,
   "cartographe": "J. Dumont",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Parc de la Dodaine.",
    "nl": "Demokaart – Parc de la Dodaine."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Luc Démo",
    "email": "cartes@b10.example",
    "telephone": "+32 470 00 20 13"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.33147,
       50.59851
      ],
      [
       4.32806,
       50.5992
      ],
      [
       4.32587,
       50.59811
      ],
      [
       4.32447,
       50.59691
      ],
      [
       4.32335,
       50.59512
      ],
      [
       4.32721,
       50.59406
      ],
      [
       4.33014,
       50.59279
      ],
      [
       4.33344,
       50.59314
      ],
      [
       4.3363,
       50.59402
      ],
      [
       4.33509,
       50.59588
      ],
      [
       4.33427,
       50.59745
      ],
      [
       4.33147,
       50.59851
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c012",
   "cadastre": 1418,
   "nom": "Bois de la Houssière",
   "clubId": "balise10",
   "commune": "Braine-le-Comte",
   "province": "HAI",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 1999,
   "anneeMaj": 2017,
   "cartographe": "M. Lambert",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de la Houssière.",
    "nl": "Demokaart – Bois de la Houssière."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Luc Modèle",
    "email": "cartes@b10.example",
    "telephone": "+32 470 00 21 13"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.18798,
       50.62691
      ],
      [
       4.17755,
       50.63352
      ],
      [
       4.16606,
       50.63209
      ],
      [
       4.15991,
       50.62751
      ],
      [
       4.16,
       50.62115
      ],
      [
       4.16603,
       50.6147
      ],
      [
       4.17645,
       50.61048
      ],
      [
       4.18703,
       50.60935
      ],
      [
       4.19595,
       50.61092
      ],
      [
       4.19965,
       50.6158
      ],
      [
       4.19713,
       50.62211
      ],
      [
       4.18798,
       50.62691
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c013",
   "cadastre": 1456,
   "nom": "Bois de Colfontaine",
   "clubId": "altair",
   "commune": "Colfontaine",
   "province": "HAI",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 1995,
   "anneeMaj": 2016,
   "cartographe": "P. Peeters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de Colfontaine.",
    "nl": "Demokaart – Bois de Colfontaine."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Anne Fictif",
    "email": "cartes@alt.example",
    "telephone": "+32 470 00 22 10"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.85669,
       50.40854
      ],
      [
       3.84546,
       50.41323
      ],
      [
       3.8356,
       50.40969
      ],
      [
       3.83329,
       50.40387
      ],
      [
       3.83083,
       50.39825
      ],
      [
       3.83644,
       50.39186
      ],
      [
       3.84824,
       50.38989
      ],
      [
       3.86151,
       50.38667
      ],
      [
       3.87204,
       50.39085
      ],
      [
       3.87586,
       50.39812
      ],
      [
       3.8698,
       50.40578
      ],
      [
       3.85669,
       50.40854
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c014",
   "cadastre": 1494,
   "nom": "Mons centre",
   "clubId": "altair",
   "commune": "Mons",
   "province": "HAI",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2015,
   "anneeMaj": 2024,
   "cartographe": "C. Dubois",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Anne Exemple",
    "email": "cartes@alt.example",
    "telephone": "+32 470 00 23 10"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.95185,
       50.45713
      ],
      [
       3.94684,
       50.45739
      ],
      [
       3.94371,
       50.45552
      ],
      [
       3.94252,
       50.4532
      ],
      [
       3.94648,
       50.4517
      ],
      [
       3.94981,
       50.45033
      ],
      [
       3.95459,
       50.45036
      ],
      [
       3.95916,
       50.45141
      ],
      [
       3.95866,
       50.4537
      ],
      [
       3.95973,
       50.45576
      ],
      [
       3.95704,
       50.45775
      ],
      [
       3.95185,
       50.45713
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c015",
   "cadastre": 1532,
   "nom": "Bois d'Havré",
   "clubId": "altair",
   "commune": "Mons",
   "province": "HAI",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2006,
   "anneeMaj": 2006,
   "cartographe": "A. Janssens",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois d'Havré.",
    "nl": "Demokaart – Bois d'Havré."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "15-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Anne Démo",
    "email": "cartes@alt.example",
    "telephone": "+32 470 00 24 10"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.05344,
       50.46571
      ],
      [
       4.04802,
       50.46706
      ],
      [
       4.04256,
       50.46874
      ],
      [
       4.03506,
       50.4662
      ],
      [
       4.02783,
       50.46357
      ],
      [
       4.02743,
       50.4601
      ],
      [
       4.02585,
       50.45603
      ],
      [
       4.03419,
       50.45599
      ],
      [
       4.04147,
       50.45673
      ],
      [
       4.04867,
       50.45888
      ],
      [
       4.05543,
       50.46238
      ],
      [
       4.05344,
       50.46571
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c016",
   "cadastre": 1570,
   "nom": "Forêt de Bon-Secours",
   "clubId": "hoc",
   "commune": "Péruwelz",
   "province": "HAI",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 1997,
   "anneeMaj": 2021,
   "cartographe": "L. Martin",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt de Bon-Secours.",
    "nl": "Demokaart – Forêt de Bon-Secours."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Thomas Modèle",
    "email": "cartes@hoc.example",
    "telephone": "+32 470 00 25 17"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.60309,
       50.49645
      ],
      [
       3.60519,
       50.49002
      ],
      [
       3.61044,
       50.48446
      ],
      [
       3.61989,
       50.48118
      ],
      [
       3.62886,
       50.48535
      ],
      [
       3.63479,
       50.49047
      ],
      [
       3.63356,
       50.49658
      ],
      [
       3.63393,
       50.50368
      ],
      [
       3.62406,
       50.50462
      ],
      [
       3.61528,
       50.50646
      ],
      [
       3.60698,
       50.50278
      ],
      [
       3.60309,
       50.49645
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c017",
   "cadastre": 1608,
   "nom": "Tournai centre",
   "clubId": "hoc",
   "commune": "Tournai",
   "province": "HAI",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2017,
   "anneeMaj": 2022,
   "cartographe": "S. Wouters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Tournai centre.",
    "nl": "Demokaart – Tournai centre."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Thomas Fictif",
    "email": "cartes@hoc.example",
    "telephone": "+32 470 00 26 17"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.39102,
       50.60953
      ],
      [
       3.38648,
       50.61089
      ],
      [
       3.38302,
       50.60924
      ],
      [
       3.38059,
       50.60725
      ],
      [
       3.38168,
       50.60471
      ],
      [
       3.38546,
       50.60328
      ],
      [
       3.38896,
       50.60143
      ],
      [
       3.39361,
       50.60176
      ],
      [
       3.3952,
       50.60402
      ],
      [
       3.39793,
       50.60606
      ],
      [
       3.39434,
       50.60812
      ],
      [
       3.39102,
       50.60953
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c018",
   "cadastre": 1646,
   "nom": "Bois de la Houppe",
   "clubId": "hoc",
   "commune": "Flobecq",
   "province": "HAI",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2025,
   "anneeMaj": null,
   "cartographe": "F. Leclercq",
   "statut": "projet",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Thomas Exemple",
    "email": "cartes@hoc.example",
    "telephone": "+32 470 00 27 17"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.73123,
       50.74112
      ],
      [
       3.72047,
       50.74145
      ],
      [
       3.71524,
       50.73858
      ],
      [
       3.71669,
       50.73543
      ],
      [
       3.71599,
       50.73221
      ],
      [
       3.72456,
       50.73029
      ],
      [
       3.73357,
       50.72929
      ],
      [
       3.74108,
       50.73061
      ],
      [
       3.74536,
       50.73299
      ],
      [
       3.74773,
       50.73626
      ],
      [
       3.7413,
       50.73953
      ],
      [
       3.73123,
       50.74112
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c019",
   "cadastre": 1684,
   "nom": "Thuin ville haute",
   "clubId": "thor",
   "commune": "Thuin",
   "province": "HAI",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2013,
   "anneeMaj": 2020,
   "cartographe": "H. Schmitz",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Thuin ville haute.",
    "nl": "Demokaart – Thuin ville haute."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Elise Démo",
    "email": "cartes@thor.example",
    "telephone": "+32 470 00 28 22"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.2861,
       50.34241
      ],
      [
       4.28347,
       50.34261
      ],
      [
       4.28313,
       50.3402
      ],
      [
       4.28278,
       50.3379
      ],
      [
       4.28503,
       50.33653
      ],
      [
       4.28688,
       50.33489
      ],
      [
       4.28939,
       50.33487
      ],
      [
       4.29155,
       50.33621
      ],
      [
       4.29104,
       50.33886
      ],
      [
       4.29093,
       50.34151
      ],
      [
       4.28861,
       50.34352
      ],
      [
       4.2861,
       50.34241
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c020",
   "cadastre": 1722,
   "nom": "Lacs de l'Eau d'Heure",
   "clubId": "thor",
   "commune": "Cerfontaine",
   "province": "NAM",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2002,
   "anneeMaj": 2018,
   "cartographe": "N. Renard",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Lacs de l'Eau d'Heure.",
    "nl": "Demokaart – Lacs de l'Eau d'Heure."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Elise Modèle",
    "email": "cartes@thor.example",
    "telephone": "+32 470 00 29 22"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.37147,
       50.20539
      ],
      [
       4.36137,
       50.19928
      ],
      [
       4.35437,
       50.19506
      ],
      [
       4.34829,
       50.18898
      ],
      [
       4.35225,
       50.18182
      ],
      [
       4.3629,
       50.17804
      ],
      [
       4.37505,
       50.17682
      ],
      [
       4.38683,
       50.18004
      ],
      [
       4.39228,
       50.18717
      ],
      [
       4.39151,
       50.19495
      ],
      [
       4.38091,
       50.199
      ],
      [
       4.37147,
       50.20539
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c021",
   "cadastre": 1760,
   "nom": "Bois de Rance",
   "clubId": "thor",
   "commune": "Sivry-Rance",
   "province": "HAI",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2009,
   "anneeMaj": 2015,
   "cartographe": "J. Dumont",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de Rance.",
    "nl": "Demokaart – Bois de Rance."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Elise Fictif",
    "email": "cartes@thor.example",
    "telephone": "+32 470 00 30 22"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.25172,
       50.14819
      ],
      [
       4.2534,
       50.1418
      ],
      [
       4.25885,
       50.13693
      ],
      [
       4.26453,
       50.13209
      ],
      [
       4.27487,
       50.12807
      ],
      [
       4.28487,
       50.12971
      ],
      [
       4.28617,
       50.13565
      ],
      [
       4.28479,
       50.1409
      ],
      [
       4.28201,
       50.14743
      ],
      [
       4.27092,
       50.15057
      ],
      [
       4.26188,
       50.14913
      ],
      [
       4.25172,
       50.14819
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c022",
   "cadastre": 1798,
   "nom": "Citadelle de Namur",
   "clubId": "pegase",
   "commune": "Namur",
   "province": "NAM",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2011,
   "anneeMaj": 2023,
   "cartographe": "M. Lambert",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Hilde Exemple",
    "email": "cartes@peg.example",
    "telephone": "+32 470 00 31 20"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.86819,
       50.45918
      ],
      [
       4.865,
       50.46211
      ],
      [
       4.86123,
       50.46454
      ],
      [
       4.85671,
       50.464
      ],
      [
       4.85304,
       50.46214
      ],
      [
       4.85385,
       50.45854
      ],
      [
       4.85398,
       50.45547
      ],
      [
       4.85754,
       50.45399
      ],
      [
       4.86092,
       50.45276
      ],
      [
       4.86422,
       50.45378
      ],
      [
       4.86671,
       50.45586
      ],
      [
       4.86819,
       50.45918
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c023",
   "cadastre": 1836,
   "nom": "Bois de la Marlagne",
   "clubId": "pegase",
   "commune": "Namur",
   "province": "NAM",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 1994,
   "anneeMaj": 2020,
   "cartographe": "P. Peeters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de la Marlagne.",
    "nl": "Demokaart – Bois de la Marlagne."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "15-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Hilde Démo",
    "email": "cartes@peg.example",
    "telephone": "+32 470 00 32 20"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.80777,
       50.4393
      ],
      [
       4.80218,
       50.43497
      ],
      [
       4.80071,
       50.42798
      ],
      [
       4.8089,
       50.42142
      ],
      [
       4.81944,
       50.41811
      ],
      [
       4.83082,
       50.41659
      ],
      [
       4.83891,
       50.42083
      ],
      [
       4.83672,
       50.42843
      ],
      [
       4.83272,
       50.43457
      ],
      [
       4.82617,
       50.44116
      ],
      [
       4.81582,
       50.44102
      ],
      [
       4.80777,
       50.4393
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c024",
   "cadastre": 1874,
   "nom": "Bois de Lustin",
   "clubId": "pegase",
   "commune": "Profondeville",
   "province": "NAM",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2004,
   "anneeMaj": 2004,
   "cartographe": "C. Dubois",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de Lustin.",
    "nl": "Demokaart – Bois de Lustin."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Hilde Modèle",
    "email": "cartes@peg.example",
    "telephone": "+32 470 00 33 20"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.88946,
       50.37775
      ],
      [
       4.88184,
       50.37888
      ],
      [
       4.87446,
       50.38069
      ],
      [
       4.86949,
       50.3775
      ],
      [
       4.86871,
       50.37323
      ],
      [
       4.8684,
       50.36859
      ],
      [
       4.87444,
       50.36522
      ],
      [
       4.88155,
       50.36378
      ],
      [
       4.89012,
       50.36329
      ],
      [
       4.89024,
       50.36897
      ],
      [
       4.89075,
       50.37283
      ],
      [
       4.88946,
       50.37775
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c025",
   "cadastre": 1912,
   "nom": "Sart-Tilman (1993)",
   "clubId": "coliege",
   "commune": "Liège",
   "province": "LIE",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 1993,
   "anneeMaj": 2005,
   "cartographe": "A. Janssens",
   "statut": "ancienne",
   "remplaceePar": "c026",
   "description": {
    "fr": "Carte de démonstration – Sart-Tilman (1993).",
    "nl": "Demokaart – Sart-Tilman (1993)."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Julie Fictif",
    "email": "cartes@col.example",
    "telephone": "+32 470 00 34 14"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.56486,
       50.59123
      ],
      [
       5.55882,
       50.58535
      ],
      [
       5.5603,
       50.58041
      ],
      [
       5.55822,
       50.57421
      ],
      [
       5.56794,
       50.57358
      ],
      [
       5.57681,
       50.57555
      ],
      [
       5.58425,
       50.57876
      ],
      [
       5.59003,
       50.58347
      ],
      [
       5.58715,
       50.58766
      ],
      [
       5.58363,
       50.59135
      ],
      [
       5.57571,
       50.59352
      ],
      [
       5.56486,
       50.59123
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c026",
   "cadastre": 1050,
   "nom": "Sart-Tilman",
   "clubId": "coliege",
   "commune": "Liège",
   "province": "LIE",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2018,
   "anneeMaj": 2023,
   "cartographe": "L. Martin",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-02",
     "au": "31-03"
    },
    {
     "du": "01-06",
     "au": "15-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Julie Exemple",
    "email": "cartes@col.example",
    "telephone": "+32 470 00 35 14"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.59233,
       50.58657
      ],
      [
       5.58815,
       50.59437
      ],
      [
       5.5793,
       50.59559
      ],
      [
       5.57078,
       50.60006
      ],
      [
       5.56493,
       50.59434
      ],
      [
       5.56244,
       50.58738
      ],
      [
       5.56297,
       50.57926
      ],
      [
       5.56894,
       50.57168
      ],
      [
       5.57824,
       50.57276
      ],
      [
       5.58684,
       50.57232
      ],
      [
       5.5895,
       50.57953
      ],
      [
       5.59233,
       50.58657
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c027",
   "cadastre": 1088,
   "nom": "Liège Outremeuse",
   "clubId": "coliege",
   "commune": "Liège",
   "province": "LIE",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2016,
   "anneeMaj": 2022,
   "cartographe": "S. Wouters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Liège Outremeuse.",
    "nl": "Demokaart – Liège Outremeuse."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Julie Démo",
    "email": "cartes@col.example",
    "telephone": "+32 470 00 36 14"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.57702,
       50.64132
      ],
      [
       5.57429,
       50.63997
      ],
      [
       5.57313,
       50.63767
      ],
      [
       5.57457,
       50.6353
      ],
      [
       5.57808,
       50.63435
      ],
      [
       5.58175,
       50.63348
      ],
      [
       5.58456,
       50.63516
      ],
      [
       5.58652,
       50.6371
      ],
      [
       5.58618,
       50.63952
      ],
      [
       5.58356,
       50.64122
      ],
      [
       5.58028,
       50.64269
      ],
      [
       5.57702,
       50.64132
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c028",
   "cadastre": 1126,
   "nom": "Bois d'Esneux",
   "clubId": "coliege",
   "commune": "Esneux",
   "province": "LIE",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2007,
   "anneeMaj": 2019,
   "cartographe": "F. Leclercq",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois d'Esneux.",
    "nl": "Demokaart – Bois d'Esneux."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Julie Modèle",
    "email": "cartes@col.example",
    "telephone": "+32 470 00 37 14"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.55588,
       50.53365
      ],
      [
       5.55586,
       50.52951
      ],
      [
       5.5608,
       50.52575
      ],
      [
       5.5681,
       50.52384
      ],
      [
       5.57606,
       50.52261
      ],
      [
       5.58404,
       50.52391
      ],
      [
       5.58805,
       50.52798
      ],
      [
       5.58454,
       50.53303
      ],
      [
       5.5767,
       50.53651
      ],
      [
       5.56791,
       50.53778
      ],
      [
       5.5622,
       50.5354
      ],
      [
       5.55588,
       50.53365
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c029",
   "cadastre": 1164,
   "nom": "Forêt de Spa",
   "clubId": "coliege",
   "commune": "Spa",
   "province": "LIE",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2000,
   "anneeMaj": 2021,
   "cartographe": "H. Schmitz",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt de Spa.",
    "nl": "Demokaart – Forêt de Spa."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Julie Fictif",
    "email": "cartes@col.example",
    "telephone": "+32 470 00 38 14"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.85656,
       50.49394
      ],
      [
       5.84696,
       50.49387
      ],
      [
       5.84497,
       50.4849
      ],
      [
       5.84532,
       50.47626
      ],
      [
       5.85206,
       50.47008
      ],
      [
       5.85945,
       50.46662
      ],
      [
       5.86759,
       50.46626
      ],
      [
       5.87708,
       50.46906
      ],
      [
       5.87785,
       50.47921
      ],
      [
       5.8737,
       50.48872
      ],
      [
       5.86569,
       50.49566
      ],
      [
       5.85656,
       50.49394
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c030",
   "cadastre": 1202,
   "nom": "Huy centre",
   "clubId": "herma",
   "commune": "Huy",
   "province": "LIE",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2019,
   "anneeMaj": 2019,
   "cartographe": "N. Renard",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Claire Exemple",
    "email": "cartes@herma.example",
    "telephone": "+32 470 00 39 16"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.23967,
       50.52155
      ],
      [
       5.23578,
       50.52137
      ],
      [
       5.23392,
       50.51967
      ],
      [
       5.23166,
       50.51802
      ],
      [
       5.23318,
       50.516
      ],
      [
       5.23683,
       50.51525
      ],
      [
       5.24007,
       50.51502
      ],
      [
       5.2442,
       50.515
      ],
      [
       5.24509,
       50.51706
      ],
      [
       5.24624,
       50.51911
      ],
      [
       5.2439,
       50.52111
      ],
      [
       5.23967,
       50.52155
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c031",
   "cadastre": 1240,
   "nom": "Bois d'Ampsin",
   "clubId": "herma",
   "commune": "Amay",
   "province": "LIE",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2026,
   "anneeMaj": null,
   "cartographe": "J. Dumont",
   "statut": "projet",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois d'Ampsin.",
    "nl": "Demokaart – Bois d'Ampsin."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "15-09"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Claire Démo",
    "email": "cartes@herma.example",
    "telephone": "+32 470 00 40 16"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.29086,
       50.54295
      ],
      [
       5.28546,
       50.54279
      ],
      [
       5.2794,
       50.54112
      ],
      [
       5.27418,
       50.53656
      ],
      [
       5.27274,
       50.53092
      ],
      [
       5.27518,
       50.52643
      ],
      [
       5.28164,
       50.52653
      ],
      [
       5.28711,
       50.52879
      ],
      [
       5.29191,
       50.53164
      ],
      [
       5.29493,
       50.53607
      ],
      [
       5.29588,
       50.54121
      ],
      [
       5.29086,
       50.54295
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c032",
   "cadastre": 1278,
   "nom": "Forêt de Saint-Hubert",
   "clubId": "ardoc",
   "commune": "Saint-Hubert",
   "province": "LUX",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 1996,
   "anneeMaj": 2022,
   "cartographe": "M. Lambert",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt de Saint-Hubert.",
    "nl": "Demokaart – Forêt de Saint-Hubert."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Marc Modèle",
    "email": "cartes@ardoc.example",
    "telephone": "+32 470 00 41 11"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.35813,
       50.04861
      ],
      [
       5.35272,
       50.04026
      ],
      [
       5.34735,
       50.03255
      ],
      [
       5.35059,
       50.02175
      ],
      [
       5.36419,
       50.01824
      ],
      [
       5.37469,
       50.01337
      ],
      [
       5.38461,
       50.01624
      ],
      [
       5.39461,
       50.02166
      ],
      [
       5.3909,
       50.03262
      ],
      [
       5.38147,
       50.04033
      ],
      [
       5.37113,
       50.04547
      ],
      [
       5.35813,
       50.04861
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c033",
   "cadastre": 1316,
   "nom": "Bouillon château",
   "clubId": "ardoc",
   "commune": "Bouillon",
   "province": "LUX",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2014,
   "anneeMaj": 2014,
   "cartographe": "P. Peeters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bouillon château.",
    "nl": "Demokaart – Bouillon château."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Marc Fictif",
    "email": "cartes@ardoc.example",
    "telephone": "+32 470 00 42 11"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.06269,
       49.79712
      ],
      [
       5.0616,
       49.79577
      ],
      [
       5.06306,
       49.79378
      ],
      [
       5.06503,
       49.79218
      ],
      [
       5.06754,
       49.79096
      ],
      [
       5.07094,
       49.78985
      ],
      [
       5.07274,
       49.79109
      ],
      [
       5.07186,
       49.79327
      ],
      [
       5.06993,
       49.79502
      ],
      [
       5.06775,
       49.79636
      ],
      [
       5.06514,
       49.79726
      ],
      [
       5.06269,
       49.79712
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c034",
   "cadastre": 1354,
   "nom": "Bois de La Roche",
   "clubId": "ardoc",
   "commune": "La Roche-en-Ardenne",
   "province": "LUX",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2005,
   "anneeMaj": 2018,
   "cartographe": "C. Dubois",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-02",
     "au": "31-03"
    },
    {
     "du": "01-06",
     "au": "15-09"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Marc Exemple",
    "email": "cartes@ardoc.example",
    "telephone": "+32 470 00 43 11"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.56959,
       50.19173
      ],
      [
       5.56213,
       50.18664
      ],
      [
       5.55753,
       50.18182
      ],
      [
       5.55635,
       50.17626
      ],
      [
       5.56663,
       50.17508
      ],
      [
       5.57439,
       50.17115
      ],
      [
       5.58331,
       50.17593
      ],
      [
       5.59371,
       50.17922
      ],
      [
       5.59349,
       50.18485
      ],
      [
       5.58724,
       50.18818
      ],
      [
       5.5795,
       50.18935
      ],
      [
       5.56959,
       50.19173
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c035",
   "cadastre": 1392,
   "nom": "Durbuy",
   "clubId": "ardoc",
   "commune": "Durbuy",
   "province": "LUX",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2018,
   "anneeMaj": 2023,
   "cartographe": "A. Janssens",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Durbuy.",
    "nl": "Demokaart – Durbuy."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Marc Démo",
    "email": "cartes@ardoc.example",
    "telephone": "+32 470 00 44 11"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.45565,
       50.35503
      ],
      [
       5.45364,
       50.35407
      ],
      [
       5.451,
       50.35324
      ],
      [
       5.45075,
       50.35125
      ],
      [
       5.45242,
       50.34962
      ],
      [
       5.45492,
       50.34866
      ],
      [
       5.45764,
       50.34912
      ],
      [
       5.45936,
       50.35034
      ],
      [
       5.46004,
       50.35181
      ],
      [
       5.45929,
       50.35319
      ],
      [
       5.45864,
       50.35522
      ],
      [
       5.45565,
       50.35503
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c036",
   "cadastre": 1430,
   "nom": "Arlon centre",
   "clubId": "sudolux",
   "commune": "Arlon",
   "province": "LUX",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2012,
   "anneeMaj": 2021,
   "cartographe": "L. Martin",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Arlon centre.",
    "nl": "Demokaart – Arlon centre."
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Jonas Modèle",
    "email": "cartes@sud.example",
    "telephone": "+32 470 00 45 21"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.80893,
       49.68403
      ],
      [
       5.80935,
       49.68097
      ],
      [
       5.81043,
       49.67822
      ],
      [
       5.81392,
       49.67865
      ],
      [
       5.81706,
       49.67822
      ],
      [
       5.81902,
       49.68095
      ],
      [
       5.82164,
       49.68368
      ],
      [
       5.8193,
       49.6858
      ],
      [
       5.81831,
       49.68883
      ],
      [
       5.81473,
       49.68706
      ],
      [
       5.81107,
       49.68712
      ],
      [
       5.80893,
       49.68403
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c037",
   "cadastre": 1468,
   "nom": "Forêt d'Anlier",
   "clubId": "sudolux",
   "commune": "Habay",
   "province": "LUX",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 1998,
   "anneeMaj": 2020,
   "cartographe": "S. Wouters",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Forêt d'Anlier.",
    "nl": "Demokaart – Forêt d'Anlier."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Jonas Fictif",
    "email": "cartes@sud.example",
    "telephone": "+32 470 00 46 21"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.59334,
       49.78238
      ],
      [
       5.58862,
       49.77466
      ],
      [
       5.60194,
       49.76591
      ],
      [
       5.61265,
       49.75898
      ],
      [
       5.62619,
       49.75717
      ],
      [
       5.63678,
       49.75856
      ],
      [
       5.64571,
       49.76231
      ],
      [
       5.6479,
       49.77041
      ],
      [
       5.63611,
       49.77933
      ],
      [
       5.62023,
       49.78158
      ],
      [
       5.60777,
       49.78287
      ],
      [
       5.59334,
       49.78238
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c038",
   "cadastre": 1506,
   "nom": "École communale de Virton",
   "clubId": "sudolux",
   "commune": "Virton",
   "province": "LUX",
   "type": "ecole",
   "echelle": 2000,
   "equidistance": 2,
   "anneeCreation": 2020,
   "anneeMaj": 2020,
   "cartographe": "F. Leclercq",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [
    {
     "du": "01-01",
     "au": "31-12"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Jonas Exemple",
    "email": "cartes@sud.example",
    "telephone": "+32 470 00 47 21"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       5.53365,
       49.56904
      ],
      [
       5.53296,
       49.56947
      ],
      [
       5.53173,
       49.56905
      ],
      [
       5.5308,
       49.56852
      ],
      [
       5.53001,
       49.56785
      ],
      [
       5.53034,
       49.5673
      ],
      [
       5.53076,
       49.56684
      ],
      [
       5.53164,
       49.56645
      ],
      [
       5.53285,
       49.56711
      ],
      [
       5.53353,
       49.5678
      ],
      [
       5.53418,
       49.56854
      ],
      [
       5.53365,
       49.56904
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c039",
   "cadastre": 1544,
   "nom": "Sankt Vith Zentrum",
   "clubId": "olveifel",
   "commune": "Sankt Vith",
   "province": "LIE",
   "type": "sprint",
   "echelle": 4000,
   "equidistance": 2.5,
   "anneeCreation": 2015,
   "anneeMaj": 2022,
   "cartographe": "H. Schmitz",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Sankt Vith Zentrum.",
    "nl": "Demokaart – Sankt Vith Zentrum."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Benoît Démo",
    "email": "cartes@olv.example",
    "telephone": "+32 470 00 48 19"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       6.12635,
       50.28683
      ],
      [
       6.12399,
       50.28533
      ],
      [
       6.12183,
       50.28369
      ],
      [
       6.12221,
       50.28112
      ],
      [
       6.12295,
       50.27833
      ],
      [
       6.1261,
       50.27744
      ],
      [
       6.12897,
       50.27789
      ],
      [
       6.13183,
       50.27892
      ],
      [
       6.13199,
       50.28165
      ],
      [
       6.13227,
       50.28454
      ],
      [
       6.12902,
       50.28551
      ],
      [
       6.12635,
       50.28683
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c040",
   "cadastre": 1582,
   "nom": "Bütgenbacher Wald",
   "clubId": "olveifel",
   "commune": "Bütgenbach",
   "province": "LIE",
   "type": "foret",
   "echelle": 15000,
   "equidistance": 5,
   "anneeCreation": 2003,
   "anneeMaj": 2019,
   "cartographe": "N. Renard",
   "statut": "usage",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bütgenbacher Wald.",
    "nl": "Demokaart – Bütgenbacher Wald."
   },
   "periodesAcces": [
    {
     "du": "15-03",
     "au": "31-08"
    },
    {
     "du": "01-11",
     "au": "15-12"
    }
   ],
   "remarqueAcces": {
    "fr": "Demander l'autorisation au cantonnement du DNF au moins deux mois à l'avance.",
    "nl": "Minstens twee maanden vooraf toestemming vragen aan het DNF-kantonnement."
   },
   "contact": {
    "nom": "Benoît Modèle",
    "email": "cartes@olv.example",
    "telephone": "+32 470 00 49 19"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       6.22381,
       50.42004
      ],
      [
       6.21585,
       50.42515
      ],
      [
       6.21007,
       50.43115
      ],
      [
       6.19716,
       50.42977
      ],
      [
       6.18857,
       50.4266
      ],
      [
       6.18068,
       50.42282
      ],
      [
       6.17759,
       50.41665
      ],
      [
       6.18372,
       50.41051
      ],
      [
       6.19726,
       50.41029
      ],
      [
       6.21013,
       50.40892
      ],
      [
       6.21595,
       50.41488
      ],
      [
       6.22381,
       50.42004
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c041",
   "cadastre": 1620,
   "nom": "Hertogenwald",
   "clubId": "olveifel",
   "commune": "Eupen",
   "province": "LIE",
   "type": "foret",
   "echelle": 10000,
   "equidistance": 5,
   "anneeCreation": 2026,
   "anneeMaj": null,
   "cartographe": "J. Dumont",
   "statut": "projet",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Hertogenwald.",
    "nl": "Demokaart – Hertogenwald."
   },
   "periodesAcces": [
    {
     "du": "01-04",
     "au": "30-09"
    }
   ],
   "remarqueAcces": null,
   "contact": {
    "nom": "Benoît Fictif",
    "email": "cartes@olv.example",
    "telephone": "+32 470 00 50 19"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       6.04247,
       50.5978
      ],
      [
       6.03603,
       50.59101
      ],
      [
       6.0408,
       50.5832
      ],
      [
       6.0525,
       50.5804
      ],
      [
       6.06297,
       50.57568
      ],
      [
       6.0759,
       50.57774
      ],
      [
       6.08277,
       50.58487
      ],
      [
       6.07845,
       50.59258
      ],
      [
       6.07521,
       50.60011
      ],
      [
       6.06295,
       50.60155
      ],
      [
       6.0507,
       50.60344
      ],
      [
       6.04247,
       50.5978
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c042",
   "cadastre": null,
   "nom": "Bois de Baudour",
   "clubId": "altair",
   "commune": "Saint-Ghislain",
   "province": "HAI",
   "type": "foret",
   "echelle": null,
   "equidistance": null,
   "anneeCreation": null,
   "anneeMaj": null,
   "cartographe": null,
   "statut": "demande",
   "remplaceePar": null,
   "description": {
    "fr": "Terrain varié avec un réseau de chemins dense.",
    "nl": ""
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Anne Exemple",
    "email": "cartes@alt.example",
    "telephone": "+32 470 00 51 10"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       3.82893,
       50.48908
      ],
      [
       3.82024,
       50.48795
      ],
      [
       3.8188,
       50.48252
      ],
      [
       3.81886,
       50.47847
      ],
      [
       3.81943,
       50.47348
      ],
      [
       3.8268,
       50.47097
      ],
      [
       3.83462,
       50.47244
      ],
      [
       3.84024,
       50.47534
      ],
      [
       3.84352,
       50.47946
      ],
      [
       3.84352,
       50.48458
      ],
      [
       3.83722,
       50.48813
      ],
      [
       3.82893,
       50.48908
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c043",
   "cadastre": null,
   "nom": "Bois de la Cambre – Étangs",
   "clubId": "comb",
   "commune": "Bruxelles",
   "province": "BRU",
   "type": "parc",
   "echelle": null,
   "equidistance": null,
   "anneeCreation": null,
   "anneeMaj": null,
   "cartographe": null,
   "statut": "demande",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de la Cambre – Étangs.",
    "nl": "Demokaart – Bois de la Cambre – Étangs."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Pierre Démo",
    "email": "cartes@comb.example",
    "telephone": "+32 470 00 52 15"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.38423,
       50.80935
      ],
      [
       4.38181,
       50.81049
      ],
      [
       4.37772,
       50.80888
      ],
      [
       4.37429,
       50.80772
      ],
      [
       4.37221,
       50.80566
      ],
      [
       4.37205,
       50.8038
      ],
      [
       4.37331,
       50.8024
      ],
      [
       4.37663,
       50.80266
      ],
      [
       4.38035,
       50.80311
      ],
      [
       4.3824,
       50.80537
      ],
      [
       4.38569,
       50.80768
      ],
      [
       4.38423,
       50.80935
      ]
     ]
    ]
   },
   "motifRefus": null
  },
  {
   "id": "c044",
   "cadastre": null,
   "nom": "Bois de Rance – extension",
   "clubId": "thor",
   "commune": "Sivry-Rance",
   "province": "HAI",
   "type": "foret",
   "echelle": null,
   "equidistance": null,
   "anneeCreation": null,
   "anneeMaj": null,
   "cartographe": null,
   "statut": "refusee",
   "remplaceePar": null,
   "description": {
    "fr": "Carte de démonstration – Bois de Rance – extension.",
    "nl": "Demokaart – Bois de Rance – extension."
   },
   "periodesAcces": [],
   "remarqueAcces": null,
   "contact": {
    "nom": "Elise Modèle",
    "email": "cartes@thor.example",
    "telephone": "+32 470 00 53 22"
   },
   "apercu": null,
   "zone": {
    "type": "Polygon",
    "coordinates": [
     [
      [
       4.30036,
       50.15704
      ],
      [
       4.28948,
       50.15645
      ],
      [
       4.28638,
       50.1526
      ],
      [
       4.28327,
       50.14946
      ],
      [
       4.28887,
       50.14672
      ],
      [
       4.29433,
       50.14342
      ],
      [
       4.30395,
       50.14461
      ],
      [
       4.31079,
       50.14626
      ],
      [
       4.31566,
       50.14884
      ],
      [
       4.31431,
       50.1521
      ],
      [
       4.31134,
       50.1561
      ],
      [
       4.30036,
       50.15704
      ]
     ]
    ]
   },
   "motifRefus": {
    "fr": "La zone recouvre en grande partie la carte « Bois de Rance » du même club : mettre plutôt cette carte à jour.",
    "nl": "De zone overlapt grotendeels met de kaart ‘Bois de Rance’ van dezelfde club: werk liever die kaart bij."
   }
  }
 ],
 "signalements": [
  {
   "id": "s001",
   "carteId": "c001",
   "auteur": {
    "profil": "membre",
    "clubId": "comb"
   },
   "date": "2026-10-03",
   "texte": "Le parking du Rouge-Cloître n'est plus accessible : il faudrait l'indiquer dans la remarque sur l'accès.",
   "statut": "ouvert",
   "reponse": null,
   "dateReponse": null
  },
  {
   "id": "s002",
   "carteId": "c026",
   "auteur": {
    "profil": "membre",
    "clubId": "herma"
   },
   "date": "2026-10-18",
   "texte": "L'équidistance indiquée (5 m) ne correspond pas à la carte imprimée, qui est en 2,5 m.",
   "statut": "ouvert",
   "reponse": null,
   "dateReponse": null
  },
  {
   "id": "s003",
   "carteId": "c009",
   "auteur": {
    "profil": "membre",
    "clubId": "lost"
   },
   "date": "2026-11-02",
   "texte": "Le nom du cartographe est incomplet : la mise à jour 2024 a été faite par deux personnes.",
   "statut": "ouvert",
   "reponse": null,
   "dateReponse": null
  },
  {
   "id": "s004",
   "carteId": "c013",
   "auteur": {
    "profil": "membre",
    "clubId": "altair"
   },
   "date": "2026-09-12",
   "texte": "La période d'accès a changé : le DNF autorise maintenant aussi le mois d'octobre.",
   "statut": "traite",
   "reponse": "Merci, vérifié avec le cantonnement : la période sera mise à jour.",
   "dateReponse": "2026-09-20"
  }
 ]
};
