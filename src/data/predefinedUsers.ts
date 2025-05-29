
export const PREDEFINED_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    full_name: 'Administrator Sistem',
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    full_name: 'Maria Popescu',
    username: 'maria.popescu',
    password: 'maria123',
    role: 'trainer' as const
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    full_name: 'Ion Ionescu',
    username: 'ion.ionescu',
    password: 'ion123',
    role: 'trainer' as const
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    full_name: 'Ana Georgescu',
    username: 'ana.georgescu',
    password: 'ana123',
    role: 'trainer' as const
  }
];

export const PREDEFINED_TRAINERS = PREDEFINED_USERS.filter(user => user.role === 'trainer');
