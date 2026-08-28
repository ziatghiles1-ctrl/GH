const Auth = (() => {
  // Clés de codes valides (simulation serveur)
  const VALID_CODES = {
    'FPDZ-7K4M-X92P-8LQW': {
      plan: 'ANNUEL',
      activatedAt: '2026-08-28',
      expiresAt: '2027-08-28',
      devices: 1,
      status: 'active'
    },
    'FPDZ-DEMO-TEST-1234': {
      plan: 'MENSUEL',
      activatedAt: '2026-08-01',
      expiresAt: '2026-09-01',
      devices: 1,
      status: 'active'
    },
    'FPDZ-EXPI-EXPI-0000': {
      plan: 'ANNUEL',
      activatedAt: '2024-01-01',
      expiresAt: '2025-01-01',
      devices: 1,
      status: 'expired'
    },
    'FPDZ-SUSP-SUSP-0000': {
      plan: 'ANNUEL',
      activatedAt: '2026-01-01',
      expiresAt: '2027-01-01',
      devices: 1,
      status: 'suspended'
    }
  };

  function showMessage(type, html) {
    const el = document.getElementById('statusMessage');
    if (!el) return;
    el.className = 'status-message ' + type;
    el.innerHTML = html;
  }

  function saveSession(code, data) {
    localStorage.setItem('fpdz_license', JSON.stringify({ code, ...data }));
  }

  function getSession() {
    const raw = localStorage.getItem('fpdz_license');
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    localStorage.removeItem('fpdz_license');
  }

  function checkAccess() {
    const session = getSession();
    if (!session) return { ok:false, reason:'none' };
    if (session.status === 'suspended') return { ok:false, reason:'suspended' };
    if (new Date(session.expiresAt) < new Date()) return { ok:false, reason:'expired' };
    return { ok:true, session };
  }

  function activate(code) {
    code = code.toUpperCase().trim();
    const data = VALID_CODES[code];
    if (!data) {
      showMessage('error', `
        ❌ CODE INVALIDE<br>
        Le code d'accès saisi est incorrect.<br>
        Veuillez vérifier votre code ou contacter le fournisseur.
      `);
      return;
    }
    if (data.status === 'expired') {
      showMessage('warning', `
        ⚠ ABONNEMENT EXPIRÉ<br>
        Votre code d'accès n'est plus valide.<br>
        Veuillez acheter un nouvel abonnement.
      `);
      return;
    }
    if (data.status === 'suspended') {
      showMessage('warning', `
        ⚠ ABONNEMENT SUSPENDU<br>
        Votre accès a été temporairement suspendu.<br>
        Veuillez contacter le fournisseur.
      `);
      return;
    }

    saveSession(code, data);
    showMessage('success', `
      ✓ ACTIVATION RÉUSSIE<br><br>
      Bienvenue dans FACTURATION PRO DZ<br><br>
      Votre abonnement : <b>${data.plan}</b><br>
      Date d'activation : ${data.activatedAt}<br>
      Date d'expiration : ${data.expiresAt}<br>
      Appareils autorisés : ${data.devices}
    `);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
  }

  function requireAuth() {
    const check = checkAccess();
    if (!check.ok) {
      if (check.reason === 'expired') {
        alert('⚠ ABONNEMENT EXPIRÉ\nVeuillez renouveler votre abonnement.');
      } else if (check.reason === 'suspended') {
        alert('⚠ ABONNEMENT SUSPENDU\nVeuillez contacter le fournisseur.');
      } else {
        alert('⚠ AUCUNE LICENCE ACTIVE\nVeuillez activer votre code d\'accès.');
      }
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  return { activate, checkAccess, getSession, clearSession, requireAuth };
})();