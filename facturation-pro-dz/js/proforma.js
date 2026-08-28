const Proforma = (() => {
  // Structure identique à facture.js mais :
  // - Titre "Facture pro-forma N°..."
  // - TVA 19% (Du montant HT sans retenue de garantie)
  // - PAS de retenue de garantie
  // - PAS de franchise
  
  function render() {
    // ... même template que Facture avec ces différences :
    // - "Facture pro-forma N°XX du JJ/MM/AAAA"
    // - TVA = totalHT * 0.19
    // - totalTTC = totalHT + TVA
    // - Pas de ligne "RETENUE DE GARANTIE"
    // - Pas de ligne "Franchise"
  }
  
  async function printPDF() {
    // Même logique que Facture.printPDF
  }
  
  return { init, addLine, removeLine, update, render, printPDF };
})();