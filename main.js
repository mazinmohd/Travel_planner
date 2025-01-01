// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Destination Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const destinationCards = document.querySelectorAll('.destination-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            destinationCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Budget Tracker
    const budgetTracker = {
        budget: 0,
        expenses: [],

        init() {
            const budgetInput = document.querySelector('.budget-tracker input');
            const addExpenseBtn = document.querySelector('.budget-tracker .btn');
            
            if (budgetInput) {
                budgetInput.addEventListener('change', (e) => {
                    this.budget = parseFloat(e.target.value);
                    this.updateBudgetDisplay();
                });
            }

            if (addExpenseBtn) {
                addExpenseBtn.addEventListener('click', () => this.addExpenseForm());
            }
        },

        addExpenseForm() {
            const expenseForm = `
                <div class="expense-item fade-in">
                    <input type="text" class="input" placeholder="Expense description">
                    <input type="number" class="input mt-4" placeholder="Amount">
                    <button class="btn btn-primary mt-4" onclick="budgetTracker.saveExpense(this)">Save</button>
                </div>
            `;

            const container = document.querySelector('.budget-tracker');
            container.insertAdjacentHTML('beforeend', expenseForm);
        },

        saveExpense(btn) {
            const expenseItem = btn.parentElement;
            const description = expenseItem.querySelector('input[type="text"]').value;
            const amount = parseFloat(expenseItem.querySelector('input[type="number"]').value);

            if (description && amount) {
                this.expenses.push({ description, amount });
                this.updateBudgetDisplay();
                expenseItem.remove();
            }
        },

        updateBudgetDisplay() {
            const totalExpenses = this.expenses.reduce((total, exp) => total + exp.amount, 0);
            const remaining = this.budget - totalExpenses;

            const budgetDisplay = document.createElement('div');
            budgetDisplay.className = 'budget-display mt-4';
            budgetDisplay.innerHTML = `
                <h3>Budget Overview</h3>
                <p>Total Budget: $${this.budget}</p>
                <p>Total Expenses: $${totalExpenses}</p>
                <p>Remaining: $${remaining}</p>
            `;

            const existingDisplay = document.querySelector('.budget-display');
            if (existingDisplay) {
                existingDisplay.remove();
            }
            document.querySelector('.budget-tracker').appendChild(budgetDisplay);
        }
    };

    // Initialize Budget Tracker
    budgetTracker.init();

    // Itinerary Builder
    const itineraryBuilder = {
        days: [],

        init() {
            const addDayBtn = document.querySelector('#itinerary .btn');
            if (addDayBtn) {
                addDayBtn.addEventListener('click', () => this.addDay());
            }
        },

        addDay() {
            const dayNumber = this.days.length + 1;
            const dayTemplate = `
                <div class="day-item fade-in" draggable="true">
                    <h3>Day ${dayNumber}</h3>
                    <div class="activities">
                        <input type="text" class="input" placeholder="Add activity">
                        <button class="btn btn-primary mt-4" onclick="itineraryBuilder.addActivity(this)">Add Activity</button>
                    </div>
                </div>
            `;

            const timeline = document.querySelector('.timeline');
            timeline.insertAdjacentHTML('beforeend', dayTemplate);
            this.days.push([]);
            this.initDragAndDrop();
        },

        addActivity(btn) {
            const dayItem = btn.closest('.day-item');
            const input = dayItem.querySelector('input');
            const activity = input.value.trim();

            if (activity) {
                const activityElement = `
                    <div class="activity fade-in">
                        <span>${activity}</span>
                        <button onclick="this.parentElement.remove()">×</button>
                    </div>
                `;
                dayItem.querySelector('.activities').insertAdjacentHTML('beforeend', activityElement);
                input.value = '';
            }
        },

        initDragAndDrop() {
            const dayItems = document.querySelectorAll('.day-item');
            dayItems.forEach(item => {
                item.addEventListener('dragstart', () => item.classList.add('dragging'));
                item.addEventListener('dragend', () => item.classList.remove('dragging'));
            });

            const timeline = document.querySelector('.timeline');
            timeline.addEventListener('dragover', e => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                const afterElement = this.getDragAfterElement(timeline, e.clientY);
                
                if (afterElement) {
                    timeline.insertBefore(draggable, afterElement);
                } else {
                    timeline.appendChild(draggable);
                }
            });
        },

        getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.day-item:not(.dragging)')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    };

    // Initialize Itinerary Builder
    itineraryBuilder.init();

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
