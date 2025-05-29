
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { PREDEFINED_USERS } from '@/data/predefinedUsers';
import { toast } from '@/hooks/use-toast';
import { User, Shield, Calendar } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = PREDEFINED_USERS.find(u => u.username === username);
    
    if (!user) {
      toast({
        title: "Eroare autentificare",
        description: "Utilizatorul nu a fost găsit.",
        variant: "destructive",
      });
      return;
    }

    // Simulăm autentificarea prin salvarea în localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    toast({
      title: "Autentificare reușită",
      description: `Bun venit, ${user.full_name}!`,
    });

    // Redirecționăm către pagina principală
    navigate('/');
  };

  const handleQuickLogin = (user: typeof PREDEFINED_USERS[0]) => {
    setUsername(user.username);
    setSelectedUser(user.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Programări Traineri</h1>
          </div>
          <p className="text-gray-600">Sistem de gestionare programări pentru școli</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Autentificare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Nume utilizator</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Introduceți numele de utilizator"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!username.trim()}
              >
                Autentificare
              </Button>
            </CardContent>
          </Card>

          {/* Quick Login */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Conturi Predefinite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PREDEFINED_USERS.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedUser === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleQuickLogin(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrator' : 'Trainer'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Instrucțiuni:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Selectați un cont predefinit din lista din dreapta pentru autentificare rapidă</li>
              <li>Sau introduceți manual numele de utilizator în câmpul din stânga</li>
              <li>Administratorul poate gestiona toate programările</li>
              <li>Trainerii pot vizualiza și gestiona programările</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
