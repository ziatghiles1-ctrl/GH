const App = (() => {
  function getFactures() { return JSON.parse(localStorage.getItem('fpdz_factures') || '[]'); }
  function getProformas() { return JSON.parse(localStorage.getItem('fpdz_proformas') || '[]'); }
  function saveFacture(f) {
    const arr = getFactures(); arr.push(f);
    localStorage.setItem('fpdz_factures', JSON.stringify(arr));
  }
  function saveProforma(p) {
    const arr = getProformas(); arr.push(p);
    localStorage.setItem('fpdz_proformas', JSON.stringify(arr));
  }
  function countFactures() { return getFactures().length; }
  function countProformas() { return getProformas().length; }
  function caMois() {
    const now = new Date();
    return getFactures().filter(f => {
      const d = new Date(f.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s,f)=>s+(+f.total||0), 0).toFixed(2);
  }
  return { saveFacture, saveProforma, countFactures, countProformas, caMois };
})();