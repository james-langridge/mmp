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
      this.#officerID = undefined
      this.#newManagerID = undefined
      console.error('Missing ID')

      return {success: false}
    }
    if (officerID === this.#general.id) {
      this.#officerID = undefined
      this.#newManagerID = undefined
      console.error(
        'You cannot remove the general. Your insubordination has been reported!',
      )

      return {success: false}
    }
    if (officerID === managerID) {
      this.#officerID = undefined
      this.#newManagerID = undefined
      console.error('officerID must be different to managerID')

      return {success: false}
    }

    if (moveType === 'move') {
      if (this.#moveIndex < this.#prevMoves.length - 1) {
        this.#prevMoves = this.#prevMoves.slice(0, this.#moveIndex + 1)
      }

      this.#moveIndex++
    }

    const A = this.#extractOfficer(officerID, moveType)

    if (!A) {
      this.#officerID = undefined
      this.#newManagerID = undefined
      this.#moveIndex--
      console.error(`officerId ${officerID} not found!`)

      return {success: false}
    }

    this.#insertOfficer(A, managerID)

    // Reset the values
    this.#officerID = undefined
    this.#newManagerID = undefined

    return {success: true}
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

        // No-op if trying to move 1st level officer to general
        if (
          managerOfA.id === this.#general.id &&
          this.#newManagerID === this.#general.id
        ) {
          return undefined
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
      if (target.classList.contains('officer')) {
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

    // Create the general
    const btn = document.createElement('button')
    btn.id = String(this.#general.id)
    btn.innerText = this.#general.name
    btn.className = 'officer'
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
      btn.className = 'officer'

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

      const {success} = this.moveOfficer(this.#officerID, this.#newManagerID)

      if (success) {
        this.#renderArmy()
      }
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
  id: 4414403118104576,
  name: 'Runte',
  subordinates: [
    {
      id: 2255409681268736,
      name: 'Welch',
      subordinates: [
        {
          id: 5289006159888384,
          name: 'Berge',
          subordinates: [
            {id: 6477126282772480, name: 'Witting', subordinates: []},
            {id: 3583093055160320, name: 'Gerhold', subordinates: []},
            {id: 731703804952576, name: 'Goyette', subordinates: []},
          ],
        },
        {
          id: 6755638029844480,
          name: 'Windler',
          subordinates: [
            {id: 6734702408892416, name: 'Kris', subordinates: []},
            {
              id: 2837393883267072,
              name: 'MacGyver',
              subordinates: [],
            },
            {
              id: 1739271736131584,
              name: 'Dickinson-Shields',
              subordinates: [],
            },
          ],
        },
        {
          id: 8965487518023680,
          name: 'Langosh',
          subordinates: [
            {
              id: 8821237660778496,
              name: 'Homenick',
              subordinates: [],
            },
            {id: 367154270568448, name: 'Gorczany', subordinates: []},
            {
              id: 8631827960954880,
              name: 'MacGyver',
              subordinates: [],
            },
          ],
        },
      ],
    },
    {
      id: 752826999373824,
      name: 'Kuhn',
      subordinates: [
        {
          id: 8360634274021376,
          name: 'Wiza',
          subordinates: [
            {id: 329008319299584, name: 'Berge', subordinates: []},
            {id: 3980249003982848, name: 'Zulauf', subordinates: []},
            {id: 8185399719493632, name: 'West', subordinates: []},
          ],
        },
        {
          id: 4796171983781888,
          name: 'Bruen',
          subordinates: [
            {id: 5974160589193216, name: 'Braun', subordinates: []},
            {id: 8448128384499712, name: 'Sipes', subordinates: []},
            {
              id: 1792728413241344,
              name: 'Kertzmann',
              subordinates: [],
            },
          ],
        },
        {
          id: 1126636709740544,
          name: 'Pouros',
          subordinates: [
            {id: 3610567862386688, name: 'Kub', subordinates: []},
            {id: 5847941006753792, name: 'Moen', subordinates: []},
            {id: 5543482080886784, name: 'Orn', subordinates: []},
          ],
        },
      ],
    },
    {
      id: 4742725043748864,
      name: 'Durgan',
      subordinates: [
        {
          id: 5387387840495616,
          name: 'Kovacek',
          subordinates: [
            {id: 3116168061648896, name: 'Gerlach', subordinates: []},
            {id: 8061307072806912, name: 'Kihn', subordinates: []},
            {
              id: 1867738721026048,
              name: 'Nitzsche',
              subordinates: [],
            },
          ],
        },
        {
          id: 3581808895590400,
          name: 'Heathcote',
          subordinates: [
            {id: 114283868323840, name: 'DuBuque', subordinates: []},
            {id: 8192062828576768, name: 'Rau', subordinates: []},
            {id: 2473156684021760, name: 'Kling', subordinates: []},
          ],
        },
        {
          id: 7228172166758400,
          name: 'Lemke',
          subordinates: [
            {id: 634374145966080, name: 'Bernhard', subordinates: []},
            {id: 1028590613299200, name: 'Steuber', subordinates: []},
            {id: 4402901417984000, name: 'Volkman', subordinates: []},
          ],
        },
      ],
    },
  ],
}

new ArmyRankingApp(general)
