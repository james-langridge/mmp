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
var _ArmyRankingApp_instances, _ArmyRankingApp_general, _ArmyRankingApp_rootElement, _ArmyRankingApp_officerID, _ArmyRankingApp_newManagerID, _ArmyRankingApp_prevMoves, _ArmyRankingApp_moveIndex, _ArmyRankingApp_undo, _ArmyRankingApp_redo, _ArmyRankingApp_extractOfficer, _ArmyRankingApp_insertOfficer, _ArmyRankingApp_renderArmy, _ArmyRankingApp_renderChildElements, _ArmyRankingApp_createButtonEventListeners;
class ArmyRankingApp {
    constructor(general) {
        _ArmyRankingApp_instances.add(this);
        _ArmyRankingApp_general.set(this, void 0);
        _ArmyRankingApp_rootElement.set(this, void 0);
        _ArmyRankingApp_officerID.set(this, void 0);
        _ArmyRankingApp_newManagerID.set(this, void 0);
        _ArmyRankingApp_prevMoves.set(this, [null]);
        _ArmyRankingApp_moveIndex.set(this, 0);
        __classPrivateFieldSet(this, _ArmyRankingApp_general, general, "f");
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_createButtonEventListeners).call(this);
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderArmy).call(this);
    }
    moveOfficer(officerID, managerID, moveType = 'move') {
        var _a, _b;
        if (!officerID || !managerID) {
            __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
            console.error('Missing ID');
            return { success: false };
        }
        if (officerID === __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id) {
            __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
            console.error('You cannot remove the general. Your insubordination has been reported!');
            return { success: false };
        }
        if (officerID === managerID) {
            __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
            console.error('officerID must be different to managerID');
            return { success: false };
        }
        if (moveType === 'move') {
            if (__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") < __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").length - 1) {
                __classPrivateFieldSet(this, _ArmyRankingApp_prevMoves, __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").slice(0, __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") + 1), "f");
            }
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a++, _a), "f");
        }
        const A = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractOfficer).call(this, officerID, moveType);
        if (!A) {
            __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_b = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _b--, _b), "f");
            console.error(`officerId ${officerID} not found!`);
            return { success: false };
        }
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertOfficer).call(this, A, managerID);
        // Reset the values
        __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
        __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
        return { success: true };
    }
}
_ArmyRankingApp_general = new WeakMap(), _ArmyRankingApp_rootElement = new WeakMap(), _ArmyRankingApp_officerID = new WeakMap(), _ArmyRankingApp_newManagerID = new WeakMap(), _ArmyRankingApp_prevMoves = new WeakMap(), _ArmyRankingApp_moveIndex = new WeakMap(), _ArmyRankingApp_instances = new WeakSet(), _ArmyRankingApp_undo = function _ArmyRankingApp_undo() {
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
    }
}, _ArmyRankingApp_redo = function _ArmyRankingApp_redo() {
    var _a;
    if (__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f") >= __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f").length - 1) {
        return;
    }
    __classPrivateFieldSet(this, _ArmyRankingApp_moveIndex, (_a = __classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f"), _a++, _a), "f");
    const move = __classPrivateFieldGet(this, _ArmyRankingApp_prevMoves, "f")[__classPrivateFieldGet(this, _ArmyRankingApp_moveIndex, "f")];
    if (move) {
        this.moveOfficer(move.officer.id, move.newManagerID, 'redo');
    }
}, _ArmyRankingApp_extractOfficer = function _ArmyRankingApp_extractOfficer(officerID, moveType = 'move', officer = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f")) {
    // Find the officer in the army by id
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === officerID) {
            const A = officer.subordinates[i];
            const managerOfA = officer;
            // No-op if trying to move 1st level officer to general
            if (managerOfA.id === __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id &&
                __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f") === __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id) {
                return undefined;
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
}, _ArmyRankingApp_renderArmy = function _ArmyRankingApp_renderArmy() {
    const main = document.createElement('div');
    main.id = 'main';
    // Create one event listener for clicks on the officer buttons
    main.addEventListener('click', event => {
        const target = event.target;
        if (target.classList.contains('officer')) {
            if (!__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f") || __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
                const selectedElements = document.querySelectorAll('.selected');
                selectedElements.forEach(element => {
                    element.classList.remove('selected');
                });
                __classPrivateFieldSet(this, _ArmyRankingApp_officerID, Number(target.id), "f");
                __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
                target.classList.add('selected');
            }
            else if (!__classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
                __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, Number(target.id), "f");
                target.classList.add('selected');
            }
        }
        else {
            // Reset the values if click away from officers
            __classPrivateFieldSet(this, _ArmyRankingApp_officerID, undefined, "f");
            __classPrivateFieldSet(this, _ArmyRankingApp_newManagerID, undefined, "f");
            const selectedElements = document.querySelectorAll('.selected');
            selectedElements.forEach(element => {
                element.classList.remove('selected');
            });
        }
    });
    const fragment = document.createDocumentFragment();
    const rootEl = fragment
        .appendChild(main)
        .appendChild(document.createElement('section'))
        .appendChild(document.createElement('ul'))
        .appendChild(document.createElement('li'));
    rootEl.id = String(__classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id);
    const root = document.getElementById('root');
    if (!root) {
        throw new Error('No root element!');
    }
    // Clear the root, which includes the child div with the click event listener
    root.innerHTML = '';
    // Re-append everything
    root.appendChild(fragment);
    // Create the general
    const btn = document.createElement('button');
    btn.id = String(__classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id);
    btn.innerText = __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").name;
    btn.className = 'officer';
    rootEl.appendChild(btn);
    __classPrivateFieldSet(this, _ArmyRankingApp_rootElement, rootEl, "f");
    __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_rootElement, "f"));
}, _ArmyRankingApp_renderChildElements = function _ArmyRankingApp_renderChildElements(officer, element) {
    if (!element) {
        throw new Error('No element to append children to');
    }
    const list = document.createElement('ul');
    element.appendChild(list);
    for (let i = 0; i < officer.subordinates.length; i++) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.id = String(officer.subordinates[i].id);
        btn.innerText = officer.subordinates[i].name;
        btn.className = 'officer';
        li.appendChild(btn);
        list.appendChild(li);
        if (officer.subordinates[i].subordinates.length) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderChildElements).call(this, officer.subordinates[i], li);
        }
    }
}, _ArmyRankingApp_createButtonEventListeners = function _ArmyRankingApp_createButtonEventListeners() {
    const moveBtn = document.getElementById('moveBtn');
    moveBtn.addEventListener('click', () => {
        if (!__classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f")) {
            return;
        }
        const { success } = this.moveOfficer(__classPrivateFieldGet(this, _ArmyRankingApp_officerID, "f"), __classPrivateFieldGet(this, _ArmyRankingApp_newManagerID, "f"));
        if (success) {
            __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderArmy).call(this);
        }
    });
    const undoBtn = document.getElementById('undoBtn');
    undoBtn.addEventListener('click', () => {
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_undo).call(this);
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderArmy).call(this);
    });
    const redoBtn = document.getElementById('redoBtn');
    redoBtn.addEventListener('click', () => {
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_redo).call(this);
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_renderArmy).call(this);
    });
};
const general = {
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
                        { id: 6477126282772480, name: 'Witting', subordinates: [] },
                        { id: 3583093055160320, name: 'Gerhold', subordinates: [] },
                        { id: 731703804952576, name: 'Goyette', subordinates: [] },
                    ],
                },
                {
                    id: 6755638029844480,
                    name: 'Windler',
                    subordinates: [
                        { id: 6734702408892416, name: 'Kris', subordinates: [] },
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
                        { id: 367154270568448, name: 'Gorczany', subordinates: [] },
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
                        { id: 329008319299584, name: 'Berge', subordinates: [] },
                        { id: 3980249003982848, name: 'Zulauf', subordinates: [] },
                        { id: 8185399719493632, name: 'West', subordinates: [] },
                    ],
                },
                {
                    id: 4796171983781888,
                    name: 'Bruen',
                    subordinates: [
                        { id: 5974160589193216, name: 'Braun', subordinates: [] },
                        { id: 8448128384499712, name: 'Sipes', subordinates: [] },
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
                        { id: 3610567862386688, name: 'Kub', subordinates: [] },
                        { id: 5847941006753792, name: 'Moen', subordinates: [] },
                        { id: 5543482080886784, name: 'Orn', subordinates: [] },
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
                        { id: 3116168061648896, name: 'Gerlach', subordinates: [] },
                        { id: 8061307072806912, name: 'Kihn', subordinates: [] },
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
                        { id: 114283868323840, name: 'DuBuque', subordinates: [] },
                        { id: 8192062828576768, name: 'Rau', subordinates: [] },
                        { id: 2473156684021760, name: 'Kling', subordinates: [] },
                    ],
                },
                {
                    id: 7228172166758400,
                    name: 'Lemke',
                    subordinates: [
                        { id: 634374145966080, name: 'Bernhard', subordinates: [] },
                        { id: 1028590613299200, name: 'Steuber', subordinates: [] },
                        { id: 4402901417984000, name: 'Volkman', subordinates: [] },
                    ],
                },
            ],
        },
    ],
};
new ArmyRankingApp(general);
