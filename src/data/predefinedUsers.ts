
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
    full_name: 'Gheorghe Bardan',
    username: 'gheorghe.bardan',
    password: 'gheorghe123',
    role: 'trainer' as const
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    full_name: 'Dumitru Vlad',
    username: 'dumitru.vlad',
    password: 'dumitru123',
    role: 'trainer' as const
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    full_name: 'Mitocaru Constantin',
    username: 'mitocaru.constantin',
    password: 'mitocaru123',
    role: 'trainer' as const
  }
];

export const PREDEFINED_TRAINERS = PREDEFINED_USERS.filter(user => user.role === 'trainer');
