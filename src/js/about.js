/**
 * About Page: Interactive Timeline & Scroll Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const timelineEvents = [
    { year: 1993, event: 'Built a computer, tinkered with every setting possible' },
    { year: 1994, event: 'Built a website on geocities, modified everything' },
    { year: 1995, event: 'Used HTML snips in myspace to customize' },
    { year: 2004, event: 'Sought graphic design degree to combine computers and art' },
    { year: 2006, event: 'First design job at a t-shirt shop' },
    { year: 2006.5, event: 'Learned e-commerce CMS, promoted to lead designer' },
    { year: 2007, event: 'HTML + CSS + PHP to customize purchased themes' },
    { year: 2009, event: 'Completed BFA in graphic design' },
    { year: 2009.5, event: 'Built layouts with HTML/CSS, familiarizing with web hosts' },
    { year: 2012, event: 'Web development internship - learned Joomla' },
    { year: 2013, event: 'Accepted web dev job, learned WordPress CMS' },
    { year: 2014, event: 'Building fully custom WordPress themes back to back' },
    { year: 2015, event: 'Responsive WP - Bootstrap, jQuery, Javascript, ACF' },
    { year: 2016, event: 'Utilization of Foundation Grid based theme' },
    { year: 2017, event: 'Building UX/UI methods, ACF Flexible templates' },
    { year: 2018, event: 'Sass, GIT, Terminal, Docker, docker-compose' },
    { year: 2019, event: 'Seeking next things - DB connections, APIs, languages' },
    { year: 2020, event: 'Answering on StackOverflow, building Git projects' },
    { year: 2021, event: 'Started Freelance LLC, Joined A11yTalks Team' },
    { year: 2023, event: 'AI Learning & AI Council at MERGE' },
  ];

  const rangeData = [
    { start: 2000, end: 2004, title: 'High School', type: 'education', color: '#2b8a92', tier: 0 },
    {
      start: 2004,
      end: 2009,
      title: 'B.F.A. Design',
      type: 'education',
      color: '#2b8a92',
      tier: 1,
    },
    {
      start: 2006,
      end: 2011,
      title: 'Designer & Manager, HaysTees',
      type: 'experience',
      color: '#f97316',
      tier: 2,
    },
    {
      start: 2014,
      end: 2016,
      title: 'Web Developer',
      type: 'experience',
      color: '#f97316',
      tier: 0,
    },
    {
      start: 2016,
      end: 2021,
      title: 'Sr Digital Developer',
      type: 'experience',
      color: '#f97316',
      tier: 1,
    },
    {
      start: 2014,
      end: 2019,
      title: 'Roller Derby',
      type: 'experience',
      color: '#e60000',
      tier: 2,
    },
    {
      start: 2020,
      end: 2024,
      title: 'Heather New LLC',
      type: 'freelance',
      color: '#2b8a92',
      tier: 0,
    },
    {
      start: 2022,
      end: 2025,
      title: 'Senior Studio Artist',
      type: 'experience',
      color: '#f97316',
      tier: 1,
    },
    {
      start: 2024.5,
      end: 2026,
      title: 'UX Design Cert.',
      type: 'education',
      color: '#2b8a92',
      tier: 2,
    },
    {
      start: 2025,
      end: 2027,
      title: 'Studio Manager',
      type: 'experience',
      color: '#FFBD56',
      tier: 0,
    },
  ];

  const wrapper = document.getElementById('timeline-wrapper');
  const scrollContainer = document.querySelector('.timeline-scroll-container');
  if (!wrapper || !scrollContainer) return;

  const startYear = 1992;
  const endYear = 2027;
  const totalYears = endYear - startYear;

  const yearToX = (year) => {
    return ((year - startYear) / totalYears) * 100;
  };

  // 1. Render Year Markers
  for (let y = startYear; y <= endYear; y++) {
    const marker = document.createElement('div');
    marker.className = 'year-marker';
    marker.style.left = `${yearToX(y)}%`;
    marker.innerHTML = `<span>${y}</span>`;
    wrapper.appendChild(marker);
  }

  // 2. Render Ranges with explicit tier positioning
  rangeData.forEach((range) => {
    const el = document.createElement('div');
    el.className = `timeline-range range-${range.type}`;
    const left = yearToX(range.start);
    const right = yearToX(range.end);
    el.style.left = `${left}%`;
    el.style.width = `${right - left}%`;
    el.style.backgroundColor = range.color;

    // Tiers: 0=High Top, 1=Lower Top, 2=High Bottom, 3=Lower Bottom
    let topPos = '50%';
    if (range.tier === 0) topPos = '20%';
    else if (range.tier === 1)
      topPos = '36%'; // User requested 36%
    else if (range.tier === 2) topPos = '60%';
    else if (range.tier === 3) topPos = '76%';

    el.style.top = topPos;
    el.innerText = range.title;
    wrapper.appendChild(el);
  });

  // 3. Render Events with 4-level staggering
  timelineEvents.forEach((ev, i) => {
    const dot = document.createElement('div');
    const level = i % 4;
    dot.className = `timeline-event level-${level}`;
    dot.style.left = `${yearToX(ev.year)}%`;

    const label = document.createElement('div');

    if (level === 0) {
      label.className = 'event-label top';
      label.style.bottom = '120px';
    } else if (level === 1) {
      label.className = 'event-label top';
      label.style.bottom = '40px';
    } else if (level === 2) {
      label.className = 'event-label bottom';
      label.style.top = '40px';
    } else {
      label.className = 'event-label bottom';
      label.style.top = '120px';
    }

    label.innerText = ev.event;
    dot.appendChild(label);

    wrapper.appendChild(dot);
  });

  // 4. Drag to Scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });
  scrollContainer.addEventListener('mouseleave', () => (isDown = false));
  scrollContainer.addEventListener('mouseup', () => (isDown = false));
  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  // Initial scroll to the end
  scrollContainer.scrollLeft = scrollContainer.scrollWidth;
});
