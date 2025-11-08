<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally or deploy it online with GitHub Pages.

> [!TIP]
> Une fois le dépôt poussé sur GitHub, l'application est automatiquement construite et publiée grâce au workflow GitHub Pages fourni dans ce projet. Aucune étape manuelle supplémentaire n'est nécessaire au-delà de l'activation de Pages dans les paramètres du dépôt.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Déployer en ligne (GitHub Pages)

1. **Poussez** votre dépôt sur GitHub.
2. **Activez GitHub Pages** : dans les paramètres du dépôt, section **Pages**, sélectionnez la source `GitHub Actions`.
3. A chaque `git push` sur `main` (ou `master`), le workflow [`Deploy to GitHub Pages`](.github/workflows/deploy.yml) construit le projet (`npm run build`) puis publie automatiquement le contenu du dossier `dist/` sur Pages.

L'application sera accessible via l'URL fournie par GitHub Pages (par exemple `https://<votre-utilisateur>.github.io/Estimation-HTML/`).
