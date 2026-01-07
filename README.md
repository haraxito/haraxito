# Auto Glass - Prise de rendez-vous

Application web Next.js pour la prise de rendez-vous de remplacement de pare-brise.

## Stack Technique

- **Frontend:** Next.js 14 (App Router), React Hook Form, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (Postgres, RLS)
- **Déploiement:** Vercel

## Configuration Supabase

### 1. Exécuter le SQL

Dans votre projet Supabase, ouvrez **SQL Editor** et exécutez le contenu du fichier `supabase.sql`.

Cela crée :

- La table `rendez_vous`
- Les politiques RLS :
  - Insert public (anon + authenticated)
  - Select pour `service_role` (admin côté serveur)

### 2. Récupérer vos clés

Dans **Settings > API** de votre projet Supabase :

- `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurer les variables

Modifiez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://mnjrloqjkpdktkptzjum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

- **Formulaire client:** http://localhost:3000
- **Dashboard Admin:** http://localhost:3000/admin

## Fonctionnalités

### Formulaire (Page d'accueil)

- Choix du service : **Service Mobile** (DOMICILE) ou **À l'Atelier** (ATELIER)
- Affichage conditionnel du champ adresse selon le choix
- Informations véhicule et contact
- Sélecteur de date

### Dashboard Admin

- Liste des rendez-vous triés par date de création
- Badges visuels clairs **DOMICILE** (vert) / **ATELIER** (bleu)
- Affichage de l'adresse d'intervention pour les services mobiles
- Compteurs par type de service

## Déploiement Vercel

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement dans les Settings
3. Déployez !
