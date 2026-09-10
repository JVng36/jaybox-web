import { useEffect, useRef, useState } from 'react'
import { projects } from './projects'

const workTitle = 'projects'

// The tab and the page heading share this title. The styles live in index.css.
const sections = [
  { id: 'work', label: workTitle },
  { id: 'about', label: 'About me' },
  { id: 'contact', label: 'Contact' },
]

// Keep this in step with the mobile breakpoint in index.css.
const narrowScreenQuery = '(max-width: 760px)'

function Projects({ title }) {
  return (
    <>
      <p className="page-label">From my notebook</p>
      <h2>{title}</h2>
      <p className="intro">
        A few things I&apos;ve made or am still figuring out. Open a note for the slightly longer version.
      </p>
      {projects.map((project) => (
        <article className="project" key={project.id} aria-labelledby={`${project.id}-title`}>
          <p className="project-type">{project.type}</p>
          <h3 id={`${project.id}-title`}>{project.title}</h3>
          <p>{project.summary}</p>
          <p className="project-tech">{project.technologies}</p>
          <details>
            <summary>Read my notes</summary>
            {project.notes.map((note) => <p key={note}>{note}</p>)}
          </details>
          <a className="project-link" href={project.url} aria-label={`View on GitHub: ${project.title}`}>
            View on GitHub
          </a>
        </article>
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
      <p>I wanted a small site I could understand and come back to change. It&apos;s built with React and plain CSS, with a notebook layout for now.</p>
    </>
  )
}

function Contact() {
  return (
    <>
      <p className="page-label">Elsewhere</p>
      <h2>Say hello</h2>
      <p>You can reach me by email or find me on LinkedIn.</p>
      <p><a className="contact-link" href="https://www.linkedin.com/in/jvang75/">LinkedIn</a></p>
      <p><a className="contact-link" href="mailto:vangjay36@gmail.com">vangjay36@gmail.com</a></p>
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
          <h1>Jay</h1>
          <p className="bio">Small apps, hardware experiments, and things I&apos;m learning.</p>
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
          <p className="small-note">Built a little at a time.</p>
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
          <footer>Made with React and plain CSS.</footer>
        </main>
      </div>
    </>
  )
}

export default App
