import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/label';
import { 
  X, 
  Image, 
  Folder, 
  Globe,
  Users,
  Lock,
  Camera,
  Heart,
  Star,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryPrivacy } from './types';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, coverUrl: string, privacy: GalleryPrivacy) => void;
}

const SUGGESTED_TITLES = [
  { icon: Calendar, label: 'Férias de Verão 2024', color: 'text-blue-600' },
  { icon: Heart, label: 'Momentos Especiais', color: 'text-red-600' },
  { icon: Camera, label: 'Ensaio Fotográfico', color: 'text-purple-600' },
  { icon: MapPin, label: 'Viagem Inesquecível', color: 'text-green-600' },
  { icon: Star, label: 'Aniversário Mágico', color: 'text-yellow-600' },
  { icon: Sparkles, label: 'Festa Inesquecível', color: 'text-pink-600' }
];

const COVER_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&crop=center'
];

export function AlbumModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: AlbumModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [privacy, setPrivacy] = useState<GalleryPrivacy>('public');
  const [customCover, setCustomCover] = useState('');
  const [useCustomCover, setUseCustomCover] = useState(false);

  if (!isOpen) return null;

  function handleCreate() {
    if (!name.trim()) return;
    
    const finalCoverUrl = useCustomCover ? customCover : coverUrl;
    onCreate(name, description, finalCoverUrl, privacy);
    
    // Resetar formulário
    setName('');
    setDescription('');
    setCoverUrl('');
    setCustomCover('');
    setUseCustomCover(false);
    setPrivacy('public');
    
    onClose();
  }

  function handleSuggestedTitle(title: string) {
    setName(title);
  }

  function handleCoverSuggestion(url: string) {
    setCoverUrl(url);
    setUseCustomCover(false);
  }

  function getPrivacyIcon(privacyLevel: GalleryPrivacy) {
    switch (privacyLevel) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'friends': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
    }
  }

  function getPrivacyLabel(privacyLevel: GalleryPrivacy) {
    switch (privacyLevel) {
      case 'public': return 'Público';
      case 'friends': return 'Apenas Amigos';
      case 'private': return 'Privado';
    }
  }

  function getPrivacyDescription(privacyLevel: GalleryPrivacy) {
    switch (privacyLevel) {
      case 'public': return 'Todos podem ver este álbum';
      case 'friends': return 'Apenas seus amigos podem ver';
      case 'private': return 'Apenas você pode ver';
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Criar Novo Álbum</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Sugestões de Títulos */}
          <div className="mb-6">
            <Label className="mb-3 block">Sugestões de Títulos Nostálgicos</Label>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_TITLES.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestedTitle(suggestion.label)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-md",
                      name === suggestion.label 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", suggestion.color)} />
                    <span className="text-sm font-medium">{suggestion.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nome do Álbum */}
          <div className="mb-4">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Nome do Álbum *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minhas Férias Incríveis, Festa de Aniversário..."
              className="mt-1"
            />
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <Label htmlFor="description" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte uma história sobre este álbum..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Capa do Álbum */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <Image className="h-4 w-4" />
              Capa do Álbum
            </Label>
            
            {!useCustomCover ? (
              <>
                <p className="text-sm text-gray-600 mb-3">Escolha uma imagem de capa para seu álbum:</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {COVER_SUGGESTIONS.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => handleCoverSuggestion(url)}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:shadow-md",
                        coverUrl === url 
                          ? "border-purple-500 ring-2 ring-purple-200" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <img
                        src={url}
                        alt={`Capa ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {coverUrl === url && (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-1">
                            <Star className="h-4 w-4 text-purple-500 fill-current" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setUseCustomCover(true)}
                  className="w-full gap-2"
                >
                  <Image className="h-4 w-4" />
                  Usar URL Personalizada
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Input
                  value={customCover}
                  onChange={(e) => setCustomCover(e.target.value)}
                  placeholder="Cole a URL da imagem de capa..."
                />
                
                {customCover && (
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={customCover}
                      alt="Prévia da capa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTEyLjVMMjEwIDExNy41TDIwMCAxMTIuNUwxOTAgMTE3LjVMMjAwIDExMi41WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setUseCustomCover(false);
                    setCustomCover('');
                  }}
                  className="w-full"
                >
                  Voltar para Sugestões
                </Button>
              </div>
            )}
          </div>

          {/* Privacidade */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              {getPrivacyIcon(privacy)}
              Privacidade do Álbum
            </Label>
            
            <Select value={privacy} onValueChange={(value) => setPrivacy(value as GalleryPrivacy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Público</div>
                      <div className="text-xs text-gray-500">Todos podem ver este álbum</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Apenas Amigos</div>
                      <div className="text-xs text-gray-500">Apenas seus amigos podem ver</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium">Privado</div>
                      <div className="text-xs text-gray-500">Apenas você pode ver</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getPrivacyIcon(privacy)}
                <span>{getPrivacyDescription(privacy)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            * Campos obrigatórios
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Folder className="h-4 w-4" />
              Criar Álbum
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}