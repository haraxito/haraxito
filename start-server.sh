#!/bin/bash

# Script de démarrage avec diagnostic complet
# Usage: bash start-server.sh

echo "======================================"
echo "🚀 DÉMARRAGE DU SERVEUR NEXT.JS"
echo "======================================"
echo ""

# 1. Tuer les anciens processus
echo "1️⃣ Nettoyage des processus existants..."
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 2
echo "   ✅ Processus nettoyés"
echo ""

# 2. Vérifier que le port est libre
echo "2️⃣ Vérification du port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3000 occupé, libération en cours..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi
echo "   ✅ Port 3000 disponible"
echo ""

# 3. Vérifier NODE_ENV
echo "3️⃣ Vérification NODE_ENV..."
if [ ! -z "$NODE_ENV" ] && [ "$NODE_ENV" != "development" ] && [ "$NODE_ENV" != "production" ]; then
    echo "   ⚠️  NODE_ENV=$NODE_ENV (valeur non-standard)"
    echo "   💡 Suggestion: unset NODE_ENV"
else
    echo "   ✅ NODE_ENV OK"
fi
echo ""

# 4. Vérifier les variables d'environnement Supabase
echo "4️⃣ Vérification des variables Supabase..."
if [ -f ".env.local" ]; then
    if grep -q "VOTRE_ANON_KEY_ICI" .env.local 2>/dev/null; then
        echo "   ❌ PROBLÈME: .env.local contient un placeholder"
        echo "   📝 Action requise: Remplacer NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   📖 Voir: QUICK-FIX.md"
    else
        echo "   ✅ Fichier .env.local configuré"
    fi
else
    echo "   ⚠️  Fichier .env.local non trouvé"
fi
echo ""

# 5. Vérifier node_modules
echo "5️⃣ Vérification des dépendances..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules présent"
else
    echo "   ❌ node_modules manquant"
    echo "   💡 Lancer: npm install"
    exit 1
fi
echo ""

# 6. Démarrer le serveur
echo "6️⃣ Démarrage du serveur Next.js..."
echo "   📍 URL: http://localhost:3000"
echo "   🛑 Pour arrêter: Ctrl+C"
echo ""
echo "======================================"
echo ""

# Démarrer avec output visible
PORT=3000 npm run dev
