
export const PREDEFINED_USERS = [
  {
    id: 'admin-001',
    full_name: 'Administrator Sistem',
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const
  },
  {
    id: 'trainer-001',
    full_name: 'Maria Popescu',
    username: 'maria.popescu',
    password: 'maria123',
    role: 'trainer' as const
  },
  {
    id: 'trainer-002',
    full_name: 'Ion Ionescu',
    username: 'ion.ionescu',
    password: 'ion123',
    role: 'trainer' as const
  },
  {
    id: 'trainer-003',
    full_name: 'Ana Georgescu',
    username: 'ana.georgescu',
    password: 'ana123',
    role: 'trainer' as const
  }
];

export const PREDEFINED_TRAINERS = PREDEFINED_USERS.filter(user => user.role === 'trainer');
