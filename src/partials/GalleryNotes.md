# PhotoSwipe Gallery - Integration Guide

## Files Included

1. **photoswipe-gallery.html** - Complete standalone gallery (for reference)
2. **gallery-styles.css** - Extracted CSS (scoped and namespaced)
3. This integration guide

## Quick Integration Steps

### 1. Add Required Libraries

```html
<!-- PhotoSwipe CSS -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.css"
/>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/default-skin/default-skin.min.css"
/>

<!-- Gallery Styles -->
<link rel="stylesheet" href="path/to/gallery-styles.css" />
```

### 2. Add Gallery HTML

Copy the gallery HTML structure from `photoswipe-gallery.html`:

- Start from `<div class="gallery">` (or include `.gallery-wrapper` for padding/background)
- End at the closing `</div>` for gallery
- Add your own images following the pattern

### 3. Add PhotoSwipe Markup (Once per page)

Copy the entire `.pswp` div from the HTML file - this only needs to be added once per page.

### 4. Add Required Scripts (Before closing body tag)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.2/lazysizes.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe-ui-default.js"></script>
<script src="path/to/gallery-init.js"></script>
```

### 5. Gallery Initialization Script

Copy the initialization script from the HTML file (everything in the last `<script>` tag).

## Class Reference

### Namespaced Classes (Won't Conflict)

- `.gallery` - Main gallery container
- `.gallery-wrapper` - Optional wrapper with padding/background
- `.gallery-item` - Individual gallery items
- `.gallery-caption` - Image captions (shown on hover)
- `.vertical` - Modifier class: makes item span 2 rows
- `.horizontal` - Modifier class: makes item span 2 columns

### Image Layout Classes

```html
<!-- Standard item (1 column × 1 row) -->
<figure class="gallery-item">
  <!-- Portrait item (1 column × 2 rows) -->
  <figure class="gallery-item vertical">
    <!-- Landscape item (2 columns × 1 row) -->
    <figure class="gallery-item horizontal"></figure>
  </figure>
</figure>
```

## Responsive Breakpoints

- **Mobile** (< 768px): 2 columns, 150px rows, 6px gap
- **Tablet** (768-1023px): 3 columns, 180px rows, 8px gap
- **Desktop** (1024-1279px): 4 columns, 200px rows, 8px gap
- **Large** (1280-1599px): 5 columns, 200px rows, 8px gap
- **XL** (≥ 1600px): 6 columns, 220px rows, 8px gap

## Customization Tips

### Adjust Grid Spacing

```css
.gallery {
  gap: 12px; /* Change from 8px */
}
```

### Change Row Heights

```css
.gallery {
  grid-auto-rows: 250px; /* Change from 200px */
}
```

### Adjust Max Width

```css
.gallery {
  max-width: 1600px; /* Change from 1400px */
}
```

## Using Without Gallery Wrapper

If your template already has padding/background, you can skip `.gallery-wrapper`:

```html
<!-- Just use the gallery div directly -->
<div class="gallery" itemscope itemtype="http://schema.org/ImageGallery">
  <!-- gallery items -->
</div>
```

## Important Notes

1. **All styles are scoped** - Won't conflict with your global styles
2. **Figure margins are reset** - Only within `.gallery` container
3. **Box-sizing is scoped** - Only applies to `.gallery` and its children
4. **Image dimensions matter** - Use actual pixel dimensions in `data-size` attribute for smooth PhotoSwipe animations
5. **Lazy loading** - Images use lazysizes library for performance

## Adding New Images

```html
<figure
  class="gallery-item [vertical|horizontal]"
  itemprop="associatedMedia"
  itemscope
  itemtype="http://schema.org/ImageObject"
>
  <a href="path/to/full-size-image.jpg" itemprop="contentUrl" data-size="1920x1080">
    <img
      class="lazyload fadein"
      src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http://www.w3.org/2000/svg'%20viewBox%3D'0%200%201920%201080'%20%2F%3E"
      data-src="path/to/thumbnail-image.jpg"
      itemprop="thumbnail"
      alt="Image description"
    />
  </a>
  <figcaption class="gallery-caption" itemprop="caption description">Your Caption</figcaption>
</figure>
```

Replace:

- `path/to/full-size-image.jpg` - Full resolution image for lightbox
- `data-size="1920x1080"` - Actual pixel dimensions of full-size image
- `viewBox='0 0 1920 1080'` - Matches aspect ratio for placeholder
- `path/to/thumbnail-image.jpg` - Smaller version for gallery grid
- Alt text and caption

## Support

For PhotoSwipe documentation: https://photoswipe.com/documentation/getting-started.html
