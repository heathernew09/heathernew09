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
    'Feral',
    'Unhinged',
    'Unbothered',
    'Certified',
    'Undefeated',
    'Chaotic',
    'Iconic',
    'Unmatched',
    'Extra',
    'Goated',
    'Diabolical',
    'Unstoppable',
    'Rowdy',
    'Rabid',
    'Untamed',
    'Reckless',
    'Volatile',
    'Explosive',
    'Relentless',
    'Notorious',
    'Merciless',
    'Deranged',
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
    'Warlord',
    'Reckoning',
    'Vendetta',
    'Renegade',
    'Outlaw',
    'Villain',
    'Gremlin',
    'Maverick',
    'Berserker',
    'Executioner',
    'Nightmare',
    'Juggernaut',
    'Warhead',
    'Tempest',
    'Marauder',
    'Predator',
    'Wrecker',
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
    'Bout',
    'Jam',
    'Hitter',
    'Wall',
    'Power-Jam',
    'Grand-Slam',
    'Toe-Stop',
    'Lead-Jammer',
    'Star-Pass',
  ],
  verbs: [
    'Smash',
    'Whip',
    'Block',
    'Roll',
    'Crush',
    'Strike',
    'Bash',
    'Wreck',
    'Slam',
    'Juke',
    'Grind',
    'Stomp',
    'Clobber',
    'Demolish',
    'Unleash',
    'Detonate',
  ],
  animals: [
    'Viper',
    'Wolverine',
    'Falcon',
    'Piranha',
    'Hyena',
    'Cobra',
    'Panther',
    'Badger',
    'Hornet',
    'Rhino',
    'Scorpion',
    'Mongoose',
    'Raptor',
    'Jackal',
    'Barracuda',
    'Grizzly',
    'Wasp',
    'Vulture',
    'Coyote',
    'Komodo',
  ],
  colors: [
    'Crimson',
    'Neon',
    'Cobalt',
    'Scarlet',
    'Electric',
    'Toxic-Green',
    'Midnight',
    'Chrome',
    'Magenta',
    'Amber',
    'Obsidian',
    'Violet',
    'Blaze-Orange',
    'Silver',
    'Jet-Black',
    'Hot-Pink',
  ],
  // Blend fodder for the portmanteau engine — mashed against the skater's
  // own name/interest so the result is never just their word regurgitated.
  chaosThemeWords: [
    'Tornado',
    'Avalanche',
    'Hurricane',
    'Stampede',
    'Wildfire',
    'Blizzard',
    'Meltdown',
    'Mayhem',
    'Vortex',
    'Rampage',
    'Sabotage',
    'Disaster',
    'Wrecking',
    'Ruckus',
    'Apocalypse',
    'Chaos',
    'Carnage',
    'Frenzy',
    'Onslaught',
  ],
  // Hand-curated pun aliases — the "guaranteed laugh" wildcard slot. Procedural
  // generation is great for volume, but the classic derby-name pun (a straight
  // name that sounds like something else) is hard to fake algorithmically well,
  // so a handful of real ones are seeded in as a rare pull.
  curatedPuns: [
    'Justice Wynn',
    'Always Wright',
    'Neva Loose',
    'Wynn Diesel',
    'Fatality Wynn',
    'Percy Verance',
    'Anna Mosity',
    'Barb Dwyer',
    'Mel Practice',
    'Sasha Distraction',
    'Bea Line',
    'Constance Fear',
    'Paige Turner',
    'Holly Wood',
    'Robyn Banks',
    'Cher Nobyl',
    'Terry Bull',
    'Gail Force',
    'Wanda Round',
    'Rex Karnation',
    'Anne Ihilate',
    'Chase N. Payne',
    'Kerry Oki',
    'Bree Zee',
    'Trixie Trapp',
    'Val Kyrie',
    'Fury Ocious',
    'Mo Mentum',
    'Vic Torious',
    'Xtra Ordinary',
  ],
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

