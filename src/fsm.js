class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('no config provided');
        }
        this.initialState = config.initial;
        this.state = config.initial;
        this.states = config.states;
        this.stateHistory = [config.initial];
        this.stateIndex = 0;
        this.redoHistory = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states[state]) {
            throw new Error('set state error');
        }
        this.stateHistory.push(this.state);
        this.stateIndex = this.stateHistory.length;
        this.redoHistory = [];
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const transitions = this.states[this.getState()].transitions;
        if (!transitions[event]) {
            throw new Error('not valid transition');
        }
        this.stateHistory.push(transitions[event]);
        this.stateIndex = this.stateHistory.length - 1;
        this.redoHistory = [];
        this.state = transitions[event];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this.states);
        }
        return Object.keys(this.states).filter(state => this.states[state].transitions[event]);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.stateIndex === 0) {
            return false;
        }
        this.redoHistory.push(this.state);
        this.stateIndex--;
        this.state = this.stateHistory[this.stateIndex];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.redoHistory.length) {
            return false;
        }

        this.stateIndex++;
        this.state = this.redoHistory.pop();

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.reset();
        this.stateHistory = [this.state];
        this.stateIndex = 0;
        this.redoHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
