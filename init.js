class InputHandler {
    constructor(inputSelector) {
        this.inputSelector = inputSelector;
        this.inputElement = null;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.inputElement = document.querySelector(this.inputSelector);
            if (this.inputElement) {
                this.setupListeners();
            } else {
                console.error(`Input element not found: ${this.inputSelector}`);
            }
        });
    }

    setupListeners() {
        this.inputElement.addEventListener('keydown', this.onEnterPress.bind(this));
    }

    onEnterPress(event) {
        if (event.key === 'Enter') {
            let tickerInput = event.target.value;
            console.log('Enter key pressed. Input value:', tickerInput);
            getCurrentPrice(tickerInput)
        }
    }
}

const inputHandler = new InputHandler('#tickerInput');
inputHandler.init();
