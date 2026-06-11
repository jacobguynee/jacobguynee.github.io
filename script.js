const content = {
  name: "Jacob Guynee",
  role: "Mathematics PhD Student",
  institution: "Georgia Institute of Technology",
  email: "jguynee@gatech.edu",
  cvHref:
    "https://drive.google.com/file/d/1rcD-SRMnvjtIptiOlbtC2pMc74YxiAB4/view?usp=drive_link",
  portrait: "assets/jacob-guynee.jpg",
  bio:
    "I am a fifth-year mathematics PhD student at Georgia Tech working with Dan Margalit. My research interests lie broadly in geometric group theory and low-dimensional topology. More specifically, I am interested in representations of braid groups and applications of braids and knots to the sciences.",
  papers: [
    {
      title:
        "A theory of inductive loops in electrochemical impedance spectroscopy",
      href: "https://arxiv.org/abs/2301.05024",
      year: "2023",
      meta: "with Yury Grabovsky &middot; submitted",
    },
    {
      title:
        "GT-shadows for the gentle version of the Grothendieck-Teichmueller group",
      href: "https://arxiv.org/abs/2401.06870",
      year: "2024",
      meta: "with Vasily Dolgushev &middot; Journal of Pure and Applied Algebra",
    },
  ],
  slides: {
    title: "The Alexander &amp; Thurston Norms",
    href: "slideshows/alex-and-thurston/index.html",
    meta: "April 8, 2026",
    note:
      "These slides were built in HTML with no framework, a workflow that is only feasible because of AI.",
  },
  mentoring: {
    title: "CUBE REU at Vanderbilt",
    href: "https://margalit.droppages.net/reu.html",
    meta: "Summer 2024",
    description: "I was a mentor for a group studying virtual braid groups.",
    project: "Genus-0 Virtual Braids",
    group: "Jerry Gao, Alberto Maga&ntilde;a, Isaiah Williams",
    poster: "assets/genus-0-virtual-braids-poster.pdf",
  },
  courses: [
    ["Survey of Calculus", "Spring 2026"],
    ["Combinatorics", "Spring 2026"],
    ["Precalculus", "Fall 2025"],
    ["Combinatorics", "Summer 2025"],
    ["Precalculus", "Fall 2024"],
    ["Discrete Mathematics", "Spring 2024"],
    ["Differential Calculus", "Fall 2023"],
  ],
  outreach:
    'In Spring 2024, I co-coreographed (with <a href="https://sites.google.com/view/aiyko/home" target="_blank" rel="noopener noreferrer">Aiya Kuchukova</a>) an aerial silks act about braids and knots. The performance was part of the <a href="https://atlantasciencefestival.org/events-2024/808-science-of-the-circus/" target="_blank" rel="noopener noreferrer">Science of the Circus</a> event at the Atlanta Science Festival.',
  outreachVideo:
    "https://drive.google.com/file/d/1J1d-u1OM01Z6d9Sy87omcITtz2qol_px/view",
  artIntro:
    "I have created several interactive mathematical art apps. The idea is that one can enjoy them without any knowledge of mathematics, but there is an interesting math concept there for the curious user. They are incomplete, but two of them are below.",
  art: [
    {
      title: "Voronoi Madness",
      href: "mathematical-art/voronoi-madness/",
      meta: "Interactive Voronoi art tool",
      description:
        "This app allows one to place large amounts of points on the plane, possibly along text they've drawn or inside of regions they've outlined. The app generates the Voronoi diagram and allows for some color customization. Future features include more coloring options and alternate metrics.",
      visual: "voronoi",
      image: "assets/voronoi-madness-preview.png",
      imageAlt: "Voronoi diagram spelling Go Birds",
    },
    {
      title: "Kobon Mosaics",
      href: "mathematical-art/kobon-mosaics/",
      meta: "Interactive line-arrangement mosaic tool",
      description:
        "The Kobon triangle problem asks how many triangles can be formed from <span class=\"math-inline\">N</span> lines in the plane. This is an open problem that can be understood, and even worked on, by the general public. This app places lines in the plane and colors the polygons a color according to the number of sides. The user can move the lines, randomly generate a given number of them, and control the colors.",
      visual: "kobon",
      image: "assets/kobon-mosaics-preview.png",
      imageAlt: "Kobon Mosaics line arrangement preview",
    },
  ],
};

const root = document.querySelector("#site-root");

