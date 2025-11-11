import { cn } from '@/lib/utils'

export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={cn(
        'rounded-lg border border-neutral-200 bg-white text-neutral-950',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={cn('text-sm text-neutral-500', className)}>
      {children}
    </p>
  )
}