// Each template is a recipe of slot types plus a weight. Higher weight = drawn
// more often. Templates that fold in the skater's own name/interest are
// weighted heaviest so results usually feel personal; the blend + curated-pun
// slots are rarer "did that really just happen" pulls.
const templates = [
  { parts: ['adjective', 'name'], weight: 3 },
  { parts: ['name', 'static_the', 'noun'], weight: 3 },
  { parts: ['interest', 'derbyTerm'], weight: 2 },
  { parts: ['static_the', 'adjective', 'interest'], weight: 2 },
  { parts: ['adjective', 'name', 'noun'], weight: 2 },
  { parts: ['verb', 'name'], weight: 2 },
  { parts: ['color', 'animal'], weight: 2 },
  { parts: ['blendInterest'], weight: 3 },
  { parts: ['blendName'], weight: 2 },
  { parts: ['adjective', 'color', 'noun'], weight: 1 },
  { parts: ['curatedPun'], weight: 2 },
  { parts: ['name', 'static_the', 'animal'], weight: 2 },
];

let currentNameParts = [];
let nameHistory = JSON.parse(localStorage.getItem('derbyNameHistory') || '[]');
let recentWords = JSON.parse(localStorage.getItem('derbyRecentWords') || '[]');

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Picks a word the viewer hasn't seen in their last ~25 pulls, so mashing the
// button (or "smash to reroll") doesn't just cycle the same three favorites.
function pickFresh(arr) {
  const fresh = arr.filter((word) => !recentWords.includes(word));
  const choice = pickRandom(fresh.length ? fresh : arr);
  recentWords.push(choice);
  if (recentWords.length > 25) recentWords.shift();
  localStorage.setItem('derbyRecentWords', JSON.stringify(recentWords));
  return choice;
}

function pickWeightedTemplate() {
  const total = templates.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * total;
  for (const t of templates) {
    if (roll < t.weight) return t.parts;
    roll -= t.weight;
  }
  return templates[0].parts;
}

// Portmanteau blender: fuses two words into one instead of just concatenating
// them. It first looks for real letter overlap where word A's ending matches
// word B's start (e.g. "comic" + "iconic" -> "comiconic"); if there's no
// natural seam it falls back to slicing word A at ~60% and welding word B on,
// which still reads as one invented word rather than "A" + "B" glued together.
function blendWords(a, b) {
  a = a.toLowerCase().replace(/[^a-z]/g, '');
  b = b.toLowerCase().replace(/[^a-z]/g, '');
  if (!a) return b;
  if (!b) return a;
  if (a.length < 3) return a + b;

  const maxOverlap = Math.min(a.length, b.length) - 1;
  for (let len = maxOverlap; len >= 2; len--) {
    if (a.slice(-len) === b.slice(0, len)) {
      return a.slice(0, a.length - len) + b;
    }
  }

  const cut = Math.max(1, Math.min(a.length - 1, Math.ceil(a.length * 0.6)));
  return a.slice(0, cut) + b;
}

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

// Takes the raw user text, keeps just the first word, and blends it against a
// random chaos/animal word so the output is a genuinely new invented word —
// not their input read back at them.
function blendFromUserWord(userWord) {
  const base = userWord.trim().split(/\s+/)[0] || userWord;
  const theme = pickRandom([...vocab.chaosThemeWords, ...vocab.animals]);
  return capitalize(blendWords(base, theme));
}

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

  const template = pickWeightedTemplate();

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
  let isLegendary = false;

  switch (slotType) {
    case 'name':
      let firstLetter = userName.charAt(0).toUpperCase();
      if (!/^[A-Z]$/.test(firstLetter)) {
        firstLetter = pickRandom(Object.keys(vocab.alphabetNames));
      }

      const possibleNames = vocab.alphabetNames[firstLetter];
      let chosenAlias = pickFresh(possibleNames);

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
      text = pickFresh(vocab.adjectives);
      break;
    case 'noun':
      text = pickFresh(vocab.nouns);
      break;
    case 'derbyTerm':
      text = pickFresh(vocab.derbyTerms);
      break;
    case 'verb':
      text = pickFresh(vocab.verbs);
      break;
    case 'animal':
      text = pickFresh(vocab.animals);
      break;
    case 'color':
      text = pickFresh(vocab.colors);
      break;
    case 'blendInterest':
      text = blendFromUserWord(userInterest);
      break;
    case 'blendName':
      text = blendFromUserWord(userName);
      break;
    case 'curatedPun':
      text = pickFresh(vocab.curatedPuns);
      isLegendary = true;
      break;
    case 'static_the':
      text = 'the';
      isStatic = true;
      break;
  }

  return { text, type: slotType, isStatic, isLegendary };
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
      if (part.isLegendary) el.classList.add('legendary');
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
  if (exportBtn) exportBtn.innerHTML = '⬇ Export MVP Medal';

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

