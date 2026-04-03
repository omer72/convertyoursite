# convertYourSite Component Style Guide

## Buttons

### Primary Button
```
bg-primary-600 text-white font-semibold
px-6 py-3 rounded-md shadow-sm
hover:bg-primary-700 hover:shadow-md
focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
transition-all duration-150
text-base
```
Usage: Main CTAs ("Get Free Estimate", "Send Message", "Start a Project")

### Secondary Button
```
bg-white text-primary-600 font-semibold
border-2 border-primary-600
px-6 py-3 rounded-md
hover:bg-primary-50 hover:shadow-sm
focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
transition-all duration-150
text-base
```
Usage: Secondary actions ("View Our Work", "Contact Us", "Learn More")

### Ghost Button
```
bg-transparent text-gray-700 font-medium
px-4 py-2 rounded-md
hover:bg-gray-100 hover:text-gray-900
focus:ring-2 focus:ring-gray-300
transition-all duration-150
text-sm
```
Usage: Tertiary actions, navigation items

### Button Sizes
| Size | Padding | Font |
|------|---------|------|
| `sm` | `px-4 py-2` | `text-sm` |
| `md` | `px-6 py-3` | `text-base` |
| `lg` | `px-8 py-4` | `text-lg` |

### Icon Button
- Icon left: `gap-2`, icon `w-5 h-5`
- Arrow right pattern: `[Text →]` with `ml-2` on arrow, arrow translates right 4px on hover

---

## Cards

### Service Card
```
bg-white rounded-xl shadow p-8
hover:shadow-md hover:scale-[1.01]
transition-all duration-200
border border-gray-100
```
Structure:
- Icon (40x40, primary-600 bg circle with white icon, or colored SVG)
- H3 title (`text-xl font-semibold text-gray-900 mt-4`)
- Body text (`text-gray-700 mt-2 text-base leading-relaxed`)
- Link (`text-primary-600 font-medium mt-4 inline-flex items-center`)

### Portfolio Card
```
bg-white rounded-2xl overflow-hidden shadow
hover:shadow-lg
transition-all duration-200
group
```
Structure:
- Image container (`aspect-video overflow-hidden rounded-t-2xl`)
  - Image scales 1.05 on group-hover
- Content padding (`p-6`)
- Category tag (`text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full`)
- H3 title (`text-lg font-semibold text-gray-900 mt-2`)
- Description (`text-gray-600 text-sm mt-1 line-clamp-2`)
- Link

### Testimonial Card
```
bg-white rounded-xl p-8
border border-gray-100
```
Structure:
- Quote icon (SVG, text-primary-200, 32x32)
- Quote text (`text-gray-700 text-lg italic leading-relaxed mt-4`)
- Divider (`border-t border-gray-100 mt-6 pt-4`)
- Avatar + Name + Company (flex row, avatar `w-12 h-12 rounded-full`)
- Star rating (`text-amber-400`)

### Team Card
```
bg-white rounded-xl p-6 text-center
hover:shadow-md
transition-all duration-200
```
Structure:
- Avatar (`w-24 h-24 rounded-full mx-auto object-cover`)
- Name (`text-lg font-semibold text-gray-900 mt-4`)
- Title (`text-sm text-gray-500 mt-1`)
- Bio (`text-gray-600 text-sm mt-3`)
- Social links (`flex gap-3 justify-center mt-4`)

---

## Navigation

### Desktop Navbar
```
sticky top-0 z-50
bg-white/95 backdrop-blur-sm
border-b border-gray-100
h-16
```
- Container: `max-w-7xl mx-auto px-6 flex items-center justify-between`
- Logo: left-aligned, `h-8` logo mark + "convertYourSite" wordmark in `font-bold text-gray-900`
- Nav links: `flex gap-8`, each link `text-sm font-medium text-gray-600 hover:text-gray-900`
- Active link: `text-primary-600 font-semibold` with `border-b-2 border-primary-600` (2px below)
- CTA button: Primary button (sm) right-aligned

### Mobile Navbar
- Same sticky header, logo left, hamburger icon right (`w-6 h-6`)
- Drawer: slides from right, full height, `w-80 max-w-[85vw]`
- Overlay: `bg-black/50` behind drawer
- Nav links: vertical, `py-3 px-4 text-lg font-medium`, full width tap targets
- CTA button: full width at bottom of drawer

---

## Footer

```
bg-gray-900 text-gray-300
py-16
```
- 4-column grid on desktop (Logo + tagline | Quick Links | Services | Contact)
- Logo: white version, `h-6`
- Tagline: `text-sm text-gray-400 mt-2 max-w-xs`
- Column headers: `text-sm font-semibold text-white uppercase tracking-wider mb-4`
- Links: `text-sm text-gray-400 hover:text-white transition-colors`
- Bottom bar: `border-t border-gray-800 mt-12 pt-8`
- Copyright: `text-sm text-gray-500`
- Social icons: `flex gap-4`, icons `w-5 h-5 text-gray-400 hover:text-white`

---

## Form Elements

### Text Input
```
w-full px-4 py-3
bg-white
border border-gray-300 rounded-md
text-gray-900 text-base placeholder:text-gray-400
focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
transition-colors duration-150
```

### Label
```
block text-sm font-medium text-gray-700 mb-1.5
```
Required indicator: `text-red-500 ml-0.5` asterisk

### Textarea
Same as text input, plus `min-h-[120px] resize-y`

### Select
Same as text input with chevron-down icon `absolute right-3`

### Checkbox
```
w-5 h-5 rounded border-gray-300
text-primary-600
focus:ring-primary-500 focus:ring-offset-0
```
Label: `ml-3 text-base text-gray-700`

### Form Error State
- Input: `border-red-500 focus:ring-red-500/20`
- Error text: `text-sm text-red-600 mt-1`

### Form Success State
- Success message container: `bg-emerald-50 border border-emerald-200 rounded-lg p-4`
- Icon: checkmark circle `text-emerald-500`
- Text: `text-emerald-800 font-medium`

---

## Section Headers

### Page Header
```
bg-gray-50 py-16 lg:py-20
text-center
```
- H1: `text-4xl lg:text-5xl font-extrabold text-gray-900`
- Subtitle: `text-lg text-gray-600 mt-4 max-w-2xl mx-auto`

### Section Header
- H2: `text-3xl font-bold text-gray-900 text-center`
- Optional subtitle: `text-gray-600 mt-2 text-center max-w-xl mx-auto`
- Bottom spacing: `mb-12`

---

## Stats Counter
```
text-center
```
- Number: `text-4xl lg:text-5xl font-extrabold` (white on dark bg, primary-600 on light bg)
- Label: `text-sm font-medium mt-2 uppercase tracking-wide` (white/60 on dark, gray-600 on light)

---

## Accordion (FAQ)
```
border border-gray-200 rounded-lg overflow-hidden
divide-y divide-gray-200
```
- Item header: `flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50`
- Question: `text-base font-medium text-gray-900`
- Chevron: rotates 180deg when open, `transition-transform duration-200`
- Answer: `px-6 pb-4 text-gray-600 text-base`

---

## Badges & Tags
```
inline-flex items-center
px-2.5 py-0.5
text-xs font-medium
rounded-full
```
Variants:
- Primary: `bg-primary-50 text-primary-700`
- Success: `bg-emerald-50 text-emerald-700`
- Neutral: `bg-gray-100 text-gray-700`

---

## Loading States
- Button loading: spinner icon replaces text, button disabled with `opacity-70`
- Form submit: button shows spinner + "Sending..."
- Page transition: top progress bar (primary-600, 2px height)
