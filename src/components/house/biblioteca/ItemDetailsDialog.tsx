import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LibraryItem, LibraryItemComment } from './types';
import { useAuth } from '@/hooks/useAuth';

interface ItemDetailsDialogProps {
  item: LibraryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLike: () => void;
  onComment: (text: string) => void;
  comments: LibraryItemComment[];
}

export function ItemDetailsDialog({
  item,
  open,
  onOpenChange,
  onLike,
  onComment,
  comments
}: ItemDetailsDialogProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
    }
  };

  const typeLabel = {
    book: 'Livro',
    movie: 'Filme',
    series: 'Série',
    music: 'Música',
    link: 'Link',
    note: 'Anotação'
  }[item.type];

  const creatorLabel = {
    book: 'Autor',
    movie: 'Diretor',
    series: 'Criador',
    music: 'Artista',
    link: 'Fonte',
    note: 'Categoria'
  }[item.type];

  const statusLabel = {
    not_started: 'Quero começar',
    in_progress: 'Em andamento',
    completed: 'Concluído'
  }[item.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[200px,1fr] gap-4">
          {/* Imagem e informações básicas */}
          <div>
            <img
              src={item.cover_url || '/placeholder-cover.jpg'}
              alt={item.title}
              className="w-full rounded-lg shadow-md"
            />
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-semibold">Tipo:</span> {typeLabel}</p>
              <p><span className="font-semibold">{creatorLabel}:</span> {item.creator}</p>
              <p><span className="font-semibold">Status:</span> {statusLabel}</p>
              <p><span className="font-semibold">Curtidas:</span> {item.likes_count}</p>
            </div>
            <Button
              onClick={onLike}
              variant={item.user_has_liked ? "default" : "outline"}
              className="w-full mt-4"
            >
              {item.user_has_liked ? '❤️ Curtido' : '🤍 Curtir'}
            </Button>
          </div>

          {/* Anotações e comentários */}
          <div className="space-y-4">
            {item.notes && (
              <div>
                <h4 className="font-semibold mb-2">Anotações</h4>
                <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Comentários</h4>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user.avatar_url} />
                      <AvatarFallback>
                        {comment.user.casa_name?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.casa_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {user && (
                  <form onSubmit={handleSubmitComment} className="mt-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      className="mb-2"
                    />
                    <Button
                      type="submit"
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      Comentar
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}