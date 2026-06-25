[![Untitled UI Icons](https://cdn.prod.website-files.com/636496d3f0ebfdaba9784655/670882dc8bf3188d57dbfa80_f94520b427bcb8cd0bc4b85a8c684adb_untitled-ui-free-icons-open-graph-img.jpg)](https://www.untitledui.com/resources/icons)

# Untitled UI Icons

Explore 1,100+ free SVG icons for your next React project. [Untitled UI Icons](https://www.untitledui.com/icons) are a clean, consistent, and neutral icon library crafted specifically for modern UI design. Made for Figma, in Figma, and now available for React!

[Learn more](https://www.untitledui.com/icons) • [Documentation](https://www.untitledui.com/react/docs/icons) • [Copy as SVGs](https://www.untitledui.com/resources/icons) • [Figma](https://www.untitledui.com/download/icons) • [FAQs](https://www.untitledui.com/faqs)


## Installation

To get started, install the Untitled UI Icons package:

```bash
npm i @untitledui/icons
```

You can also install directly from GitHub, e.g. with pnpm:

```bash
pnpm add @untitledui/icons@github:untitleduico/icons#main
```

Check out our [Untitled UI Icons installation guide](https://www.untitledui.com/react/docs/icons).


## Usage Options

Untitled UI Icons can be used in two ways:

### Option 1: React Components

Import icons as React components with full prop support:

```jsx
import ArrowDown from "@untitledui/icons/ArrowDown"

<ArrowDown />

// Configure size via `size` prop
<ArrowDown size={16} />

// Configure size via `className`
<ArrowDown className="size-4" />

// Configure color via `color` prop
<ArrowDown color="#000" />

// Configure color via `className`
<ArrowDown className="text-black" />
```

### Option 2: Data URIs

Import icons as URL-encoded SVG data URIs for use in CSS or as image sources:

```jsx
import { ArrowDown } from "@untitledui/icons/__data_uri"

// Use as an image source
<img src={ArrowDown} alt="Arrow down" />

// Use in CSS
<div style={{ backgroundImage: `url(${ArrowDown})` }} />
```

#### Coloring Data URI Icons with CSS

Data URI icons can be dynamically colored using CSS `mask-image` combined with `background-color`:

```css
.icon {
  width: 24px;
  height: 24px;
  background-color: currentColor; /* or any color */
  mask-image: var(--icon-url);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: var(--icon-url);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
```

```jsx
import { ArrowDown } from "@untitledui/icons/__data_uri"

<div 
  className="icon" 
  style={{ '--icon-url': `url(${ArrowDown})` }} 
/>
```

This approach allows you to change the icon color simply by changing `background-color` or using `currentColor` to inherit from the parent's text color.

### Listing Available Icons

A list of every icon name shipped with the package — plus an `IconName` type — is available under the `__inventory` subpath. It is generated at build time, sorted alphabetically, and typed as a `readonly` tuple, so the literal name strings flow through to `IconName`.

```ts
import { iconNames, type IconName } from "@untitledui/icons/__inventory";

iconNames.length; // 1170+
iconNames[0];     // "Activity"

const name: IconName = "ArrowDown"; // type-checked against the full list
```

### Lazy-loading Icons by Name

If you need to render an icon by a runtime string (e.g. a name from a CMS or user input) without bundling every icon into your app, use the `__loaders` subpath together with `React.lazy`:

```tsx
import { lazy, Suspense } from "react";
import { loadIcon } from "@untitledui/icons/__loaders";
import type { IconName } from "@untitledui/icons/__inventory";

function Icon({ name }: { name: IconName }) {
  const Component = lazy(loadIcon(name));
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}
```

Behind the scenes `loadIcon` issues a template-literal dynamic import (`import(\`../${name}\`)`) from inside the package's `dist/__loaders` directory. Bundlers (Webpack 5, Turbopack, Rollup/Vite) treat the parent `dist/` directory as the context root and emit **one chunk per icon actually requested at runtime** — so your initial bundle stays small no matter how many icons you reference.

For repeated lookups, memoise the returned component:

```tsx
import { lazy } from "react";
import { loadIcon, type IconLoader } from "@untitledui/icons/__loaders";
import type { IconName } from "@untitledui/icons/__inventory";

const cache = new Map<IconName, ReturnType<typeof lazy>>();

export function resolveIcon(name: IconName) {
  const cached = cache.get(name);
  if (cached) return cached;
  const Component = lazy(loadIcon(name));
  cache.set(name, Component);
  return Component;
}
```

> **Note:** `loadIcon` relies on the consumer's bundler analysing the dynamic import inside `node_modules/@untitledui/icons/dist/__loaders/index.mjs` and producing per-icon chunks. Webpack-based stacks (Next.js, CRA) and Vite/Rollup production builds handle this; check your production build output if you depend on the per-icon split. A direct dynamic import like `import(\`@untitledui/icons/${name}\`)` written in your own code will **not** work — bundlers cannot create a context from a bare package specifier.


## What are Untitled UI Icons?

[Untitled UI Icons](https://www.untitledui.com/icons) are a clean, consistent, and neutral icon library crafted specifically for modern UI design. Made for Figma, in Figma, and now available for React!

We searched everywhere for the "ultimate" icon set for modern UI design to use across all our projects... We couldn't find an icon library for Figma we loved so we made one.

Untitled UI Icons won Product Hunt [#1 Product of the Week](https://www.producthunt.com/posts/untitled-ui-icon) and is one of the most popular icon libraries in the world with 230,000+ Figma Community downloads.

## Untitled UI Icons PRO

The PRO version of [Untitled UI Icons](https://www.untitledui.com/icons) includes 4,600+ icons across 4 styles. Choose between minimal line, modern duocolor or duotone, or solid icon styles. Untitled UI Icons PRO includes access to a private npm package with 4,600+ icons across 4 styles.

[Explore Untitled UI Icons →](https://www.untitledui.com/resources/icons)

[Buy Untitled UI Icons PRO →](https://www.untitledui.com/buy/icons)

## License

You can use Untitled UI Icons in unlimited personal and commercial projects.

[Untitled UI license agreement →](https://www.untitledui.com/license)

[Frequently asked questions →](https://www.untitledui.com/faqs)
