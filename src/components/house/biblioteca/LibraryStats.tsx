import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LibraryStats as LibraryStatsType } from './types';

interface LibraryStatsProps {
  stats: LibraryStatsType;
}

export function LibraryStats({ stats }: LibraryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Total de Itens
            </h3>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <span className="text-2xl">📚</span>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Livros</span>
            <span>{stats.byType.book}</span>
          </div>
          <div className="flex justify-between">
            <span>Filmes/Séries</span>
            <span>{stats.byType.movie + stats.byType.series}</span>
          </div>
          <div className="flex justify-between">
            <span>Músicas</span>
            <span>{stats.byType.music}</span>
          </div>
          <div className="flex justify-between">
            <span>Outros</span>
            <span>{stats.byType.link + stats.byType.note}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Em Andamento
            </h3>
            <p className="text-2xl font-bold">
              {stats.recentlyAdded.filter(item => item.status === 'in_progress').length}
            </p>
          </div>
          <span className="text-2xl">📖</span>
        </div>
        <div className="mt-4 text-sm">
          {stats.recentlyAdded
            .filter(item => item.status === 'in_progress')
            .map((item) => (
              <div
                key={item.id}
                className="truncate text-muted-foreground"
                title={item.title}
              >
                • {item.title}
              </div>
            ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Favoritos
            </h3>
            <p className="text-2xl font-bold">
              {Object.values(stats.favoritesByType)
                .reduce((acc, curr) => acc + curr.length, 0)}
            </p>
          </div>
          <span className="text-2xl">⭐</span>
        </div>
        <div className="mt-4 text-sm">
          {stats.topRated.map((item) => (
            <div
              key={item.id}
              className="truncate text-muted-foreground"
              title={item.title}
            >
              • {item.title} {item.rating ? `(${item.rating}⭐)` : ''}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Recentes
            </h3>
            <p className="text-2xl font-bold">
              {stats.recentlyAdded.length}
            </p>
          </div>
          <span className="text-2xl">🆕</span>
        </div>
        <div className="mt-4 text-sm">
          {stats.recentlyAdded.map((item) => (
            <div
              key={item.id}
              className="truncate text-muted-foreground"
              title={item.title}
            >
              • {item.title}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}