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

// Change this to wherever your backend actually runs.
// While developing locally, this default (localhost:5000) matches
// the CreatorSetu backend's default PORT.
const API_BASE_URL = 'http://localhost:5000';

const authShell = document.querySelector('[data-auth-shell]');
const authCard = document.querySelector('[data-auth-card]');
const dashboard = document.querySelector('[data-dashboard]');
const barChart = document.querySelector('[data-bar-chart]');
const activityFeed = document.querySelector('[data-activity-feed]');
const modeButtons = document.querySelectorAll('[data-mode-button]');
const authForms = document.querySelectorAll('[data-form]');
const welcomeName = document.querySelector('[data-welcome-name]');
const profileInitials = document.querySelector('[data-profile-initials]');

const earningsData = [
	{ month: 'Jan', value: 36000 },
	{ month: 'Feb', value: 52000 },
	{ month: 'Mar', value: 44000 },
	{ month: 'Apr', value: 68000 },
	{ month: 'May', value: 58000 },
	{ month: 'Jun', value: 76000 }
];

const activityItems = [
	{ badge: 'Payment', time: '2h ago', title: 'Brand collab payout received', text: 'You earned ₹680 from the latest sponsored Reel campaign.' },
	{ badge: 'Growth', time: 'Yesterday', title: 'Audience milestone reached', text: 'Your creator community passed 24K followers across platforms.' },
	{ badge: 'Savings', time: '2d ago', title: 'Savings goal updated', text: 'You moved 5% closer to the monthly reserve target.' },
	{ badge: 'Impact', time: '3d ago', title: 'Donation allocated', text: 'A portion of this week\'s revenue was set aside for impact work.' }
];

function shortRupee(value) {
	if (value >= 1000) {
		const thousands = value / 1000;
		const rounded = Number.isInteger(thousands) ? thousands : Math.round(thousands * 10) / 10;
		return `₹${rounded}K`;
	}
	return `₹${value}`;
}

