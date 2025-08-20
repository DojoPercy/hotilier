# Energy Nexus Color Scheme

## Primary Brand Colors

### Blue Theme
- **Main Brand Blue**: `#262262` — Main brand color for nav bars, key headings, accents
- **Vibrant Blue**: `#635DFF` — Call-to-action buttons, hover effects

### Neutral Base Colors
- **White**: `#FFFFFF` — Main background for readability
- **Light Gray**: `#F4F4F7` — Section dividers, subtle panels
- **Medium Gray**: `#C9CACE` — Secondary text, borders, muted buttons
- **Dark Neutral**: `#1E212A` — Body text on light backgrounds

### Accent Colors
- **Crimson Red**: `#D03C38` — Highlights, urgency notices, active states
- **Emerald Green**: `#13A688` — Success messages, positive data points

### Support Colors
- **Charcoal Black**: `#000000` — Pure black for contrast in headlines
- **Muted Slate**: `#65676E` — Subtle icon/text color in sidebars

## Usage Guidelines

### Navigation & Headers
- Background: `#FFFFFF`
- Borders: `#C9CACE`
- Active states: `#D03C38` with red underline
- Hover states: `#635DFF`

### Buttons
- Primary CTA: `#635DFF` background, white text
- Secondary: White background, `#635DFF` text and border
- Danger/Logout: White background, `#D03C38` text and border

### Text Hierarchy
- Headlines: `#1E212A` or `#000000`
- Body text: `#1E212A`
- Secondary text: `#65676E`
- Muted text: `#C9CACE`

### Interactive Elements
- Hover backgrounds: `#F4F4F7`
- Focus states: `#635DFF`
- Success states: `#13A688`

## Tailwind CSS Classes

```css
/* Primary Colors */
.bg-brand-blue { background-color: #262262; }
.text-brand-blue { color: #262262; }
.bg-vibrant-blue { background-color: #635DFF; }
.text-vibrant-blue { color: #635DFF; }

/* Neutral Colors */
.bg-white { background-color: #FFFFFF; }
.bg-light-gray { background-color: #F4F4F7; }
.bg-medium-gray { background-color: #C9CACE; }
.text-dark-neutral { color: #1E212A; }

/* Accent Colors */
.text-crimson-red { color: #D03C38; }
.bg-crimson-red { background-color: #D03C38; }
.text-emerald-green { color: #13A688; }
.bg-emerald-green { background-color: #13A688; }

/* Support Colors */
.text-charcoal-black { color: #000000; }
.text-muted-slate { color: #65676E; }
```

## Component Examples

### Header Navigation
```jsx
<nav className="bg-white border-b border-[#C9CACE]">
  <Link className="text-[#1E212A] hover:text-[#635DFF]">
    Navigation Item
  </Link>
  <Link className="text-[#D03C38] border-b-2 border-[#D03C38]">
    Active Item
  </Link>
</nav>
```

### Buttons
```jsx
{/* Primary Button */}
<button className="bg-[#635DFF] text-white hover:bg-[#262262]">
  Primary Action
</button>

{/* Secondary Button */}
<button className="bg-white text-[#635DFF] border border-[#635DFF] hover:bg-[#F4F4F7]">
  Secondary Action
</button>

{/* Danger Button */}
<button className="bg-white text-[#D03C38] border border-[#D03C38] hover:bg-[#F4F4F7]">
  Delete
</button>
```

### Cards & Panels
```jsx
<div className="bg-white border border-[#C9CACE] rounded-lg p-6">
  <h3 className="text-[#1E212A] font-bold">Card Title</h3>
  <p className="text-[#65676E]">Card content with secondary text</p>
</div>
```

## Accessibility Notes

- Ensure sufficient contrast ratios (4.5:1 minimum for normal text)
- Use `#D03C38` sparingly for important actions only
- Provide focus indicators using `#635DFF`
- Test color combinations for colorblind accessibility
