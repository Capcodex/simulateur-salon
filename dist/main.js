"use strict";
const salons = {
    'artbasel-paris': {
        name: 'Art Basel Paris',
        location: 'france',
        standard: {
            transportPerPerson: 100,
            hotelPerNight: 120,
            pass: 110,
        },
        premium: {
            transportPerPerson: 100,
            hotelPerNight: 120,
            pass: 650,
        },
        VIP: {
            transportPerPerson: 100,
            hotelPerNight: 120,
            pass: 1300,
        },
    },
    'artgeneve': {
        name: 'Artgenève',
        location: 'europe',
        standard: {
            transportPerPerson: 150,
            hotelPerNight: 130,
            pass: 20,
        },
        premium: {
            transportPerPerson: 150,
            hotelPerNight: 130,
            pass: 0,
        },
        VIP: {
            transportPerPerson: 150,
            hotelPerNight: 130,
            pass: 0,
        },
    },
};
// Coûts supplémentaires selon confort logement
const coutConfortLogement = {
    basic: 0,
    confort: 40, // +40€ par nuit et par personne
    '5etoiles': 100, // +100€ par nuit et par personne
};
function estimerCout(params) {
    const salon = salons[params.salonId];
    const tarif = salon[params.formule];
    // Si accompagnement pro choisi, on ajoute 1 personne supplémentaire
    const nbPersonnes = params.accompagnementPro ? params.personnes + 1 : params.personnes;
    let total = 0;
    const nuits = Math.max(0, params.jours - 1);
    total += (tarif.hotelPerNight + coutConfortLogement[params.confortLogement]) * nuits * nbPersonnes;
    total += tarif.transportPerPerson * nbPersonnes;
    total += tarif.pass * nbPersonnes;
    // Coût fixe accompagnement pro (optionnel, si tu veux rajouter un coût spécifique à part)
    // total += accompagnementPro ? 500 : 0;
    return total;
}
// Exemple d’intégration avec formulaire HTML (à adapter en fonction de ton HTML)
const form = document.getElementById('simulateur-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Récupération des données utilisateur
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telephone').value;
    const salonId = document.getElementById('salon').value;
    const formule = form.querySelector('input[name="formule"]:checked').value;
    const jours = parseInt(document.getElementById('jours').value);
    const personnes = parseInt(document.getElementById('personnes').value);
    const confortLogement = document.getElementById('confort-logement').value;
    const accompagnementPro = document.getElementById('accompagnement-pro').checked;
    const total = estimerCout({
        salonId,
        formule,
        jours,
        personnes,
        confortLogement,
        accompagnementPro,
    });
    // Affichage du devis personnalisé
    const devisSection = document.getElementById('devis-resultat');
    const devisContenu = document.getElementById('devis-contenu');
    devisContenu.innerHTML = `
    <p><strong>Nom :</strong> ${prenom} ${nom}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Téléphone :</strong> ${telephone || 'Non renseigné'}</p>
    <hr />
    <p><strong>Salon :</strong> ${salons[salonId].name}</p>
    <p><strong>Formule :</strong> ${formule}</p>
    <p><strong>Nombre de jours :</strong> ${jours}</p>
    <p><strong>Nombre de personnes :</strong> ${personnes}${accompagnementPro ? ' (+1 pro)' : ''}</p>
    <p><strong>Confort logement :</strong> ${confortLogement}</p>
    <p><strong>Accompagnement pro :</strong> ${accompagnementPro ? 'Oui' : 'Non'}</p>
    <hr />
    <h3>💰 Coût estimé : ${total.toLocaleString('fr-FR')} € TTC</h3>
  `;
    devisSection.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
});
const joursInput = document.getElementById('jours');
const confortGroup = document.getElementById('confort-logement').closest('.form-group');
function toggleConfortVisibility() {
    const jours = parseInt(joursInput.value);
    if (jours <= 1) {
        confortGroup.style.display = 'none';
    }
    else {
        confortGroup.style.display = '';
    }
}
joursInput.addEventListener('input', toggleConfortVisibility);
toggleConfortVisibility(); // appel initial
// === Désactivation des formules selon le salon ===
const formuleInputs = document.querySelectorAll('input[name="formule"]');
document.getElementById('salon').addEventListener('change', (e) => {
    const selectedSalon = e.target.value;
    if (selectedSalon === 'artgeneve') {
        formuleInputs.forEach((input) => {
            if (input.value !== 'standard') {
                input.disabled = true;
                input.checked = false;
            }
            else {
                input.disabled = false;
                input.checked = true;
            }
        });
    }
    else {
        formuleInputs.forEach((input) => {
            input.disabled = false;
        });
    }
});
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.addEventListener('click', () => {
    const devisContenu = document.getElementById('devis-contenu');
    const { jsPDF } = window.jspdf; // 👈 version CDN
    const pdf = new jsPDF();
    const lines = devisContenu.innerText.split('\n');
    pdf.setFontSize(12);
    let y = 20;
    lines.forEach((line) => {
        if (y > 270) {
            pdf.addPage();
            y = 20;
        }
        pdf.text(line.trim(), 10, y);
        y += 8;
    });
    pdf.save('devis-simulation-salon.pdf');
});
//# sourceMappingURL=main.js.map