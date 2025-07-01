type Formule = 'standard' | 'premium';

interface Tarif {
  transportPerPerson: number;
  hotelPerNight: number;
  pass: number;
}

interface SalonConfig {
  name: string;
  location: 'france' | 'europe' | 'hors_europe';
  standard: Tarif;
  premium: Tarif;
}

const salons: Record<string, SalonConfig> = {
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
const coutConfortLogement: Record<string, number> = {
  basic: 0,
  confort: 40,       // +40€ par nuit et par personne
  '5etoiles': 100,   // +100€ par nuit et par personne
};

function estimerCout({
  salonId,
  formule,
  jours,
  personnes,
  confortLogement,
  accompagnementPro,
}: {
  salonId: string;
  formule: Formule;
  jours: number;
  personnes: number;
  confortLogement: keyof typeof coutConfortLogement;
  accompagnementPro: boolean;
}): number {
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

const form = document.getElementById('simulateur-form') as HTMLFormElement;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const salonId = (document.getElementById('salon') as HTMLSelectElement).value;
  const formule = (form.querySelector('input[name="formule"]:checked') as HTMLInputElement).value as Formule;
  const jours = parseInt((document.getElementById('jours') as HTMLInputElement).value);
  const personnes = parseInt((document.getElementById('personnes') as HTMLInputElement).value);
  const confortLogement = (document.getElementById('confort-logement') as HTMLSelectElement).value as keyof typeof coutConfortLogement;
  const accompagnementPro = (document.getElementById('accompagnement-pro') as HTMLInputElement).checked;

  const total = estimerCout({ salonId, formule, jours, personnes, confortLogement, accompagnementPro });

  alert(`💡 Estimation : ${total.toLocaleString('fr-FR')} € TTC`);
});