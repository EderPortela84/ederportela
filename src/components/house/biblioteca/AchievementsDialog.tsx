import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import type { LibraryAchievement } from './types';

interface AchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: LibraryAchievement[];
}

const ACHIEVEMENT_ICONS = {
  'reader_beginner': '📚',
  'reader_intermediate': '📖',
  'reader_advanced': '📓',
  'cinephile_beginner': '🎬',
  'cinephile_intermediate': '🎥',
  'cinephile_advanced': '🎭',
  'music_lover_beginner': '🎵',
  'music_lover_intermediate': '🎼',
  'music_lover_advanced': '🎹',
  'collector_beginner': '🏆',
  'collector_intermediate': '🌟',
  'collector_advanced': '👑'
};

const ACHIEVEMENT_TITLES = {
  'reader_beginner': 'Leitor Iniciante',
  'reader_intermediate': 'Leitor Ávido',
  'reader_advanced': 'Mestre da Literatura',
  'cinephile_beginner': 'Cinéfilo Iniciante',
  'cinephile_intermediate': 'Cinéfilo Experiente',
  'cinephile_advanced': 'Mestre do Cinema',
  'music_lover_beginner': 'Amante da Música',
  'music_lover_intermediate': 'Colecionador de Sons',
  'music_lover_advanced': 'Maestro da Biblioteca',
  'collector_beginner': 'Colecionador Iniciante',
  'collector_intermediate': 'Colecionador Dedicado',
  'collector_advanced': 'Colecionador Mestre'
};

export function AchievementsDialog({
  open,
  onOpenChange,
  achievements
}: AchievementsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Conquistas da Biblioteca</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-secondary/50'
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {ACHIEVEMENT_ICONS[achievement.type as keyof typeof ACHIEVEMENT_ICONS]}
                </span>
                <div>
                  <h4 className="font-semibold">
                    {ACHIEVEMENT_TITLES[achievement.type as keyof typeof ACHIEVEMENT_TITLES]}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>
                    {achievement.current_count} / {achievement.required_count}
                  </span>
                </div>
                <Progress
                  value={(achievement.current_count / achievement.required_count) * 100}
                />
              </div>

              {achievement.unlocked && (
                <div className="mt-2 text-sm text-muted-foreground">
                  🎉 Conquista desbloqueada em{' '}
                  {new Date(achievement.unlocked_at!).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}