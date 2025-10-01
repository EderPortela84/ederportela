import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Chrome as Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Parece que você se perdeu na cidade. Esta página não existe ou foi movida.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
}
