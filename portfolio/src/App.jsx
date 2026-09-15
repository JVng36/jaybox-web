import { useEffect, useRef, useState } from 'react'
import { projects } from './projects'
import ThemeToggle from './ThemeToggle'

const workTitle = 'Projects'

// The tab and the page heading share this title. The styles live in index.css.
const sections = [
  { id: 'work', label: workTitle },
  { id: 'about', label: 'About me' },
  { id: 'contact', label: 'Contact' },
]

// Keep this in step with the mobile breakpoint in index.css.
const narrowScreenQuery = '(max-width: 760px)'

function Project({ project }) {
  const [notesOpen, setNotesOpen] = useState(false)
  const notesId = `${project.id}-notes`

  return (
    <article className="project" aria-labelledby={`${project.id}-title`}>
      <p className="project-type">{project.type}</p>
      <h3 id={`${project.id}-title`}>{project.title}</h3>
      <p>{project.summary}</p>
      <p className="project-tech">{project.technologies}</p>
      <div className="project-actions">
        <button
          className="notes-toggle"
          type="button"
          aria-expanded={notesOpen}
          aria-controls={notesId}
          onClick={() => setNotesOpen((open) => !open)}
        >
          <span aria-hidden="true">{notesOpen ? '▾' : '▸'}</span>
          Read my notes
        </button>
        <a className="project-link" href={project.url} aria-label={`View on GitHub: ${project.title}`}>
          View on GitHub
        </a>
      </div>
      <div className="project-notes" id={notesId} hidden={!notesOpen}>
        {project.notes.map((note) => <p key={note}>{note}</p>)}
      </div>
    </article>
  )
}

function Projects({ title }) {
  return (
    <>
      <p className="page-label">From my notebook</p>
      <h2>{title}</h2>
      <p className="intro">
        Projects I’ve built, with notes on how they work and the decisions behind them.
      </p>
      {projects.map((project) => (
        <Project key={project.id} project={project} />
      ))}
    </>
  )
}

function About() {
  return (
    <>
      <p className="page-label">The person behind the projects</p>
      <h2>A little about me</h2>
      <p>I&apos;m Jay. I&apos;m interested in gamedev, hardware, AI, and making small tools for everyday use.</p>
      <p>I like figuring out how things work and learning by trying things out. This site is a mix of personal projects, experiments, and older coursework.</p>
      <h3>About this site</h3>
      <p>I built this site with React and plain CSS, using a notebook layout to keep the focus on the projects.</p>
    </>
  )
}

function Contact() {
  return (
    <>
      <p className="page-label">Elsewhere</p>
      <h2>Contact me</h2>
      <p>You can reach me by email or find me on LinkedIn and GitHub.</p>
      {/* Icons from Bootstrap Icons. License: /licenses/bootstrap-icons.txt */}
      <p>
        <a className="contact-link" href="https://www.linkedin.com/in/jvang75/">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
          </svg>
          <span>LinkedIn</span>
        </a>
      </p>
      <p>
        <a className="contact-link" href="https://github.com/JVng36">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
          <span>GitHub</span>
        </a>
      </p>
      <p>
        <a className="contact-link" href="mailto:vangjay36@gmail.com">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
          </svg>
          <span>vangjay36@gmail.com</span>
        </a>
      </p>
    </>
  )
}

function App() {
  // React remembers which page is selected. Changing it updates the buttons and panels.
  const [activeSection, setActiveSection] = useState(() => {
    // Preserve the sketch's direct links, such as /#about. Unknown names use Projects.
    const fragment = window.location.hash.slice(1)
    return sections.some((section) => section.id === fragment) ? fragment : 'work'
  })
  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia(narrowScreenQuery).matches)
  const tabRefs = useRef([])

  // Match the keyboard direction to the vertical desktop or horizontal mobile tabs.
  useEffect(() => {
    const screen = window.matchMedia(narrowScreenQuery)
    const updateOrientation = (event) => setIsNarrow(event.matches)
    screen.addEventListener('change', updateOrientation)
    return () => screen.removeEventListener('change', updateOrientation)
  }, [])

  function handleTabKeyDown(event, index) {
    const nextKey = isNarrow ? 'ArrowRight' : 'ArrowDown'
    const previousKey = isNarrow ? 'ArrowLeft' : 'ArrowUp'
    let nextIndex

    if (event.key === nextKey) nextIndex = (index + 1) % sections.length
    else if (event.key === previousKey) nextIndex = (index - 1 + sections.length) % sections.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = sections.length - 1
    else return // Leave other keys, including normal page scrolling, to the browser.

    event.preventDefault()
    setActiveSection(sections[nextIndex].id)
    tabRefs.current[nextIndex].focus()
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="notebook">
        <header className="profile">
          <h1>Jay Vang</h1>
          <p className="bio">Software projects, hardware experiments, and AI tools.</p>
          <p className="availability">Open to new opportunities.</p>
          <div className="tabs" role="tablist" aria-label="Notebook sections" aria-orientation={isNarrow ? 'horizontal' : 'vertical'}>
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                ref={(element) => { tabRefs.current[index] = element }}
                role="tab"
                id={`tab-${section.id}`}
                aria-controls={section.id}
                aria-selected={section.id === activeSection}
                tabIndex={section.id === activeSection ? 0 : -1}
                onClick={() => setActiveSection(section.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <p className="small-note"></p>
        </header>

        <main id="main" tabIndex={-1}>
          {/* Hidden panels stay mounted, so an open project note survives switching tabs. */}
          <section className="panel" id="work" role="tabpanel" aria-labelledby="tab-work" tabIndex={0} hidden={activeSection !== 'work'}>
            <Projects title={workTitle} />
          </section>
          <section className="panel about-copy" id="about" role="tabpanel" aria-labelledby="tab-about" tabIndex={0} hidden={activeSection !== 'about'}>
            <About />
          </section>
          <section className="panel about-copy" id="contact" role="tabpanel" aria-labelledby="tab-contact" tabIndex={0} hidden={activeSection !== 'contact'}>
            <Contact />
          </section>
        </main>
      </div>
    </>
  )
}

export default App
