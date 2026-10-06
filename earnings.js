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

const earningForm = document.querySelector('[data-earning-form]');
const earningsGrid = document.querySelector('[data-earnings-grid]');
const emptyState = document.querySelector('[data-empty-state]');
const pieChart = document.querySelector('[data-pie-chart]');
const pieLegend = document.querySelector('[data-pie-legend]');
const totalEarningsEl = document.querySelector('[data-total-earnings]');
const totalCountEl = document.querySelector('[data-total-count]');
const topPlatformEl = document.querySelector('[data-top-platform]');
const topPlatformAmountEl = document.querySelector('[data-top-platform-amount]');
const latestAmountEl = document.querySelector('[data-latest-amount]');
const latestMetaEl = document.querySelector('[data-latest-meta]');

const STORAGE_KEY = 'creatorsetu.earnings';

const PIE_COLORS = [
	'#7c9e8a',
	'#d4a5a5',
	'#b9c6a8',
	'#c9a9c4',
	'#8fb3a6',
	'#e0b894',
	'#9aa8c9'
];

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

const seedEarnings = [
	{ id: 'seed-1', platform: 'Instagram', amount: 6800, date: '2026-06-12', category: 'Sponsorship' },
	{ id: 'seed-2', platform: 'YouTube', amount: 4200, date: '2026-06-05', category: 'Ad Revenue' },
	{ id: 'seed-3', platform: 'Pinterest', amount: 2600, date: '2026-05-28', category: 'Affiliate' }
];

function loadEarnings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [...seedEarnings];
		}
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [...seedEarnings];
	} catch (error) {
		return [...seedEarnings];
	}
}

function saveEarnings(earnings) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(earnings));
	} catch (error) {
		/* storage unavailable; keep in-memory only */
	}
}

let earnings = loadEarnings();

function formatDate(value) {
	const parsed = new Date(`${value}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) {
		return value;
	}
	return dateFormatter.format(parsed);
}

function sortedByDate(list) {
	return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderSummary(sorted) {
	const total = earnings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
	totalEarningsEl.textContent = rupeeFormatter.format(total);
	totalCountEl.textContent = earnings.length === 0
		? 'No earnings logged yet'
		: `Across ${earnings.length} ${earnings.length === 1 ? 'entry' : 'entries'}`;

	const byPlatform = {};
	earnings.forEach((item) => {
		byPlatform[item.platform] = (byPlatform[item.platform] || 0) + Number(item.amount || 0);
	});
	const topEntry = Object.entries(byPlatform).sort((a, b) => b[1] - a[1])[0];
	if (topEntry) {
		topPlatformEl.textContent = topEntry[0];
		topPlatformAmountEl.textContent = `${rupeeFormatter.format(topEntry[1])} earned`;
	} else {
		topPlatformEl.textContent = '—';
		topPlatformAmountEl.textContent = 'Add an entry to see your leader';
	}

	const latest = sorted[0];
	if (latest) {
		latestAmountEl.textContent = rupeeFormatter.format(Number(latest.amount || 0));
		latestMetaEl.textContent = `${latest.platform} • ${formatDate(latest.date)}`;
	} else {
		latestAmountEl.textContent = '—';
		latestMetaEl.textContent = 'Your most recent payout shows here';
	}
}

function renderPie() {
	const byPlatform = {};
	earnings.forEach((item) => {
		byPlatform[item.platform] = (byPlatform[item.platform] || 0) + Number(item.amount || 0);
	});

	const entries = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);
	const total = entries.reduce((sum, entry) => sum + entry[1], 0);

	if (total === 0) {
		pieChart.style.background = 'conic-gradient(rgba(124, 158, 138, 0.15) 0 100%)';
		pieChart.dataset.empty = 'true';
		pieLegend.innerHTML = '<li class="pie-legend__empty">No data to chart yet.</li>';
		return;
	}

	pieChart.dataset.empty = 'false';

	let cursor = 0;
	const segments = [];
	const legendItems = [];

	entries.forEach(([platform, amount], index) => {
		const color = PIE_COLORS[index % PIE_COLORS.length];
		const start = (cursor / total) * 100;
		cursor += amount;
		const end = (cursor / total) * 100;
		segments.push(`${color} ${start}% ${end}%`);

		const pct = Math.round((amount / total) * 100);
		legendItems.push(`
			<li class="pie-legend__item">
				<span class="pie-legend__dot" style="background:${color}"></span>
				<span class="pie-legend__label">${platform}</span>
				<span class="pie-legend__value">${rupeeFormatter.format(amount)} · ${pct}%</span>
			</li>
		`);
	});

	pieChart.style.background = `conic-gradient(${segments.join(', ')})`;
	pieLegend.innerHTML = legendItems.join('');
}

function renderGrid(sorted) {
	if (sorted.length === 0) {
		earningsGrid.innerHTML = '';
		emptyState.hidden = false;
		return;
	}

	emptyState.hidden = true;
	earningsGrid.innerHTML = sorted
		.map(
			(item) => `
				<article class="earning-card">
					<div class="earning-card__top">
						<span class="earning-card__platform">${item.platform}</span>
						<button class="earning-card__remove" type="button" data-remove="${item.id}" aria-label="Remove earning">&times;</button>
					</div>
					<strong class="earning-card__amount">${rupeeFormatter.format(Number(item.amount || 0))}</strong>
					<div class="earning-card__meta">
						<span class="earning-card__badge">${item.category}</span>
						<span class="earning-card__date">${formatDate(item.date)}</span>
					</div>
				</article>
			`
		)
		.join('');
}

function render() {
	const sorted = sortedByDate(earnings);
	renderSummary(sorted);
	renderPie();
	renderGrid(sorted);
}

earningForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(earningForm);
	const platform = String(formData.get('platform') || '').trim();
	const amount = Number(formData.get('amount'));
	const date = String(formData.get('date') || '');
	const category = String(formData.get('category') || '');

	if (!platform || !date || !category || Number.isNaN(amount) || amount <= 0) {
		return;
	}

	earnings.push({
		id: `e-${Date.now()}`,
		platform,
		amount,
		date,
		category
	});

	saveEarnings(earnings);
	earningForm.reset();
	render();
});

earningsGrid.addEventListener('click', (event) => {
	const button = event.target.closest('[data-remove]');
	if (!button) {
		return;
	}
	const id = button.dataset.remove;
	earnings = earnings.filter((item) => item.id !== id);
	saveEarnings(earnings);
	render();
});

const dateInput = earningForm.querySelector('input[name="date"]');
if (dateInput) {
	dateInput.value = new Date().toISOString().slice(0, 10);
}

render();
