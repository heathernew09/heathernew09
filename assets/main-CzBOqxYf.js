import"./site-core-B3OiY5_E.js";/* empty css               */function v(){console.log("Home hero script initializing...");const e=document.querySelector(".hero-section");if(!e){console.warn("Hero section not found");return}const n=document.querySelector('.icon[data-id="sound"]');let i=null,a=!1;console.log("Sound icon:",n),n&&n.addEventListener("click",function(o){console.log("Sound icon clicked"),o.preventDefault(),o.stopPropagation(),i||(i=new Audio("/assets/para/audio/environment1.m4a"),i.loop=!0,i.volume=.3,i.addEventListener("canplay",()=>{console.log("Audio ready to play")}),i.addEventListener("error",c=>{console.error("Audio error:",c)})),a?(i.pause(),n.classList.remove("playing"),n.classList.add("muted"),a=!1,console.log("Audio paused")):i.play().then(()=>{n.classList.add("playing"),n.classList.remove("muted"),a=!0,console.log("Audio playing")}).catch(c=>{console.error("Audio play failed:",c),alert("Audio failed to play. Check console for details.")})});const t=document.querySelector("#phone-icon");let r=0;const d=5;console.log("Phone icon:",t),t&&(document.addEventListener("mousemove",function(o){if(r>=d)return;const c=t.getBoundingClientRect(),l=c.left+c.width/2,p=c.top+c.height/2,f=o.clientX,h=o.clientY;if(Math.sqrt(Math.pow(f-l,2)+Math.pow(h-p,2))<120){r++,console.log("Phone running away! Count:",r);const y=Math.atan2(p-h,l-f),E=parseFloat(t.style.bottom)||15,b=parseFloat(t.style.right)||18,L=15,$=b+Math.cos(y)*L,M=E+Math.sin(y)*L,C=Math.max(10,Math.min(80,$)),T=Math.max(10,Math.min(80,M));t.style.right=C+"%",t.style.bottom=T+"%",r>=d&&setTimeout(()=>{t.style.opacity="0.2",t.style.cursor="not-allowed",t.setAttribute("data-disabled","true")},500)}}),t.addEventListener("click",function(o){t.getAttribute("data-disabled")==="true"&&(o.preventDefault(),m(t))}));function m(o){const c=document.querySelector(".phone-tooltip");c&&c.remove();const l=document.createElement("div");l.className="phone-tooltip",l.innerText="good luck even my dog couldn't get me on the phone.",document.body.appendChild(l);const p=o.getBoundingClientRect();l.style.left=p.left+p.width/2+"px",l.style.top=p.top-10+"px",setTimeout(()=>{l.classList.add("fade-out"),setTimeout(()=>l.remove(),500)},3e3)}const u=document.querySelector('.icon[data-id="quote"]'),s=document.getElementById("testimonials-overlay"),g=document.querySelector(".close-testimonials");console.log("Quote icon:",u),console.log("Testimonials overlay:",s),u&&u.addEventListener("click",function(o){console.log("Quote icon clicked"),o.preventDefault(),o.stopPropagation(),s?(s.classList.add("active"),document.body.style.overflow="hidden"):console.error("Testimonials overlay not found in DOM")}),g&&g.addEventListener("click",function(){s.classList.remove("active"),document.body.style.overflow=""}),s&&s.addEventListener("click",function(o){o.target===s&&(s.classList.remove("active"),document.body.style.overflow="")}),document.addEventListener("keydown",function(o){o.key==="Escape"&&(s!=null&&s.classList.contains("active"))&&(s.classList.remove("active"),document.body.style.overflow="")});const w=new IntersectionObserver(o=>{o.forEach(c=>{c.isIntersecting?c.target.setAttribute("data-is-intersecting","true"):c.target.setAttribute("data-is-intersecting","false")})},{threshold:.1});e&&w.observe(e),console.log("Home hero script initialization complete")}document.addEventListener("DOMContentLoaded",function(){console.log("Home hero script loaded - DOMContentLoaded"),v(),setTimeout(v,100),setTimeout(v,500)});window.addEventListener("includesLoaded",function(){console.log("Includes loaded event received"),v()});async function k(){const e=document.getElementById("main-content");if(e)try{const i=await(await fetch("/data/projects.json")).json();e.innerHTML=i.map((a,t)=>A(a,t)).join(""),q()}catch(n){console.error("Failed to load projects:",n)}}function A(e,n){e.id;const i=e.id==="hotspot",a=n%2===1,t=e.tech.map(s=>`<span class="tech-tag">${s}</span>`).join(""),r=`
        <div class="project-content">
            <span class="project-category design">${e.category}</span>
            <p class="project-subtitle">${e.subtitle}</p>
            <h2 class="project-title">${e.title}</h2>
            <p class="project-description">${e.description}</p>
            <div class="project-tech">${t}</div>
            <div class="project-cta">
                <a href="${e.cta.link}" class="project-link">${e.cta.text}</a>
            </div>
        </div>
    `;let d=`
        <div class="project-visual">
            <img src="${e.visual.src}" 
                 alt="${e.visual.alt}" 
                 id="${e.visual.id||""}" 
                 loading="lazy"
                 decodings="async">
        </div>
    `;i&&(d=`
            <div class="project-visual hotspot-preview">
                <img src="${e.visual.src}" alt="${e.visual.alt}">
            </div>
        `);const m=a?"project-tile reverse":"project-tile",u=a?r+d:d+r;return`
        <section id="tile-${e.id}" class="content-section">
            <div class="container">
                <article class="${m}">
                    ${u}
                </article>
            </div>
        </section>
    `}function q(){const e=document.getElementById("merge-logo"),n=document.querySelector(".merge-preview");!e||!n||(n.addEventListener("mousemove",i=>{const a=n.getBoundingClientRect(),t=i.clientX-a.left,r=i.clientY-a.top,d=a.width/2,m=a.height/2,u=(r-m)/m*-15,s=(t-d)/d*15;e.style.transform=`
            perspective(1000px) 
            rotateX(${u}deg) 
            rotateY(${s}deg)
            scale3d(1.05, 1.05, 1.05)
        `}),n.addEventListener("mouseleave",()=>{e.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"}))}document.addEventListener("DOMContentLoaded",k);
