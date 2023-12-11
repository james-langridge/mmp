type Officer = {
    id: number
    name: string
    subordinates: Officer[]
}

class ArmyRankingApp {
    #general: Officer
    #rootElement?: HTMLElement
    #officerID?: number
    #oldManagerID?: number
    #newManagerID?: number
    #subordinates?: Officer[]
    #isASelected: boolean

    constructor(general: Officer) {
        this.#general = general;
        this.#isASelected = false
        this.#render()

        // Create the buttons
        const testBtn = document.getElementById('moveBtn')
        testBtn && testBtn.addEventListener('click', () => {
            this.moveOfficer(this.#officerID, this.#newManagerID)
            this.#render()
        })

        const undoBtn = document.getElementById('undoBtn')
        undoBtn && undoBtn.addEventListener('click', () => {
            this.#undo()
            this.#render()
        })

        const redoBtn = document.getElementById('redoBtn')
        redoBtn && redoBtn.addEventListener('click', () => {
            this.#redo()
            this.#render()
        })

    }

    #undo() {
        // Move officer back to previous manager
        this.moveOfficer(this.#officerID, this.#oldManagerID, true)
        // Move previous subordinates back under officer
        this.#subordinates?.forEach(subordinate => {
            this.moveOfficer(subordinate.id, this.#officerID, true)
        })
    }

    #redo() {
        this.moveOfficer(this.#officerID, this.#newManagerID, true)
    }

    #render() {
        const main = document.createElement("div")
        main.id = 'main'

        // Create one event listener for clicks on the officer buttons
        main.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('button')) {
                if (!this.#isASelected) {
                    const selectedElements = document.querySelectorAll('.selected');
                    selectedElements.forEach(element => {
                        element.classList.remove('selected');
                    });

                    this.#officerID = Number(target.id)
                    target.classList.add('selected')
                    this.#isASelected = true
                } else {
                    this.#newManagerID = Number(target.id)
                    target.classList.add('selected')
                    this.#isASelected = false
                }
            } else {
                this.#isASelected = false
                const selectedElements = document.querySelectorAll('.selected');
                selectedElements.forEach(element => {
                    element.classList.remove('selected');
                });
            }
        });

        const fragment = document.createDocumentFragment();
        const rootEl = fragment
            .appendChild(main)
            .appendChild(document.createElement("section"))
            .appendChild(document.createElement("ul"))
            .appendChild(document.createElement("li"))

        rootEl.id = String(this.#general.id)

        const root = document.getElementById('root')

        if (!root) {
            throw new Error('No root element!')
        }

        // Clear the root, which includes the child div with the click event listener
        root.innerHTML = '';
        // Re-append everything
        root.appendChild(fragment);

        const btn = document.createElement("button")
        btn.innerText = this.#general.name
        rootEl.appendChild(btn)

        this.#rootElement = rootEl

        this.#renderChildElements(this.#general, this.#rootElement)
    }

    moveOfficer(officerID?: number, managerID?: number, isUndo: boolean = false) {
        if (!officerID || !managerID) {
            throw new Error('Missing ID')
        }
        if (officerID == this.#general.id) {
            throw new Error('Insubordination!  You cannot remove the general!')
        }
        if (officerID === managerID) {
            throw new Error('officerID must be different to managerID')
        }

        const A = this.#extractA(this.#general, officerID, isUndo)

        if (!A) {
            throw new Error(`officerId ${officerID} not found!`)
        }

        this.#insertA(this.#general, A, managerID)
    }

    #extractA(officer: Officer, officerID: number, isUndo: boolean = false): Officer | undefined {
        for (let i = 0; i < officer.subordinates.length; i++) {
            if (officer.subordinates[i].id === officerID) {
                const A = officer.subordinates[i]
                const managerOfA = officer
                this.#oldManagerID = officer.id
                const subordinatesOfA = [...A.subordinates]
                // Updating this.#subordinates interferes with un/re-do logic
                if (!isUndo) {
                    this.#subordinates = subordinatesOfA
                }
                const aWithoutSubordinates = {
                    id: A.id,
                    name: A.name,
                    subordinates: []
                }

                // Remove officerID from manager subs
                managerOfA.subordinates = managerOfA.subordinates.filter(s => s.id !== A.id)
                // Add A's subs to manager subs
                managerOfA.subordinates = [...managerOfA.subordinates, ...subordinatesOfA]

                return aWithoutSubordinates
            }

            const result = this.#extractA(officer.subordinates[i], officerID, isUndo);
            if (result !== undefined) {
                return result;
            }
        }

        return undefined
    }

    #insertA(officer: Officer, A: Officer, managerID: number): boolean {
        if (managerID === officer.id) {
            officer.subordinates.push(A)

            return true
        }

        for (let i = 0; i < officer.subordinates.length; i++) {
            if (officer.subordinates[i].id === managerID) {
                officer.subordinates[i].subordinates.push(A);

                return true;
            }

            if (this.#insertA(officer.subordinates[i], A, managerID)) {
                return true;
            }
        }

        return false;
    }

    #renderChildElements(officer: Officer, element?: HTMLElement) {
        if (!element) {
            throw new Error('No element to append children to')
        }

        const list = document.createElement("ul")
        element.appendChild(list)

        for (let i = 0; i < officer.subordinates.length; i++) {
            const li = document.createElement('li')
            const btn = document.createElement("button")
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
                    subordinates: []
                },
                {
                    id: 789,
                    name: 'princess',
                    subordinates: []
                },
            ]
        },
        {
            id: 888,
            name: 'bill',
            subordinates: [
                {
                    id: 333,
                    name: 'julie',
                    subordinates: []
                },
                {
                    id: 222,
                    name: 'franzi',
                    subordinates: []
                },
            ]
        }
    ]
}

new ArmyRankingApp(general)
