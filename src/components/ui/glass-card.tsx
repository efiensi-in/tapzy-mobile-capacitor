import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'liquid-glass rounded-xl',
      strong: 'liquid-glass rounded-xl',
      subtle: 'liquid-glass-subtle rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          'p-4',
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

type GlassCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCardHeader = React.forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);
GlassCardHeader.displayName = 'GlassCardHeader';

type GlassCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, GlassCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
GlassCardTitle.displayName = 'GlassCardTitle';

type GlassCardContentProps = React.HTMLAttributes<HTMLDivElement>;

const GlassCardContent = React.forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
GlassCardContent.displayName = 'GlassCardContent';

export { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent };
