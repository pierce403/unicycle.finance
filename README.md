# unicycle.finance
automated uniswap liquidity juggling

## Cloudflare publishing

Native Cloudflare Git builds publish `master`. Validate with `npm ci` and
`npm run check:deploy`; build uses `npm run build`, deployment `npm run deploy`.
Only the reviewed public file list is copied to `dist`; original public content
and GitHub Pages recovery remain. Credentials stay in Cloudflare and previews
are disabled. The revision is at `/.well-known/cloudflare-build.json`.
