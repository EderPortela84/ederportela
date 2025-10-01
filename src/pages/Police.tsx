import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Flag } from 'lucide-react';

export default function Police() {
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
        <div className="mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Delegacia</h1>
            <p className="text-gray-600">Central de segurança e moderação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Flag className="w-8 h-8 text-red-600 mb-2" />
              <CardTitle>Reportar Conteúdo</CardTitle>
              <CardDescription>
                Denuncie conteúdo impróprio ou que viole nossas diretrizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ajude a manter a T-Ville um lugar seguro para todos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle>Diretrizes da Comunidade</CardTitle>
              <CardDescription>
                Conheça as regras e boas práticas da T-Ville
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Respeito, segurança e diversão para todos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
