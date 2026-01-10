# 🚀 Guide de Configuration Complète - Supabase + Vercel

## ❌ PROBLÈME ACTUEL

Votre `NEXT_PUBLIC_SUPABASE_ANON_KEY` contient un placeholder invalide : `VOTRE_ANON_KEY_ICI`

## 📋 ÉTAPE 1 : RÉCUPÉRER LES CLÉS SUPABASE

### 1.1 Aller sur le Dashboard Supabase
```
https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/settings/api
```

### 1.2 Copier les clés
Dans la section "Project API keys":

1. **anon public** : C'est votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Utilisée côté client (navigateur)
   - Commence par `eyJ...`
   - Environ 200+ caractères

2. **service_role** : C'est votre `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ SECRET - Ne JAMAIS exposer côté client !
   - Utilisée uniquement côté serveur
   - Commence par `eyJ...`
   - Environ 200+ caractères

---

## 📝 ÉTAPE 2 : METTRE À JOUR .env.local

Ouvrez votre fichier `.env.local` et remplacez la ligne 5 :

### ❌ AVANT (INVALIDE)
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uanJsb3Fqa3Bka3RrcHR6anVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg0ODYsImV4cCI6MjA4MzM5NDQ4Nn0.VOTRE_ANON_KEY_ICI
```

### ✅ APRÈS (VALIDE)
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uanJsb3Fqa3Bka3RrcHR6anVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg0ODYsImV4cCI6MjA4MzM5NDQ4Nn0.[VOTRE_VRAIE_SIGNATURE_ICI]
```

**Note**: Copiez la clé COMPLÈTE depuis Supabase (tout le JWT en 3 parties séparées par des points)

---

## 🗄️ ÉTAPE 3 : CRÉER LA TABLE DANS SUPABASE

### Option A : Via l'Interface Supabase (Recommandé)

1. Aller sur : `https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/editor`
2. Cliquer sur "SQL Editor" (dans le menu latéral)
3. Créer une nouvelle query
4. Copier-coller le contenu de `supabase.sql`
5. Cliquer sur "Run" (Ctrl/Cmd + Enter)

### Option B : Via l'Assistant Supabase

Dire à l'assistant Supabase:
```
Merci de créer ma table avec ce script SQL :
[coller le contenu de supabase.sql]

Options :
1. Supprimer les anciennes politiques : OUI
2. Contraintes supplémentaires : NON
3. Données de test : OUI (2-3 exemples)
4. Edge Function : NON (j'utilise Next.js API routes)
```

### Vérification
Après exécution, vous devriez voir dans la Table Editor :
- ✅ Table `rendez_vous` créée
- ✅ 8 colonnes (id, created_at, client_nom, etc.)
- ✅ Données de test (si demandées)

---

## ☁️ ÉTAPE 4 : CONFIGURER VERCEL

### 4.1 Installer Vercel CLI (si pas déjà fait)
```bash
npm i -g vercel
```

### 4.2 Se connecter à Vercel
```bash
vercel login
```

### 4.3 Lier le projet
```bash
cd "/Applications/programation /projet/windsheild remplacement"
vercel link
```

### 4.4 Ajouter les variables d'environnement

**IMPORTANT**: Utilisez les VRAIES clés que vous avez copiées de Supabase !

```bash
# URL Supabase (public)
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Coller : https://mnjrloqjkpdktkptzjum.supabase.co
# Sélectionner : Production, Preview, Development

# Clé ANON (public)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Coller : [VOTRE VRAIE CLÉ ANON COMPLÈTE]
# Sélectionner : Production, Preview, Development

# Clé SERVICE_ROLE (SECRET!)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Coller : [VOTRE VRAIE CLÉ SERVICE_ROLE]
# Sélectionner : Production, Preview, Development

# Clé Resend
vercel env add RESEND_API_KEY
# Coller : re_jkQntLzr_24KuyssBrNT9VErSzXVHUZo3
# Sélectionner : Production, Preview, Development

# Email admin
vercel env add ADMIN_EMAIL
# Coller : sarmadyaqoob4@gmail.com
# Sélectionner : Production, Preview, Development

# Email FROM
vercel env add RESEND_FROM_EMAIL
# Coller : AutoGlass Pro <sarmadyaqoob4@gmail.com>
# Sélectionner : Production, Preview, Development

# Mot de passe admin (optionnel, défaut: parebrise2026)
vercel env add ADMIN_PASSWORD
# Coller : parebrise2026
# Sélectionner : Production, Preview, Development
```