function buildEarningsChart(data) {
	const width = 620;
	const height = 320;
	const margin = { top: 34, right: 24, bottom: 44, left: 56 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;

	const maxValue = Math.max(...data.map((item) => item.value));
	const tickCount = 4;
	const step = Math.ceil(maxValue / tickCount / 10000) * 10000;
	const maxY = step * tickCount;
	const slotWidth = plotWidth / data.length;
	const barWidth = slotWidth * 0.46;
	const yFor = (value) => margin.top + plotHeight - (value / maxY) * plotHeight;
	const xCenter = (index) => margin.left + slotWidth * (index + 0.5);

	const gridLines = [];
	const axisLabels = [];
	for (let tick = 0; tick <= tickCount; tick += 1) {
		const value = step * tick;
		const y = yFor(value);
		gridLines.push(
			`<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" class="earnings-chart__grid" />`
		);
		axisLabels.push(
			`<text x="${margin.left - 12}" y="${y + 4}" class="earnings-chart__axis">${shortRupee(value)}</text>`
		);
	}

	const bars = data
		.map((item, index) => {
			const x = xCenter(index) - barWidth / 2;
			const y = yFor(item.value);
			const barHeight = margin.top + plotHeight - y;
			return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="10" class="earnings-chart__bar" />`;
		})
		.join('');

	const linePoints = data.map((item, index) => `${xCenter(index)},${yFor(item.value)}`).join(' ');
	const areaPoints = `${margin.left},${margin.top + plotHeight} ${linePoints} ${width - margin.right},${margin.top + plotHeight}`;

	const markers = data
		.map((item, index) => {
			const cx = xCenter(index);
			const cy = yFor(item.value);
			return `
				<circle cx="${cx}" cy="${cy}" r="5" class="earnings-chart__dot" />
				<text x="${cx}" y="${cy - 14}" class="earnings-chart__value">${shortRupee(item.value)}</text>
				<text x="${cx}" y="${height - margin.bottom + 24}" class="earnings-chart__label">${item.month}</text>
			`;
		})
		.join('');

	return `
		<svg class="earnings-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly earnings chart" preserveAspectRatio="xMidYMid meet">
			${gridLines.join('')}
			${axisLabels.join('')}
			<polygon points="${areaPoints}" class="earnings-chart__area" />
			${bars}
			<polyline points="${linePoints}" class="earnings-chart__line" />
			${markers}
		</svg>
	`;
}

function setMode(mode) {
	if (!authShell || !authCard) {
		return;
	}

	const normalizedMode = mode === 'signup' ? 'signup' : 'login';
	const isSignup = normalizedMode === 'signup';

	authShell.classList.toggle('is-signup', isSignup);
	authCard.dataset.mode = normalizedMode;

	authForms.forEach((form) => {
		const active = form.dataset.form === normalizedMode;
		form.classList.toggle('is-active', active);
		form.setAttribute('aria-hidden', String(!active));
	});

	modeButtons.forEach((button) => {
		const active = button.dataset.modeButton === normalizedMode;
		button.classList.toggle('is-active', active);
		button.setAttribute('aria-pressed', String(active));
	});

	document.title = `CreatorSetu | ${isSignup ? 'Sign Up' : 'Login'}`;
}

function renderDashboard() {
	if (!barChart || !activityFeed) {
		return;
	}

	barChart.innerHTML = buildEarningsChart(earningsData);

	activityFeed.innerHTML = activityItems
		.map(
			(item) => `
				<article class="activity-item">
					<div class="activity-item__top">
						<span>${item.title}</span>
						<span class="activity-item__badge">${item.badge}</span>
					</div>
					<p>${item.text}</p>
					<p>${item.time}</p>
				</article>
			`
		)
		.join('');
}

modeButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setMode(button.dataset.modeButton);
	});
});

function toTitleCase(value) {
	return value
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

function getInitials(name) {
	const parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return '';
	}
	const initials = parts.length === 1
		? parts[0].slice(0, 2)
		: parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
	return initials.toUpperCase();
}

function resolveName(form) {
	if (!form) {
		return '';
	}

	const nameInput = form.querySelector('input[name="signupName"]');
	if (nameInput && nameInput.value.trim()) {
		return toTitleCase(nameInput.value.trim());
	}

	const emailInput = form.querySelector('input[type="email"]');
	if (emailInput && emailInput.value.trim()) {
		const localPart = emailInput.value.trim().split('@')[0].replace(/[._-]+/g, ' ');
		return toTitleCase(localPart);
	}

	return '';
}

function applyUserName(name) {
	if (!name) {
		return;
	}

	if (welcomeName) {
		welcomeName.textContent = name;
	}

	if (profileInitials) {
		const initials = getInitials(name);
		if (initials) {
			profileInitials.textContent = initials;
		}
	}
}

function showPostLogin(form, realName) {
	if (!authShell || !dashboard) {
		return;
	}

	// Prefer the real name the backend sent back; fall back to guessing
	// from the form only if that's ever missing.
	applyUserName(realName || resolveName(form));

	authShell.hidden = false;
	authShell.classList.add('is-post-login');
	dashboard.hidden = false;
	dashboard.classList.add('is-visible');
	document.title = 'CreatorSetu | Dashboard';
	renderDashboard();
}

// Shows/hides the little red error message inside a given form
function setFormError(form, message) {
	const errorEl = form.querySelector('[data-auth-error]');
	if (!errorEl) return;
	if (message) {
		errorEl.textContent = message;
		errorEl.hidden = false;
	} else {
		errorEl.hidden = true;
	}
}

// Disables the submit button and changes its text while a request is in flight,
// so the user can't double-click and send two requests by accident.
function setFormLoading(form, isLoading, loadingText, normalText) {
	const btn = form.querySelector('[data-submit-button]');
	if (!btn) return;
	btn.disabled = isLoading;
	btn.textContent = isLoading ? loadingText : normalText;
}

async function handleLoginSubmit(form) {
	setFormError(form, null);
	const email = form.querySelector('input[name="loginEmail"]').value.trim();
	const password = form.querySelector('input[name="loginPassword"]').value;

	if (!email || !password) {
		setFormError(form, 'Please enter both your email and password.');
		return;
	}

	setFormLoading(form, true, 'Logging in…', 'Login');
	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		const data = await response.json();

		if (!response.ok) {
			// The backend sends back { error: "..." } when something's wrong
			setFormError(form, data.error || 'Something went wrong. Please try again.');
			return;
		}

		// Success! Save the token so future requests can prove who we are.
		localStorage.setItem('creatorsetu_token', data.token);
		localStorage.setItem('creatorsetu_user', JSON.stringify(data.user));
		showPostLogin(form, data.user.name);
	} catch (err) {
		// This usually means the backend server isn't running at all
		setFormError(form, 'Could not reach the server. Is the backend running?');
	} finally {
		setFormLoading(form, false, 'Logging in…', 'Login');
	}
}

async function handleSignupSubmit(form) {
	setFormError(form, null);
	const name = form.querySelector('input[name="signupName"]').value.trim();
	const email = form.querySelector('input[name="signupEmail"]').value.trim();
	const password = form.querySelector('input[name="signupPassword"]').value;
	const platform = form.querySelector('select[name="platform"]').value;

	if (!name || !email || !password) {
		setFormError(form, 'Please fill in your name, email, and password.');
		return;
	}
	if (password.length < 6) {
		setFormError(form, 'Password must be at least 6 characters.');
		return;
	}

	setFormLoading(form, true, 'Creating account…', 'Create Account');
	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password, platform }),
		});
		const data = await response.json();

		if (!response.ok) {
			setFormError(form, data.error || 'Something went wrong. Please try again.');
			return;
		}

		localStorage.setItem('creatorsetu_token', data.token);
		localStorage.setItem('creatorsetu_user', JSON.stringify(data.user));
		showPostLogin(form, data.user.name);
	} catch (err) {
		setFormError(form, 'Could not reach the server. Is the backend running?');
	} finally {
		setFormLoading(form, false, 'Creating account…', 'Create Account');
	}
}

authForms.forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (form.dataset.form === 'signup') {
			handleSignupSubmit(form);
		} else {
			handleLoginSubmit(form);
		}
	});
});

setMode('login');
