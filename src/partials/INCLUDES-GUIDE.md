# 🔧 HTML Include System Guide

## Yes, You Can Include Files Like PHP!

This JavaScript-based include system works just like PHP's `include()`, but runs in the browser.

## 📦 How It Works

**Just like PHP:**
```php
<?php include 'header.php'; ?>
```

**With JavaScript:**
```html
<div data-include="/partials/header.html"></div>
```

That's it! The JavaScript automatically loads and inserts the HTML.

## 🚀 Quick Start

### 1. Add the Include Script

Add this to **every page** that needs includes:

```html
<script src="/js/include.js"></script>
```

Put it at the **end of your `<body>`** tag.

### 2. Create Your Partials

Create reusable HTML snippets in `/partials/`:

```
/partials/
  ├── header.html
  ├── footer.html
  ├── nav.html
  └── sidebar.html
```

### 3. Use Includes in Your Pages

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <!-- Include header -->
    <div data-include="/partials/header.html"></div>
    
    <!-- Your page content -->
    <main>
        <h1>Page Content</h1>
    </main>
    
    <!-- Include footer -->
    <div data-include="/partials/footer.html"></div>
    
    <!-- Load include system -->
    <script src="/js/include.js"></script>
</body>
</html>
```

## 💡 Real Examples

### Example 1: Header with Navigation

**Create:** `/partials/header.html`
```html
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
    </nav>
</header>
```

**Use it:**
```html
<div data-include="/partials/header.html"></div>
```

### Example 2: Footer

**Create:** `/partials/footer.html`
```html
<footer>
    <p>&copy; 2026 Your Name</p>
</footer>
```

**Use it:**
```html
<div data-include="/partials/footer.html"></div>
```

## 🎨 Partials Can Include CSS & JavaScript!

Your partials can contain `<style>` and `<script>` tags:

```html
<!-- /partials/sidebar.html -->
<aside class="sidebar">
    <h3>Latest Posts</h3>
    <ul id="post-list"></ul>
</aside>

<style>
    .sidebar {
        background: #f0f0f0;
        padding: 1rem;
    }
</style>

<script>
    // Load posts dynamically
    fetch('/api/posts')
        .then(r => r.json())
        .then(posts => {
            document.getElementById('post-list').innerHTML = 
                posts.map(p => `<li>${p.title}</li>`).join('');
        });
</script>
```

## 🎯 Your Portfolio Setup

### Current Structure:
```
/
├── partials/
│   ├── header.html     ✅ Created (navigation bar)
│   └── footer.html     ✅ Created (site footer)
├── js/
│   ├── include.js      ✅ Created (include system)
│   ├── hero.js         (home page only)
│   └── nav.js          (old system - can remove)
└── pages...
```

### Updated Page Template:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title</title>
    <link rel="stylesheet" href="/css/global.css">
</head>
<body>
    <!-- Include header -->
    <div data-include="/partials/header.html"></div>
    
    <!-- Your content -->
    <main class="project-content">
        <h1>Project Title</h1>
        <p>Content goes here...</p>
    </main>
    
    <!-- Include footer -->
    <div data-include="/partials/footer.html"></div>
    
    <!-- Include system -->
    <script src="/js/include.js"></script>
</body>
</html>
```

## ✅ Benefits Over nav.js

**Old way (nav.js):**
- Only navigation
- JavaScript string templates (messy)
- Hard to edit HTML

**New way (include.js):**
- ✅ Any HTML snippet
- ✅ Edit in separate files
- ✅ CSS/JS in partials
- ✅ Easy to maintain
- ✅ Works like PHP!

## 🔧 Advanced Usage

### Multiple Includes on One Page
```html
<div data-include="/partials/header.html"></div>
<div data-include="/partials/sidebar.html"></div>
<main>Content</main>
<div data-include="/partials/footer.html"></div>
```

### Nested Includes
Partials can include other partials!

```html
<!-- /partials/page-layout.html -->
<div data-include="/partials/header.html"></div>
<main class="content">
    <!-- Page content goes here -->
</main>
<div data-include="/partials/footer.html"></div>
```

### Error Handling
If a file doesn't load, you'll see:
```
Error loading /partials/missing.html
```

Check the browser console for details.

## 🚨 Important Notes

### 1. Must Run on a Server
Includes won't work if you just open HTML files directly (`file://`).

**Use:**
```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`

### 2. File Paths
Use absolute paths starting with `/`:
```html
✅ <div data-include="/partials/header.html"></div>
❌ <div data-include="partials/header.html"></div>
```

### 3. Order Matters
Load `include.js` **after** your include divs:

```html
<div data-include="/partials/header.html"></div>
<!-- ↑ Includes first -->

<script src="/js/include.js"></script>
<!-- ↑ Script last -->
```

## 🎓 Converting Your Site

### Step 1: Update All Project Pages
Replace this:
```html
<div id="nav-container"></div>
<script src="/js/nav.js"></script>
```

With this:
```html
<div data-include="/partials/header.html"></div>
<div data-include="/partials/footer.html"></div>
<script src="/js/include.js"></script>
```

### Step 2: Remove Old System (Optional)
Once all pages are converted, you can delete:
- `/js/nav.js`

### Step 3: Create More Partials
```
/partials/
  ├── header.html       ✅ Navigation
  ├── footer.html       ✅ Footer
  ├── social-links.html  (Twitter, LinkedIn, etc)
  ├── cta-banner.html    (Call to action)
  └── contact-form.html  (Reusable contact form)
```

## 🎯 Next Steps

1. **Test it:** Open `/parasite-hunter.html` - it now uses includes!
2. **Convert other pages:** Copy the pattern to remaining project pages
3. **Create more partials:** Break out any repeated HTML
4. **Deploy:** Works on any web server (Netlify, Vercel, etc.)

---

**You now have PHP-style includes in pure HTML!** 🎉

No build step, no framework, just clean reusable HTML.
