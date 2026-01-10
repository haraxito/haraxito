#!/bin/bash

# Script de test complet du système
# Usage: bash test-systeme.sh

echo "======================================"
echo "🧪 TEST COMPLET DU SYSTÈME"
echo "======================================"
echo ""

# Configuration
BASE_URL="http://localhost:3000"
RESULTS_FILE="test-results.md"

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -n "   Testing $description... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>&1)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data" 2>&1)
    fi

    if [[ "$response" =~ ^[0-9]+$ ]]; then
        if [ "$response" -ge 200 ] && [ "$response" -lt 400 ]; then
            echo "✅ $response"
            return 0
        else
            echo "⚠️  $response"
            return 1
        fi
    else
        echo "❌ Connection failed"
        return 2
    fi
}

# Créer le fichier de résultats
cat > "$RESULTS_FILE" << 'EOF'
# 🧪 RÉSULTATS DES TESTS SYSTÈME
**Date**: $(date +"%Y-%m-%d %H:%M:%S")

---

## 📊 Tests Effectués

EOF

# 1. Vérifier que le serveur tourne
echo "1️⃣ Vérification du serveur..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ✅ Serveur détecté sur port 3000"
    SERVER_RUNNING=true
else
    echo "   ❌ Aucun serveur sur port 3000"
    echo "   💡 Lancer: bash start-server.sh"
    SERVER_RUNNING=false
fi
echo ""

if [ "$SERVER_RUNNING" = false ]; then
    echo "⚠️  Impossible de continuer sans serveur"
    echo "📝 Lancer d'abord: bash start-server.sh"
    exit 1
fi

# 2. Tester la page d'accueil
echo "2️⃣ Test de la page d'accueil..."
test_endpoint "GET" "/" "" "Homepage"
echo ""

# 3. Tester l'API booking
echo "3️⃣ Test de l'API Booking..."
test_endpoint "GET" "/api/booking" "" "API Health Check"
test_endpoint "POST" "/api/booking" '{}' "POST (validation errors expected)"
echo ""

# 4. Tester les pages admin
echo "4️⃣ Test des pages admin..."
test_endpoint "GET" "/admin" "" "Admin Login Page"
test_endpoint "GET" "/api/admin/list" "" "Admin List API (401 expected)"
echo ""

# 5. Vérifier les fichiers critiques
echo "5️⃣ Vérification des fichiers..."
check_file() {
    if [ -f "$1" ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 manquant"
    fi
}

check_file ".env.local"
check_file "components/BookingForm.tsx"
check_file "lib/supabaseClient.ts"
check_file "app/api/booking/route.ts"
echo ""

# 6. Vérifier les variables d'environnement
echo "6️⃣ Variables d'environnement..."
if [ -f ".env.local" ]; then
    if grep -q "VOTRE_ANON_KEY_ICI" .env.local 2>/dev/null; then
        echo "   ❌ ANON_KEY contient un placeholder"
    else
        echo "   ✅ ANON_KEY configuré"
    fi

    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null; then
        echo "   ✅ SUPABASE_URL présent"
    else
        echo "   ❌ SUPABASE_URL manquant"
    fi
fi
echo ""

# Résumé
echo "======================================"
echo "✅ Tests terminés"
echo "📄 Résultats complets: $RESULTS_FILE"
echo "======================================"

# Compléter le fichier de résultats
cat >> "$RESULTS_FILE" << EOF

## ✅ Résumé

- Serveur: $([ "$SERVER_RUNNING" = true ] && echo "✅ Running" || echo "❌ Not running")
- Tests effectués: $(date +"%Y-%m-%d %H:%M:%S")

## 🔍 Actions Recommandées

1. Si des tests échouent, vérifier les logs du serveur
2. Pour les erreurs 401/403: Normal pour endpoints protégés
3. Pour les erreurs 500: Vérifier .env.local et Supabase
4. Pour connection refused: Vérifier que le serveur tourne

## 📞 Support

- \`debug-supabase.js\` - Diagnostic environnement
- \`DIAGNOSTIC-SYSTEME.md\` - Analyse complète
- \`QUICK-FIX.md\` - Fixes rapides
EOF

echo ""
echo "💡 Pour lancer le diagnostic Supabase: node debug-supabase.js"
