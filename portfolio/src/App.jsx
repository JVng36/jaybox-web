import { useEffect, useRef, useState } from 'react'

// Start with the sample copy here. The stylesheet lives in index.css.
const sections = [
  { id: 'work', label: 'Projects' },
  { id: 'about', label: 'About me' },
  { id: 'contact', label: 'Contact' },
]

// Keep this in step with the mobile breakpoint in index.css.
const narrowScreenQuery = '(max-width: 760px)'

function Projects() {
  return (
    <>
      <p className="page-label">From my notebook</p>
      <h2>Projects</h2>
      <p className="intro">
        A few things I&apos;ve made or am still figuring out. Open a note for the slightly longer version.
      </p>
      <article className="project">
        <h3>A weekend website</h3>
        <p>A home for a few ideas, built slowly and kept simple.</p>
        <details>
          <summary>Read my notes</summary>
          <p>The aim, an interesting decision, and a real project link could go here.</p>
        </details>
      </article>
      <article className="project">
        <h3>A useful little data tool</h3>
        <p>A helper for making messy tables less of a chore.</p>
        <details>
          <summary>Read my notes</summary>
          <p>A few sentences about the problem are usually more interesting than a long list of technologies.</p>
        </details>
      </article>
      <article className="project">
        <h3>Things to come back to</h3>
        <p>A small place to keep books, ideas, and unfinished work.</p>
        <details>
          <summary>Read my notes</summary>
          <p>Leave room for projects that are personal or still in progress.</p>
        </details>
      </article>
    </>
  )
}

function About() {
  return (
    <>
      <p className="page-label">The person behind the projects</p>
      <h2>A little about me</h2>
      <p>This is where you can be less concise than the sidebar. A short introduction, what you enjoy making, and the kind of problems that catch your attention.</p>
      <h3>Outside the code</h3>
      <p>A few non-work interests give this page a person, not just a skill list. Replace these prompts with things you actually want to share.</p>
      <ul className="interests">
        <li>Something you are learning</li>
        <li>Something you do for fun</li>
        <li>Something you are curious about</li>
      </ul>
    </>
  )
}

function Contact() {
  return (
    <>
      <p className="page-label">Leave a note</p>
      <h2>Say hello</h2>
      <p>Your chosen public email or profile link belongs here. You do not need a contact form, a scheduling widget, or a row of social icons.</p>
      <p>Keep this page as simple as the way you want someone to get in touch.</p>
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
          <p className="bio">Small projects, things I&apos;m learning, and a little about the person behind them.</p>
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
          <p className="small-note">Pick a section. The page beside it changes.</p>
        </header>

        <main id="main" tabIndex={-1}>
          {/* Hidden panels stay mounted, so an open project note survives switching tabs. */}
          <section className="panel" id="work" role="tabpanel" aria-labelledby="tab-work" tabIndex={0} hidden={activeSection !== 'work'}>
            <Projects />
          </section>
          <section className="panel about-copy" id="about" role="tabpanel" aria-labelledby="tab-about" tabIndex={0} hidden={activeSection !== 'about'}>
            <About />
          </section>
          <section className="panel about-copy" id="contact" role="tabpanel" aria-labelledby="tab-contact" tabIndex={0} hidden={activeSection !== 'contact'}>
            <Contact />
          </section>
          <footer>Portfolio draft. All personal and project copy is illustrative.</footer>
        </main>
      </div>
    </>
  )
}

export default App
