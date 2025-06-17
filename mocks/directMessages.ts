import { Conversation, Message } from '@/types/forum';

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['currentUser', 'AutoExperte'],
    lastMessage: {
      id: 'msg3',
      senderId: 'AutoExperte',
      receiverId: 'currentUser',
      content: 'Kein Problem, melde dich wenn du weitere Fragen hast!',
      timestamp: '2023-06-15T14:30:00Z',
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participantIds: ['currentUser', 'TeslaFan'],
    lastMessage: {
      id: 'msg6',
      senderId: 'currentUser',
      receiverId: 'TeslaFan',
      content: 'Danke für die Infos, das hilft mir sehr weiter!',
      timestamp: '2023-06-12T09:45:00Z',
      read: true,
    },
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 'currentUser',
      receiverId: 'AutoExperte',
      content: 'Hallo, ich habe eine Frage zu deinem Kommentar über Fahranfängerautos. Würdest du eher den Polo oder den Yaris empfehlen?',
      timestamp: '2023-06-15T13:10:00Z',
      read: true,
    },
    {
      id: 'msg2',
      senderId: 'AutoExperte',
      receiverId: 'currentUser',
      content: 'Hallo! Beide sind gut, aber der Yaris ist etwas zuverlässiger und günstiger im Unterhalt. Der Polo hat dafür mehr Ausstattung für das Geld.',
      timestamp: '2023-06-15T13:25:00Z',
      read: true,
    },
    {
      id: 'msg3',
      senderId: 'AutoExperte',
      receiverId: 'currentUser',
      content: 'Kein Problem, melde dich wenn du weitere Fragen hast!',
      timestamp: '2023-06-15T14:30:00Z',
      read: false,
    },
  ],
  'conv2': [
    {
      id: 'msg4',
      senderId: 'currentUser',
      receiverId: 'TeslaFan',
      content: 'Hi, ich interessiere mich für ein Tesla Model 3. Kannst du mir mehr über die Reichweite im Alltag erzählen?',
      timestamp: '2023-06-12T08:15:00Z',
      read: true,
    },
    {
      id: 'msg5',
      senderId: 'TeslaFan',
      receiverId: 'currentUser',
      content: 'Klar! Ich komme mit meinem Long Range im Sommer etwa 450km weit, im Winter eher 350km. Aber das Supercharger-Netzwerk ist super, also mache ich mir nie Sorgen.',
      timestamp: '2023-06-12T08:30:00Z',
      read: true,
    },
    {
      id: 'msg6',
      senderId: 'currentUser',
      receiverId: 'TeslaFan',
      content: 'Danke für die Infos, das hilft mir sehr weiter!',
      timestamp: '2023-06-12T09:45:00Z',
      read: true,
    },
  ],
};