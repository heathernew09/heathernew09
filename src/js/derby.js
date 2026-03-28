// --- Dictionaries for generation ---
const vocab = {
  adjectives: [
    'Lethal',
    'Toxic',
    'Savage',
    'Brutal',
    'Iron',
    'Rebel',
    'Vicious',
    'Atomic',
    'Neon',
    'Wicked',
    'Smashing',
    'Fearless',
    'Rogue',
    'Hellish',
    'Ruthless',
    'Fierce',
    'Psycho',
    'Bloody',
    'Radical',
  ],
  nouns: [
    'Bruiser',
    'Crusher',
    'Destroyer',
    'Menace',
    'Valkyrie',
    'Banshee',
    'Viper',
    'Phantom',
    'Riot',
    'Hurricane',
    'Annihilator',
    'Havoc',
    'Threat',
    'Punisher',
    'Assassin',
    'Fury',
    'Monster',
    'Machine',
  ],
  derbyTerms: [
    'Jammer',
    'Blocker',
    'Pivot',
    'Skater',
    'Roller',
    'Whip',
    'Track',
    'Quad',
    'Derby',
    'Wheels',
    'Apex',
  ],
  verbs: ['Smash', 'Whip', 'Block', 'Roll', 'Crush', 'Strike', 'Bash'],
  alphabetNames: {
    A: ['Alice', 'Athena', 'Artemis', 'Abby', 'Aria', 'Axel', 'Amethyst'],
    B: ['Betty', 'Blaze', 'Bella', 'Bonnie', 'Bex', 'Buffy', 'Bellatrix'],
    C: ['Cleo', 'Carmine', 'Cherry', 'Chloe', 'Cora', 'Crimson', 'Calamity'],
    D: ['Daisy', 'Dixie', 'Dakota', 'Delilah', 'Darcy', 'Dagger'],
    E: ['Elektra', 'Eve', 'Elvira', 'Eris', 'Eden', 'Echo'],
    F: ['Fiona', 'Foxy', 'Flora', 'Faye', 'Frankie', 'Fury'],
    G: ['Gia', 'Greta', 'Gwen', 'Goldie', 'Galaxy', 'Gorgon'],
    H: ['Harley', 'Hera', 'Hazel', 'Helga', 'Hilda', 'Havoc'],
    I: ['Ivy', 'Iris', 'Isolde', 'Ignacia', 'Ina', 'Iron'],
    J: ['Jett', 'Jinx', 'Jade', 'Jezebel', 'Jojo', 'Justice'],
    K: ['Kat', 'Karma', 'Kiki', 'Kira', 'Killer', 'Khaos'],
    L: ['Lola', 'Luna', 'Lilith', 'Lexi', 'Lulu', 'Lethal'],
    M: ['Moxie', 'Maeve', 'Macy', 'Medusa', 'Margot', 'Malice'],
    N: ['Nova', 'Nyx', 'Nikki', 'Nellie', 'Nina', 'Nebula'],
    O: ['Onyx', 'Olga', 'Olivia', 'Ophelia', 'Octavia', 'Omega'],
    P: ['Pepper', 'Penny', 'Pixie', 'Pandora', 'Pearl', 'Poison'],
    Q: ['Quinn', 'Queenie', 'Qira', 'Quake', 'Quartz'],
    R: ['Roxy', 'Raven', 'Ruby', 'Rizzo', 'Ramona', 'Riot'],
    S: ['Stella', 'Sadie', 'Scarlett', 'Siren', 'Sasha', 'Savage'],
    T: ['Trixie', 'Tallulah', 'Tara', 'Trinity', 'Tess', 'Terror'],
    U: ['Uma', 'Ursula', 'Ulrica', 'Unity', 'Ultra'],
    V: ['Vera', 'Valkyrie', 'Venus', 'Veda', 'Vixen', 'Viper'],
    W: ['Wanda', 'Winifred', 'Willow', 'Whisper', 'Willa', 'Wrath'],
    X: ['Xena', 'Xanthe', 'Xia', 'Xyla', 'Xenon'],
    Y: ['Yara', 'Yolanda', 'Yvaine', 'Yuki', 'Yankee'],
    Z: ['Zelda', 'Zara', 'Zoe', 'Zephyr', 'Ziggy', 'Zap'],
  },
};

const templates = [
  ['adjective', 'name'],
  ['name', 'static_the', 'noun'],
  ['interest', 'derbyTerm'],
  ['static_the', 'adjective', 'interest'],
  ['adjective', 'name', 'noun'],
  ['verb', 'name'],
];

let currentNameParts = [];
let nameHistory = JSON.parse(localStorage.getItem('derbyNameHistory') || '[]');

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function saveToHistory(fullName) {
  // Avoid duplicates if same name clicked multiple times
  if (nameHistory[0] === fullName) return;

  nameHistory.unshift(fullName);
  if (nameHistory.length > 3) nameHistory.pop(); // Keep last 3
  localStorage.setItem('derbyNameHistory', JSON.stringify(nameHistory));
  updateHistoryFeed();
}

function updateHistoryFeed() {
  const feed = document.getElementById('chatFeed');
  if (!feed) return;

  feed.innerHTML = '';
  nameHistory.forEach((name, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.style.animationDelay = `${i * 0.1}s`;
    bubble.innerHTML = `Track assigned: <strong>${name}</strong>`;
    feed.appendChild(bubble);
  });
}

