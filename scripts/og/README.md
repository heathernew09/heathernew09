# OG image

`public/assets/heathernew-og.png` is the social preview card (1200x630) referenced by
`og:image` / `twitter:image` on every page. It is generated from `og-image.html`, not
hand-exported, so it can be re-rendered whenever the wording or palette changes.

Regenerate:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot="public/assets/heathernew-og.png" \
  "file://$PWD/scripts/og/og-image.html"
```

Manrope is pulled from Google Fonts at render time, so the machine needs to be online.
