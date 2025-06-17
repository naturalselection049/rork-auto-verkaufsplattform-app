import { ForumPost } from '@/types/forum';

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Welches Auto für Fahranfänger?',
    content: 'Ich habe gerade meinen Führerschein gemacht und suche ein zuverlässiges Auto für Fahranfänger. Budget liegt bei etwa 5.000€. Was könnt ihr empfehlen?',
    category: 'Kaufberatung',
    author: 'FahranfängerMax',
    authorId: 'user1',
    createdAt: '2023-06-15T10:30:00Z',
    comments: [
      {
        id: 'c1',
        authorId: 'user2',
        author: 'AutoExperte',
        content: 'Ich würde dir einen VW Polo oder einen Toyota Yaris empfehlen. Beide sind zuverlässig, sparsam und haben günstige Versicherungseinstufungen.',
        createdAt: '2023-06-15T11:15:00Z',
        likedBy: ['user1', 'user3'],
      },
      {
        id: 'c2',
        authorId: 'user3',
        author: 'MechanikMeister',
        content: 'Schau dir auch den Opel Corsa an. Günstig in der Anschaffung und Reparaturen sind nicht so teuer.',
        createdAt: '2023-06-15T12:45:00Z',
        likedBy: [],
      }
    ],
    likedBy: ['user2', 'user4'],
    commentCount: 2,
  },
  {
    id: '2',
    title: 'Erfahrungen mit Elektroautos im Winter?',
    content: 'Ich überlege, mir ein Elektroauto zuzulegen, mache mir aber Sorgen um die Reichweite im Winter. Hat jemand Erfahrungen damit, wie stark die Reichweite bei Kälte abnimmt?',
    category: 'Elektromobilität',
    author: 'StromFahrer',
    authorId: 'user5',
    createdAt: '2023-06-10T14:20:00Z',
    comments: [
      {
        id: 'c3',
        authorId: 'user6',
        author: 'TeslaFan',
        content: 'Ich fahre seit 2 Jahren ein Model 3 und kann sagen, dass die Reichweite im Winter etwa 20-30% geringer ist. Das Vorheizen während des Ladens hilft aber sehr.',
        createdAt: '2023-06-10T15:10:00Z',
        likedBy: ['user5'],
      }
    ],
    likedBy: ['user6', 'user7', 'user8'],
    commentCount: 1,
  },
  {
    id: '3',
    title: 'Tipps für Getriebeölwechsel',
    content: 'Mein Automatikgetriebe macht komische Geräusche beim Schalten. Ich denke, es ist Zeit für einen Getriebeölwechsel. Hat jemand Tipps, worauf ich achten sollte?',
    category: 'Technik',
    author: 'SchrauberPro',
    authorId: 'user9',
    createdAt: '2023-06-05T09:15:00Z',
    comments: [],
    likedBy: ['user10'],
    commentCount: 0,
  },
  {
    id: '4',
    title: 'Oldtimer als Wertanlage?',
    content: 'Ich interessiere mich für einen Mercedes W123 als Wertanlage. Lohnt sich das noch oder ist der Markt überhitzt?',
    category: 'Oldtimer',
    author: 'KlassikerFan',
    authorId: 'user11',
    createdAt: '2023-06-01T16:45:00Z',
    comments: [
      {
        id: 'c4',
        authorId: 'user12',
        author: 'OldtimerSammler',
        content: 'Der W123 ist definitiv eine gute Wahl, aber achte auf den Zustand. Nur wirklich gut erhaltene oder fachgerecht restaurierte Fahrzeuge steigen im Wert.',
        createdAt: '2023-06-01T17:30:00Z',
        likedBy: ['user11'],
      },
      {
        id: 'c5',
        authorId: 'user13',
        author: 'MercedesFan',
        content: 'Ich habe selbst einen W123 und die Ersatzteilversorgung ist noch sehr gut. Das ist wichtig für den Werterhalt.',
        createdAt: '2023-06-01T18:15:00Z',
        likedBy: [],
      }
    ],
    likedBy: ['user12', 'user13', 'user14', 'user15'],
    commentCount: 2,
  },
  {
    id: '5',
    title: 'Erfahrungen mit Chiptuning?',
    content: 'Hat jemand Erfahrungen mit Chiptuning bei einem Golf 7 GTI? Lohnt sich die Investition und gibt es Probleme mit der Garantie?',
    category: 'Tuning',
    author: 'TuningFreak',
    authorId: 'user16',
    createdAt: '2023-05-25T11:30:00Z',
    comments: [
      {
        id: 'c6',
        authorId: 'user17',
        author: 'GTIFahrer',
        content: 'Ich habe meinen GTI chippen lassen und bin sehr zufrieden. +50 PS für relativ wenig Geld. Aber ja, die Garantie ist damit weg.',
        createdAt: '2023-05-25T12:20:00Z',
        likedBy: ['user16'],
      }
    ],
    likedBy: ['user17', 'user18'],
    commentCount: 1,
  }
];