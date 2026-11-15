# now.gg SVG wrapper for jsDelivr

A static, client-side SVG document that uses SVG `foreignObject` to display an HTML toolbar and an iframe. There is no backend and no build step.

## Important limitation

This SVG is a different *wrapper format*, not a way to bypass a site's embedding rules. The iframe still navigates to the selected destination, and the browser still enforces that destination's `X-Frame-Options` and Content Security Policy `frame-ancestors` response headers.

now.gg's official Embed Module documentation says its supported embedding integration requires a whitelisted domain and a `clientId`. A public now.gg page may refuse to load in this generic iframe. SVG `foreignObject`, jsDelivr hosting, and client-side JavaScript cannot override that response policy.

## Files

```text
nowgg-svg-jsdelivr/
├── nowgg.svg
├── script.js
├── style.css
└── README.md
```

Keep all three runtime files in the same folder. The SVG loads `script.js` and `style.css` using relative paths.

## Publish on GitHub, then use jsDelivr

1. Create a public GitHub repository, for example `nowgg-svg`.
2. Upload `nowgg.svg`, `script.js`, and `style.css` to the repository root.
3. Create a version tag such as `v1.0.0` (recommended), or use `main` while testing.
4. Open the SVG as a **top-level document** using this URL pattern:

   ```text
   https://cdn.jsdelivr.net/gh/USER/REPO@v1.0.0/nowgg.svg
   ```

   Replace `USER` and `REPO` with your GitHub username and repository name.
5. Do not load it with `<img src="...">`. Browsers restrict active SVG content in image contexts; open the SVG URL directly in a tab, or use a browsing context that loads it as a document.

Because the CSS and JS paths are relative, jsDelivr serves them from the same tagged folder automatically.

## Change the destination

Edit the `DEFAULT_EMBED_URL` value at the top of `script.js`:

```js
const CONFIG = {
  DEFAULT_EMBED_URL: "https://now.gg/",
  LOAD_HINT_MS: 14000
};
```

Alternatively, add a `url` query parameter to the SVG URL. For example, encode the full destination URL before placing it after `?url=`. If using a CDN URL, changing `DEFAULT_EMBED_URL` in `script.js` is the most dependable configuration method because CDNs may cache URL variants differently.

Only `http://` and `https://` destinations are accepted.

## Controls

- **URL** opens a field for a different destination.
- **Reload** reloads the selected destination.
- **Fullscreen** requests fullscreen for the wrapper.
- **Open in new tab** opens the selected URL outside the iframe.
- A delayed notice appears with a fallback when the frame may not have loaded successfully.

## What the page can and cannot detect

The wrapper can detect that a timer elapsed and that the iframe fired a `load` event. It cannot read a cross-origin iframe's document to determine whether it is blank, playable, or displaying a browser-level refusal. Browsers may fire an iframe `load` event even when the framed content did not load normally, so the status message is deliberately not presented as proof of success.

## Troubleshooting

1. Click **Open in new tab**. If the destination does not open there either, the issue is not the SVG wrapper.
2. Test with the default URL first, then try the exact game URL you need.
3. Check the browser console for frame-policy, mixed-content, cookie, or permission errors.
4. Test in a current desktop browser with third-party cookies and required site permissions available.
5. Check whether the destination sends `X-Frame-Options: DENY` or `SAMEORIGIN`, or a CSP `frame-ancestors` policy that does not allow the wrapper's origin. These are enforced by the browser.
6. For supported now.gg website embedding, follow now.gg's official Embed Module process and obtain the required domain approval and `clientId` from now.gg.

A reverse proxy can change response headers only when the proxy operator controls that response path. This static SVG cannot strip destination headers or make a blocked destination embeddable.

## Security note about sandboxing

The iframe uses a restrictive sandbox with scripts, forms, pointer lock, and popups enabled. It intentionally does not grant `allow-same-origin`, which can affect sites that depend on origin-bound storage or APIs. Relaxing sandbox permissions may improve compatibility but reduces isolation. Do not add permissions unless you understand the trade-off.
