type Officer = {
  id: number
  name: string
  subordinates: Officer[]
}

type Move = {
  officer: Officer
  oldManagerID: number
  newManagerID: number
}

type MoveType = 'move' | 'undo' | 'redo'

class ArmyRankingApp {
  #general?: Officer
  #moveIndex: number = 0
  #newManagerID?: number
  #officerClassname: string
  #officerID?: number
  #prevMoves: (Move | null)[] = [null]
  #resetError?: () => void
  #rootElementID: string

  constructor(rootElementID: string, officerClassname: string) {
    this.#officerClassname = officerClassname
    this.#rootElementID = rootElementID
  }

  get officerID() {
    return this.#officerID
  }

  get newManagerID() {
    return this.#newManagerID
  }

  set general(value: Officer | undefined) {
    this.#general = value
  }

  set resetError(cb: () => void) {
    this.#resetError = cb
  }

  undo() {
    if (this.#moveIndex < 1) {
      return
    }

    const move = this.#prevMoves[this.#moveIndex]

    if (move) {
      // Remove officer from army
      this.#extractOfficer(move.officer.id, 'undo')
      // Remove subordinates from previous location
      move.officer.subordinates.forEach(subordinate => {
        this.#extractOfficer(subordinate.id, 'undo')
      })
      // Re-insert officer to previous position with previous subordinates
      this.#insertOfficer(move.officer, move.oldManagerID)

      this.#moveIndex--

      this.renderArmy()
    }
  }

  redo() {
    if (this.#moveIndex >= this.#prevMoves.length - 1) {
      return
    }

    this.#moveIndex++

    const move = this.#prevMoves[this.#moveIndex]

    if (move) {
      this.moveOfficer(move.officer.id, move.newManagerID, 'redo')
    }
  }

  moveOfficer(
    officerID?: number,
    managerID?: number,
    moveType: MoveType = 'move',
  ) {
    if (!this.#general) {
      throw new Error('No general!')
    }

    if (!officerID || !managerID) {
      this.#resetIDs()

      throw new Error('Missing ID')
    }

    if (officerID === this.#general.id) {
      this.#resetIDs()

      throw new Error(
        'You cannot remove the general. Your insubordination has been reported!',
      )
    }

    if (officerID === managerID) {
      this.#resetIDs()

      throw new Error('officerID must be different to managerID')
    }

    if (moveType === 'move') {
      if (this.#moveIndex < this.#prevMoves.length - 1) {
        this.#prevMoves = this.#prevMoves.slice(0, this.#moveIndex + 1)
      }

      this.#moveIndex++
    }

    const A = this.#extractOfficer(officerID, moveType)

    if (!A) {
      this.#resetIDs()
      this.#moveIndex--

      throw new Error(`officerId ${officerID} not found!`)
    }

    this.#insertOfficer(A, managerID)

    // Reset the values
    this.#resetIDs()

    this.renderArmy()
  }

