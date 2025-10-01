import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  Sun, 
  Contrast, 
  Palette, 
  Camera,
  Zap,
  Heart,
  Star,
  Clock,
  RotateCcw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaFilter } from './types';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filter: MediaFilter) => void;
  onResetFilters: () => void;
  currentFilter?: MediaFilter;
}

interface FilterPreset {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  filter: MediaFilter;
  description: string;
  color: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    name: 'Retrô Orkut',
    icon: Clock,
    filter: {
      brightness: 110,
      contrast: 120,
      saturation: 80,
      sepia: 20,
      blur: 0,
      grayscale: 0,
      hueRotate: 0,
      invert: 0
    },
    description: 'Efeito nostálgico dos anos 2000',
    color: 'text-orange-600'
  },
  {
    name: 'Vintage 90s',
    icon: Camera,
    filter: {
      brightness: 105,
      contrast: 110,
      saturation: 60,
      sepia: 40,
      blur: 0,
      grayscale: 0,
      hueRotate: 15,
      invert: 0
    },
    description: 'Estilo fotográfico dos anos 90',
    color: 'text-amber-600'
  },
  {
    name: 'High Contrast',
    icon: Contrast,
    filter: {
      brightness: 100,
      contrast: 150,
      saturation: 120,
      sepia: 0,
      blur: 0,
      grayscale: 0,
      hueRotate: 0,
      invert: 0
    },
    description: 'Contraste elevado para impacto visual',
    color: 'text-blue-600'
  },
  {
    name: 'Soft Glow',
    icon: Sun,
    filter: {
      brightness: 115,
      contrast: 95,
      saturation: 110,
      sepia: 5,
      blur: 0.5,
      grayscale: 0,
      hueRotate: 0,
      invert: 0
    },
    description: 'Brilho suave e acolhedor',
    color: 'text-yellow-600'
  },
  {
    name: 'Black & White',
    icon: Sparkles,
    filter: {
      brightness: 100,
      contrast: 130,
      saturation: 0,
      sepia: 0,
      blur: 0,
      grayscale: 100,
      hueRotate: 0,
      invert: 0
    },
    description: 'Clássico preto e branco',
    color: 'text-gray-600'
  },
  {
    name: 'Dreamy',
    icon: Heart,
    filter: {
      brightness: 108,
      contrast: 90,
      saturation: 125,
      sepia: 10,
      blur: 1,
      grayscale: 0,
      hueRotate: -10,
      invert: 0
    },
    description: 'Efeito sonhador e romântico',
    color: 'text-pink-600'
  },
  {
    name: 'Dramatic',
    icon: Zap,
    filter: {
      brightness: 95,
      contrast: 160,
      saturation: 140,
      sepia: 0,
      blur: 0,
      grayscale: 0,
      hueRotate: 5,
      invert: 0
    },
    description: 'Drama e intensidade visual',
    color: 'text-red-600'
  },
  {
    name: 'Golden Hour',
    icon: Star,
    filter: {
      brightness: 112,
      contrast: 105,
      saturation: 115,
      sepia: 25,
      blur: 0,
      grayscale: 0,
      hueRotate: 20,
      invert: 0
    },
    description: 'Luz dourada do pôr do sol',
    color: 'text-yellow-500'
  }
];

