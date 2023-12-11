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
var _ArmyRankingApp_instances, _ArmyRankingApp_general, _ArmyRankingApp_extractA, _ArmyRankingApp_insertA;
class ArmyRankingApp {
    constructor(general) {
        _ArmyRankingApp_instances.add(this);
        _ArmyRankingApp_general.set(this, void 0);
        __classPrivateFieldSet(this, _ArmyRankingApp_general, general, "f");
    }
    moveOfficer(officerID, managerID) {
        if (officerID == __classPrivateFieldGet(this, _ArmyRankingApp_general, "f").id) {
            throw new Error('Insubordination!  You cannot remove the general!');
        }
        if (officerID === managerID) {
            throw new Error('officerID must be different to managerID');
        }
        const A = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractA).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), officerID);
        if (!A) {
            throw new Error(`officerId ${officerID} not found!`);
        }
        __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_insertA).call(this, __classPrivateFieldGet(this, _ArmyRankingApp_general, "f"), A, managerID);
        // Add to DOM
    }
}
_ArmyRankingApp_general = new WeakMap(), _ArmyRankingApp_instances = new WeakSet(), _ArmyRankingApp_extractA = function _ArmyRankingApp_extractA(officer, officerID) {
    for (let i = 0; i < officer.subordinates.length; i++) {
        if (officer.subordinates[i].id === officerID) {
            const A = officer.subordinates[i];
            const managerOfA = officer;
            const subordinatesOfA = [...A.subordinates];
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
        const result = __classPrivateFieldGet(this, _ArmyRankingApp_instances, "m", _ArmyRankingApp_extractA).call(this, officer.subordinates[i], officerID);
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
};
