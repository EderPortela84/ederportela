import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  Upload, 
  Image, 
  Video, 
  Folder, 
  MapPin, 
  Tag,
  Settings,
  Eye,
  EyeOff,
  Users,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryAlbum, GalleryPrivacy, UploadProgress } from './types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  albums: GalleryAlbum[];
  onUpload: (files: File[], albumId: string, title: string, description: string, location: string, tags: string[], privacy: GalleryPrivacy) => void;
}

export function UploadModal({ 
  isOpen, 
  onClose, 
  albums, 
  onUpload 
}: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [privacy, setPrivacy] = useState<GalleryPrivacy>('public');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  if (!isOpen) return null;

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragOver(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  async function handleUpload() {
    if (files.length === 0 || !selectedAlbum || !title.trim()) return;

    setIsUploading(true);
    
    // Simular progresso de upload
    const progress = files.map((_, index) => ({
      id: index.toString(),
      fileName: files[index].name,
      progress: 0,
      status: 'uploading' as const
    }));
    setUploadProgress(progress);

    // Simular upload progressivo
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(prev => prev.map(p => ({ ...p, progress: i })));
    }

    // Chamar função de upload real
    onUpload(files, selectedAlbum, title, description, location, tags, privacy);
    
    // Resetar formulário
    setFiles([]);
    setTitle('');
    setDescription('');
    setLocation('');
    setTags([]);
    setUploadProgress([]);
    setIsUploading(false);
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Upload de Mídia</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Área de Upload */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors",
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Arraste e solte suas fotos e vídeos aqui</h3>
            <p className="text-gray-500 mb-4">ou</p>
            
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Escolher Arquivos
            </Button>
          </div>

          {/* Lista de Arquivos */}
          {files.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Arquivos Selecionados ({files.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Video className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    
                    {uploadProgress[index] && (
                      <div className="w-20">
                        <Progress value={uploadProgress[index].progress} className="h-2" />
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Detalhes */}
          <div className="space-y-4">
            {/* Álbum */}
            <div>
              <Label htmlFor="album">Álbum *</Label>
              <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
                <SelectTrigger id="album">
                  <SelectValue placeholder="Selecione um álbum" />
                </SelectTrigger>
                <SelectContent>
                  {albums.map((album) => (
                    <SelectItem key={album.id} value={album.id}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        <span>{album.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {album.item_count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dê um título para suas mídias..."
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição (opcional)..."
                rows={3}
              />
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="location">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Onde foi tirada esta foto?"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Adicione tags (pressione Enter)"
                />
                <Button onClick={addTag} type="button">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Privacidade */}
            <div>
              <Label htmlFor="privacy">Privacidade</Label>
              <Select value={privacy} onValueChange={(value) => setPrivacy(value as GalleryPrivacy)}>
                <SelectTrigger id="privacy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Público</div>
                        <div className="text-xs text-gray-500">Todos podem ver</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Apenas Amigos</div>
                        <div className="text-xs text-gray-500">Apenas seus amigos</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Privado</div>
                        <div className="text-xs text-gray-500">Apenas você</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {getPrivacyIcon(privacy)}
            <span>{getPrivacyLabel(privacy)}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !selectedAlbum || !title.trim() || isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}