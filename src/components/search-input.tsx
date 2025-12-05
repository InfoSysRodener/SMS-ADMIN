import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type SearchProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  onSearch?: (value: string) => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onSearch,
  ...props
}: SearchProps & Omit<React.ComponentProps<typeof Input>, 'onChange'>) {
  const [searchValue, setSearchValue] = React.useState(value || '')

  React.useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-9"
        {...props}
      />
    </div>
  )
}
