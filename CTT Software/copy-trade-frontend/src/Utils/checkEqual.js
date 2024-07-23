export default function checkEqual(oldState, newState) {
    return JSON.stringify(oldState) === JSON.stringify(newState);
}