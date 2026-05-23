import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Avatar } from '@shared/schema';

interface AvatarOption {
  id: Avatar;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  personality: string;
}

const avatarOptions: AvatarOption[] = [
  {
    id: 'Skyler',
    name: 'Skyler',
    subtitle: 'The Visionary',
    description: 'Skyler sees the big picture and inspires others with their clarity and focus on the future.',
    image: 'https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/06/bird4_sunset.svg',
    color: 'from-blue-400 to-blue-600',
    personality: 'visionary'
  },
  {
    id: 'Raven',
    name: 'Raven',
    subtitle: 'The Thinker',
    description: 'Raven is analytical and thoughtful, always diving deep to understand challenges thoroughly.',
    image: 'https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/06/bird3_candy.svg',
    color: 'from-purple-400 to-purple-600',
    personality: 'analytical'
  },
  {
    id: 'Phoenix',
    name: 'Phoenix',
    subtitle: 'The Resilient',
    description: 'Phoenix rises from challenges stronger than before, inspiring transformation and growth.',
    image: 'https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/06/bird2_cyber.svg',
    color: 'from-orange-400 to-red-600',
    personality: 'resilient'
  }
];

interface AvatarSelectionProps {
  selectedAvatar: Avatar | null;
  onAvatarSelect: (avatar: Avatar) => void;
  onNext: () => void;
}

export default function AvatarSelection({ selectedAvatar, onAvatarSelect, onNext }: AvatarSelectionProps) {
  const [hoveredAvatar, setHoveredAvatar] = useState<Avatar | null>(null);

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-foreground tracking-wider uppercase">
          Choose Your Avatar
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your avatar will guide your goal-setting journey with their unique personality and approach
        </p>
      </div>

      <div className="flex justify-center gap-8 flex-wrap">
        {avatarOptions.map((avatar) => {
          const isSelected = selectedAvatar === avatar.id;
          const isHovered = hoveredAvatar === avatar.id;
          
          return (
            <Card
              key={avatar.id}
              className={`
                relative cursor-pointer transition-all duration-300 p-6 w-72 hover-elevate
                ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-2xl transform scale-105' 
                    : 'hover:shadow-xl'
                }
              `}
              onMouseEnter={() => setHoveredAvatar(avatar.id)}
              onMouseLeave={() => setHoveredAvatar(null)}
              onClick={() => onAvatarSelect(avatar.id)}
              data-testid={`avatar-${avatar.id.toLowerCase()}`}
            >
              {/* Avatar Image */}
              <div 
                className={`
                  w-52 h-64 mx-auto mb-4 rounded-full bg-gradient-to-b ${avatar.color}
                  transition-all duration-300 overflow-hidden
                  ${
                    isSelected || isHovered
                      ? 'transform scale-110 shadow-2xl' 
                      : 'shadow-lg'
                  }
                `}
                style={{
                  backgroundImage: `url(${avatar.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Avatar Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">
                    {avatar.id === 'Skyler' ? '🦅' : avatar.id === 'Raven' ? '🦉' : '🔥'}
                  </span>
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {avatar.personality}
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  {avatar.name}
                </h3>
                
                <p className="text-lg font-semibold text-primary italic">
                  {avatar.subtitle}
                </p>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {avatar.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selected Avatar Display & Next Button */}
      <div className="space-y-6">
        {selectedAvatar && (
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg font-semibold text-primary mb-2">
              Selected: {avatarOptions.find(a => a.id === selectedAvatar)?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Your {avatarOptions.find(a => a.id === selectedAvatar)?.subtitle.toLowerCase()} will help you create a personalized goal plan.
            </p>
          </div>
        )}
        
        <Button 
          onClick={onNext}
          disabled={!selectedAvatar}
          size="lg"
          className="w-full max-w-sm mx-auto font-semibold text-lg py-6"
          data-testid="button-next-avatar"
        >
          {selectedAvatar ? 'Continue with ' + selectedAvatar : 'Select an Avatar to Continue'}
        </Button>
      </div>
    </div>
  );
}