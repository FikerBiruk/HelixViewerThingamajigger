# DNA Helix Viewer (Three.js)

A complete client-side web project that renders an interactive 3D DNA double helix with Three.js.

## Features

- Default DNA sequence fallback
- Automatic complementary strand generation
- Color-coded bases (A/T/C/G)
- Hover highlight + tooltip metadata
- OrbitControls (rotate/zoom/pan)
- Ambient + directional lighting
- Subtle bloom postprocessing for glow
- Modern side-panel UI for sequence input
- GitHub Pages deployment via GitHub Actions

## Project Files

- `index.html` - App shell and UI layout
- `styles.css` - Modern styling and transitions
- `src/main.js` - App wiring, helix rendering, animation loop
- `src/dna.js` - Sequence parsing, complement generation, helix layout math
- `src/scene.js` - Scene/camera/renderer/lights/controls/bloom setup
- `src/interaction.js` - Raycasting hover logic + tooltip
- `src/ui.js` - UI events and status updates
- `.github/workflows/deploy-pages.yml` - GitHub Pages deployment workflow
- `.nojekyll` - Ensures static assets are served as-is

## Run Locally

This app uses ES modules from CDN and requires a local static server (do not open directly as `file://`).

```powershell
cd C:\Users\fiker\HelixViewerThingamajigger
python -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Ensure your default branch is `main` (or adjust the workflow trigger in `.github/workflows/deploy-pages.yml`).
5. Push to `main` to trigger deployment.

Your site URL will be:

- `https://<your-github-username>.github.io/<your-repository-name>/`

## Usage

1. Paste a DNA sequence containing `A`, `T`, `C`, `G`.
2. Click **Generate**.
3. Empty input automatically falls back to the default sequence.
4. Hover a nucleotide to see base metadata.

## Notes

- Invalid characters are removed automatically.
- Press `Ctrl+Enter` in the text area to generate quickly.
