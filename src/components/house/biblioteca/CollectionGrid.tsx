import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ItemDetailsDialog } from './ItemDetailsDialog';
import type { LibraryItem, ConsumptionStatus } from './types';

interface CollectionGridProps {
  items: LibraryItem[];
  onLike: (itemId: string) => void;
  onComment: (itemId: string, text: string) => void;
  onUpdateStatus: (itemId: string, status: ConsumptionStatus) => void;
  onDelete: (itemId: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'not_started', label: '⏳ Quero começar' },
  { value: 'in_progress', label: '📖 Em andamento' },
  { value: 'completed', label: '✅ Concluído' }
] as const;

export function CollectionGrid({
  items,
  onLike,
  onComment,
  onUpdateStatus,
  onDelete
}: CollectionGridProps) {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum item encontrado nesta coleção.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="group relative">
            <CardHeader className="p-0">
              <div
                className="aspect-[2/3] rounded-t-lg bg-muted cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {{
                      book: '📚',
                      movie: '🎬',
                      series: '📺',
                      music: '🎵',
                      link: '🔗',
                      note: '📝'
                    }[item.type]}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <h3
                className="font-medium truncate cursor-pointer"
                onClick={() => setSelectedItem(item)}
                title={item.title}
              >
                {item.title}
              </h3>
              {item.creator && (
                <p
                  className="text-sm text-muted-foreground truncate"
                  title={item.creator}
                >
                  {item.creator}
                </p>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Button
                variant={item.user_has_liked ? 'default' : 'outline'}
                size="sm"
                className="w-20"
                onClick={() => onLike(item.id)}
              >
                {item.user_has_liked ? '❤️' : '🤍'} {item.likes_count}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setSelectedItem(item)}
                  >
                    Ver detalhes
                  </DropdownMenuItem>
                  {STATUS_OPTIONS.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onUpdateStatus(item.id, option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    🗑️ Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>

            {/* Status Badge */}
            {item.status && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                {{
                  not_started: '⏳',
                  in_progress: '📖',
                  completed: '✅'
                }[item.status]}
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailsDialog
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
          onLike={() => onLike(selectedItem.id)}
          onComment={(text) => onComment(selectedItem.id, text)}
          comments={selectedItem.comments || []}
        />
      )}
    </>
  );
}