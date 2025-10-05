# Color Fluent Brand Colors Reference

## Logo Brand Colors

These colors are based on your logo and should be used throughout the website while maintaining the dark mode theme.

### Color Names & Usage

#### 1. Logo Element Color
- **Color**: `#ffffff` (White)
- **Tailwind Class**: `text-logo-element` or `bg-logo-element`
- **Usage**: For logo elements, icons, and accent elements that need to stand out

#### 2. Logo Background Color
- **Color**: `#e8b1a3` (Soft Pink/Peach)
- **Tailwind Class**: `bg-logo-bg` or `text-logo-bg`
- **Usage**: Backgrounds, highlights, and accent areas

#### 3. Logo Text Gradient
- **Start Color**: `#9822e2` (Purple)
- **End Color**: `#b086cb` (Light Purple)
- **Tailwind Class**: `bg-gradient-logo-text` or `text-transparent bg-clip-text bg-gradient-logo-text`
- **Usage**: Text gradients, special headings, and branded text elements

### How to Use These Colors

#### For Text:
```html
<!-- White text -->
<h1 className="text-logo-element">Title</h1>

<!-- Gradient text -->
<h1 className="text-transparent bg-clip-text bg-gradient-logo-text">Gradient Title</h1>

<!-- Colored text -->
<p className="text-logo-bg">Accent text</p>
```

#### For Backgrounds:
```html
<!-- Logo background color -->
<div className="bg-logo-bg">Content</div>

<!-- Gradient background -->
<div className="bg-gradient-logo-text">Content</div>

<!-- White background -->
<div className="bg-logo-element">Content</div>
```

#### For Borders:
```html
<!-- Logo colored border -->
<div className="border-logo-bg border-2">Content</div>

<!-- White border -->
<div className="border-logo-element border-2">Content</div>
```

### Color Combinations for Dark Mode

Since your website is in dark mode, here are recommended combinations:

1. **Primary Text**: Use `text-logo-element` (white) for main text
2. **Accent Text**: Use `text-logo-bg` (soft pink) for secondary text
3. **Special Headings**: Use `bg-gradient-logo-text` for branded headings
4. **Accent Backgrounds**: Use `bg-logo-bg` for highlights and call-to-action areas
5. **Borders**: Use `border-logo-bg` for subtle borders and dividers

### When to Use Each Color

- **`logo-element` (White)**: Main text, icons, primary buttons, navigation
- **`logo-bg` (#e8b1a3)**: Accent backgrounds, secondary buttons, highlights, borders
- **`gradient-logo-text`**: Special headings, branded text, call-to-action text

### Example Usage in Components

```html
<!-- Navigation -->
<nav className="bg-logo-bg/10 border-b border-logo-bg/20">
  <a className="text-logo-element hover:text-logo-bg">Home</a>
</nav>

<!-- Hero Section -->
<h1 className="text-transparent bg-clip-text bg-gradient-logo-text text-6xl">
  Color Fluent
</h1>

<!-- Button -->
<button className="bg-logo-bg text-logo-element hover:bg-logo-bg/80">
  Get Started
</button>
```

## Quick Reference

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Logo Element | `#ffffff` | `text-logo-element` | White text/elements |
| Logo Background | `#e8b1a3` | `bg-logo-bg` | Accent backgrounds |
| Gradient Start | `#9822e2` | `text-logo-text-start` | Gradient components |
| Gradient End | `#b086cb` | `text-logo-text-end` | Gradient components |
| Logo Gradient | Both | `bg-gradient-logo-text` | Text gradients |
