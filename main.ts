type Officer = {
    id: number
    name: string
    subordinates: Officer[]
}

class ArmyRankingApp {
    #general: Officer
    #rootElement: HTMLElement

    constructor(general: Officer) {
        this.#general = general;

        // Create the root army element
        const root = document.getElementById('root')
        const fragment = document.createDocumentFragment();
        const rootEl = fragment
            .appendChild(document.createElement("section"))
            .appendChild(document.createElement("ul"))
            .appendChild(document.createElement("li"));
        rootEl.textContent = this.#general.name;
        rootEl.id = String(this.#general.id)

        if (!root) {
            throw new Error('No root element!')
        }

        root.appendChild(fragment);

        const element = document.getElementById(String(this.#general.id))

        if (!element) {
            throw new Error('No element!')
        }

        this.#rootElement = element

        const button = document.getElementById('button')
        button && button.addEventListener('click', () => {
            let child = element.lastElementChild;
            while (child) {
                element.removeChild(child);
                child = element.lastElementChild;
            }
            this.moveOfficer(789, 222)
        })

        // Render the army
        this.#render(this.#general, element)
    }

    moveOfficer(officerID: number, managerID: number) {
        if (officerID == this.#general.id) {
            throw new Error('Insubordination!  You cannot remove the general!')
        }

        if (officerID === managerID) {
            throw new Error('officerID must be different to managerID')
        }

        const A = this.#extractA(this.#general, officerID)

        if (!A) {
            throw new Error(`officerId ${officerID} not found!`)
        }

        this.#insertA(this.#general, A, managerID)

        this.#render(this.#general, this.#rootElement)
    }

    #extractA(officer: Officer, officerID: number): Officer | undefined {
        for (let i = 0; i < officer.subordinates.length; i++) {
            if (officer.subordinates[i].id === officerID) {
                const A = officer.subordinates[i]
                const managerOfA = officer
                const subordinatesOfA = [...A.subordinates]
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

            const result = this.#extractA(officer.subordinates[i], officerID);
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

    #render(officer: Officer, element: HTMLElement) {
        const list = document.createElement("ul")
        element.appendChild(list)

        for (let i = 0; i < officer.subordinates.length; i++) {
            const li = document.createElement('li')
            li.textContent = officer.subordinates[i].name
            list.appendChild(li)

            if (officer.subordinates[i].subordinates.length) {
                this.#render(officer.subordinates[i], li)
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
