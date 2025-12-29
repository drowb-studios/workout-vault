# shadcn/ui Components

This directory contains shadcn/ui components. 

## Adding Components

To add more shadcn/ui components, you can use the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc...
```

Or manually copy components from https://ui.shadcn.com/docs/components

## Example Usage

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Button variant="default">Click me</Button>
  )
}
```

## Available Variants

The Button component includes these variants:
- default
- destructive
- outline
- secondary
- ghost
- link

And these sizes:
- default
- sm
- lg
- icon





