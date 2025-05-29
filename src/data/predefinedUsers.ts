
export const PREDEFINED_USERS = [
  {
    id: 'admin-001',
    full_name: 'Administrator Sistem',
    username: 'admin',
    role: 'admin' as const
  },
  {
    id: 'trainer-001',
    full_name: 'Maria Popescu',
    username: 'maria.popescu',
    role: 'trainer' as const
  },
  {
    id: 'trainer-002',
    full_name: 'Ion Ionescu',
    username: 'ion.ionescu',
    role: 'trainer' as const
  },
  {
    id: 'trainer-003',
    full_name: 'Ana Georgescu',
    username: 'ana.georgescu',
    role: 'trainer' as const
  }
];

export const PREDEFINED_TRAINERS = PREDEFINED_USERS.filter(user => user.role === 'trainer');
