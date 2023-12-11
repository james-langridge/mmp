"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ArmyRankingApp_instances, _ArmyRankingApp_general, _ArmyRankingApp_rootElement, _ArmyRankingApp_officerID, _ArmyRankingApp_oldManagerID, _ArmyRankingApp_newManagerID, _ArmyRankingApp_subordinates, _ArmyRankingApp_isASelected, _ArmyRankingApp_undo, _ArmyRankingApp_redo, _ArmyRankingApp_render, _ArmyRankingApp_extractA, _ArmyRankingApp_insertA, _ArmyRankingApp_renderChildElements;
class ArmyRankingApp {
    constructor(general) {
        _ArmyRankingApp_instances.add(this);
        _ArmyRankingApp_general.set(this, void 0);
        _ArmyRankingApp_rootElement.set(this, void 0);
        _ArmyRankingApp_officerID.set(this, void 0);
        _ArmyRankingApp_oldManagerID.set(this, void 0);
        _ArmyRankingApp_newManagerID.set(this, void 0);
        _ArmyRankingApp_subordinates.set(this, void 0);
        _ArmyRankingApp_isASelected.set(this, void 0);
        __classPrivateFieldSet(this, _ArmyRankingApp_general, general, "f");
        __classPrivateFieldSet(this, _ArmyRankingApp_isASelected, false, "f");
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_render).call(this);
        // Create the buttons
        const testBtn = document.getElementById('moveBtn');
        testBtn && testBtn.addEventListener('click', () => {
            this.moveOfficer(__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f"));
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_render).call(this);
        });
        const undoBtn = document.getElementById('undoBtn');
        undoBtn && undoBtn.addEventListener('click', () => {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_undo).call(this);
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_render).call(this);
        });
        const redoBtn = document.getElementById('redoBtn');
        redoBtn && redoBtn.addEventListener('click', () => {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_redo).call(this);
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_render).call(this);
        });
    }
    moveOfficer(officerID, managerID, isUndo = false) {
        if (!officerID || !managerID) {
            throw new Error('Missing ID');
        }
        if (officerID == __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id) {
            throw new Error('Insubordination!  You cannot remove the general!');
        }
        if (officerID === managerID) {
            throw new Error('officerID must be different to managerID');
        }
        const A = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractA).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), officerID, isUndo);
        if (!A) {
            throw new Error(`officerId ${officerID} not found!`);
        }
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertA).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), A, managerID);
    }
}
_ArmyRankingApp_general = new WeakMap(), _ArmyRankingApp_rootElement = new WeakMap(), _ArmyRankingApp_officerID = new WeakMap(), _ArmyRankingApp_oldManagerID = new WeakMap(), _ArmyRankingApp_newManagerID = new WeakMap(), _ArmyRankingApp_subordinates = new WeakMap(), _ArmyRankingApp_isASelected = new WeakMap(), _ArmyRankingApp_instances = new WeakSet(), _ArmyRankingApp_undo = function _ArmyRankingApp_undo() {
    var _a;
    // Move officer back to previous manager
    this.moveOfficer(__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_oldManagerID, "f"), true);
    // Move previous subordinates back under officer
    (_a = __classPrivateFieldGet(this, _ArmyRankingApp_subordinates, "f")) === null || _a === void 0 ? void 0 : _a.forEach(subordinate => {
        this.moveOfficer(subordinate.id, __classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f"), true);
    });
}, _ArmyRankingApp_redo = function _ArmyRankingApp_redo() {
    this.moveOfficer(__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f"), true);
}, _ArmyRankingApp_render = function _ArmyRankingApp_render() {
    const main = document.createElement("div");
    main.id = 'main';
    // Create one event listener for clicks on the officer buttons
    main.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('button')) {
            if (!__classPrivateFieldGet(this, _ArmyRankingApp_isASelected, "f")) {
                const selectedElements = document.querySelectorAll('.selected');
                selectedElements.forEach(element => {
                    element.classList.remove('selected');
                });
                __classPrivateFieldSet(this, _ArmyRankingApp_officerID, Number(target.id), "f");
                target.classList.add('selected');
                __classPrivateFieldSet(this, _ArmyRankingApp_isASelected, true, "f");
            }
            else {
                __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, Number(target.id), "f");
                target.classList.add('selected');
                __classPrivateFieldSet(this, _ArmyRankingApp_isASelected, false, "f");
            }
        }
        else {
            __classPrivateFieldSet(this, _ArmyRankingApp_isASelected, false, "f");
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
        .appendChild(document.createElement("li"));
    rootEl.id = String(__classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id);
    const root = document.getElementById('root');
    if (!root) {
        throw new Error('No root element!');
    }
    // Clear the root, which includes the child div with the click event listener
    root.innerHTML = '';
    // Re-append everything
    root.appendChild(fragment);
    const btn = document.createElement("button");
    btn.innerText = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").name;
    rootEl.appendChild(btn);
    __classPrivateFieldSet(this, _ArmyRankingApp_rootElement, rootEl, "f");
    __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_rootElement, "f"));
}, _ArmyRankingApp_extractA = function _ArmyRankingApp_extractA(officer, officerID, isUndo = false) {
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === officerID) {
            const A = officer.subordinates[i];
            const managerOfA = officer;
            __classPrivateFieldSet(this, _ArmyRankingApp_oldManagerID, officer.id, "f");
            const subordinatesOfA = [...A.subordinates];
            // Updating this.#subordinates interferes with un/re-do logic
            if (!isUndo) {
                __classPrivateFieldSet(this, _ArmyRankingApp_subordinates, subordinatesOfA, "f");
            }
            const aWithoutSubordinates = {
                id: A.id,
                name: A.name,
                subordinates: []
            };
            // Remove officerID from manager subs
            managerOfA.subordinates = managerOfA.subordinates.filter(s => s.id !== A.id);
            // Add A's subs to manager subs
            managerOfA.subordinates = [...managerOfA.subordinates, ...subordinatesOfA];
            return aWithoutSubordinates;
        }
        const result = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractA).call(this, officer.subordinates[i], officerID, isUndo);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}, _ArmyRankingApp_insertA = function _ArmyRankingApp_insertA(officer, A, managerID) {
    if (managerID === officer.id) {
        officer.subordinates.push(A);
        return true;
    }
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === managerID) {
            officer.subordinates[i].subordinates.push(A);
            return true;
        }
        if (__classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertA).call(this, officer.subordinates[i], A, managerID)) {
            return true;
        }
    }
    return false;
}, _ArmyRankingApp_renderChildElements = function _ArmyRankingApp_renderChildElements(officer, element) {
    if (!element) {
        throw new Error('No element to append children to');
    }
    const list = document.createElement("ul");
    element.appendChild(list);
    for (let i = 0; i < officer.subordinates.length; i++) {
        const li = document.createElement('li');
        const btn = document.createElement("button");
        btn.id = String(officer.subordinates[i].id);
        btn.innerText = officer.subordinates[i].name;
        btn.className = 'button';
        li.appendChild(btn);
        list.appendChild(li);
        if (officer.subordinates[i].subordinates.length) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, officer.subordinates[i], li);
        }
    }
};
const general = {
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
};
new ArmyRankingApp(general);