function generateNewName() {
  const rawName = document.getElementById('userName').value.trim();
  const rawInterest = document.getElementById('userInterest').value.trim();

  const name = rawName || pickRandom(['Skater', 'Derby', 'Danger', 'Brawler']);
  const interest = rawInterest || pickRandom(['Chaos', 'Metal', 'Candy', 'Lightning']);

  const template = templates[Math.floor(Math.random() * templates.length)];

  currentNameParts = template.map((slotType) => {
    return generatePartData(slotType, name, interest);
  });

  document.getElementById('resultArea').classList.add('active');
  renderName();
  saveToHistory(currentNameParts.map((p) => p.text).join(' '));
}

function generatePartData(slotType, userName, userInterest) {
  let text = '';
  let isStatic = false;

  switch (slotType) {
    case 'name':
      let firstLetter = userName.charAt(0).toUpperCase();
      if (!/^[A-Z]$/.test(firstLetter)) {
        firstLetter = pickRandom(Object.keys(vocab.alphabetNames));
      }

      const possibleNames = vocab.alphabetNames[firstLetter];
      let chosenAlias = pickRandom(possibleNames);

      let nameAttempts = 0;
      while (chosenAlias.toLowerCase() === userName.toLowerCase() && nameAttempts < 10) {
        chosenAlias = pickRandom(possibleNames);
        nameAttempts++;
      }

      text = chosenAlias;
      break;
    case 'interest':
      text = userInterest;
      break;
    case 'adjective':
      text = pickRandom(vocab.adjectives);
      break;
    case 'noun':
      text = pickRandom(vocab.nouns);
      break;
    case 'derbyTerm':
      text = pickRandom(vocab.derbyTerms);
      break;
    case 'verb':
      text = pickRandom(vocab.verbs);
      break;
    case 'static_the':
      text = 'the';
      isStatic = true;
      break;
  }

  return { text, type: slotType, isStatic };
}

function swapPart(index) {
  const part = currentNameParts[index];
  if (part.isStatic) return;

  let rawName = document.getElementById('userName').value.trim() || 'Danger';
  let rawInterest = document.getElementById('userInterest').value.trim() || 'Chaos';

  let newText = part.text;
  let attempts = 0;

  while (newText === part.text && attempts < 10) {
    newText = generatePartData(part.type, rawName, rawInterest).text;
    attempts++;
  }

  currentNameParts[index].text = newText;
  renderName(index);
}

function renderName(animatedIndex = -1) {
  const container = document.getElementById('nameDisplay');
  container.innerHTML = '';

  currentNameParts.forEach((part, index) => {
    const el = document.createElement('div');

    if (part.isStatic) {
      el.className = 'name-part static-part';
      el.innerText = part.text;
    } else {
      el.className = 'name-part';
      if (index === animatedIndex) {
        el.classList.add('pop-anim');
      }
      el.innerHTML = `
                ${part.text}
                <span class="swap-icon">↻ Smash</span>
            `;
      el.onclick = () => swapPart(index);
    }

    container.appendChild(el);
  });

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) copyBtn.innerText = 'Copy Text';

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.innerHTML = '⬇ Export VIP Pass';

  saveToHistory(currentNameParts.map((p) => p.text).join(' '));
}

function copyName() {
  const fullName = currentNameParts.map((p) => p.text).join(' ');
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = fullName;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();

  try {
    document.execCommand('copy');
    document.getElementById('copyBtn').innerText = 'Copied! 🤘';
  } catch (err) {
    console.error('Failed to copy', err);
  }
  document.body.removeChild(tempTextArea);
}

function exportVIPPass() {
  const exportBtn = document.getElementById('exportBtn');
  exportBtn.innerHTML = 'Generating... ⏳';

  // 1. Prepare dynamic SVG content
  const svgGroup = document.getElementById('svg-name-group');
  svgGroup.innerHTML = '';

  // Vertical centering logic based on how many words we have
  const centerY = 340;
  const spacing = 50;
  const startY = centerY - ((currentNameParts.length - 1) * spacing) / 2;

  currentNameParts.forEach((part, index) => {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('x', '200');
    textEl.setAttribute('y', startY + index * spacing);
    textEl.setAttribute('fill', part.isStatic ? '#7a7a7a' : '#1a1a1a');
    textEl.setAttribute('font-size', part.isStatic ? '28' : '48');
    textEl.setAttribute('font-weight', part.isStatic ? '600' : '900');
    if (part.isStatic) textEl.setAttribute('font-style', 'italic');
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('text-transform', 'uppercase');
    textEl.textContent = part.text;
    svgGroup.appendChild(textEl);
  });

  // 2. Convert SVG to string
  const svgElement = document.getElementById('vip-badge-svg');
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  // 3. Draw on Canvas to extract PNG
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Export and trigger download
    const pngData = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngData;

    const safeName = currentNameParts
      .map((p) => p.text)
      .join('-')
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    downloadLink.download = `VIP-PASS-${safeName}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    exportBtn.innerHTML = 'Exported! 🎟️';
    setTimeout(() => {
      exportBtn.innerHTML = '⬇ Export VIP Pass';
    }, 2000);
  };

  img.onerror = function () {
    console.error('Failed to render SVG to canvas.');
    exportBtn.innerHTML = 'Error :(';
  };

  img.src = url;
}

window.generateNewName = generateNewName;
window.copyName = copyName;
window.swapPart = swapPart;
window.exportVIPPass = exportVIPPass;

document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    generateNewName();
  }
});
updateHistoryFeed();
