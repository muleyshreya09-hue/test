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

(function () {
	'use strict';

	/* ── Sample data ── */
	const loanRequests = [
		{ id: 1, name: 'Priya Sharma', amount: 3000, purpose: 'Equipment upgrade', description: 'Need a ring light and tripod for better video quality.', timeline: '1 month', riskScore: 'low', avatar: 'PS' },
		{ id: 2, name: 'Rohan Mehta', amount: 1500, purpose: 'Software subscription', description: 'Annual Canva Pro for carousel designs.', timeline: '2 weeks', riskScore: 'low', avatar: 'RM' },
		{ id: 3, name: 'Ananya Das', amount: 5000, purpose: 'Course or workshop', description: 'Advanced video editing masterclass to level up content.', timeline: '2 months', riskScore: 'medium', avatar: 'AD' },
		{ id: 4, name: 'Kabir Singh', amount: 2000, purpose: 'Marketing & ads', description: 'Instagram ad campaign for new merch launch.', timeline: '1 month', riskScore: 'medium', avatar: 'KS' },
		{ id: 5, name: 'Meera Joshi', amount: 8000, purpose: 'Content production', description: 'Travel to shoot a location-based vlog series.', timeline: '3 months', riskScore: 'high', avatar: 'MJ' },
		{ id: 6, name: 'Arjun Patel', amount: 1200, purpose: 'Emergency fund', description: 'Laptop charger broke unexpectedly before a deadline.', timeline: '2 weeks', riskScore: 'low', avatar: 'AP' },
	];

	const myLoans = [
		{ borrower: 'Priya Sharma', amount: 2000, repaid: 1400, total: 2000, status: 'On track' },
		{ borrower: 'Rohan Mehta', amount: 1500, repaid: 1500, total: 1500, status: 'Completed' },
		{ borrower: 'Ananya Das', amount: 1000, repaid: 300, total: 1000, status: 'In progress' },
	];

	const riskColors = { low: '#7c9e8a', medium: '#d4a855', high: '#c97a7a' };
	const riskLabels = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

	/* ── Toggle ── */
	const toggleBtns = document.querySelectorAll('[data-kredit-mode]');
	const panels = document.querySelectorAll('[data-kredit-panel]');

	toggleBtns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var mode = btn.dataset.kreditMode;
			toggleBtns.forEach(function (b) {
				b.classList.toggle('is-active', b === btn);
				b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
			});
			panels.forEach(function (p) {
				p.classList.toggle('kredit-panel--hidden', p.dataset.kreditPanel !== mode);
			});
		});
	});

	/* ── Render loan request cards ── */
	var requestGrid = document.querySelector('[data-loan-requests]');

	function renderRequests() {
		requestGrid.innerHTML = loanRequests.map(function (req) {
			return '<article class="kredit-card">' +
				'<div class="kredit-card__top">' +
					'<div class="kredit-card__avatar" style="background:' + riskColors[req.riskScore] + '">' + req.avatar + '</div>' +
					'<div class="kredit-card__info">' +
						'<h3 class="kredit-card__name">' + req.name + '</h3>' +
						'<span class="kredit-card__purpose">' + req.purpose + '</span>' +
					'</div>' +
				'</div>' +
				'<p class="kredit-card__desc">' + req.description + '</p>' +
				'<div class="kredit-card__meta">' +
					'<div class="kredit-card__amount">' +
						'<span class="kredit-card__amount-label">Amount</span>' +
						'<strong>' + formatCurrency(req.amount) + '</strong>' +
					'</div>' +
					'<div class="kredit-card__timeline">' +
						'<span class="kredit-card__amount-label">Repay in</span>' +
						'<strong>' + req.timeline + '</strong>' +
					'</div>' +
				'</div>' +
				'<div class="kredit-card__foot">' +
					'<span class="kredit-risk-badge" style="background:' + riskColors[req.riskScore] + '20;color:' + riskColors[req.riskScore] + ';border:1px solid ' + riskColors[req.riskScore] + '30">' + riskLabels[req.riskScore] + '</span>' +
					'<button class="primary-button kredit-lend-btn" data-lend-id="' + req.id + '">Lend</button>' +
				'</div>' +
			'</article>';
		}).join('');

		requestGrid.querySelectorAll('[data-lend-id]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				btn.textContent = 'Lent!';
				btn.disabled = true;
				btn.classList.add('kredit-lend-btn--done');
			});
		});
	}

	renderRequests();

	/* ── Borrow form ── */
	var borrowForm = document.querySelector('[data-borrow-form]');
	if (borrowForm) {
		borrowForm.addEventListener('submit', function (e) {
			e.preventDefault();
			var fd = new FormData(borrowForm);
			var amount = fd.get('amount');
			var purpose = fd.get('purpose');
			var timeline = fd.get('timeline');

			if (!amount || !purpose || !timeline) return;

			var newReq = {
				id: Date.now(),
				name: 'You',
				amount: parseInt(amount, 10),
				purpose: purpose,
				description: fd.get('description') || '',
				timeline: timeline,
				riskScore: 'low',
				avatar: 'YO',
			};
			loanRequests.unshift(newReq);
			renderRequests();

			borrowForm.reset();

			toggleBtns.forEach(function (b) {
				b.classList.toggle('is-active', b.dataset.kreditMode === 'lend');
				b.setAttribute('aria-pressed', b.dataset.kreditMode === 'lend' ? 'true' : 'false');
			});
			panels.forEach(function (p) {
				p.classList.toggle('kredit-panel--hidden', p.dataset.kreditPanel !== 'lend');
			});
		});
	}

	/* ── My Kredit loans list ── */
	var loansContainer = document.querySelector('[data-kredit-loans]');

	function renderLoans() {
		loansContainer.innerHTML = myLoans.map(function (loan) {
			var pct = Math.round((loan.repaid / loan.total) * 100);
			var barColor = pct === 100 ? '#7c9e8a' : (pct > 50 ? '#7c9e8a' : '#d4a855');
			return '<div class="kredit-loan-row">' +
				'<div class="kredit-loan-row__info">' +
					'<strong>' + loan.borrower + '</strong>' +
					'<span>' + formatCurrency(loan.repaid) + ' of ' + formatCurrency(loan.total) + ' repaid</span>' +
				'</div>' +
				'<div class="kredit-loan-row__bar-wrap">' +
					'<div class="progress-bar"><span style="width:' + pct + '%;background:' + barColor + '"></span></div>' +
					'<div class="kredit-loan-row__status">' +
						'<span class="kredit-loan-status-badge kredit-loan-status-badge--' + (pct === 100 ? 'done' : 'active') + '">' + loan.status + '</span>' +
						'<span class="kredit-loan-pct">' + pct + '%</span>' +
					'</div>' +
				'</div>' +
			'</div>';
		}).join('');
	}

	renderLoans();

	/* ── Helpers ── */
	function formatCurrency(n) {
		return '\u20B9' + Number(n).toLocaleString('en-IN');
	}
})();