export function FiltersPanel({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  onResetFilters, 
  currentFilter 
}: FiltersPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customFilter, setCustomFilter] = useState<MediaFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    blur: 0,
    grayscale: 0,
    hueRotate: 0,
    invert: 0
  });
  const [showCustom, setShowCustom] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  if (!isOpen) return null;

  function handlePresetSelect(preset: FilterPreset) {
    setSelectedPreset(preset.name);
    setCustomFilter(preset.filter);
    if (previewEnabled) {
      onApplyFilter(preset.filter);
    }
  }

  function handleCustomChange(property: keyof MediaFilter, value: number) {
    const newFilter = { ...customFilter, [property]: value };
    setCustomFilter(newFilter);
    setSelectedPreset('');
    if (previewEnabled) {
      onApplyFilter(newFilter);
    }
  }

  function handleApply() {
    onApplyFilter(customFilter);
    onClose();
  }

  function handleReset() {
    const defaultFilter: MediaFilter = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      grayscale: 0,
      hueRotate: 0,
      invert: 0
    };
    setCustomFilter(defaultFilter);
    setSelectedPreset('');
    onResetFilters();
  }

  function getFilterStyle(filter: MediaFilter) {
    return {
      filter: `
        brightness(${filter.brightness}%)
        contrast(${filter.contrast}%)
        saturate(${filter.saturation}%)
        sepia(${filter.sepia}%)
        blur(${filter.blur}px)
        grayscale(${filter.grayscale}%)
        hue-rotate(${filter.hueRotate}deg)
        invert(${filter.invert}%)
      `.replace(/\s+/g, ' ').trim()
    };
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filtros e Efeitos Visuais</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewEnabled(!previewEnabled)}
              className="text-white hover:bg-white/20"
            >
              {previewEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Painel de Filtros */}
          <div className="w-80 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              {/* Botões de Ação */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1 gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Resetar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustom(!showCustom)}
                  className="flex-1"
                >
                  {showCustom ? 'Predefinidos' : 'Personalizar'}
                </Button>
              </div>

              {!showCustom ? (
                /* Filtros Predefinidos */
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Filtros Nostálgicos</h3>
                  {FILTER_PRESETS.map((preset) => {
                    const IconComponent = preset.icon;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className={cn(
                          "w-full p-3 rounded-lg border-2 text-left transition-all hover:shadow-md",
                          selectedPreset === preset.name
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={cn("h-5 w-5", preset.color)} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{preset.name}</div>
                            <div className="text-xs text-gray-500">{preset.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Controles Personalizados */
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Ajustes Personalizados</h3>
                  
                  {/* Brilho */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Brilho</Label>
                      <span className="text-xs text-gray-500">{customFilter.brightness}%</span>
                    </div>
                    <Slider
                      value={[customFilter.brightness]}
                      onValueChange={(value) => handleCustomChange('brightness', value[0])}
                      min={50}
                      max={150}
                      step={5}
                    />
                  </div>

                  {/* Contraste */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Contraste</Label>
                      <span className="text-xs text-gray-500">{customFilter.contrast}%</span>
                    </div>
                    <Slider
                      value={[customFilter.contrast]}
                      onValueChange={(value) => handleCustomChange('contrast', value[0])}
                      min={50}
                      max={200}
                      step={5}
                    />
                  </div>

                  {/* Saturação */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Saturação</Label>
                      <span className="text-xs text-gray-500">{customFilter.saturation}%</span>
                    </div>
                    <Slider
                      value={[customFilter.saturation]}
                      onValueChange={(value) => handleCustomChange('saturation', value[0])}
                      min={0}
                      max={200}
                      step={5}
                    />
                  </div>

                  {/* Sépia */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Sépia</Label>
                      <span className="text-xs text-gray-500">{customFilter.sepia}%</span>
                    </div>
                    <Slider
                      value={[customFilter.sepia]}
                      onValueChange={(value) => handleCustomChange('sepia', value[0])}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  {/* Desfoque */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Desfoque</Label>
                      <span className="text-xs text-gray-500">{customFilter.blur}px</span>
                    </div>
                    <Slider
                      value={[customFilter.blur]}
                      onValueChange={(value) => handleCustomChange('blur', value[0])}
                      min={0}
                      max={5}
                      step={0.5}
                    />
                  </div>

                  {/* Escala de Cinza */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Escala de Cinza</Label>
                      <span className="text-xs text-gray-500">{customFilter.grayscale}%</span>
                    </div>
                    <Slider
                      value={[customFilter.grayscale]}
                      onValueChange={(value) => handleCustomChange('grayscale', value[0])}
                      min={0}
                      max={100}
                      step={10}
                    />
                  </div>

                  {/* Rotação de Matiz */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Matiz</Label>
                      <span className="text-xs text-gray-500">{customFilter.hueRotate}°</span>
                    </div>
                    <Slider
                      value={[customFilter.hueRotate]}
                      onValueChange={(value) => handleCustomChange('hueRotate', value[0])}
                      min={-180}
                      max={180}
                      step={15}
                    />
                  </div>

                  {/* Inversão */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Inversão</Label>
                      <span className="text-xs text-gray-500">{customFilter.invert}%</span>
                    </div>
                    <Slider
                      value={[customFilter.invert]}
                      onValueChange={(value) => handleCustomChange('invert', value[0])}
                      min={0}
                      max={100}
                      step={10}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Área de Pré-visualização */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 relative">
            <div className="text-center">
              <div 
                className="w-80 h-60 mx-auto mb-4 rounded-lg shadow-lg overflow-hidden"
                style={previewEnabled ? getFilterStyle(customFilter) : {}}
              >
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                  alt="Pré-visualização"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-gray-600 text-sm">
                {previewEnabled ? 'Pré-visualização ativa' : 'Pré-visualização desativada'}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button
              onClick={handleApply}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="h-4 w-4" />
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}