const MEDAL_FONT = 'Manrope, Arial Black, Impact, sans-serif';

// Splits a multi-word name into the two lines whose longest-line width is
// smallest, so e.g. a 3-word name doesn't lopsidedly dump 2 words on line one
// and strand a single word on line two.
function balancedTwoLineSplit(words, widthAt, fontSize) {
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i).join(' ');
    const score = Math.max(widthAt(line1, fontSize), widthAt(line2, fontSize));
    if (!best || score < best.score) best = { lines: [line1, line2], score };
  }
  return best.lines;
}

// Fits the derby name inside the medal face on (at most) two centered lines,
// shrinking the font down to a floor to keep a comfortable margin from the
// medal's edge. Uses a scratch canvas so the measurement matches the font
// actually used in the exported PNG.
function fitMedalText(fullName) {
  const maxWidth = 210;
  const maxFontSize = 44;
  const minFontSize = 14;
  const text = fullName.toUpperCase();
  const words = text.split(' ');

  const measureCtx = document.createElement('canvas').getContext('2d');
  const widthAt = (line, size) => {
    measureCtx.font = `900 ${size}px ${MEDAL_FONT}`;
    return measureCtx.measureText(line).width;
  };

  let fontSize = maxFontSize;
  let lines = words.length > 1 ? balancedTwoLineSplit(words, widthAt, fontSize) : [text];

  const longestLineWidth = () => Math.max(...lines.map((line) => widthAt(line, fontSize)));
  while (fontSize > minFontSize && longestLineWidth() > maxWidth) {
    fontSize -= 2;
    // Re-balance the split at each size: the narrowest split can shift as
    // the font shrinks (rare, but cheap to keep correct).
    if (words.length > 1) lines = balancedTwoLineSplit(words, widthAt, fontSize);
  }

  return { lines, fontSize };
}

function exportVIPPass() {
  const exportBtn = document.getElementById('exportBtn');
  exportBtn.innerHTML = 'Generating... ⏳';

  // 1. Prepare dynamic SVG content: engraved-looking gold text, auto-sized
  // (and wrapped onto a second line if needed) to fit the medal face.
  const svgGroup = document.getElementById('svg-name-group');
  svgGroup.innerHTML = '';

  const fullName = currentNameParts.map((p) => p.text).join(' ');
  const { lines, fontSize } = fitMedalText(fullName);
  const lineHeight = fontSize * 1.3;
  const centerY = 415;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

  const svgNS = 'http://www.w3.org/2000/svg';
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;

    const shadow = document.createElementNS(svgNS, 'text');
    shadow.setAttribute('x', '200');
    shadow.setAttribute('y', y + 2.5);
    shadow.setAttribute('fill', '#7a5a12');
    shadow.setAttribute('font-size', String(fontSize));
    shadow.setAttribute('font-weight', '900');
    shadow.setAttribute('text-anchor', 'middle');
    shadow.textContent = line;
    svgGroup.appendChild(shadow);

    const face = document.createElementNS(svgNS, 'text');
    face.setAttribute('x', '200');
    face.setAttribute('y', y);
    face.setAttribute('fill', '#fff6d5');
    face.setAttribute('font-size', String(fontSize));
    face.setAttribute('font-weight', '900');
    face.setAttribute('text-anchor', 'middle');
    face.textContent = line;
    svgGroup.appendChild(face);
  });

  // 2. Convert SVG to string
  const svgElement = document.getElementById('vip-badge-svg');
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  // 3. Draw on Canvas to extract PNG
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 620;
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

    const safeName = fullName
      .replace(/\s+/g, '-')
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    downloadLink.download = `MVP-MEDAL-${safeName}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    exportBtn.innerHTML = 'Exported! 🏅';
    setTimeout(() => {
      exportBtn.innerHTML = '⬇ Export MVP Medal';
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
