import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  Trophy, 
  Star, 
  Heart, 
  Camera, 
  Users,
  Clock,
  Zap,
  Award,
  Crown,
  Gem,
  Shield,
  Flame,
  Sparkles,
  Target,
  Share2,
  Eye,
  Download,
  Lock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryAchievement } from './types';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: GalleryAchievement[];
  userStats: {
    totalPhotos: number;
    totalVideos: number;
    totalAlbums: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
    streakDays: number;
  };
}

const ACHIEVEMENT_TIERS = {
  bronze: { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Trophy },
  silver: { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Star },
  gold: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Crown },
  platinum: { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Gem }
};

const CATEGORY_ICONS = {
  upload: Camera,
  social: Heart,
  views: Eye,
  sharing: Share2,
  collection: Award,
  streak: Flame
};

export function AchievementsPanel({ 
  isOpen, 
  onClose, 
  achievements, 
  userStats 
}: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLocked, setShowLocked] = useState(true);

  if (!isOpen) return null;

  function getProgressPercentage(achievement: GalleryAchievement): number {
    if (achievement.is_unlocked) return 100;
    return Math.min((achievement.progress / achievement.requirement) * 100, 100);
  }

  function getCategoryIcon(category: string) {
    const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Award;
    return IconComponent;
  }

  function getTierInfo(tier: string) {
    return ACHIEVEMENT_TIERS[tier as keyof typeof ACHIEVEMENT_TIERS] || ACHIEVEMENT_TIERS.bronze;
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function formatRequirement(requirement: number, type: string): string {
    switch (type) {
      case 'upload_photos':
        return `${requirement} fotos`;
      case 'upload_videos':
        return `${requirement} vídeos`;
      case 'create_albums':
        return `${requirement} álbuns`;
      case 'get_likes':
        return `${requirement} curtidas`;
      case 'get_comments':
        return `${requirement} comentários`;
      case 'share_content':
        return `${requirement} compartilhamentos`;
      case 'get_views':
        return `${requirement} visualizações`;
      case 'daily_streak':
        return `${requirement} dias`;
      default:
        return `${requirement} pontos`;
    }
  }

  function getCurrentStatValue(type: string): number {
    switch (type) {
      case 'upload_photos': return userStats.totalPhotos;
      case 'upload_videos': return userStats.totalVideos;
      case 'create_albums': return userStats.totalAlbums;
      case 'get_likes': return userStats.totalLikes;
      case 'get_comments': return userStats.totalComments;
      case 'share_content': return userStats.totalShares;
      case 'get_views': return userStats.totalViews;
      case 'daily_streak': return userStats.streakDays;
      default: return 0;
    }
  }

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const unlockedPoints = achievements.filter(a => a.is_unlocked).reduce((sum, a) => sum + a.points, 0);

  const categories = ['all', ...Array.from(new Set(achievements.map(a => a.category)))];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Conquistas da Galeria</h2>
              <p className="text-sm opacity-90">
                {unlockedCount} de {achievements.length} conquistas desbloqueadas
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Painel Lateral */}
          <div className="w-80 border-r bg-gray-50 overflow-y-auto">
            {/* Progresso Geral */}
            <div className="p-4 border-b">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-3">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{formatNumber(unlockedPoints)}</h3>
                <p className="text-sm text-gray-500">Pontos de Conquista</p>
              </div>
              
              <Progress value={(unlockedCount / achievements.length) * 100} className="mb-2" />
              <p className="text-xs text-center text-gray-500">
                {unlockedCount}/{achievements.length} conquistas
              </p>
            </div>

            {/* Estatísticas do Usuário */}
            <div className="p-4 border-b">
              <h4 className="font-medium mb-3">Suas Estatísticas</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fotos</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(userStats.totalPhotos)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Vídeos</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(userStats.totalVideos)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Álbuns</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(userStats.totalAlbums)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Curtidas</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(userStats.totalLikes)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Visualizações</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(userStats.totalViews)}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Sequência</span>
                  </div>
                  <Badge variant="secondary">{userStats.streakDays} dias</Badge>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="p-4">
              <h4 className="font-medium mb-3">Categorias</h4>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category);
                  const count = category === 'all' 
                    ? achievements.length 
                    : achievements.filter(a => a.category === category).length;
                  const unlockedInCategory = category === 'all'
                    ? unlockedCount
                    : achievements.filter(a => a.category === category && a.is_unlocked).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all hover:shadow-md",
                        selectedCategory === category
                          ? "bg-purple-100 border-2 border-purple-300"
                          : "bg-white border border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-purple-600" />
                          <span className="font-medium capitalize">
                            {category === 'all' ? 'Todas' : category}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {unlockedInCategory}/{count}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lista de Conquistas */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Controles de Visualização */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {filteredAchievements.filter(a => a.is_unlocked).length} Desbloqueadas
                  </Badge>
                  <Badge variant="outline" className="border-orange-200 text-orange-600">
                    {filteredAchievements.filter(a => !a.is_unlocked).length} Bloqueadas
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocked(!showLocked)}
                  className="gap-2"
                >
                  {showLocked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {showLocked ? 'Ocultar' : 'Mostrar'} Bloqueadas
                </Button>
              </div>

              {/* Grid de Conquistas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements
                  .filter(a => showLocked || a.is_unlocked)
                  .map((achievement) => {
                    const tierInfo = getTierInfo(achievement.tier);
                    const IconComponent = tierInfo.icon;
                    const progress = getProgressPercentage(achievement);
                    const currentValue = getCurrentStatValue(achievement.type);
                    
                    return (
                      <Card
                        key={achievement.id}
                        className={cn(
                          "p-4 transition-all hover:shadow-lg",
                          achievement.is_unlocked
                            ? "bg-white border-2"
                            : "bg-gray-50 border border-gray-200 opacity-75"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Ícone da Conquista */}
                          <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0",
                            achievement.is_unlocked
                              ? tierInfo.bgColor
                              : "bg-gray-200"
                          )}>
                            {achievement.is_unlocked ? (
                              <IconComponent className={cn("h-6 w-6", tierInfo.color)} />
                            ) : (
                              <Lock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Informações */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className={cn(
                                  "font-semibold",
                                  achievement.is_unlocked ? "text-gray-900" : "text-gray-500"
                                )}>
                                  {achievement.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                  {achievement.description}
                                </p>
                              </div>
                              
                              {/* Pontos */}
                              <div className="text-right">
                                <Badge variant="secondary" className="mb-1">
                                  {achievement.points} pts
                                </Badge>
                                <div className={cn(
                                  "text-xs font-medium",
                                  tierInfo.color
                                )}>
                                  {achievement.tier.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            
                            {/* Progresso */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>
                                  {achievement.is_unlocked 
                                    ? 'Conquistado!' 
                                    : `${formatNumber(currentValue)} / ${formatRequirement(achievement.requirement, achievement.type)}`
                                  }
                                </span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress 
                                value={progress} 
                                className={cn(
                                  "h-2",
                                  achievement.is_unlocked && "bg-green-200"
                                )}
                              />
                            </div>
                            
                            {/* Data de Desbloqueio */}
                            {achievement.is_unlocked && achievement.unlocked_at && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                <span>
                                  Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            )}
                            
                            {/* Recompensas */}
                            {achievement.rewards && achievement.rewards.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {achievement.rewards.map((reward, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {reward}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
              
              {filteredAchievements.filter(a => showLocked || a.is_unlocked).length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    Nenhuma conquista encontrada
                  </h3>
                  <p className="text-gray-400">
                    Continue explorando a galeria para desbloquear novas conquistas!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}