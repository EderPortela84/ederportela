import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import SalaDeEstar from '@/components/house/SalaDeEstar';
import { Building2 } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();

  const isOwnProfile = !userId || userId === user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">
            {isOwnProfile ? 'Minha Casa' : 'Casa do Vizinho'}
          </h1>
        </div>
        <SalaDeEstar userId={userId || user?.id} />
      </div>
    </div>
  );
}
