const fs = require('fs');
const https = require('https');
const readline = require('readline');
const path = require('path');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour récupérer et sauvegarder les données des tickets
const fetchAndSaveTicketData = (bearerToken) => {
  const options = {
    hostname: 'api.zelty.fr',
    path: '/2.8/orders?opened=1&limit=200',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Statut: ${res.statusCode}`);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        fs.writeFile('ticket.json', data, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Les données ont été sauvegardées dans le fichier ticket.json');
            resolve();
          }
        });
      });
    });

    req.on('error', (error) => {
      console.error(`Erreur: ${error.message}`);
      reject(error);
    });

    req.end();
  });
};

// Fonction pour créer le fichier ids.json
const createIdsJsonFile = () => {
    const ticketData = JSON.parse(fs.readFileSync('ticket.json'));
    const idsFromTicket = ticketData.orders.map(order => ({ id_order: order.id }));
    const data = []; // Tableau de données vide
    const idsFromData = data.map(id => ({ id_order: id }));
    const allIds = [...idsFromTicket, ...idsFromData];
  
    const tempRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    tempRl.question('Entrez le chemin pour créer le fichier ids.json : ', (idsJsonPath) => {
      const fullPath = path.join(idsJsonPath, 'ids.json');
      fs.writeFileSync(fullPath, JSON.stringify(allIds, null, 2));
      console.log('Fichier ids.json créé avec succès.');
      tempRl.close();
    });
  };

// Fonction pour effectuer la requête POST avec l'ID_ORDER spécifié
async function fetchTransactions(ID_ORDER, bearerToken) {
  const url = `https://api.zelty.fr/2.7/orders/${ID_ORDER}/transactions`;
  const requestBody = {
    "transactions": [
      {
        "id_transaction_method": 5187,
        "price": 10000
      }
    ]
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for order ${ID_ORDER}:`, error.message);
    return null;
  }
}

// Fonction pour effectuer la requête de clôture avec l'ID_ORDER spécifié
async function fetchClosure(ID_ORDER, bearerToken) {
  const url = `https://api.zelty.fr/2.7/orders/${ID_ORDER}/closure`;

  try {
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    console.log(`Response for order ${ID_ORDER}:`, response.data);
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching closure for order ${ID_ORDER}. Status code: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error(`Error fetching closure for order ${ID_ORDER}:`, error.message);
    }
  }
}

// Fonction pour lire les ID_ORDER à partir du fichier JSON
function readIDOrdersFromFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath));
    return data.map(obj => obj.id_order);
  } catch (error) {
    console.error('Error reading ID_ORDER from file:', error.message);
    return [];
  }
}

// Fonction pour introduire un délai synchrone
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour exécuter le script
async function runScript() {
  rl.question('Entrez le token Bearer : ', bearerToken => {
    rl.question('Entrez le chemin du fichier ids.json : ', idsJsonPath => {
      rl.question('Entrez le chemin du fichier results.json : ', resultsJsonPath => {
        runScriptWithArgs(bearerToken, idsJsonPath, resultsJsonPath);
        rl.close();
      });
    });
  });
}

// Fonction pour exécuter le script avec les arguments fournis
async function runScriptWithArgs(bearerToken, idsJsonPath, resultsJsonPath) {
  await fetchAndSaveTicketData(bearerToken);
  createIdsJsonFile();

  const idOrders = readIDOrdersFromFile(idsJsonPath);
  const results = [];

  console.log(`Starting script with ${idOrders.length} orders...`);

  for (const idOrder of idOrders) {
    console.log(`Processing order ${idOrder}...`);
    const transactionResponse = await fetchTransactions(idOrder, bearerToken);
    if (transactionResponse) {
      results.push({ id_order: idOrder, transactionResponse });
    }

    // Délai d'une seconde avant la prochaine requête
    await delay(1000);

    // Effectuer la requête de clôture
    await fetchClosure(idOrder, bearerToken);
  }

  fs.writeFileSync(resultsJsonPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${resultsJsonPath}`);
}

// Exécuter le script
runScript();