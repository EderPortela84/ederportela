import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import { Building2, Users, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8 mb-16">
          <div className="flex items-center gap-3">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              T-Ville
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Sua comunidade urbana online. Conecte-se com vizinhos, compartilhe experiências e construa relacionamentos.
          </p>

          {!user && (
            <div className="flex gap-4 mt-8">
              <Button size="lg" className="text-lg px-8" onClick={() => navigate('/auth')}>
                Começar
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Saiba Mais
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Conecte-se</CardTitle>
              <CardDescription>
                Faça amigos, visite casas e participe da comunidade
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="w-10 h-10 text-red-600 mb-2" />
              <CardTitle>Compartilhe</CardTitle>
              <CardDescription>
                Deixe recados, compartilhe momentos e construa memórias
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Ambiente Seguro</CardTitle>
              <CardDescription>
                Moderação ativa e regras claras para todos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