function externalAttrs(href) {
  return href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function textLink(href, label, className = "") {
  return `<a href="${href}"${externalAttrs(href)}${className ? ` class="${className}"` : ""}>${label}</a>`;
}

function mentoringPosterLink(label = "poster") {
  return textLink(content.mentoring.poster, label);
}

function contactLinks() {
  return `
    <p>Email: <a href="mailto:${content.email}">${content.email}</a></p>
    <p>CV: ${textLink(content.cvHref, "Curriculum Vitae")}</p>
  `;
}

function paperEntries(className = "entry", heading = "h3") {
  return content.papers
    .map(
      (paper) => `
        <article class="${className}">
          <${heading} class="entry-title">${textLink(paper.href, paper.title)}</${heading}>
          <p class="entry-meta">${paper.meta}</p>
        </article>
      `,
    )
    .join("");
}

function slidesEntry(className = "entry", heading = "h3") {
  return `
    <article class="${className}">
      <${heading} class="entry-title">${textLink(content.slides.href, content.slides.title)}</${heading}>
      <p class="entry-meta">${content.slides.meta}</p>
      <p>${content.slides.note}</p>
    </article>
  `;
}

function mentoringEntry(className = "entry", heading = "h3") {
  return `
    <article class="${className}">
      <${heading} class="entry-title">${textLink(content.mentoring.href, content.mentoring.title)}</${heading}>
      <p class="entry-meta">${content.mentoring.meta}</p>
      <p>${content.mentoring.description}</p>
      <p class="entry-detail"><span>Project:</span> ${content.mentoring.project}</p>
      <p class="entry-detail"><span>Poster:</span> ${mentoringPosterLink()}</p>
      <p class="entry-detail"><span>Group:</span> ${content.mentoring.group}</p>
    </article>
  `;
}

function courseList(className = "course-list") {
  return `
    <ul class="${className}">
      ${content.courses
        .map(
          ([name, term]) => `
            <li>
              <span>${name}</span>
              <span class="course-term">${term}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function artVisual(item) {
  if (item.image) {
    const altText = item.imageAlt || `${item.title} preview`;
    return `
      <button class="art-preview-button" type="button" data-art-preview="${item.image}" data-art-preview-alt="${altText}" aria-label="Enlarge ${item.title} preview">
        <img class="art-thumb art-thumb-image" src="${item.image}" alt="${altText}">
      </button>
    `;
  }

  return `<span class="art-thumb art-thumb--${item.visual}" aria-hidden="true"></span>`;
}

function artEntries(className = "entry", heading = "h3") {
  return content.art
    .map(
      (item) => `
        <article class="${className} art-entry">
          ${artVisual(item)}
          <div>
            <${heading} class="entry-title">${textLink(item.href, item.title)}</${heading}>
            <p class="entry-meta">${item.meta}</p>
            <p>${item.description}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function dossierArtList() {
  return content.art
    .map(
      (item) => `
        <li class="art-cv-item">
          <div>
            <h4>${textLink(item.href, item.title)}</h4>
            <p>${item.description}</p>
          </div>
          <div class="art-cv-side">
            ${artVisual(item)}
          </div>
        </li>
      `,
    )
    .join("");
}

function dossierTemplate() {
  return `
    <div class="site dossier-site">
      <aside class="dossier-rail">
        <div class="dossier-profile-head">
          <img class="portrait" src="${content.portrait}" alt="${content.name}">
          <div class="dossier-profile-copy">
            <h1>${content.name}</h1>
            <p>${content.role}<br>${content.institution}</p>
            <div class="dossier-contact">
              ${contactLinks()}
            </div>
          </div>
        </div>
      </aside>

      <main class="dossier-main">
        <section class="dossier-intro">
          <h2>About</h2>
          <p class="dossier-summary">${content.bio}</p>
        </section>

        <section class="cv-block">
          <h3>Papers</h3>
          <ul class="cv-list">
            ${content.papers
              .map(
                (paper) => `
                  <li>
                    <div>
                      <h4>${textLink(paper.href, paper.title)}</h4>
                      <p>${paper.meta}</p>
                    </div>
                    <p>${paper.year}</p>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </section>

        <section class="cv-block">
          <h3>Slides</h3>
          <ul class="cv-list">
            <li>
              <div>
                <h4>${textLink(content.slides.href, content.slides.title)}</h4>
                <p>${content.slides.note}</p>
              </div>
              <p>${content.slides.meta}</p>
            </li>
          </ul>
        </section>

        <section class="cv-block">
          <h3>Teaching</h3>
          <ul class="cv-list">
            ${content.courses
              .map(
                ([name, term]) => `
                  <li>
                    <div><h4>${name}</h4></div>
                    <p>${term}</p>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </section>

        <section class="cv-block">
          <h3>Mathematical Art</h3>
          <div class="art-section-body">
            <p class="art-intro">${content.artIntro}</p>
            <ul class="cv-list art-cv-list">
              ${dossierArtList()}
            </ul>
          </div>
        </section>

        <section class="cv-block">
          <h3>Mentoring &amp; Outreach</h3>
          <ul class="cv-list">
            <li>
              <div>
                <h4>${textLink(content.mentoring.href, content.mentoring.title)}</h4>
                <p>${content.mentoring.description}</p>
                <p>Project: ${content.mentoring.project} (${mentoringPosterLink()})</p>
                <p>Group: ${content.mentoring.group}</p>
              </div>
              <p>${content.mentoring.meta}</p>
            </li>
            <li>
              <div>
                <h4>${textLink(content.outreachVideo, "Braids and knots aerial silks performance")}</h4>
                <p>${content.outreach}</p>
              </div>
              <p>Spring 2024</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  `;
}

function notebookTemplate() {
  return `
    <div class="site notebook-site">
      <aside class="notebook-margin">
        <img class="portrait" src="${content.portrait}" alt="${content.name}">
        <h1>${content.name}</h1>
        <p>${content.role}<br>${content.institution}</p>
        ${contactLinks()}
        <div class="notebook-note">
          <p>Interests</p>
          <strong>braids, knots, low-dimensional topology, geometric group theory</strong>
        </div>
      </aside>

      <main class="notebook-pages">
        <section class="notebook-opening">
          <p class="label">Research Notebook</p>
          <h2>Notes around braids, topology, and representation-theoretic shadows.</h2>
          <p>${content.bio}</p>
        </section>

        <section class="notebook-spread">
          <div class="notebook-index">
            <span>01</span>
            <h3>Papers</h3>
          </div>
          <div class="notebook-body">${paperEntries("notebook-entry", "h4")}</div>
        </section>

        <section class="notebook-spread">
          <div class="notebook-index">
            <span>02</span>
            <h3>Slides</h3>
          </div>
          <div class="notebook-body">${slidesEntry("notebook-entry", "h4")}</div>
        </section>

        <section class="notebook-spread">
          <div class="notebook-index">
            <span>03</span>
            <h3>Teaching</h3>
          </div>
          <div class="notebook-body">
            <p>I have been a teaching assistant for the following courses at Georgia Tech.</p>
            ${courseList("notebook-courses")}
          </div>
        </section>

        <section class="notebook-spread">
          <div class="notebook-index">
            <span>04</span>
            <h3>Mathematical Art</h3>
          </div>
          <div class="notebook-body">
            <p class="art-intro">${content.artIntro}</p>
            ${artEntries("notebook-entry", "h4")}
          </div>
        </section>

        <section class="notebook-spread">
          <div class="notebook-index">
            <span>05</span>
            <h3>Mentoring / Outreach</h3>
          </div>
          <div class="notebook-body">
            ${mentoringEntry("notebook-entry", "h4")}
            <article class="notebook-entry">
              <h4>${textLink(content.outreachVideo, "Braids and knots aerial silks performance")}</h4>
              <p>${content.outreach}</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  `;
}

function letterheadTemplate() {
  return `
    <div class="site letter-site">
      <main class="letter-paper">
        <header class="letter-top">
          <div>
            <p>Georgia Institute of Technology</p>
            <h1>${content.name}</h1>
            <span>${content.role}</span>
          </div>
          <img class="portrait" src="${content.portrait}" alt="${content.name}">
        </header>

        <section class="letter-memo">
          <dl>
            <div><dt>Subject</dt><dd>Research and teaching profile</dd></div>
            <div><dt>Contact</dt><dd><a href="mailto:${content.email}">${content.email}</a></dd></div>
            <div><dt>CV</dt><dd>${textLink(content.cvHref, "Curriculum Vitae")}</dd></div>
          </dl>
          <p>${content.bio}</p>
        </section>

        <section class="letter-section">
          <h2>Papers</h2>
          ${paperEntries("letter-entry", "h3")}
        </section>

        <section class="letter-columns">
          <div class="letter-section">
            <h2>Slides</h2>
            ${slidesEntry("letter-entry", "h3")}
            <h2>Mathematical Art</h2>
            <p class="art-intro">${content.artIntro}</p>
            ${artEntries("letter-entry", "h3")}
            <h2>Mentoring / REU</h2>
            ${mentoringEntry("letter-entry", "h3")}
          </div>
          <aside class="letter-section">
            <h2>Teaching</h2>
            ${courseList("letter-courses")}
            <h2>Outreach</h2>
            <p>${content.outreach}</p>
            <p>${textLink(content.outreachVideo, "Watch the performance")}.</p>
          </aside>
        </section>
      </main>
    </div>
  `;
}

function seminarTemplate() {
  return `
    <div class="site seminar-site">
      <header class="seminar-mast">
        <div class="seminar-title-block">
          <p>Topology / Braids / Mathematical Outreach</p>
          <h1>${content.name}</h1>
          <span>${content.role} &middot; ${content.institution}</span>
        </div>
        <div class="seminar-portrait">
          <img class="portrait" src="${content.portrait}" alt="${content.name}">
        </div>
      </header>

      <main class="seminar-board">
        <section class="seminar-feature">
          <h2>Current Work</h2>
          <p>${content.bio}</p>
        </section>

        <section class="seminar-column seminar-wide">
          <h2>Papers</h2>
          ${paperEntries("seminar-entry", "h3")}
        </section>

        <section class="seminar-column">
          <h2>Slides</h2>
          ${slidesEntry("seminar-entry", "h3")}
        </section>

        <section class="seminar-column">
          <h2>Teaching</h2>
          ${courseList("seminar-courses")}
        </section>

        <section class="seminar-column seminar-wide">
          <h2>Mathematical Art</h2>
          <p class="art-intro">${content.artIntro}</p>
          ${artEntries("seminar-entry", "h3")}
        </section>

        <section class="seminar-column seminar-wide">
          <h2>Mentoring &amp; Outreach</h2>
          ${mentoringEntry("seminar-entry", "h3")}
          <article class="seminar-entry">
            <h3>${textLink(content.outreachVideo, "Science of the Circus performance")}</h3>
            <p>${content.outreach}</p>
          </article>
        </section>

        <aside class="seminar-contact">
          <h2>Contact</h2>
          ${contactLinks()}
        </aside>
      </main>
    </div>
  `;
}

function cardsTemplate() {
  return `
    <div class="site cards-site">
      <main class="cards-desk">
        <header class="cards-header">
          <div>
            <p>Index Cards</p>
            <h1>${content.name}</h1>
            <span>${content.role} at ${content.institution}</span>
          </div>
          <img class="portrait" src="${content.portrait}" alt="${content.name}">
        </header>

        <section class="card-grid">
          <article class="index-card bio-card">
            <h2>Bio</h2>
            <p>${content.bio}</p>
            <div class="card-contact">${contactLinks()}</div>
          </article>

          <article class="index-card research-card">
            <h2>Papers</h2>
            ${paperEntries("card-entry", "h3")}
          </article>

          <article class="index-card">
            <h2>Slides</h2>
            ${slidesEntry("card-entry", "h3")}
          </article>

          <article class="index-card teaching-card">
            <h2>Teaching</h2>
            ${courseList("card-courses")}
          </article>

          <article class="index-card">
            <h2>Mathematical Art</h2>
            <p class="art-intro">${content.artIntro}</p>
            ${artEntries("card-entry", "h3")}
          </article>

          <article class="index-card">
            <h2>Mentoring / REU</h2>
            ${mentoringEntry("card-entry", "h3")}
          </article>

          <article class="index-card outreach-card">
            <h2>Outreach</h2>
            <p>${content.outreach}</p>
            <p>${textLink(content.outreachVideo, "Watch the performance")}.</p>
          </article>
        </section>
      </main>
    </div>
  `;
}

const templates = {
  dossier: dossierTemplate,
  notebook: notebookTemplate,
  letterhead: letterheadTemplate,
  seminar: seminarTemplate,
  cards: cardsTemplate,
};

function activateFormat(format) {
  const nextFormat = templates[format] ? format : "dossier";
  document.body.dataset.format = nextFormat;
  root.innerHTML = templates[nextFormat]();

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeArtLightbox();
  }
});

function ensureArtLightbox() {
  let lightbox = document.querySelector("#art-lightbox");
  if (lightbox) {
    return lightbox;
  }

  lightbox = document.createElement("div");
  lightbox.id = "art-lightbox";
  lightbox.className = "art-lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="art-lightbox-close" type="button" aria-label="Close image preview">&times;</button>
    <img class="art-lightbox-image" alt="">
  `;
  document.body.append(lightbox);
  return lightbox;
}

function openArtLightbox(src, alt) {
  const lightbox = ensureArtLightbox();
  const image = lightbox.querySelector(".art-lightbox-image");
  image.src = src;
  image.alt = alt;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeArtLightbox() {
  const lightbox = document.querySelector("#art-lightbox");
  if (!lightbox || lightbox.hidden) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

document.addEventListener("click", (event) => {
  const previewButton = event.target.closest("[data-art-preview]");
  if (previewButton) {
    openArtLightbox(previewButton.dataset.artPreview, previewButton.dataset.artPreviewAlt);
    return;
  }

  if (
    event.target.matches(".art-lightbox, .art-lightbox-close")
  ) {
    closeArtLightbox();
  }
});

activateFormat("dossier");
