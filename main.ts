type Officer = {
    id: number
    name: string
    subordinates: Officer[]
}

class ArmyRankingApp {
    #general: Officer

    constructor(general: Officer) {
        this.#general = general;
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

        // Add to DOM
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
}
