import { addDays, subDays } from "date-fns";

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string; // Coursera, Stepik, Yandex
  providerLogo?: string;
  dates: {
    start: Date;
    end: Date;
  };
  format: 'online' | 'offline' | 'hybrid';
  price: number;
  currency: 'RUB';
  rating: number;
  category: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  role: 'employee' | 'admin' | 'manager';
  department: string;
  position: string;
  avatar: string;
}

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Иванов Иван Иванович',
  role: 'employee',
  department: 'Департамент информатизации',
  position: 'Старший разработчик',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan'
};

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Продвинутый Angular',
    description: 'Глубокое погружение в архитектуру Angular приложений, RxJS и NGRX.',
    provider: 'Stepik',
    dates: {
      start: addDays(new Date(), 10),
      end: addDays(new Date(), 40)
    },
    format: 'online',
    price: 45000,
    currency: 'RUB',
    rating: 4.8,
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'c2',
    title: 'Управление проектами в IT',
    description: 'Методологии Agile, Scrum, Kanban. Управление рисками и командой.',
    provider: 'Яндекс.Практикум',
    dates: {
      start: addDays(new Date(), 15),
      end: addDays(new Date(), 60)
    },
    format: 'online',
    price: 85000,
    currency: 'RUB',
    rating: 4.9,
    category: 'Management',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'c3',
    title: 'Системный анализ и проектирование',
    description: 'Основы системного анализа, UML, BPMN, проектирование баз данных.',
    provider: 'Coursera',
    dates: {
      start: addDays(new Date(), 20),
      end: addDays(new Date(), 50)
    },
    format: 'online',
    price: 35000,
    currency: 'RUB',
    rating: 4.5,
    category: 'Analysis',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'c4',
    title: 'Python для Data Science',
    description: 'Изучение библиотек Pandas, NumPy, Matplotlib для анализа данных.',
    provider: 'Skillbox',
    dates: {
      start: addDays(new Date(), 5),
      end: addDays(new Date(), 35)
    },
    format: 'online',
    price: 60000,
    currency: 'RUB',
    rating: 4.7,
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'c5',
    title: 'Лидерство и эмоциональный интеллект',
    description: 'Развитие soft skills для руководителей и тимлидов.',
    provider: 'Нетология',
    dates: {
      start: addDays(new Date(), 25),
      end: addDays(new Date(), 30)
    },
    format: 'hybrid',
    price: 25000,
    currency: 'RUB',
    rating: 4.6,
    category: 'Soft Skills',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'c6',
    title: 'Безопасность веб-приложений',
    description: 'OWASP Top 10, защита от атак, безопасная разработка.',
    provider: 'HackerU',
    dates: {
      start: addDays(new Date(), 30),
      end: addDays(new Date(), 60)
    },
    format: 'online',
    price: 90000,
    currency: 'RUB',
    rating: 4.9,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];
