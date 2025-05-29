
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { PREDEFINED_USERS } from '@/data/predefinedUsers';
import { toast } from '@/hooks/use-toast';
import { User, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulăm o verificare de credențiale
    const user = PREDEFINED_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      toast({
        title: "Eroare autentificare",
        description: "Credențiale invalide. Verifică username-ul și parola.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Autentificare reușită
    login(user);
    
    toast({
      title: "Autentificare reușită",
      description: `Bun venit, ${user.full_name}!`,
    });

    // Redirecționăm către pagina principală
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Program PNRR TechMinds Academy</h1>
          </div>
          <p className="text-gray-600">Sistem de gestionare programări pentru școli</p>
        </div>

        {/* Login Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Shield className="w-5 h-5" />
              Autentificare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nume utilizator</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Introduceți numele de utilizator"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Parolă</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduceți parola"
                  className="mt-1"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!username.trim() || !password.trim() || isLoading}
              >
                {isLoading ? 'Se autentifică...' : 'Autentificare'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="w-full mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Informații:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Introduceți credențialele pentru a accesa sistemul</li>
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
