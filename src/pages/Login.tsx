import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (!error) {
          toast({
            title: 'Conta criada com sucesso',
            description: 'Verifique o seu email para confirmar a conta.',
          });
          // Após confirmar email, faça login e será redirecionado
        } else {
          toast({
            title: 'Erro ao criar conta',
            description: error,
            variant: 'destructive',
          });
        }
      } else {
        const { error } = await login(email, password);
        if (!error) {
          toast({
            title: 'Login realizado com sucesso',
            description: 'Bem-vindo à área de administração',
          });
          navigate('/admin');
        } else {
          toast({
            title: 'Credenciais inválidas',
            description: error,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{isSignUp ? 'Criar conta' : 'Admin Login'}</CardTitle>
          <p className="text-muted-foreground">
            {isSignUp ? 'Crie a sua conta para aceder' : 'Acesso restrito à área de administração'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? 'A criar...' : 'Entrando...') : (isSignUp ? 'Criar conta' : 'Entrar')}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {isSignUp ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
              <button
                type="button"
                className="underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Entrar' : 'Criar conta'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;