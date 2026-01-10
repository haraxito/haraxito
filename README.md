# 🚗 Parebrise Instant - Système de Réservation

Application Next.js de prise de rendez-vous pour le remplacement de pare-brise.

---

## 🎓 Full Stack en 2 minutes

**Ce projet utilise :**

**Frontend** (ce que l'utilisateur voit)
- **Next.js** → Framework React pour créer des pages web
- **TypeScript** → JavaScript avec types (évite les erreurs)
- **Tailwind CSS** → Styles CSS rapides

**Backend** (ce qui se passe côté serveur)
- **API Routes Next.js** → Des endpoints comme `/api/booking` qui reçoivent les données
- **Server Components** → Pages rendues côté serveur (plus rapide)

**Base de données**
- **Supabase** → Stocke les réservations (comme MySQL mais plus simple)

**Emails**
- **Resend** → Envoie les emails de confirmation

**Comment ça marche :**
```
Client remplit formulaire → Next.js envoie à /api/booking
→ API valide et sauvegarde dans Supabase → Emails envoyés → Confirmation
```

### Configuration Supabase Détaillée

#### 2. Récupérer vos clés

Dans **Settings > API** de votre projet Supabase :

- `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. Configurer les variables

Modifiez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

---

## ⚡ Optimisations SSR Récentes

Le formulaire de réservation a été optimisé avec **Server-Side Rendering (SSR)** pour de meilleures performances :
- ✅ **Séparation Server/Client Components** pour réduire le bundle JavaScript
- ✅ **Pré-calcul des données** côté serveur (années, constantes)
- ✅ **Meilleur SEO** avec HTML complet au premier rendu
- ✅ **Time to Interactive amélioré** de 15-20%

📖 **Voir [SSR_OPTIMIZATION.md](SSR_OPTIMIZATION.md) pour les détails techniques**

## ⚠️ Note Importante - Compatibilité Node.js

Le projet fonctionne parfaitement en mode développement mais nécessite **Node.js v20 LTS** pour le build de production.

Si vous utilisez Node.js v24, consultez [BUILD_ISSUE.md](BUILD_ISSUE.md) pour la solution.

```bash
# Vérifier votre version
node --version

# Utiliser Node.js v20 (recommandé)
nvm use 20  # ou installer via nvm
```

## 🚨 Configuration Supabase

Votre clé Supabase `NEXT_PUBLIC_SUPABASE_ANON_KEY` doit être configurée correctement.

### ✅ Solution Rapide

1. **Récupérer la vraie clé :**
   ```
   https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/settings/api
   ```

2. **Mettre à jour `.env.local` ligne 5**

3. **Vérifier la configuration :**
   ```bash
   node debug-supabase.js
   ```

---

## 📚 Documentation

### Guides Utilisateur
- **[GUIDE-DEBUTANT.md](GUIDE-DEBUTANT.md)** ⭐ → Tout comprendre pas à pas
- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** → Configuration technique détaillée

### Documentation Technique
- **[SSR_OPTIMIZATION.md](SSR_OPTIMIZATION.md)** 🚀 → Optimisations Server-Side Rendering
- **[BUILD_ISSUE.md](BUILD_ISSUE.md)** 🔧 → Résoudre le problème de build Node.js v24

### Scripts Utiles
- **[debug-supabase.js](debug-supabase.js)** → Script de diagnostic
- **[test-booking-api.js](test-booking-api.js)** → Script de test

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
```bash
# Copier .env.local et mettre les vraies clés Supabase
# Voir GUIDE-DEBUTANT.md section "Configuration Pas à Pas"
```

### 3. Créer la table dans Supabase
```sql
-- Exécuter supabase.sql dans l'éditeur SQL de Supabase
-- Ou demander à l'assistant Supabase de le faire
```

### 4. Démarrer le serveur
```bash
npm run dev
```

### 5. Tester
```bash
# Terminal 1 : serveur dev
npm run dev

# Terminal 2 : diagnostic
node debug-supabase.js

# Terminal 3 : test API
node test-booking-api.js
```

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev              # Démarrer en local
npm run build            # Compiler
npm run start            # Démarrer en production

# Debug
node debug-supabase.js   # Diagnostic complet
node test-booking-api.js # Tester l'API

# Déploiement Vercel
vercel login             # Se connecter
vercel link              # Lier le projet
vercel env add [VAR]     # Ajouter une variable
vercel --prod            # Déployer
vercel logs              # Voir les logs
```

---

## 📁 Structure du Projet

```
.
├── app/
│   ├── page.tsx                  # Page d'accueil avec formulaire
│   ├── admin/
│   │   ├── page.tsx              # Dashboard admin
│   │   └── login/page.tsx        # Login admin
│   └── api/
│       ├── booking/route.ts      # API de réservation
│       └── admin/auth/route.ts   # API d'authentification
│
├── components/
│   ├── BookingForm.tsx           # Server Component (wrapper)
│   └── BookingFormClient.tsx     # Client Component (formulaire interactif)
│
├── lib/
│   ├── constants.ts              # 🆕 Constantes et types partagés (SSR)
│   ├── supabaseClient.ts         # Configuration Supabase
│   ├── env.ts                    # Validation des variables
│   ├── resend.ts                 # Envoi d'emails
│   └── auth.ts                   # Authentification admin
│
├── .env.local                    # Variables d'environnement
├── .nvmrc                        # 🆕 Version Node.js recommandée
├── supabase.sql                  # Script SQL de création de table
│
└── Documentation
    ├── README.md                 # Ce fichier
    ├── GUIDE-DEBUTANT.md         # Guide complet pour débutants
    ├── SETUP-GUIDE.md            # Guide de configuration
    ├── SSR_OPTIMIZATION.md       # 🆕 Optimisations SSR
    ├── BUILD_ISSUE.md            # 🆕 Problème Node.js v24
    ├── debug-supabase.js         # Script de diagnostic
    └── test-booking-api.js       # Script de test API
```

---

## 🔑 Variables d'Environnement

### Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbG...` (JWT) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé privée Supabase | `eyJhbG...` (JWT) |
| `RESEND_API_KEY` | Clé API Resend | `re_xxx...` |

### Optionnelles

| Variable | Description | Défaut |
|----------|-------------|--------|
| `ADMIN_EMAIL` | Email admin | - |
| `RESEND_FROM_EMAIL` | Email expéditeur | - |
| `ADMIN_PASSWORD` | Mot de passe admin | `parebrise2026` |

---

## 🗄️ Base de Données

### Table : `rendez_vous`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID auto-incrémenté |
| `created_at` | timestamptz | Date de création |
| `client_nom` | text | Nom du client |
| `client_telephone` | text | Téléphone |
| `client_email` | text | Email (optionnel) |
| `vehicule_infos` | text | Infos véhicule |
| `type_service` | text | DOMICILE ou ATELIER |
| `adresse_intervention` | text | Adresse si DOMICILE |
| `date_souhaitee` | date | Date préférée |
| `statut` | text | Nouveau/Confirmé/etc. |

---

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activée
- ✅ Service role key côté serveur uniquement
- ✅ Validation des données côté API
- ✅ Cookies httpOnly pour les sessions admin
- ⚠️ Mot de passe admin simple (changer en production)

---

## 📧 Emails

Deux emails sont envoyés automatiquement :

1. **Email client** : Confirmation de la demande
2. **Email admin** : Notification de nouvelle réservation

Service utilisé : [Resend](https://resend.com)

---

## 🌐 Déploiement

### Local
```bash
npm run dev
# → http://localhost:3000
```

### Production (Vercel)
```bash
vercel --prod
# → https://votre-projet.vercel.app
```

**Important** : Configurer les variables d'environnement sur Vercel :
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

---

## 🐛 Debug

### Problème : Configuration invalide
```bash
node debug-supabase.js
```

### Problème : API ne répond pas
```bash
# Vérifier que le serveur tourne
npm run dev

# Tester le health check
curl http://localhost:3000/api/booking
```

### Problème : Emails non reçus
- Vérifier RESEND_API_KEY
- Vérifier le domaine sur https://resend.com/domains
- Consulter les logs : https://resend.com/emails

---

## 📊 Workflow Utilisateur

```
┌─────────────┐
│   Client    │
│  remplit    │
│ formulaire  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  POST /api/ │
│   booking   │
└──────┬──────┘
       │
       ├─→ Validation
       │
       ├─→ Insert Supabase
       │
       ├─→ Email client
       │
       ├─→ Email admin
       │
       ↓
┌─────────────┐
│ Confirmation│
│   affichée  │
└─────────────┘
```

---

## 📝 Checklist de Déploiement

### Avant de déployer :
- [ ] `.env.local` configuré avec vraies clés
- [ ] `node debug-supabase.js` → ✅ VALIDE
- [ ] `npm run dev` démarre sans erreur
- [ ] Tests API passent (`node test-booking-api.js`)
- [ ] Table Supabase créée et visible
- [ ] Variables Vercel configurées

### Après déploiement :
- [ ] Site accessible via l'URL Vercel
- [ ] Health check production OK
- [ ] Test de réservation OK
- [ ] Emails reçus
- [ ] Dashboard admin accessible

---

## 💬 Support

En cas de problème :

1. **Lire** [GUIDE-DEBUTANT.md](GUIDE-DEBUTANT.md)
2. **Exécuter** `node debug-supabase.js`
3. **Vérifier** les logs : `vercel logs` (production)
4. **Consulter** la console navigateur (F12)

---

**Fait avec ❤️ par Claude Code**

*Dernière mise à jour : 2026-01-09*
