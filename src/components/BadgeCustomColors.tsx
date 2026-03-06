import { Badge } from "@/components/ui/badge"

interface BadgeCustomColorsProps {
  color: 'blue' | 'green' | 'sky' | 'purple' | 'red'
  children: React.ReactNode
}

export function BadgeCustomColors({ color, children }: BadgeCustomColorsProps) {
  const colorClasses = {
    blue: {
      light: 'bg-blue-50 text-blue-700',
      dark: 'dark:bg-blue-950 dark:text-blue-300',
    },
    green: {
      light: 'bg-green-50 text-green-700',
      dark: 'dark:bg-green-950 dark:text-green-300',
    },
    sky: {
      light: 'bg-sky-50 text-sky-700',
      dark: 'dark:bg-sky-950 dark:text-sky-300',
    },
    purple: {
      light: 'bg-purple-50 text-purple-700',
      dark: 'dark:bg-purple-950 dark:text-purple-300',
    },
    red: {
      light: 'bg-red-50 text-red-700',
      dark: 'dark:bg-red-950 dark:text-red-300',
    },
  }

  const { light, dark } = colorClasses[color]

  return (
    <Badge className={`${light} ${dark}`}>
      {children}
    </Badge>
  )
}
