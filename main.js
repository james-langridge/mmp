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
var _ArmyRankingApp_instances, _ArmyRankingApp_general, _ArmyRankingApp_moveIndex, _ArmyRankingApp_newManagerID, _ArmyRankingApp_officerClassname, _ArmyRankingApp_officerID, _ArmyRankingApp_prevMoves, _ArmyRankingApp_resetError, _ArmyRankingApp_rootElementID, _ArmyRankingApp_extractOfficer, _ArmyRankingApp_insertOfficer, _ArmyRankingApp_renderChildElements, _ArmyRankingApp_createOfficer, _ArmyRankingApp_resetIDs;
class ArmyRankingApp {
    constructor(rootElementID, officerClassname) {
        _ArmyRankingApp_instances.add(this);
        _ArmyRankingApp_general.set(this, void 0);
        _ArmyRankingApp_moveIndex.set(this, 0);
        _ArmyRankingApp_newManagerID.set(this, void 0);
        _ArmyRankingApp_officerClassname.set(this, void 0);
        _ArmyRankingApp_officerID.set(this, void 0);
        _ArmyRankingApp_prevMoves.set(this, [null]);
        _ArmyRankingApp_resetError.set(this, void 0);
        _ArmyRankingApp_rootElementID.set(this, void 0);
        __classPrivateFieldSet(this, _ArmyRankingApp_officerClassname, officerClassname, "f");
        __classPrivateFieldSet(this, _ArmyRankingApp_rootElementID, rootElementID, "f");
    }
    get officerID() {
        return __classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f");
    }
    get newManagerID() {
        return __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f");
    }
    set general(value) {
        __classPrivateFieldSet(this, _ArmyRankingApp_general, value, "f");
    }
    set resetError(cb) {
        __classPrivateFieldSet(this, _ArmyRankingApp_resetError, cb, "f");
    }
    undo() {
        var _a;
        if (__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") < 1) {
            return;
        }
        const move = __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f")[__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f")];
        if (move) {
            // Remove officer from army
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractOfficer).call(this, move.officer.id, 'undo');
            // Remove subordinates from previous location
            move.officer.subordinates.forEach(subordinate => {
                __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractOfficer).call(this, subordinate.id, 'undo');
            });
            // Re-insert officer to previous position with previous subordinates
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertOfficer).call(this, move.officer, move.oldManagerID);
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a--, _a), "f");
            this.renderArmy();
        }
    }
    redo() {
        var _a;
        if (__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") >= __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").length - 1) {
            return;
        }
        __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a++, _a), "f");
        const move = __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f")[__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f")];
        if (move) {
            this.moveOfficer(move.officer.id, move.newManagerID, 'redo');
        }
    }
    moveOfficer(officerID, managerID, moveType = 'move') {
        var _a, _b;
        if (!__classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
            throw new Error('No general!');
        }
        if (!officerID || !managerID) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
            throw new Error('Missing ID');
        }
        if (officerID === __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
            throw new Error('You cannot remove the general. Your insubordination has been reported!');
        }
        if (officerID === managerID) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
            throw new Error('officerID must be different to managerID');
        }
        if (moveType === 'move') {
            if (__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") < __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").length - 1) {
                __classPrivateFieldSet(this, _ArmyRankingApp_prevMoves, __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").slice(0, __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") + 1), "f");
            }
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a++, _a), "f");
        }
        const A = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractOfficer).call(this, officerID, moveType);
        if (!A) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_b = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _b--, _b), "f");
            throw new Error(`officerId ${officerID} not found!`);
        }
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertOfficer).call(this, A, managerID);
        // Reset the values
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
        this.renderArmy();
    }
    renderArmy(general = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
        const root = document.getElementById(__classPrivateFieldGet(this, _ArmyRankingApp_rootElementID, "f"));
        if (!root) {
            throw new Error('No root element!');
        }
        // FIXME: nice idea but getElementById like this is too coupled to the UI.
        //  Related html and css also commented out.
        // const A = document.getElementById('A') as HTMLElement
        // const B = document.getElementById('B') as HTMLElement
        if (!general) {
            root.innerHTML = '';
            // A.textContent = 'Officer'
            // B.textContent = 'Manager'
            __classPrivateFieldSet(this, _ArmyRankingApp_prevMoves, [null], "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, 0, "f");
            return;
        }
        const main = document.createElement('div');
        main.id = 'main';
        main.style.flexGrow = '1';
        main.style.width = '100%';
        main.style.height = '100%';
        main.style.display = 'flex';
        main.style.justifyContent = 'center';
        // Create one event listener for clicks on the officer buttons
        main.addEventListener('click', event => {
            if (__classPrivateFieldGet(this, _ArmyRankingApp_resetError, "f")) {
                __classPrivateFieldGet(this, _ArmyRankingApp_resetError, "f").call(this);
            }
            const target = event.target;
            if (target.classList.contains(__classPrivateFieldGet(this, _ArmyRankingApp_officerClassname, "f"))) {
                if (!__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f") || __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
                    const selectedElements = document.querySelectorAll('.selected');
                    selectedElements.forEach(element => {
                        element.classList.remove('selected');
                    });
                    __classPrivateFieldSet(this, _ArmyRankingApp_officerID, Number(target.id), "f");
                    // A.textContent = target.innerText
                    // B.textContent = 'Manager'
                    __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
                    target.classList.add('selected');
                }
                else if (!__classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
                    // B.textContent = target.innerText
                    __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, Number(target.id), "f");
                    target.classList.add('selected');
                }
            }
            else {
                // Reset the values if click away from officers
                // A.textContent = 'Officer'
                // B.textContent = 'Manager'
                __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
                const selectedElements = document.querySelectorAll('.selected');
                selectedElements.forEach(element => {
                    element.classList.remove('selected');
                });
            }
        });
        const mainFragment = document.createDocumentFragment();
        const mainEl = mainFragment
            .appendChild(main)
            .appendChild(document.createElement('section'))
            .appendChild(document.createElement('ul'))
            .appendChild(document.createElement('li'));
        // Clear the root, including the main child div with the click event listener
        // Avoids creating multiple event listeners
        root.innerHTML = '';
        // Re-append everything to the root
        root.appendChild(mainFragment);
        // Create the general
        const btn = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_createOfficer).call(this, general);
        mainEl.appendChild(btn);
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, general, mainEl);
    }
}
_ArmyRankingApp_general = new WeakMap(), _ArmyRankingApp_moveIndex = new WeakMap(), _ArmyRankingApp_newManagerID = new WeakMap(), _ArmyRankingApp_officerClassname = new WeakMap(), _ArmyRankingApp_officerID = new WeakMap(), _ArmyRankingApp_prevMoves = new WeakMap(), _ArmyRankingApp_resetError = new WeakMap(), _ArmyRankingApp_rootElementID = new WeakMap(), _ArmyRankingApp_instances = new WeakSet(), _ArmyRankingApp_extractOfficer = function _ArmyRankingApp_extractOfficer(officerID, moveType = 'move', officer = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
    var _a;
    if (!officer || !__classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
        throw new Error('No officer subordinates to search.');
    }
    // Find the officer in the army by id
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === officerID) {
            const A = officer.subordinates[i];
            const managerOfA = officer;
            // No-op if trying to move officer to current manager
            if (managerOfA.id === __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
                __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_resetIDs).call(this);
                __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a--, _a), "f");
                throw new Error('Officer already reports to this manager.');
            }
            // Push the move to the history if this is not an undo/redo
            if (moveType === 'move') {
                __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").push({
                    officer: A,
                    oldManagerID: officer.id,
                    // this.#newManagerID is set before moving when click on officer to move to.
                    newManagerID: __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f"),
                });
            }
            if (moveType !== 'undo') {
                // Add A's subs to manager subs
                if (A.subordinates.length) {
                    managerOfA.subordinates = [
                        ...managerOfA.subordinates,
                        ...A.subordinates,
                    ];
                }
            }
            // Remove officer from manager subordinates
            managerOfA.subordinates = managerOfA.subordinates.filter(s => s.id !== A.id);
            return {
                id: A.id,
                name: A.name,
                subordinates: [],
            };
        }
        const result = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractOfficer).call(this, officerID, moveType, officer.subordinates[i]);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}, _ArmyRankingApp_insertOfficer = function _ArmyRankingApp_insertOfficer(A, managerID, officer = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
    if (!officer) {
        return false;
    }
    // No need to search if target manager is the general
    if (managerID === officer.id) {
        officer.subordinates.push(A);
        return true;
    }
    // Find the target manager and push A into its subordinates
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === managerID) {
            officer.subordinates[i].subordinates.push(A);
            return true;
        }
        if (__classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertOfficer).call(this, A, managerID, officer.subordinates[i])) {
            return true;
        }
    }
    return false;
}, _ArmyRankingApp_renderChildElements = function _ArmyRankingApp_renderChildElements(officer, element) {
    const list = document.createElement('ul');
    element.appendChild(list);
    for (let i = 0; i < officer.subordinates.length; i++) {
        const li = document.createElement('li');
        const btn = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_createOfficer).call(this, officer.subordinates[i]);
        li.appendChild(btn);
        list.appendChild(li);
        if (officer.subordinates[i].subordinates.length) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, officer.subordinates[i], li);
        }
    }
}, _ArmyRankingApp_createOfficer = function _ArmyRankingApp_createOfficer(officer) {
    const btn = document.createElement('button');
    btn.id = String(officer.id);
    btn.innerText = officer.name;
    btn.className = __classPrivateFieldGet(this, _ArmyRankingApp_officerClassname, "f");
    return btn;
}, _ArmyRankingApp_resetIDs = function _ArmyRankingApp_resetIDs() {
    __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
    __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
};
// Create app instance
const app = new ArmyRankingApp('root', 'officer');
app.resetError = resetError;
// Set up button event listeners
// Move button
const moveBtn = document.getElementById('moveBtn');
moveBtn.addEventListener('click', () => {
    resetError();
    const officerID = app.officerID;
    const newManagerID = app.newManagerID;
    if (!newManagerID) {
        return;
    }
    try {
        app.moveOfficer(officerID, newManagerID);
    }
    catch (error) {
        handleError(error);
    }
});
// Undo button
const undoBtn = document.getElementById('undoBtn');
undoBtn.addEventListener('click', () => {
    resetError();
    try {
        app.undo();
    }
    catch (error) {
        handleError(error);
    }
});
// Redo button
const redoBtn = document.getElementById('redoBtn');
redoBtn.addEventListener('click', () => {
    resetError();
    try {
        app.redo();
    }
    catch (error) {
        handleError(error);
    }
});
// Display army button
const displayArmyBtn = document.getElementById('display-army');
displayArmyBtn.addEventListener('click', () => {
    const inputText = document.getElementById('army-input');
    resetError();
    try {
        app.general = JSON.parse(inputText.value);
        app.renderArmy();
    }
    catch (error) {
        handleError(error);
    }
});
// Demo button
const demoArmyBtn = document.getElementById('demo-army');
demoArmyBtn.addEventListener('click', () => {
    resetError();
    fetch('army-data.json')
        .then(response => response.json())
        .then(data => {
        app.general = data;
        app.renderArmy();
    })
        .catch(error => {
        handleError(error);
    });
});
// Reset button
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', () => {
    resetError();
    const inputText = document.getElementById('army-input');
    inputText.value = '';
    app.general = undefined;
    try {
        app.renderArmy();
    }
    catch (error) {
        handleError(error);
    }
});
const inputError = document.getElementById('error');
function handleError(error) {
    inputError.innerText = getErrorMessage(error);
    console.error(error);
}
function resetError() {
    inputError.innerText = '';
}
function isErrorWithMessage(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string');
}
function toErrorWithMessage(maybeError) {
    if (isErrorWithMessage(maybeError))
        return maybeError;
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch (_a) {
        // Fallback in case there's an error stringifying the maybeError
        // Like with circular references for example.
        return new Error(String(maybeError));
    }
}
function getErrorMessage(error) {
    return toErrorWithMessage(error).message;
}
