        document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Element Selectors ---
            const logoContainer = document.getElementById('logo-container');
            const pixel = document.getElementById('pixel');
            const iconsContainer = document.getElementById('icons-container');
            const magicIcons = document.querySelectorAll('.magic-icon');
            const sceneContainer = document.getElementById('scene-container');
            const sceneContent = document.getElementById('scene-content');
            const testimonialBubbles = document.getElementById('testimonial-bubbles');
            const chatBubble = document.getElementById('chat-bubble');
            const chatWindow = document.getElementById('chat-window');
            const cardContainer = document.getElementById('cardContainer');
            const cardFlipper = document.querySelector('.card-flipper');
            const cardFlipTrigger = document.getElementById('card-flip-trigger');
            const cardBack = document.querySelector('.card-back');
            const cardCloseButtons = document.querySelectorAll('.card-close');
            const animationWrappers = document.querySelectorAll('.animation-wrapper');
            const timelineView = document.getElementById('timeline-view');
            const timelineBtn = document.getElementById('timeline-btn');
            const closeTimelineBtn = document.getElementById('close-timeline-btn');
            const timelineContentWrapper = document.getElementById('timeline-content-wrapper');
            const timelineScrollContainer = document.getElementById('timeline-scroll-container');
            const emailLink = document.getElementById('email-link');
            const contactFormContainer = document.getElementById('contact-form-container');
            const inactivityPrompt = document.getElementById('inactivity-prompt');
            const fullscreenPixel = document.getElementById('fullscreen-pixel-animation');

            // --- State Variables ---
            let iconsVisible = false;
            let sceneVisible = false;
            let chatOpen = false;
            let cardFlipped = false;
            let currentTestimonialIndex = 0;
            let formVisible = false;
            let inactivityTimer;
            let promptTimer;
            let testimonialInterval;

            // --- Project Content ---
            const projectContent = {
                comic: {
                    title: 'Elanco Comic Book AI Generation',
                    description: 'A groundbreaking fusion of AI generation, custom illustration styles, and strategic branding that transforms into an interactive comic book experience. This project showcases how modern technology can enhance storytelling while maintaining authentic artistic vision.',
                    link: 'https://comic.heather.codes',
                    linkText: 'View Interactive Comic'
                },
                derby: {
                    title: 'Roller Derby Design Evolution',
                    description: 'A comprehensive three-year design journey showcasing jersey design, website development, and evolving poster series. Each year brought a unique theme while maintaining brand consistency and improving accessibility.',
					link: 'https://heathernew.com/derby.html',
                    linkText: 'View Roller Derby Posters'
                },
                 inspector: {
                    title: 'Inspector Jo Branding & Website',
                    description: 'Complete brand identity and digital presence for a Chicago startup home inspection company. From logo conception to full website development, this project showcases comprehensive branding for a service-based business.',
                    link: 'https://inspectorjo.com',
                    linkText: 'Visit Inspector Jo'
                },
                pet: {
                    title: 'Red Lens Reveal - Elanco',
                    description: 'An innovative print-to-digital bridge project featuring a unique red lens reveal mechanism. This uncommon print project challenged traditional design boundaries by creating an interactive physical experience.',
                },
                biomarin: {
                    title: 'BioMarin Interactive Challenge',
                    description: 'An engaging "Beat the Clock" interactive experience designed for tradeshow booths, specifically focusing on Achondroplasia awareness. This gamified approach made complex medical information accessible and memorable.',
                    link: 'https://quiz.heather.codes',
                    linkText: 'Try the Interactive Quiz'
                },
                egg: {
                    title: 'The Hexagon Egg Drop - Design 1 Project',
                    description: 'This is a college project from 2005 that has become a personal benchmark in unlocking innovative thinking. The challenge: create a container that would protect an egg when dropped from a flight of stairs. I initially started crafting a soccerball type of structure with hexagons, then I noticed the strength when flipped inside out. Combining these inverted soccerball shapes gave points that were flexible pressure absorbing points that diverted the force across a larger surface. The egg survived through many moves in a storage bin until 2024 when my cat knocked it off of my office shelf. The cockpit was not fully closed and the egg fell out. It is still behind me on the shelf.',
					image: 'https://heathernew.com/images/eggdrop.png' 
                },
                roadshow: {
                    title: 'Studio Roadshow Game',
                    description: "Internally with my Studio team at MERGE we put together a presentation about our capabilities and invited outside vendors to come in and talk about the services they provide. We inspired the chicago office with our variety of skills, and battled to earn bragging rights by earning a spot on the leaderboard for the Which Swatch game. Dave created the audio, Jack illustrated the bird, Jody created the overall design. I love how our team is so collaborative. Try our your swatch knowledge.",
                    link: 'https://studio.heather.codes',
                    linkText: 'Climb the leaderboard'
                },
                eurotrip: {
                    title: 'Eurotrip Recap 2025',
                    description: "I was so inspired after taking vacation that I took a few days to build out a digital recap. I compiled 1500 videos from a shared album with my wife, selectively chose some to share as well as 70+ youtube videos. Seeing Salvador Dali's place, Antoni Gaudi's work, and Van Goghs stomping grounds gave me a new outlook as an artist and a designer.",
                    link: 'https://eurotrip.heather.codes',
                    linkText: 'Recap My Trip'
                }
            };

            // --- Testimonials ---
            const testimonials = [
                { text: "I just first want to say that your work is simply lovely. I cannot express how happy I am with what you have shown me so far. You have captured the vision that I have for the website. Kudos to you!", author: "DR. APH" },
                { text: "You're an awesome artist / designer / programmer / derby girl / handyman / dog mom / coworker!", author: "M.C" },
                { text: "Rock-Solid, Badass, Figure-out-anything problem solver, Hard Worker, Motivated and Cool as Hell Powerhouse.", author: "S.G." },
                { text: "You are so fun to work with because you are a real renaissance designer...", author: "George B." },
                { text: "I probably would have never figured out web design if it weren't for your patience and help anytime I had a question. You're a kick ass human and always inspiring me to design my life.", author: "M.W." },
                { text: "Thanks for keeping me sane everyday. Appreciate your talent, dedication and friendship.", author: "G.W." },
                { text: "Heather, You Rock! You have a heart of gold, and I love working with you. You bring great ideas to the table and overall make life a lot easier!", author: "J.W." },
                { text: "We’re excited to see where we could continue to evolve this quiz and conference interactivity! Go Team go! Great work Heather!", author: "J. N." },
                { text: "I know I have other priorities I need to start with this morning, but this was the project I couldn’t stop thinking about. You did such a great job storyboarding and copywriting this thing out.", author: "D. B." },
                { text: "Holy sh*t, that’s impressive!", author: "W. H." },
                { text: "Heather for the win with foresight!", author: "M. M." },
                { text: "Just wanted to follow up on this and give a shout out to Heather. She's been working with the client and their dev team for the better part of a year to try and get to the bottom of this issue. Trying all kinds of file sizes, etc. Appreciate your patience and persistence, Heather. You're awesome.", author: "J.C." },
                { text: "Heather was an absolute rockstar and beyond wonderful to work with! She was so responsive, quick, and had attention to detail - it made my job so easy! The client is so happy.", author: "A.P-L" },
                { text: "Your talent and attitude made this account a joy to work on and allowed us to do incredible work - “Best in Show” level work!", author: "J.O." }
            ];
            
            // --- Timeline Data ---
            const timelineEvents = [
                { year: 1997, event: "First shared family computer" },
                { year: 1999, event: "Built a computer" },
                { year: 2002, event: "Built a website on Geocities" },
                { year: 2003, event: "Customized MySpace with HTML" },
                { year: 2006, event: "First design job at a t-shirt shop" },
                { year: 2007, event: "Learned HTML, CSS, and PHP" },
                { year: 2015, event: "Learned Responsive WP, Bootstrap, JS, ACF" },
                { year: 2016, event: "Used Foundation Grid themes" },
                { year: 2017, event: "Built UX/UI methods with ACF" },
                { year: 2018, event: "Learned Sass, Git, Docker" },
                { year: 2019, event: "Explored databases & APIs" },
                { year: 2020, event: "Active on Stack Overflow" },
                { year: 2021, event: "Started Freelance LLC & Contributed to A11yTalks" },
                { year: 2023, event: "AI Learning & AI Council at MERGE" },
				{ year: 2025, event: "Promoted to Studio Manager, AI Garage" },
            ];
            
            const rangeData = [
                { start: 2000, end: 2004, title: "High School Diploma", subtitle: "Bishop Carroll High School", type: 'education', color: '#355E3B' },
                { start: 2004, end: 2009, title: "Bachelor of Fine Arts", subtitle: "Fort Hays State University", type: 'education', color: '#FFD700' },
                { start: 2008, end: 2012, title: "Shop Manager & Lead Designer", subtitle: "HaysTees", type: 'experience', color: '#0047AB' },
                { start: 2012.9, end: 2013.2, title: "Dev Internship", subtitle: "Quantus Creative", type: 'experience', color: '#8A2BE2', minWidth: '3.6%' },
                { start: 2013, end: 2014, title: "Jr Web Dev", subtitle: "Whistler Outdoor", type: 'experience', color: '#556B2F' },
                { start: 2014, end: 2016, title: "Web Developer", subtitle: "Prime Concepts", type: 'experience', color: '#4169E1' },
                { start: 2014, end: 2019, title: "Roller Derby League", subtitle: "Athlete & Volunteer", type: 'experience', color: '#DC2626' },
                { start: 2016, end: 2021, title: "Sr Digital Developer", subtitle: "Greteman Group", type: 'experience', color: '#06B6D4' },
                { start: 2021, end: 2023, title: "Self Employed", subtitle: "Heather New LLC", type: 'experience', color: '#2F4F4F' },
                { start: 2022, end: 2027, title: "Senior Studio Artist", subtitle: "MERGE", type: 'experience', color: '#84CC16' },
                { start: 2024.5, end: 2026, title: "Certificate, UX Design", subtitle: "Loyola University Chicago", type: 'education', color: '#800020' },
				{ start: 2025, end: 2026, title: "Studio Manager", subtitle: "Promotion", type: 'experience', color: '#0D9488' },
                { start: 2025.5, end: 2026, title: "MERGE U", subtitle: "Graduate", type: 'education', color: '#0D9488' },
            ].sort((a,b) => a.start - b.start);


            // --- Functions ---

            // Toggle project icons visibility
            function toggleIcons() {
                if (sceneVisible) return;
                iconsVisible = !iconsVisible;
                logoContainer.classList.toggle('scale-95', iconsVisible);
                iconsContainer.style.pointerEvents = iconsVisible ? 'auto' : 'none';
                magicIcons.forEach(icon => {
                    icon.classList.toggle('icon-visible', iconsVisible);
                });
            }

            // Show project details in a modal
            function showScene(projectKey) {
                if (sceneVisible || !projectContent[projectKey]) return;
                sceneVisible = true;
                
                const project = projectContent[projectKey];
				
                let imageHTML = '';
				if (project.image) {
					imageHTML = `
						<div class="project-image" style="margin-top: 1.5rem; margin-bottom: 1.5rem; border-radius: 0.5rem; overflow: hidden;">
							<img src="${project.image}" alt="${project.title}" style="width: 100%; height: auto; display: block; object-fit: contain;">
						</div>`;
				}
				
                let linkHTML = '';
                if (project.link) {
                    linkHTML = `
                        <div class="project-description" style="text-align: center; margin-top: 1.5rem;">
                            <a href="${project.link}" target="_blank" style="display: inline-block; background-color: var(--nv-primary-accent); color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; transition: background-color 0.2s;">
                                ${project.linkText} &rarr;
                            </a>
                        </div>`;
                }

                sceneContent.innerHTML = `
                    <button id="close-scene-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; color: #6B7280; background: none; border: none; font-size: 1.5rem; cursor: pointer; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--nv-primary-accent); margin-bottom: 1rem;">${project.title}</h2>
                    <p style="color: #374151;">${project.description}</p>
					${imageHTML}
                    ${linkHTML}
                `;

                sceneContainer.classList.add('visible');
                sceneContainer.querySelector('#close-scene-btn').addEventListener('click', hideScene);
                
                // Dim the icons
                iconsContainer.style.opacity = '0.5';
                iconsContainer.style.pointerEvents = 'none';
            }

            // Hide the project modal
            function hideScene() {
                if (!sceneVisible) return;
                sceneVisible = false;
                sceneContainer.classList.remove('visible');
                
                // Restore icons
                iconsContainer.style.opacity = '1';
                if(iconsVisible) {
                    iconsContainer.style.pointerEvents = 'auto';
                }
            }

            // Testimonial bubble logic
            function cycleTestimonials() {
                const existingBubble = testimonialBubbles.querySelector('.testimonial-bubble');
                
                const showNewBubble = () => {
                    if (testimonialBubbles.children.length > 0) return; // Prevent multiple bubbles if logic overlaps
                    const testimonial = testimonials[currentTestimonialIndex];
                    const newBubble = document.createElement('div');
                    newBubble.className = 'testimonial-bubble';
                    newBubble.innerHTML = `
                        <p class="testimonial-text">"${testimonial.text}"</p>
                        <p class="testimonial-author">- ${testimonial.author}</p>
                    `;
                    testimonialBubbles.appendChild(newBubble);
                    
                    setTimeout(() => {
                        newBubble.classList.add('visible');
                    }, 50);

                    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
                };

                if (existingBubble) {
                    existingBubble.classList.remove('visible');
                    existingBubble.addEventListener('transitionend', () => {
                        existingBubble.remove();
                        setTimeout(showNewBubble, 2000);
                    }, { once: true });
                } else {
                    showNewBubble();
                }
            }

            // Business card logic
            function toggleChat(forceClose = false) {
                if (forceClose) {
                    chatOpen = false;
                } else {
                    chatOpen = !chatOpen;
                }
                
                chatWindow.classList.toggle('open', chatOpen);

                if (!chatOpen) {
                    if (cardFlipped) {
                        cardFlipped = false;
                        cardContainer.classList.remove('is-flipped');
                    }
                    if (formVisible) {
                        toggleForm(true);
                    }
                }
            }

            function toggleForm(forceClose = false) {
                if (forceClose) {
                    formVisible = false;
                } else {
                    formVisible = !formVisible;
                }
                contactFormContainer.classList.toggle('form-visible', formVisible);
                cardContainer.style.height = formVisible ? '530px' : '200px';
            }
            
            // Timeline logic
            function populateTimeline() {
                const startYear = 1997;
                const endYear = 2028; 
                const totalYears = endYear - startYear;
                const timelineWidth = totalYears * 120; // 120px per year for more space
                timelineContentWrapper.style.width = `${timelineWidth}px`;
                
                timelineContentWrapper.innerHTML = `<div class="timeline-axis"></div>`; // Clear and add axis

                const yearToPercent = (year) => ((year - startYear) / totalYears) * 100;
                
                // Render Range Bars
                rangeData.forEach((item, index) => {
                    const left = yearToPercent(item.start);
                    const end = item.end > endYear ? endYear : item.end;
                    let width = yearToPercent(end) - left;
                    const barEl = document.createElement('div');
                    
                    const isBottom = index % 2 === 0;
                    const verticalClass = isBottom ? 'bottom' : 'top';

                    barEl.className = `timeline-range-bar ${verticalClass}`;
                    barEl.style.left = `${left}%`;
                    if (item.minWidth) {
                        width = Math.max(width, parseFloat(item.minWidth));
                    }
                    barEl.style.width = `${width}%`;
                    barEl.style.backgroundColor = item.color;
                    barEl.innerHTML = `
                        <div class="text-center text-white">
                            <p class="title">${item.title}</p>
                            <p class="subtitle">${item.subtitle}</p>
                        </div>
                    `;
                    timelineContentWrapper.appendChild(barEl);
                });

                // Render Year Markers on the axis
                for (let year = startYear; year <= endYear; year++) {
                    const yearMarkerEl = document.createElement('div');
                    yearMarkerEl.className = 'timeline-year-marker';
                    yearMarkerEl.style.left = `${yearToPercent(year)}%`;
                    yearMarkerEl.innerHTML = `
                        <div class="tick"></div>
                        <span class="label">${year}</span>
                    `;
                    timelineContentWrapper.appendChild(yearMarkerEl);
                }

                // Render Event Hotspots
                timelineEvents.forEach((item, index) => {
                    const leftPosition = yearToPercent(item.year);
                    const eventEl = document.createElement('div');
                    
                    const isBottom = index % 2 === 0;
                    const verticalClass = isBottom ? 'bottom' : 'top';

                    eventEl.className = `timeline-event-hotspot ${verticalClass}`;
                    eventEl.style.left = `${leftPosition}%`;
                    eventEl.innerHTML = `<p>${item.event}</p>`;
                    
                    timelineContentWrapper.appendChild(eventEl);
                });
            }

            function showTimeline() {
                timelineView.classList.add('visible');
            }

            function hideTimeline() {
                timelineView.classList.remove('visible');
            }

            function flipCard() {
                cardFlipped = !cardFlipped;
                cardContainer.classList.toggle('is-flipped', cardFlipped);
            }

            function resetCardAnimations(e) {
                e.stopPropagation();
                const wrapper = e.currentTarget;
                const animatedElements = wrapper.querySelectorAll('.circle, .ellipse, .line');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    void el.offsetWidth; // Trigger reflow
                    el.style.animation = '';
                });
            }
            
            // Inactivity Logic
            function resetInactivityTimers() {
                clearTimeout(inactivityTimer);
                clearTimeout(promptTimer);

                fullscreenPixel.classList.remove('animate');
                fullscreenPixel.style.display = 'none';
                inactivityPrompt.style.opacity = '0';

                inactivityTimer = setTimeout(() => {
                    fullscreenPixel.style.display = 'block';
                    fullscreenPixel.classList.add('animate');

                    promptTimer = setTimeout(() => {
                        inactivityPrompt.style.opacity = '1';
                        setTimeout(() => {
                            inactivityPrompt.style.opacity = '0';
                        }, 5000);
                    }, 15000); 

                }, 15000);
            }


            // --- Event Listeners ---
            logoContainer.addEventListener('click', toggleIcons);
            pixel.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleIcons();
            });

            magicIcons.forEach(icon => {
                icon.addEventListener('click', (e) => {
                    if (iconsVisible && !sceneVisible) {
                        showScene(e.currentTarget.dataset.project);
                    }
                });
            });

            chatBubble.addEventListener('click', () => toggleChat());
            cardCloseButtons.forEach(btn => btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (formVisible) {
                    toggleForm(true);
                } else {
                    toggleChat(true);
                }
            }));
            
            emailLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleForm();
            });

            cardFlipTrigger.addEventListener('click', flipCard);
            cardBack.addEventListener('click', (e) => {
                // Flip back if not clicking on an animation
                if (!e.target.closest('.animation-wrapper')) {
                    flipCard();
                }
            });

            animationWrappers.forEach(wrapper => {
                wrapper.addEventListener('click', resetCardAnimations);
            });
            
            timelineBtn.addEventListener('click', showTimeline);
            closeTimelineBtn.addEventListener('click', hideTimeline);

            // Inactivity listeners
            document.addEventListener('mousemove', resetInactivityTimers);
            document.addEventListener('click', resetInactivityTimers);
            
            // --- Initializations ---
            populateTimeline(); // Populate the timeline on page load
            
            // Start testimonial cycle
            testimonialInterval = setInterval(cycleTestimonials, 5000 + 700 + 2000);
            cycleTestimonials();
            
            // Start the initial inactivity timer
            resetInactivityTimers();
        });
