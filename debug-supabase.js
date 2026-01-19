#!/usr/bin/env node

/**
 * Script de diagnostic Supabase + Vercel
 * Vérifie la configuration et teste la connexion
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC SUPABASE + VERCEL\n');
console.log('='.repeat(60));

// 1. Vérifier les fichiers de config
console.log('\n📁 1. FICHIERS DE CONFIGURATION');
console.log('-'.repeat(60));

const files = [
  '.env.local',
  'next.config.js',
  'lib/supabaseClient.ts',
  'lib/env.ts',
  'app/api/booking/route.ts',
  'supabase.sql'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// 2. Charger et analyser .env.local
console.log('\n🔑 2. VARIABLES D\'ENVIRONNEMENT (.env.local)');
console.log('-'.repeat(60));

try {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');

  const envVars = {};
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  // Vérifier chaque variable
  const checks = [
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      test: (v) => v && v.startsWith('https://') && v.includes('.supabase.co'),
      message: 'URL Supabase valide'
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      test: (v) => {
        if (!v) return false;
        const parts = v.split('.');
        if (parts.length !== 3) return false;
        if (!parts[0].startsWith('eyJ')) return false;
        // Vérifier qu'il n'y a pas de placeholder
        if (v.includes('VOTRE_') || v.includes('_ICI')) return false;
        return parts[2].length > 10;
      },
      message: 'Clé ANON valide (JWT)'
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      test: (v) => {
        if (!v) return false;
        const parts = v.split('.');
        return parts.length === 3 && parts[0].startsWith('eyJ') && parts[2].length > 10;
      },
      message: 'Clé SERVICE_ROLE valide (JWT)'
    },
    {
      key: 'RESEND_API_KEY',
      test: (v) => v && v.startsWith('re_') && v.length > 20,
      message: 'Clé Resend valide'
    },
    {
      key: 'ADMIN_EMAIL',
      test: (v) => v && v.includes('@'),
      message: 'Email admin valide'
    },
    {
      key: 'RESEND_FROM_EMAIL',
      test: (v) => v && v.includes('@'),
      message: 'Email FROM valide'
    }
  ];

  let hasErrors = false;
  checks.forEach(check => {
    const value = envVars[check.key];
    const isValid = check.test(value);

    if (!isValid && ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'].includes(check.key)) {
      hasErrors = true;
    }

    const status = isValid ? '✅' : (check.key.includes('ADMIN') || check.key.includes('FROM') ? '⚠️' : '❌');
    const truncated = value ? `${value.substring(0, 40)}${value.length > 40 ? '...' : ''}` : 'NON DÉFINI';

    console.log(`${status} ${check.key}`);
    console.log(`   ${check.message}: ${isValid ? 'OUI' : 'NON'}`);
    console.log(`   Valeur: ${truncated}`);

    if (!isValid && value && value.includes('VOTRE_')) {
      console.log(`   ⚠️  ATTENTION: Contient un placeholder !`);
    }
  });

  // 3. Décoder les JWT pour vérifier leur contenu
  console.log('\n🔐 3. ANALYSE DES JWT TOKENS');
  console.log('-'.repeat(60));

  const jwtKeys = ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  jwtKeys.forEach(key => {
    const jwt = envVars[key];
    if (jwt && jwt.split('.').length === 3 && !jwt.includes('VOTRE_')) {
      try {
        const payload = jwt.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        console.log(`\n${key}:`);
        console.log(`   Role: ${decoded.role || 'N/A'}`);
        console.log(`   Ref: ${decoded.ref || 'N/A'}`);
        console.log(`   Issuer: ${decoded.iss || 'N/A'}`);
        console.log(`   Expires: ${decoded.exp ? new Date(decoded.exp * 1000).toLocaleDateString() : 'N/A'}`);
      } catch (e) {
        console.log(`❌ ${key}: Impossible de décoder le JWT`);
      }
    } else {
      console.log(`❌ ${key}: JWT invalide ou contient un placeholder`);
    }
  });

  // 4. Résumé des problèmes
  console.log('\n📊 4. RÉSUMÉ');
  console.log('-'.repeat(60));

  if (hasErrors) {
    console.log('❌ CONFIGURATION INVALIDE - Des erreurs critiques ont été détectées');
    console.log('\n🔧 ACTIONS REQUISES:');

    const anonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    if (!anonKey || anonKey.includes('VOTRE_') || anonKey.split('.').length !== 3) {
      console.log('\n1. RÉCUPÉRER LA VRAIE CLÉ ANON KEY:');
      console.log('   - Aller sur https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api');
      console.log('   - Copier la "anon public" key');
      console.log('   - Remplacer NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local');
    }

    console.log('\n2. VÉRIFIER LA CLÉ SERVICE_ROLE:');
    console.log('   - Sur la même page API settings');
    console.log('   - Copier la "service_role" key (secret!)');
    console.log('   - Remplacer SUPABASE_SERVICE_ROLE_KEY dans .env.local');

    console.log('\n3. CONFIGURER VERCEL:');
    console.log('   - vercel env add NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   - vercel env add SUPABASE_SERVICE_ROLE_KEY');
    console.log('   - vercel env add RESEND_API_KEY');

  } else {
    console.log('✅ CONFIGURATION LOCALE VALIDE');
    console.log('\n📤 PROCHAINES ÉTAPES:');
    console.log('1. Configurer les mêmes variables sur Vercel');
    console.log('2. Créer la table dans Supabase (exécuter supabase.sql)');
    console.log('3. Tester l\'API: npm run dev puis POST sur /api/booking');
  }

} catch (error) {
  console.error('❌ Erreur lors de la lecture de .env.local:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('Diagnostic terminé\n');
