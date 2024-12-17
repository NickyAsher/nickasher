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
            this.addGoogleTrendResult(tickerInput);
            getCurrentPrice(tickerInput);
        }
    }

    addGoogleTrendResult(tickerInput) {
        let trendResultDiv = document.getElementById("search-trend-result");
        trendResultDiv.innerHTML = '';

        let googleSearchTrendsScript = document.createElement('script');
        googleSearchTrendsScript.type = 'text/javascript';
        googleSearchTrendsScript.innerHTML = `var targetDiv = document.getElementById('search-trend-result'); trends.embed.renderExploreWidgetTo(targetDiv, "TIMESERIES", {"comparisonItem":[{"keyword":"` + tickerInput + `","geo":"","time":"today 3-m"}],"category":7,"property":""}, {"exploreQuery":"cat=7&date=today%203-m&q=BBBY&hl=en","guestPath":"https://trends.google.com:443/trends/embed/"}); `
        let bodyDiv = document.getElementById("iau9");
        bodyDiv.appendChild(googleSearchTrendsScript);
    }
}

const inputHandler = new InputHandler('#ticker-input');
inputHandler.init();
