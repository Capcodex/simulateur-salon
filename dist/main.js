"use strict";
const salons = {
    'artbasel-paris': {
        name: 'Art Basel Paris',
        location: 'france',
        standard: {
            transportPerPerson: 100,
            hotelPerNight: 120,
            pass: 50,
        },
        premium: {
            transportPerPerson: 100,
            hotelPerNight: 120,
            pass: 200,
        },
    },
};
// Coûts supplémentaires selon confort logement
const coutConfortLogement = {
    basic: 0,
    confort: 40, // +40€ par nuit et par personne
    '5etoiles': 100, // +100€ par nuit et par personne
};
function estimerCout({ salonId, formule, jours, personnes, confortLogement, accompagnementPro, }) {
    const salon = salons[salonId];
    const tarif = salon[formule];
    // Si accompagnement pro choisi, on ajoute 1 personne supplémentaire
    const nbPersonnes = accompagnementPro ? personnes + 1 : personnes;
    let total = 0;
    total += tarif.transportPerPerson * nbPersonnes;
    total += (tarif.hotelPerNight + coutConfortLogement[confortLogement]) * jours * nbPersonnes;
    total += tarif.pass * nbPersonnes;
    // Coût fixe accompagnement pro (optionnel, si tu veux rajouter un coût spécifique à part)
    // total += accompagnementPro ? 500 : 0;
    return total;
}
// Exemple d’intégration avec formulaire HTML (à adapter en fonction de ton HTML)
const form = document.getElementById('simulateur-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const salonId = document.getElementById('salon').value;
    const formule = form.querySelector('input[name="formule"]:checked').value;
    const jours = parseInt(document.getElementById('jours').value);
    const personnes = parseInt(document.getElementById('personnes').value);
    const confortLogement = document.getElementById('confort-logement').value;
    const accompagnementPro = document.getElementById('accompagnement-pro').checked;
    const total = estimerCout({ salonId, formule, jours, personnes, confortLogement, accompagnementPro });
    alert(`💡 Estimation : ${total.toLocaleString('fr-FR')} € TTC`);
});
//# sourceMappingURL=main.js.map