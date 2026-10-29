import { InboxMessage, MemoryItem, TaskItem, PlantCareResult } from '../types/index.ts';

export const initialTasks: TaskItem[] = [
  {
    id: 't1',
    time: '10:30 AM',
    title: 'Boss ko website ka update dena',
    completed: false,
    priority: 'high',
  },
  {
    id: 't2',
    time: '02:00 PM',
    title: 'Mama ko call karna',
    completed: false,
    priority: 'normal',
  },
  {
    id: 't3',
    time: '04:00 PM',
    title: 'Break: 20 min walk + chai',
    completed: true,
    priority: 'low',
  },
  {
    id: 't4',
    time: '06:00 PM',
    title: 'Plant pots mein pani aur sunlight check karna',
    completed: false,
    priority: 'normal',
  },
];

export const initialInboxMessages: InboxMessage[] = [
  {
    id: 'msg-boss',
    sender: 'Boss (WhatsApp)',
    source: 'WhatsApp',
    preview: 'Website ka design aaj tak bhej do. Dark theme aur professional chahiye.',
    fullText: 'Website ka design aaj shaam 6 baje tak bhej do. Dark theme aur professional style hona chahiye. Kisi colour ki zaroorat ho to bata dena.',
    time: '2 min pehle',
    unread: true,
  },
  {
    id: 'msg-mama',
    sender: 'Mama (Voice)',
    source: 'Voice',
    preview: '0:24 - sunna hai?',
    fullText: 'Beta shaam ko ghar jaldi aa jana, tumhari pasand ki biryani banayi hai aur aate waqt dahi le aana.',
    time: '15 min pehle',
    unread: true,
    audioDuration: '0:24',
  },
  {
    id: 'msg-ahmed',
    sender: 'Ahmed (Friend)',
    source: 'SMS',
    preview: 'Kal sham cricket ka match hai, ready rehna...',
    fullText: 'Kal shaam 5 baje ground mein match hai, sab boys aa rahe hain, apna bat saath le aana!',
    time: '1 ghanta pehle',
    unread: false,
  },
];

export const initialMemories: MemoryItem[] = [
  {
    id: 'm1',
    category: 'boss',
    title: 'Sir Imran (Boss) Preferences',
    detail: 'Dark, simple layout pasand hai. Faltu lambi baten nahi, sirf direct update. Deadline shaam 6:00 baje.',
    updatedAt: 'Aaj 09:30 AM',
  },
  {
    id: 'm2',
    category: 'mama',
    title: 'Mama ki Routine',
    detail: 'Roz 9 baje call. Voice messages ko text mein sunna aur jald jawab dena pasand karti hain.',
    updatedAt: 'Kal shaam',
  },
  {
    id: 'm3',
    category: 'projects',
    title: 'Chal Rahe Projects',
    detail: 'Boss website (din 3/42) + Plant Care Vision diagnostics engine + Personal AI Agent.',
    updatedAt: 'Aaj subah',
  },
  {
    id: 'm4',
    category: 'habits',
    title: 'Meri Aadatein',
    detail: 'Roman Urdu mein baat cheet. Har 45 minute ke kaam ke baad stretch/chai break.',
    updatedAt: 'Do din pehle',
  },
];

export const samplePlants = [
  {
    name: 'Monstera Deliciosa (Swiss Cheese Plant)',
    description: 'Bade katowale patte, kam dhoop bardasht karti hai',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Snake Plant (Sansevieria)',
    description: 'Hawa saaf karne wala, 2-3 hafte mein ek baar pani',
    image: 'https://images.unsplash.com/photo-1599598425947-5202edd56247?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Peace Lily (Spathiphyllum)',
    description: 'Safaid phool, dhalakne par pani maangti hai',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tomato Leaf (Garden)',
    description: 'Dhoop pasand, rozana nami ki zaroorat',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a63?auto=format&fit=crop&w=600&q=80',
  },
];
