import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, TrendingUp } from 'lucide-react';

export default function Neighborhood() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Vizinhança</h1>
          <p className="text-gray-600">Explore a comunidade T-Ville</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Moradores Online</CardTitle>
              <CardDescription>Veja quem está conectado agora</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Moradores
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Explorar Ruas</CardTitle>
              <CardDescription>Navegue pelas ruas da cidade</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Explorar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>Em Alta</CardTitle>
              <CardDescription>Casas mais visitadas hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Ranking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
