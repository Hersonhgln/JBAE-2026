# JBAE 2026 – Site officiel

Site web officiel pour la **2e Édition de la Journée Béninoise de l'Agroécologie (JBAE 2026)**.

## 🌿 Présentation

Site vitrine et générateur de badge interactif "J'y serai !" pour l'événement JBAE 2026, du 15 au 17 Novembre 2026 à Cotonou, Bénin.

## ✨ Fonctionnalités

- **Compte à rebours** dynamique vers l'ouverture de l'événement
- **Programme** détaillé des 3 jours
- **Inscription en ligne** avec système de badges par catégorie
- **Générateur de badge "J'y serai !"** – importez votre photo, elle s'intègre automatiquement dans le cadre officiel HD (1254×1254 px)
- **Téléchargement PNG HD** du badge prêt à partager sur WhatsApp, LinkedIn, Facebook et Instagram
- **Galerie photos** de la première édition
- **Section partenaires** et comité d'organisation
- Design responsive mobile-first

## 🛠 Technologies

- HTML5 / CSS3 (Vanilla) / JavaScript (ES6+)
- Canvas API pour le rendu et l'export du badge
- Google Fonts (Plus Jakarta Sans, Outfit)
- Font Awesome 6

## 📂 Structure

```
├── index.html              # Page principale
├── styles.css              # Styles
├── app.js                  # Logique interactive & badge generator
└── assets/
    ├── badge-template.png  # Template badge (masque avec transparence)
    ├── badge-template-data.js  # Template embarqué en Base64 (export canvas)
    ├── logo-jbae.png
    ├── hero-bg.jpg
    └── ...
```

## 🚀 Utilisation locale

Ouvrir `index.html` dans un navigateur, ou utiliser un serveur local :

```bash
# Node.js
npx serve .

# Python
python -m http.server 8080
```

---

Réalisé par **MysonPixel** pour JBAE 2026 · Bénin 🇧🇯
