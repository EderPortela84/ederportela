import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { LibraryItemType } from './types';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    type: LibraryItemType;
    title: string;
    creator: string;
    cover_url: string;
    content: string;
    url?: string;
  }) => void;
}

const ITEM_TYPES: { value: LibraryItemType; label: string }[] = [
  { value: 'book', label: 'Livro' },
  { value: 'movie', label: 'Filme' },
  { value: 'series', label: 'Série' },
  { value: 'music', label: 'Música' },
  { value: 'link', label: 'Link Útil' },
  { value: 'note', label: 'Anotação' }
];

export function AddItemDialog({ open, onOpenChange, onSubmit }: AddItemDialogProps) {
  const [type, setType] = useState<LibraryItemType>('book');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      title,
      creator,
      cover_url: coverUrl,
      content: notes,
      url: type === 'link' ? url : undefined,
    });
  };

  const creatorLabel = {
    book: 'Autor',
    movie: 'Diretor',
    series: 'Criador',
    music: 'Artista',
    link: 'Fonte',
    note: 'Categoria'
  }[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item à Biblioteca</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as LibraryItemType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map(itemType => (
                  <SelectItem key={itemType.value} value={itemType.value}>
                    {itemType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator">{creatorLabel}</Label>
            <Input
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
            />
          </div>

          {type === 'link' && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required={type === 'link'}
              />
            </div>
          )}

          {type !== 'link' && type !== 'note' && (
            <div className="space-y-2">
              <Label htmlFor="coverUrl">URL da Capa/Imagem</Label>
              <Input
                id="coverUrl"
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione suas anotações..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}