#!/usr/bin/env node

/**
 * Script de test de l'API de booking
 * Teste la création d'une réservation complète
 */

console.log('🧪 TEST DE L\'API DE BOOKING\n');
console.log('='.repeat(60));

// Données de test pour une réservation à domicile
const testBookingDomicile = {
  nom: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  telephone: '0601020304',
  vehicule: '2020 Renault Clio',
  damageType: 'crack',
  typeService: 'DOMICILE',
  adresse: '15 Rue de la République, 75001 Paris',
  preferredDate: '2026-01-15',
  message: 'Fissure sur le pare-brise suite à un impact de gravier'
};

// Données de test pour une réservation en atelier
const testBookingAtelier = {
  nom: 'Marie Martin',
  email: 'marie.martin@example.com',
  telephone: '0612345678',
  vehicule: '2019 Peugeot 308',
  damageType: 'chip',
  typeService: 'ATELIER',
  preferredDate: '2026-01-20',
  message: 'Éclat de pare-brise à réparer'
};

async function testBooking(bookingData, testName) {
  console.log(`\n📝 ${testName}`);
  console.log('-'.repeat(60));

  try {
    const response = await fetch('http://localhost:3000/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Réservation créée avec succès !');
      console.log(`   ID: ${data.booking?.id || 'N/A'}`);
      console.log(`   Client: ${bookingData.nom}`);
      console.log(`   Service: ${bookingData.typeService}`);
      console.log(`   Date: ${bookingData.preferredDate}`);

      if (data.booking) {
        console.log('\n📊 Données retournées:');
        console.log(JSON.stringify(data.booking, null, 2));
      }
    } else {
      console.log('❌ Erreur lors de la création');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.error || 'Erreur inconnue'}`);
      if (data.details) {
        console.log(`   Détails: ${data.details}`);
      }
      if (data.errors) {
        console.log('   Erreurs de validation:');
        data.errors.forEach(err => console.log(`      - ${err}`));
      }
    }

    return response.ok;

  } catch (error) {
    console.log('❌ Erreur de connexion');
    console.log(`   Message: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 CONSEIL: Le serveur n\'est pas démarré.');
      console.log('   Exécutez: npm run dev');
    }

    return false;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Test du Health Check');
  console.log('-'.repeat(60));

  try {
    const response = await fetch('http://localhost:3000/api/booking');
    const data = await response.json();

    console.log('Status API:', data.status);
    console.log('Supabase:', data.supabase);
    console.log('Resend:', data.resend);
    console.log('Env valide:', data.envValid);

    const allOk = data.status === 'ok' &&
                  data.supabase === 'configured' &&
                  data.resend === 'configured' &&
                  data.envValid === true;

    if (allOk) {
      console.log('\n✅ Health check: OK');
      return true;
    } else {
      console.log('\n⚠️ Health check: Problèmes de configuration détectés');
      return false;
    }

  } catch (error) {
    console.log('❌ Erreur de connexion');
    console.log(`   Message: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 CONSEIL: Le serveur n\'est pas démarré.');
      console.log('   Exécutez: npm run dev');
    }

    return false;
  }
}

// Fonction principale
async function main() {
  // 1. Test du health check
  const healthOk = await testHealthCheck();

  if (!healthOk) {
    console.log('\n❌ Le health check a échoué. Vérifiez votre configuration.');
    console.log('   Exécutez: node debug-supabase.js');
    process.exit(1);
  }

  // 2. Test réservation à domicile
  const domicileOk = await testBooking(testBookingDomicile, 'Test #1: Réservation à DOMICILE');

  // 3. Test réservation en atelier
  const atelierOk = await testBooking(testBookingAtelier, 'Test #2: Réservation en ATELIER');

  // 4. Test sans email (optionnel)
  const noEmailData = { ...testBookingDomicile };
  delete noEmailData.email;
  const noEmailOk = await testBooking(noEmailData, 'Test #3: Réservation sans email');

  // 5. Test avec données invalides
  console.log('\n🚫 Test #4: Données invalides (devrait échouer)');
  console.log('-'.repeat(60));
  const invalidData = { nom: 'Test' }; // Manque des champs requis
  await testBooking(invalidData, 'Données incomplètes');

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));

  const passedTests = [domicileOk, atelierOk, noEmailOk].filter(Boolean).length;
  const totalTests = 3;

  console.log(`Tests réussis: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n✅ Prochaines étapes:');
    console.log('   1. Vérifier la table rendez_vous dans Supabase');
    console.log('   2. Vérifier les emails reçus');
    console.log('   3. Tester le dashboard admin: http://localhost:3000/admin');
    console.log('   4. Déployer sur Vercel: vercel --prod');
  } else {
    console.log('\n⚠️ Certains tests ont échoué');
    console.log('   Vérifiez les logs ci-dessus pour plus de détails');
  }

  console.log('\n');
}

// Exécution
main().catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