  #extractOfficer(
    officerID: number,
    moveType: MoveType = 'move',
    officer: Officer | undefined = this.#general,
  ): Officer | undefined {
    if (!officer || !this.#general) {
      throw new Error('No officer subordinates to search.')
    }

    // Find the officer in the army by id
    for (let i = 0; i < officer.subordinates.length; i++) {
      if (officer.subordinates[i].id === officerID) {
        const A = officer.subordinates[i]
        const managerOfA = officer

        // No-op if trying to move officer to current manager
        if (managerOfA.id === this.#newManagerID) {
          this.#resetIDs()
          this.#moveIndex--

          throw new Error('Officer already reports to this manager.')
        }

        // Push the move to the history if this is not an undo/redo
        if (moveType === 'move') {
          this.#prevMoves.push({
            officer: A,
            oldManagerID: officer.id,
            // this.#newManagerID is set before moving when click on officer to move to.
            newManagerID: this.#newManagerID!,
          })
        }

        if (moveType !== 'undo') {
          // Add A's subs to manager subs
          if (A.subordinates.length) {
            managerOfA.subordinates = [
              ...managerOfA.subordinates,
              ...A.subordinates,
            ]
          }
        }

        // Remove officer from manager subordinates
        managerOfA.subordinates = managerOfA.subordinates.filter(
          s => s.id !== A.id,
        )

        return {
          id: A.id,
          name: A.name,
          subordinates: [],
        }
      }

      const result = this.#extractOfficer(
        officerID,
        moveType,
        officer.subordinates[i],
      )
      if (result !== undefined) {
        return result
      }
    }

    return undefined
  }

  #insertOfficer(
    A: Officer,
    managerID: number,
    officer: Officer | undefined = this.#general,
  ): boolean {
    if (!officer) {
      return false
    }
    // No need to search if target manager is the general
    if (managerID === officer.id) {
      officer.subordinates.push(A)

      return true
    }

    // Find the target manager and push A into its subordinates
    for (let i = 0; i < officer.subordinates.length; i++) {
      if (officer.subordinates[i].id === managerID) {
        officer.subordinates[i].subordinates.push(A)

        return true
      }

      if (this.#insertOfficer(A, managerID, officer.subordinates[i])) {
        return true
      }
    }

    return false
  }

  renderArmy(general: Officer | undefined = this.#general) {
    const root = document.getElementById(this.#rootElementID)

    if (!root) {
      throw new Error('No root element!')
    }

    // FIXME: nice idea but getElementById like this is too coupled to the UI.
    //  Related html and css also commented out.
    // const A = document.getElementById('A') as HTMLElement
    // const B = document.getElementById('B') as HTMLElement

    if (!general) {
      root.innerHTML = ''
      // A.textContent = 'Officer'
      // B.textContent = 'Manager'
      this.#prevMoves = [null]
      this.#moveIndex = 0

      return
    }

    const main = document.createElement('div')
    main.id = 'main'
    main.style.flexGrow = '1'
    main.style.width = '100%'
    main.style.height = '100%'
    main.style.display = 'flex'
    main.style.justifyContent = 'center'

    // Create one event listener for clicks on the officer buttons
    main.addEventListener('click', event => {
      if (this.#resetError) {
        this.#resetError()
      }
      const target = event.target as HTMLElement
      if (target.classList.contains(this.#officerClassname)) {
        if (!this.#officerID || this.#newManagerID) {
          const selectedElements = document.querySelectorAll('.selected')
          selectedElements.forEach(element => {
            element.classList.remove('selected')
          })
          this.#officerID = Number(target.id)
          // A.textContent = target.innerText
          // B.textContent = 'Manager'
          this.#newManagerID = undefined
          target.classList.add('selected')
        } else if (!this.#newManagerID) {
          // B.textContent = target.innerText
          this.#newManagerID = Number(target.id)
          target.classList.add('selected')
        }
      } else {
        // Reset the values if click away from officers
        // A.textContent = 'Officer'
        // B.textContent = 'Manager'
        this.#resetIDs()
        const selectedElements = document.querySelectorAll('.selected')
        selectedElements.forEach(element => {
          element.classList.remove('selected')
        })
      }
    })

    const mainFragment = document.createDocumentFragment()
    const mainEl = mainFragment
      .appendChild(main)
      .appendChild(document.createElement('section'))
      .appendChild(document.createElement('ul'))
      .appendChild(document.createElement('li'))

    // Clear the root, including the main child div with the click event listener
    // Avoids creating multiple event listeners
    root.innerHTML = ''
    // Re-append everything to the root
    root.appendChild(mainFragment)

    // Create the general
    const btn = this.#createOfficer(general)

    mainEl.appendChild(btn)

    this.#renderChildElements(general, mainEl)
  }

  #renderChildElements(officer: Officer, element: HTMLElement) {
    const list = document.createElement('ul')
    element.appendChild(list)

    for (let i = 0; i < officer.subordinates.length; i++) {
      const li = document.createElement('li')
      const btn = this.#createOfficer(officer.subordinates[i])

      li.appendChild(btn)
      list.appendChild(li)

      if (officer.subordinates[i].subordinates.length) {
        this.#renderChildElements(officer.subordinates[i], li)
      }
    }
  }

  #createOfficer(officer: Officer) {
    const btn = document.createElement('button')
    btn.id = String(officer.id)
    btn.innerText = officer.name
    btn.className = this.#officerClassname

    return btn
  }

  #resetIDs() {
    this.#officerID = undefined
    this.#newManagerID = undefined
  }
}

// Create app instance
const app = new ArmyRankingApp('root', 'officer')
app.resetError = resetError

// Set up button event listeners
// Move button
const moveBtn = document.getElementById('moveBtn') as HTMLButtonElement
moveBtn.addEventListener('click', () => {
  resetError()

  const officerID = app.officerID
  const newManagerID = app.newManagerID

  if (!newManagerID) {
    return
  }

  try {
    app.moveOfficer(officerID, newManagerID)
  } catch (error) {
    handleError(error)
  }
})

// Undo button
const undoBtn = document.getElementById('undoBtn') as HTMLButtonElement
undoBtn.addEventListener('click', () => {
  resetError()

  try {
    app.undo()
  } catch (error) {
    handleError(error)
  }
})

// Redo button
const redoBtn = document.getElementById('redoBtn') as HTMLButtonElement
redoBtn.addEventListener('click', () => {
  resetError()

  try {
    app.redo()
  } catch (error) {
    handleError(error)
  }
})

// Display army button
const displayArmyBtn = document.getElementById(
  'display-army',
) as HTMLButtonElement
displayArmyBtn.addEventListener('click', () => {
  const inputText = document.getElementById('army-input') as HTMLTextAreaElement
  resetError()

  try {
    app.general = JSON.parse(inputText.value)
    app.renderArmy()
  } catch (error) {
    handleError(error)
  }
})

// Demo button
const demoArmyBtn = document.getElementById('demo-army') as HTMLButtonElement
demoArmyBtn.addEventListener('click', () => {
  resetError()

  fetch('army-data.json')
    .then(response => response.json())
    .then(data => {
      app.general = data
      app.renderArmy()
    })
    .catch(error => {
      handleError(error)
    })
})

// Reset button
const resetBtn = document.getElementById('reset') as HTMLButtonElement
resetBtn.addEventListener('click', () => {
  resetError()
  const inputText = document.getElementById('army-input') as HTMLTextAreaElement
  inputText.value = ''
  app.general = undefined
  try {
    app.renderArmy()
  } catch (error) {
    handleError(error)
  }
})

// Error handler
type ErrorWithMessage = {
  message: string
}

const inputError = document.getElementById('error') as HTMLElement

function handleError(error: unknown) {
  inputError.innerText = getErrorMessage(error)
  console.error(error)
}

function resetError() {
  inputError.innerText = ''
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // Fallback in case there's an error stringifying the maybeError
    // Like with circular references for example.
    return new Error(String(maybeError))
  }
}

function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}
