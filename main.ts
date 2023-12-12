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
  #general: Officer
  #rootElement?: HTMLElement
  #officerID?: number
  #newManagerID?: number
  #prevMoves: (Move | null)[] = [null]
  #moveIndex: number = 0

  constructor(general: Officer) {
    this.#general = general
    this.#createButtonEventListeners()
    this.#renderArmy()
  }

  #undo() {
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
    }
  }

  #redo() {
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
    if (!officerID || !managerID) {
      throw new Error('Missing ID')
    }
    if (officerID === this.#general.id) {
      throw new Error(
        'You cannot remove the general. Your insubordination has been reported!',
      )
    }
    if (officerID === managerID) {
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
      throw new Error(`officerId ${officerID} not found!`)
    }

    this.#insertOfficer(A, managerID)

    // Reset the values
    this.#officerID = undefined
    this.#newManagerID = undefined
  }

  #extractOfficer(
    officerID: number,
    moveType: MoveType = 'move',
    officer: Officer = this.#general,
  ): Officer | undefined {
    // Find the officer in the army by id
    for (let i = 0; i < officer.subordinates.length; i++) {
      if (officer.subordinates[i].id === officerID) {
        const A = officer.subordinates[i]
        const managerOfA = officer
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
    officer: Officer = this.#general,
  ): boolean {
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

  #renderArmy() {
    const main = document.createElement('div')
    main.id = 'main'

    // Create one event listener for clicks on the officer buttons
    main.addEventListener('click', event => {
      const target = event.target as HTMLElement
      if (target.classList.contains('button')) {
        if (!this.#officerID || this.#newManagerID) {
          const selectedElements = document.querySelectorAll('.selected')
          selectedElements.forEach(element => {
            element.classList.remove('selected')
          })
          this.#officerID = Number(target.id)
          this.#newManagerID = undefined
          target.classList.add('selected')
        } else if (!this.#newManagerID) {
          this.#newManagerID = Number(target.id)
          target.classList.add('selected')
        }
      } else {
        // Reset the values if click away from officers
        this.#officerID = undefined
        this.#newManagerID = undefined
        const selectedElements = document.querySelectorAll('.selected')
        selectedElements.forEach(element => {
          element.classList.remove('selected')
        })
      }
    })

    const fragment = document.createDocumentFragment()
    const rootEl = fragment
      .appendChild(main)
      .appendChild(document.createElement('section'))
      .appendChild(document.createElement('ul'))
      .appendChild(document.createElement('li'))

    rootEl.id = String(this.#general.id)

    const root = document.getElementById('root')

    if (!root) {
      throw new Error('No root element!')
    }

    // Clear the root, which includes the child div with the click event listener
    root.innerHTML = ''
    // Re-append everything
    root.appendChild(fragment)

    const btn = document.createElement('button')
    btn.innerText = this.#general.name
    rootEl.appendChild(btn)

    this.#rootElement = rootEl

    this.#renderChildElements(this.#general, this.#rootElement)
  }

  #renderChildElements(officer: Officer, element?: HTMLElement) {
    if (!element) {
      throw new Error('No element to append children to')
    }

    const list = document.createElement('ul')
    element.appendChild(list)

    for (let i = 0; i < officer.subordinates.length; i++) {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.id = String(officer.subordinates[i].id)
      btn.innerText = officer.subordinates[i].name
      btn.className = 'button'

      li.appendChild(btn)
      list.appendChild(li)

      if (officer.subordinates[i].subordinates.length) {
        this.#renderChildElements(officer.subordinates[i], li)
      }
    }
  }

  #createButtonEventListeners() {
    const moveBtn = document.getElementById('moveBtn') as HTMLButtonElement
    moveBtn.addEventListener('click', () => {
      if (!this.#newManagerID) {
        return
      }

      this.moveOfficer(this.#officerID, this.#newManagerID)
      this.#renderArmy()
    })

    const undoBtn = document.getElementById('undoBtn') as HTMLButtonElement
    undoBtn.addEventListener('click', () => {
      this.#undo()
      this.#renderArmy()
    })

    const redoBtn = document.getElementById('redoBtn') as HTMLButtonElement
    redoBtn.addEventListener('click', () => {
      this.#redo()
      this.#renderArmy()
    })
  }
}

const general: Officer = {
  id: 987,
  name: 'general',
  subordinates: [
    {
      id: 123,
      name: 'queen',
      subordinates: [
        {
          id: 456,
          name: 'prince',
          subordinates: [],
        },
        {
          id: 789,
          name: 'princess',
          subordinates: [],
        },
      ],
    },
    {
      id: 888,
      name: 'bill',
      subordinates: [
        {
          id: 333,
          name: 'julie',
          subordinates: [],
        },
        {
          id: 222,
          name: 'franzi',
          subordinates: [],
        },
      ],
    },
  ],
}

new ArmyRankingApp(general)