### 4.5 Vérifier les variables
```bash
vercel env ls
```

Vous devriez voir toutes vos variables listées.

---

## 🧪 ÉTAPE 5 : TESTER EN LOCAL

### 5.1 Vérifier la configuration
```bash
node debug-supabase.js
```

Vous devriez voir :
```
✅ CONFIGURATION LOCALE VALIDE
```

### 5.2 Démarrer le serveur de dev
```bash
npm run dev
```

### 5.3 Tester l'API de health check
```bash
curl http://localhost:3000/api/booking
```

Réponse attendue :
```json
{
  "status": "ok",
  "supabase": "configured",
  "resend": "configured",
  "envValid": true
}
```

### 5.4 Tester une création de booking
```bash
node test-booking-api.js
```

---

## 🚀 ÉTAPE 6 : DÉPLOYER SUR VERCEL

### 6.1 Build et déploiement
```bash
vercel --prod
```

### 6.2 Vérifier le déploiement
Une fois déployé, Vercel vous donnera une URL, par exemple :
```
https://windsheild-remplacement.vercel.app
```

### 6.3 Tester l'API en production
```bash
curl https://VOTRE-URL.vercel.app/api/booking
```

---

## ✅ CHECKLIST FINALE

Avant de considérer la configuration terminée :

### Configuration Locale
- [ ] `.env.local` contient les vraies clés (pas de placeholder)
- [ ] `node debug-supabase.js` retourne "✅ CONFIGURATION LOCALE VALIDE"
- [ ] `npm run dev` démarre sans erreur
- [ ] `curl http://localhost:3000/api/booking` retourne `"status": "ok"`

### Supabase
- [ ] Table `rendez_vous` existe
- [ ] Politiques RLS activées
- [ ] Index créés
- [ ] Données de test présentes (optionnel)

### Vercel
- [ ] Toutes les variables d'environnement configurées
- [ ] `vercel env ls` liste toutes les variables
- [ ] Projet lié avec `vercel link`
- [ ] Déploiement réussi avec `vercel --prod`

### Tests
- [ ] API health check répond en local
- [ ] API health check répond en production
- [ ] Création de booking fonctionne en local
- [ ] Création de booking fonctionne en production
- [ ] Emails de confirmation reçus
- [ ] Dashboard admin accessible

---

## 🐛 DÉPANNAGE

### Erreur : "Invalid JWT format"
➡️ Votre clé ANON_KEY ou SERVICE_ROLE_KEY est incorrecte
- Vérifier qu'elle commence par `eyJ`
- Vérifier qu'elle a 3 parties séparées par des points
- Vérifier qu'il n'y a pas de placeholder

### Erreur : "Database connection not configured"
➡️ Les variables d'environnement ne sont pas chargées
- Vérifier que `.env.local` existe
- Redémarrer le serveur de dev
- Vérifier avec `node debug-supabase.js`

### Erreur : "Row Level Security policy violation"
➡️ Les politiques RLS bloquent l'accès
- Vérifier que les politiques sont créées dans Supabase
- Utiliser `supabaseAdmin()` côté serveur, pas `supabase`

### Emails non reçus
➡️ Configuration Resend incorrecte
- Vérifier `RESEND_API_KEY` commence par `re_`
- Vérifier que l'email FROM est vérifié dans Resend
- Checker les logs Resend : https://resend.com/emails

### Dashboard admin : "Unauthorized"
➡️ Problème d'authentification
- Le mot de passe par défaut est : `parebrise2026`
- Vérifier le cookie `admin_session` dans les DevTools
- Vérifier que `/app/api/admin/auth/route.ts` existe

---

## 📞 SUPPORT

Si vous rencontrez d'autres problèmes :

1. Exécuter le diagnostic : `node debug-supabase.js`
2. Vérifier les logs : `vercel logs` (pour production)
3. Vérifier la console navigateur (F12)
4. Vérifier les logs Supabase : https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/logs/explorer

---

**Dernière mise à jour** : 2026-01-09
