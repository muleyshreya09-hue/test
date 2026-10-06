// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
	const mobileMenuToggles = document.querySelectorAll('[data-mobile-menu-toggle]');
	const mobileNavMenus = document.querySelectorAll('[data-mobile-nav-menu]');
	
	mobileMenuToggles.forEach((toggle, index) => {
		toggle.addEventListener('click', () => {
			const menu = mobileNavMenus[index];
			toggle.classList.toggle('is-active');
			menu.classList.toggle('is-active');
			toggle.setAttribute('aria-expanded', toggle.classList.contains('is-active') ? 'true' : 'false');
		});
	});
	
	// Close mobile menu when a link is clicked
	mobileNavMenus.forEach((menu) => {
		const links = menu.querySelectorAll('a');
		links.forEach((link) => {
			link.addEventListener('click', () => {
				const correspondingToggle = document.querySelector('[data-mobile-menu-toggle]');
				if (correspondingToggle && correspondingToggle.classList.contains('is-active')) {
					correspondingToggle.classList.remove('is-active');
					menu.classList.remove('is-active');
					correspondingToggle.setAttribute('aria-expanded', 'false');
				}
			});
		});
	});
});

const budgetForm = document.querySelector('[data-budget-form]');
const budgetInputs = document.querySelectorAll('[data-budget-input]');
const summaryIncomeEl = document.querySelector('[data-summary-income]');
const summaryExpensesEl = document.querySelector('[data-summary-expenses]');
const summarySavingsEl = document.querySelector('[data-summary-savings]');
const savingsRateEl = document.querySelector('[data-savings-rate]');
const savingsBarEl = document.querySelector('[data-savings-bar]');
const categoryBarsEl = document.querySelector('[data-category-bars]');
const aiTipEl = document.querySelector('[data-ai-tip]');

const EXPENSE_FIELDS = ['Hostel', 'Food', 'Travel', 'College Fees', 'Other'];

const CATEGORY_COLORS = {
	Hostel: '#7c9e8a',
	Food: '#d4a5a5',
	Travel: '#b9c6a8',
	'College Fees': '#c9a9c4',
	Other: '#e0b894'
};

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 0
});

function readValue(name) {
	const input = budgetForm.querySelector(`[name="${name}"]`);
	if (!input) {
		return 0;
	}
	const value = Number(input.value);
	return Number.isNaN(value) || value < 0 ? 0 : value;
}

function buildTip(income, expenses, savings, categories) {
	if (income <= 0) {
		return 'Add your monthly income to unlock a tailored savings suggestion.';
	}

	if (savings < 0) {
		const gap = rupeeFormatter.format(Math.abs(savings));
		return `You're overspending by ${gap} this month. Trimming your largest category a little can bring you back to balance.`;
	}

	const savingsRate = (savings / income) * 100;
	const topCategory = [...categories].sort((a, b) => b.amount - a.amount)[0];
	const topShare = expenses > 0 && topCategory ? Math.round((topCategory.amount / expenses) * 100) : 0;

	if (savingsRate < 10) {
		return `Your savings rate is ${Math.round(savingsRate)}%. Aim for at least 20% — ${topCategory ? `${topCategory.name} is your biggest expense (${topShare}% of spending), a good place to start.` : 'review your top expenses for quick wins.'}`;
	}

	if (savingsRate < 20) {
		return `Nice start — you're saving ${Math.round(savingsRate)}% of your income. Pushing past 20% builds a comfortable buffer. ${topCategory ? `${topCategory.name} takes ${topShare}% of your spending.` : ''}`.trim();
	}

	return `Great work! You're saving ${Math.round(savingsRate)}% of your income. Consider moving part of your ${rupeeFormatter.format(savings)} savings into an emergency fund or a small investment.`;
}

function render() {
	const income = readValue('income');
	const categories = EXPENSE_FIELDS.map((name) => ({ name, amount: readValue(name) }));
	const expenses = categories.reduce((sum, item) => sum + item.amount, 0);
	const savings = income - expenses;

	summaryIncomeEl.textContent = rupeeFormatter.format(income);
	summaryExpensesEl.textContent = rupeeFormatter.format(expenses);
	summarySavingsEl.textContent = rupeeFormatter.format(savings);

	const savingsRate = income > 0 ? Math.max(0, Math.round((savings / income) * 100)) : 0;
	savingsRateEl.textContent = `${savingsRate}%`;
	savingsBarEl.style.width = `${Math.min(100, savingsRate)}%`;

	categoryBarsEl.innerHTML = categories
		.map((item) => {
			const share = expenses > 0 ? Math.round((item.amount / expenses) * 100) : 0;
			const color = CATEGORY_COLORS[item.name] || '#7c9e8a';
			return `
				<div class="category-row">
					<div class="category-row__head">
						<span class="category-row__name">${item.name}</span>
						<span class="category-row__value">${rupeeFormatter.format(item.amount)} · ${share}%</span>
					</div>
					<div class="progress-bar">
						<span style="width:${Math.min(100, share)}%; background:${color}"></span>
					</div>
				</div>
			`;
		})
		.join('');

	aiTipEl.textContent = buildTip(income, expenses, savings, categories);
}

budgetInputs.forEach((input) => {
	input.addEventListener('input', render);
});

render();
