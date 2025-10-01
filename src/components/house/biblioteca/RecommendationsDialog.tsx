import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LibraryRecommendation } from './types';

interface RecommendationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: LibraryRecommendation[];
  onAccept: (recommendationId: string) => void;
  onDecline: (recommendationId: string) => void;
}

export function RecommendationsDialog({
  open,
  onOpenChange,
  recommendations,
  onAccept,
  onDecline
}: RecommendationsDialogProps) {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const filteredRecommendations = recommendations.filter(rec => 
    filter === 'all' || rec.status === 'pending'
  );

  const typeLabel = {
    book: 'Livro',
    movie: 'Filme',
    series: 'Série',
    music: 'Música',
    link: 'Link',
    note: 'Anotação'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recomendações</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            size="sm"
          >
            Pendentes
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todas
          </Button>
        </div>

        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {filter === 'pending'
                ? 'Nenhuma recomendação pendente'
                : 'Nenhuma recomendação encontrada'}
            </p>
          ) : (
            filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex gap-4 p-4 rounded-lg border bg-card"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={rec.from_user.avatar_url} />
                  <AvatarFallback>
                    {rec.from_user.casa_name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {rec.from_user.casa_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(rec.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>

                  <p className="text-sm mb-2">
                    recomendou o {typeLabel[rec.item_type].toLowerCase()}{' '}
                    <span className="font-medium">{rec.item_title}</span>
                    {rec.item_creator && (
                      <> de <span className="font-medium">{rec.item_creator}</span></>
                    )}
                  </p>

                  {rec.note && (
                    <p className="text-sm text-muted-foreground mb-3">
                      "{rec.note}"
                    </p>
                  )}

                  {rec.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onAccept(rec.id)}
                      >
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDecline(rec.id)}
                      >
                        Recusar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {rec.status === 'accepted' ? '✅ Aceita' : '❌ Recusada'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}