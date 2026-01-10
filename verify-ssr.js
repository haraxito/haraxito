#!/usr/bin/env node

/**
 * Script de vérification de l'optimisation SSR
 * Vérifie que les composants Server/Client sont correctement configurés
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Vérification de l\'optimisation SSR...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function check(condition, message, type = 'check') {
  const icon = type === 'warning' ? '⚠️' : (condition ? '✅' : '❌');
  console.log(`${icon} ${message}`);

  if (type === 'warning' && !condition) {
    checks.warnings++;
  } else if (condition) {
    checks.passed++;
  } else {
    checks.failed++;
  }
}

// 1. Vérifier que lib/constants.ts existe
const constantsPath = path.join(__dirname, 'lib', 'constants.ts');
const constantsExists = fs.existsSync(constantsPath);
check(constantsExists, 'Fichier lib/constants.ts existe');

if (constantsExists) {
  const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
  check(
    constantsContent.includes('export const MARQUES_POPULAIRES'),
    'MARQUES_POPULAIRES exporté dans constants.ts'
  );
  check(
    constantsContent.includes('export function getYearsArray'),
    'Fonction getYearsArray exportée'
  );
  check(
    constantsContent.includes('export type FormValues'),
    'Types exportés dans constants.ts'
  );
}

// 2. Vérifier BookingForm.tsx (Server Component)
const bookingFormPath = path.join(__dirname, 'components', 'BookingForm.tsx');
const bookingFormExists = fs.existsSync(bookingFormPath);
check(bookingFormExists, 'Fichier components/BookingForm.tsx existe');

if (bookingFormExists) {
  const bookingFormContent = fs.readFileSync(bookingFormPath, 'utf-8');
  check(
    !bookingFormContent.includes('"use client"'),
    'BookingForm.tsx est un Server Component (pas de "use client")'
  );
  check(
    bookingFormContent.includes('import BookingFormClient'),
    'BookingForm importe BookingFormClient'
  );
  check(
    bookingFormContent.includes('from "@/lib/constants"') || bookingFormContent.includes('from \'@/lib/constants\''),
    'BookingForm importe depuis lib/constants'
  );
}

// 3. Vérifier BookingFormClient.tsx (Client Component)
const bookingFormClientPath = path.join(__dirname, 'components', 'BookingFormClient.tsx');
const bookingFormClientExists = fs.existsSync(bookingFormClientPath);
check(bookingFormClientExists, 'Fichier components/BookingFormClient.tsx existe');

if (bookingFormClientExists) {
  const bookingFormClientContent = fs.readFileSync(bookingFormClientPath, 'utf-8');
  check(
    bookingFormClientContent.includes('"use client"'),
    'BookingFormClient.tsx est un Client Component ("use client")'
  );
  check(
    bookingFormClientContent.includes('useForm'),
    'BookingFormClient utilise react-hook-form'
  );
  check(
    bookingFormClientContent.includes('useState'),
    'BookingFormClient utilise useState pour l\'interactivité'
  );
}

// 4. Vérifier que l'ancien fichier n'a pas été dupliqué
const oldBookingFormPath = path.join(__dirname, 'components', 'BookingForm.old.tsx');
check(
  !fs.existsSync(oldBookingFormPath),
  'Pas de fichier de backup inutile (.old.tsx)',
  'warning'
);

// 5. Vérifier .nvmrc
const nvmrcPath = path.join(__dirname, '.nvmrc');
const nvmrcExists = fs.existsSync(nvmrcPath);
check(nvmrcExists, 'Fichier .nvmrc existe (spécifie Node.js v20)');

if (nvmrcExists) {
  const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf-8').trim();
  check(
    nvmrcContent === '20',
    '.nvmrc contient la version recommandée (20)'
  );
}

// 6. Vérifier la documentation
const ssrDocPath = path.join(__dirname, 'SSR_OPTIMIZATION.md');
check(fs.existsSync(ssrDocPath), 'Documentation SSR_OPTIMIZATION.md existe');

const buildIssuePath = path.join(__dirname, 'BUILD_ISSUE.md');
check(fs.existsSync(buildIssuePath), 'Documentation BUILD_ISSUE.md existe');

const changelogPath = path.join(__dirname, 'CHANGELOG.md');
check(fs.existsSync(changelogPath), 'Fichier CHANGELOG.md existe');

// 7. Vérifier package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonExists = fs.existsSync(packageJsonPath);
check(packageJsonExists, 'Fichier package.json existe');

if (packageJsonExists) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const nextVersion = packageJson.dependencies?.next || '';
  check(
    nextVersion.includes('14') || nextVersion.includes('^14'),
    'Next.js version 14.x installée (compatible SSR)'
  );

  const reactVersion = packageJson.dependencies?.react || '';
  check(
    reactVersion.includes('18') || reactVersion.includes('^18'),
    'React version 18.x installée (Server Components)'
  );
}

// Résumé
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ');
console.log('='.repeat(50));
console.log(`✅ Tests réussis: ${checks.passed}`);
console.log(`❌ Tests échoués: ${checks.failed}`);
console.log(`⚠️  Avertissements: ${checks.warnings}`);

if (checks.failed === 0 && checks.warnings === 0) {
  console.log('\n🎉 Parfait! Tous les fichiers SSR sont correctement configurés.');
  console.log('📖 Voir SSR_OPTIMIZATION.md pour plus de détails.\n');
  process.exit(0);
} else if (checks.failed === 0) {
  console.log('\n✨ Bon! Configuration SSR OK avec quelques avertissements mineurs.');
  console.log('📖 Voir SSR_OPTIMIZATION.md pour plus de détails.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Certains fichiers sont manquants ou mal configurés.');
  console.log('📖 Consultez SSR_OPTIMIZATION.md pour résoudre les problèmes.\n');
  process.exit(1);
}
