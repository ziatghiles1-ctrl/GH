const Facture = (() => {
  const data = {
    items: [
      { num:'02-AB', designation:"Création y compris installation intérieur", appi:"Travaux raccordement et de mise en service des clients", qty:29, unit:'U', price:1600 },
      { num:'42-AB', designation:"Plus-value pour Pose de cable aérien au-delà de 05 portée supplémentaire et indivisible de 25 mètres", appi:"Travaux raccordement et de mise en service des clients", qty:5, unit:'U', price:382 },
      { num:'44-AB', designation:"Plus-value pour Pose de cable d'installation à paire ou bronze en façade ou immeuble au-delà de 30 mètres par longueur indivisible de 10 mètres(88/11)", appi:"Travaux raccordement et de mise en service des clients", qty:5, unit:'U', price:312 }
    ]
  };

  const client = {
    raison: "EPE/SPA ALGERIE TELECOM",
    forme: "Société par Action(SPA)",
    regime: "Secteur Public Entreprise Publique Economique(EPE)",
    compte: "001 00581 0300 001 588 CLE 86",
    rc: "02B 0018083",
    siege: "Route Nationale n°05, Cinq Maisons, Mohammadia-16200-Alger",
    dot: "TIZI-OUZOU",
    nif: "000 216 001 808 33716001",
    nis: "000 216 290 656 936"
  };

  const entreprise = {
    nom: "ETS GUERBAS TAKFARINAS",
    activite: "INSTALLATION DE RESEAUX DE CENTRALE ELECTRIQUE ET TELEPHONIQUE",
    adresse: "local n°61 cité 600 logs E.P.L.F NOUVELLE VILLE T.O",
    capital: "115 000 000 000.00 DA",
    rc: "15/00-0314241 A 15",
    nif: "198215010577918",
    nis: "182150105779130",
    ai: "15018145451",
    article: "16293838021",
    tel: "0667 45 21 61"
  };

  function init() {
    renderItems();
    render();
  }

  function addLine() {
    data.items.push({ num:'', designation:'', appi:'Travaux raccordement et de mise en service des clients', qty:0, unit:'U', price:0 });
    renderItems();
    render();
  }

  function removeLine(i) {
    data.items.splice(i,1);
    renderItems();
    render();
  }

  function renderItems() {
    const body = document.getElementById('itemsBody');
    body.innerHTML = '';
    data.items.forEach((it, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input value="${it.num}" onchange="Facture.update(${i},'num',this.value)"></td>
        <td><input value="${it.designation}" onchange="Facture.update(${i},'designation',this.value)"></td>
        <td><input value="${it.appi}" onchange="Facture.update(${i},'appi',this.value)"></td>
        <td><input type="number" value="${it.qty}" onchange="Facture.update(${i},'qty',+this.value)"></td>
        <td><input value="${it.unit}" onchange="Facture.update(${i},'unit',this.value)"></td>
        <td><input type="number" step="0.01" value="${it.price}" onchange="Facture.update(${i},'price',+this.value)"></td>
        <td>${(it.qty*it.price).toFixed(2)}</td>
        <td><button onclick="Facture.removeLine(${i})">✕</button></td>
      `;
      body.appendChild(tr);
    });
  }

  function update(i, field, val) {
    data.items[i][field] = val;
    renderItems();
    render();
  }

  function fmt(n) { return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n); }

  function numberToWords(n) {
    // Version simplifiée — en production utiliser une lib complète
    return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' dinars';
  }

  function render() {
    const f = {
      numero: document.getElementById('f_numero')?.value || '01',
      date: document.getElementById('f_date')?.value || '2026-08-28',
      ods: document.getElementById('f_ods')?.value || '',
      franchise: document.getElementById('f_franchise')?.value || '',
      marche: document.getElementById('f_marche')?.value || '',
      bon: document.getElementById('f_bon')?.value || '',
      objet: document.getElementById('f_objet')?.value || ''
    };

    const totalHT = data.items.reduce((s,i)=>s+i.qty*i.price,0);
    const tva = 0; // TVA 0% selon modèle N°01
    const totalTTC = totalHT + tva;
    const retenue = totalHT * 0.05;
    const net = totalTTC - retenue;

    const rows = data.items.map(it => `
      <tr>
        <td class="num">${it.num}</td>
        <td>${it.designation}</td>
        <td>${it.appi}</td>
        <td class="qty">${it.qty}</td>
        <td class="unit">${it.unit}</td>
        <td class="price">${fmt(it.price)}</td>
        <td class="total">${fmt(it.qty*it.price)}</td>
      </tr>
    `).join('');

    document.getElementById('invoicePreview').innerHTML = `
      <div class="invoice-header">
        <div class="row"><span><span class="label">Raison Social/Nom commercial:</span> ${client.raison}</span></div>
        <div class="row"><span><span class="label">Forme juridique:</span> ${client.forme}</span></div>
        <div class="row"><span><span class="label">Régime Juridique:</span> ${client.regime}</span></div>
        <div class="row"><span><span class="label">Compte Bancaire:</span> ${client.compte}</span><span><span class="label">Numéro d'inscription registre de commerce(RC N°)</span> ${client.rc}</span></div>
        <div class="row"><span><span class="label">Siège Social:</span> ${client.siege}</span></div>
        <div class="row"><span><span class="label">Adresse/ siège DOT:</span> ${client.dot}</span><span><span class="label">Numéro d'identification Fiscal&lt;&lt;NIF&gt;&gt;:</span> ${client.nif}</span></div>
        <div class="row"><span><span class="label">Numéro d'identification Statistique&lt;&lt;NIS&gt;&gt;:</span> ${client.nis}</span></div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h4>Facture N°${f.numero} du ${f.date}</h4>
          <p>ODS N°: ${f.ods}</p>
          <p>Franchise N°${f.franchise}</p>
          <p>Marché: contrat d'adhésion à commande N°${f.marche}</p>
        </div>
        <div class="info-box">
          <h4>Bon de commande</h4>
          <p>N°: ${f.bon}</p>
          <p><b>OBJET :</b> ${f.objet}</p>
        </div>
      </div>

      <table class="items">
        <thead>
          <tr>
            <th>N°</th><th>Désignation</th><th>Désignation APPI</th>
            <th>Quantité</th><th>Unité</th><th>Prix U</th><th>Montant en HT</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div class="line"><span>TOTAL HT</span><span>${fmt(totalHT)}</span></div>
        <div class="line"><span>TVA 0%</span><span>${fmt(tva)}</span></div>
        <div class="line"><span>TOTAL TTC</span><span>${fmt(totalTTC)}</span></div>
        <div class="line"><span>RETENUE DE GARANTIE SUR HT</span><span>${fmt(retenue)}</span></div>
        <div class="line"><span>NET A PAYER</span><span>${fmt(net)}</span></div>
      </div>

      <div class="signature">
        <div class="box"><b>L'entreprise</b><br><br>${entreprise.nom}<br>${entreprise.activite}</div>
        <div class="box"><b>Arrêtée la présente facture à la somme de :</b><br><br>${numberToWords(net)}</div>
      </div>

      <div class="footer-note">
        ${entreprise.nom} — ${entreprise.activite}<br>
        Adresse: ${entreprise.adresse} — Capital Social: ${entreprise.capital}<br>
        RC: ${entreprise.rc} — NIF: ${entreprise.nif} — NIS: ${entreprise.nis} — AI: ${entreprise.ai}<br>
        N° ARTICLE D'IMPOSITION: ${entreprise.article} — Tél: ${entreprise.tel}
      </div>
    `;
  }

  async function printPDF() {
    const el = document.getElementById('invoicePreview');
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const img = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210, pageH = 297;
    const imgW = pageW - 20;
    const imgH = canvas.height * imgW / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, imgW, imgH);
    const num = document.getElementById('f_numero').value;
    pdf.save(`Facture_N${num}.pdf`);
    App.saveFacture({ num, date: document.getElementById('f_date').value, total: net });
  }

  return { init, addLine, removeLine, update, render, printPDF };
})();