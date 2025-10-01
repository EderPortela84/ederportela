import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              T-Ville
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Sua comunidade urbana online. Conecte-se com vizinhos, compartilhe experiências e construa relacionamentos.
          </p>

          <div className="flex gap-4 mt-8">
            <Button size="lg" className="text-lg px-8">
              Começar
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
