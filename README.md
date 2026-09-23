# musejak ($MUSEJAK)

Landing page for $MUSEJAK, a memecoin on Robinhood Chain launched on Pons and paired with $META.

It's a static site with no build step: open `index.html` or host the folder on Vercel, Netlify or GitHub Pages.

## Launch checklist
- `script.js`: set `CONTRACT_ADDRESS`, and change `ALLOCATIONS` if the tokenomics change
- `index.html`: replace the chart link, and the Pons links, with the real token URLs
- `script.js`: `PAIR_ADDRESS` holds the $META token address shown in the Pair box
- `assets/meta.png`: the $META pair logo
