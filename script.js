class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('historyDisplay');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.memory = 0;
        this.shouldResetDisplay = false;
        this.history = this.loadHistory();
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNumber(e.target.textContent));
        });

        // Operators
        document.getElementById('add').addEventListener('click', () => this.handleOperator('+'));
        document.getElementById('subtract').addEventListener('click', () => this.handleOperator('−'));
        document.getElementById('multiply').addEventListener('click', () => this.handleOperator('×'));
        document.getElementById('divide').addEventListener('click', () => this.handleOperator('÷'));
        document.getElementById('decimal').addEventListener('click', () => this.handleDecimal());
        document.getElementById('equals').addEventListener('click', () => this.handleEquals());

        // Functions
        document.getElementById('clear').addEventListener('click', () => this.clear());
        document.getElementById('delete').addEventListener('click', () => this.delete());
        document.getElementById('negate').addEventListener('click', () => this.negate());
        document.getElementById('percent').addEventListener('click', () => this.percent());
        document.getElementById('reciprocal').addEventListener('click', () => this.reciprocal());

        // Scientific functions
        document.getElementById('sqrt').addEventListener('click', () => this.scientificOperation('sqrt'));
        document.getElementById('power').addEventListener('click', () => this.scientificOperation('power'));
        document.getElementById('factorial').addEventListener('click', () => this.scientificOperation('factorial'));
        document.getElementById('pi').addEventListener('click', () => this.handleNumber(Math.PI.toString()));
        document.getElementById('sin').addEventListener('click', () => this.scientificOperation('sin'));
        document.getElementById('cos').addEventListener('click', () => this.scientificOperation('cos'));
        document.getElementById('tan').addEventListener('click', () => this.scientificOperation('tan'));
        document.getElementById('log').addEventListener('click', () => this.scientificOperation('log'));
        document.getElementById('ln').addEventListener('click', () => this.scientificOperation('ln'));
        document.getElementById('exp').addEventListener('click', () => this.scientificOperation('exp'));

        // Memory functions
        document.getElementById('mc').addEventListener('click', () => this.memoryClear());
        document.getElementById('mr').addEventListener('click', () => this.memoryRecall());
        document.getElementById('mplus').addEventListener('click', () => this.memoryAdd());
        document.getElementById('mminus').addEventListener('click', () => this.memorySubtract());

        // History
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Mode toggle
        document.getElementById('basicMode').addEventListener('click', () => this.switchMode('basic'));
        document.getElementById('scientificMode').addEventListener('click', () => this.switchMode('scientific'));

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentInput = num;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentInput === '0' && num !== '.') {
                this.currentInput = num;
            } else {
                this.currentInput += num;
            }
        }
        this.updateDisplay();
    }

    handleOperator(op) {
        if (this.operation !== null) {
            this.handleEquals();
        }
        this.previousInput = this.currentInput;
        this.operation = op;
        this.shouldResetDisplay = true;
        this.historyDisplay.textContent = `${this.previousInput} ${op}`;
    }

    handleDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    handleEquals() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '−':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = current !== 0 ? prev / current : 0;
                break;
            default:
                return;
        }

        const expression = `${this.previousInput} ${this.operation} ${this.currentInput}`;
        this.addToHistory(expression, result);
        
        this.currentInput = this.formatResult(result);
        this.operation = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;
        this.historyDisplay.textContent = '';
        this.updateDisplay();
    }

    scientificOperation(op) {
        let result;
        const num = parseFloat(this.currentInput);

        switch (op) {
            case 'sqrt':
                result = Math.sqrt(num);
                this.addToHistory(`√(${this.currentInput})`, result);
                break;
            case 'power':
                result = num * num;
                this.addToHistory(`${this.currentInput}²`, result);
                break;
            case 'factorial':
                result = this.factorial(Math.floor(num));
                this.addToHistory(`${Math.floor(num)}!`, result);
                break;
            case 'sin':
                result = Math.sin(this.degreesToRadians(num));
                this.addToHistory(`sin(${num}°)`, result);
                break;
            case 'cos':
                result = Math.cos(this.degreesToRadians(num));
                this.addToHistory(`cos(${num}°)`, result);
                break;
            case 'tan':
                result = Math.tan(this.degreesToRadians(num));
                this.addToHistory(`tan(${num}°)`, result);
                break;
            case 'log':
                result = num > 0 ? Math.log10(num) : 0;
                this.addToHistory(`log(${num})`, result);
                break;
            case 'ln':
                result = num > 0 ? Math.log(num) : 0;
                this.addToHistory(`ln(${num})`, result);
                break;
            case 'exp':
                result = Math.exp(num);
                this.addToHistory(`e^${num}`, result);
                break;
            default:
                return;
        }

        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.historyDisplay.textContent = '';
        this.updateDisplay();
    }

    delete() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    negate() {
        const num = parseFloat(this.currentInput);
        this.currentInput = this.formatResult(-num);
        this.updateDisplay();
    }

    percent() {
        let result;
        if (this.operation === null) {
            result = parseFloat(this.currentInput) / 100;
        } else {
            const current = parseFloat(this.currentInput);
            const previous = parseFloat(this.previousInput);
            result = (previous * current) / 100;
        }
        this.currentInput = this.formatResult(result);
        this.updateDisplay();
    }

    reciprocal() {
        const num = parseFloat(this.currentInput);
        if (num !== 0) {
            const result = 1 / num;
            this.addToHistory(`1/${this.currentInput}`, result);
            this.currentInput = this.formatResult(result);
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
    }

    factorial(n) {
        if (n < 0) return 0;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryDisplay();
    }

    memoryRecall() {
        this.currentInput = this.formatResult(this.memory);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentInput);
        this.updateMemoryDisplay();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentInput);
        this.updateMemoryDisplay();
    }

    updateMemoryDisplay() {
        if (this.memory !== 0) {
            this.historyDisplay.textContent = `M: ${this.formatResult(this.memory)}`;
        } else {
            this.historyDisplay.textContent = '';
        }
    }

    formatResult(num) {
        // Handle very small numbers
        if (Math.abs(num) < 1e-10) {
            return '0';
        }
        // Limit decimal places
        return Math.round(num * 10000000000) / 10000000000;
    }

    updateDisplay() {
        this.display.value = this.currentInput;
    }

    addToHistory(expression, result) {
        const historyEntry = `${expression} = ${this.formatResult(result)}`;
        this.history.unshift(historyEntry);
        
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            li.addEventListener('click', () => {
                const result = entry.split('=')[1].trim();
                this.currentInput = result;
                this.shouldResetDisplay = true;
                this.updateDisplay();
            });
            this.historyList.appendChild(li);
        });
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.handleNumber(e.key);
        } else if (e.key === '.') {
            this.handleDecimal();
        } else if (e.key === '+') {
            e.preventDefault();
            this.handleOperator('+');
        } else if (e.key === '-') {
            e.preventDefault();
            this.handleOperator('−');
        } else if (e.key === '*') {
            e.preventDefault();
            this.handleOperator('×');
        } else if (e.key === '/') {
            e.preventDefault();
            this.handleOperator('÷');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.handleEquals();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.delete();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.clear();
        }
    }

    switchMode(mode) {
        const buttons = document.querySelectorAll('.sci-btn');
        const basicBtn = document.getElementById('basicMode');
        const scientificBtn = document.getElementById('scientificMode');

        if (mode === 'basic') {
            buttons.forEach(btn => btn.style.display = 'none');
            basicBtn.classList.add('active');
            scientificBtn.classList.remove('active');
        } else {
            buttons.forEach(btn => btn.style.display = 'block');
            scientificBtn.classList.add('active');
            basicBtn.classList.remove('active');
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
