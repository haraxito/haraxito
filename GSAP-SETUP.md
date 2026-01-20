# Configuration GSAP - Parebrise Instant

## Installation

Pour activer les animations GSAP, vous devez d'abord installer les dépendances:

```bash
npm install gsap
```

C'est tout! Le code est déjà en place et prêt à fonctionner.

## Ce qui a été intégré

### 1. Fichiers créés

- **`/lib/hooks/useGSAP.ts`** - Hook React personnalisé pour GSAP
- **`/components/ScrollAnimations.tsx`** - Composant client qui initialise toutes les animations
- **`GSAP-SETUP.md`** - Ce fichier de documentation

### 2. Fichiers modifiés

- **`/app/page.tsx`** - Ajout du composant ScrollAnimations et des classes GSAP
- **`/app/globals.css`** - Ajout des classes CSS pour les animations GSAP

## Animations configurées

### Hero Section
- **Titre principal** (`.gsap-hero-title`) - Fade in depuis le haut au chargement
- **Sous-titre** (`.gsap-hero-subtitle`) - Fade in avec léger délai

### Sections avec scroll
Tous les éléments avec la classe `.gsap-fade-in` s'animeront au scroll:
- Trust Indicators (3 cartes)
- Services (4 cartes)
- Témoignages (2 cartes)
- FAQ (3 items)

**Animation:** Fade in + slide up depuis le bas quand l'élément entre dans le viewport (80% de hauteur).

## Utilisation

### Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrez http://localhost:3000 et:
1. Le titre hero s'animera au chargement de la page
2. Les sections s'animeront quand vous scrollez vers le bas
3. Chaque élément aura un effet de "stagger" (délai entre chaque)

### Build pour production

```bash
npm run build
npm start
```

## Ajouter des animations à d'autres éléments

Pour animer d'autres éléments, ajoutez simplement les classes CSS:

```tsx
// Fade in au scroll
<div className="gsap-fade-in">
  Votre contenu ici
</div>

// Animation au chargement (comme le hero)
<h1 className="gsap-hero-title">
  Votre titre
</h1>
```

## Personnaliser les animations

Toutes les animations sont configurées dans `/components/ScrollAnimations.tsx`. Vous pouvez modifier:

- **Durée**: `duration: 0.8` (en secondes)
- **Délai entre éléments**: `stagger: 0.2`
- **Courbe d'animation**: `ease: 'power2.out'`
- **Point de déclenchement**: `start: 'top 80%'` (80% de la hauteur du viewport)
- **Distance du slide**: `y: 50` (50px depuis le bas)

Exemple de modification:

```typescript
gsap.from('.gsap-fade-in', {
  opacity: 0,
  y: 100,              // Plus de distance
  duration: 1.2,       // Plus lent
  stagger: 0.3,        // Plus de délai
  ease: 'elastic.out', // Effet élastique
  scrollTrigger: {
    trigger: '.gsap-fade-in',
    start: 'top 90%',  // Démarre plus tôt
  }
});
```

## Performance

- GSAP est optimisé pour la performance (utilise GPU acceleration)
- Les animations fonctionnent à 60fps sur la plupart des appareils
- ScrollTrigger se nettoie automatiquement (pas de memory leaks)
- Taille de GSAP: ~50KB gzipped

## Ressources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Documentation](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP React Guide](https://greensock.com/react/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)

## Prochaines étapes (optionnel)

Si vous voulez aller plus loin:

1. **Ajouter Three.js** pour des effets 3D
2. **Parallaxe** avec GSAP ScrollTrigger
3. **Animations de formulaire** entre les étapes
4. **Animations de hover** avec GSAP
5. **Page transitions** avec GSAP

## Dépannage

### Les animations ne fonctionnent pas

1. Vérifiez que GSAP est installé:
   ```bash
   npm list gsap
   ```

2. Si GSAP n'est pas installé, installez-le:
   ```bash
   npm install gsap
   ```

3. Redémarrez le serveur de développement:
   ```bash
   npm run dev
   ```

### Erreurs TypeScript

Si vous voyez des erreurs TypeScript liées à GSAP, installez les types:
```bash
npm install -D @types/gsap
```

Note: GSAP 3.x inclut ses propres types TypeScript, donc `@types/gsap` n'est généralement pas nécessaire.

### Flash de contenu

Les éléments animés ont `opacity: 1` par défaut dans `globals.css`, donc si GSAP ne charge pas, le contenu reste visible (graceful degradation).

## Support

Les animations GSAP fonctionnent sur:
- Tous les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Mobile (iOS, Android)
- Tablettes

---

**Créé le:** 2026-01-12
**Version GSAP:** 3.x
**Compatible avec:** Next.js 14, React 18
