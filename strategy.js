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

const strategyForm = document.querySelector('[data-strategy-form]');
const strategyInputs = document.querySelectorAll('[data-strategy-input]');
const postsRange = document.querySelector('[data-posts-range]');
const postsValueEl = document.querySelector('[data-posts-value]');
const suggestionGrid = document.querySelector('[data-suggestion-grid]');
const advisorContext = document.querySelector('[data-advisor-context]');
const bestContentEl = document.querySelector('[data-best-content]');
const postsPaceEl = document.querySelector('[data-posts-pace]');

const PLATFORM_TIPS = {
	Instagram: [
		{ emoji: '🎬', title: 'Hook in 1.5 seconds', desc: 'Open Reels with motion or a bold question so viewers stop scrolling before they think about it.' },
		{ emoji: '🗂️', title: 'Save-worthy carousels', desc: 'Turn your best advice into a 6-slide carousel. Saves and shares signal value to the algorithm.' },
		{ emoji: '💬', title: 'Reply with a Reel', desc: 'Answer a top comment as a video. It feels personal and quietly doubles your content.' }
	],
	YouTube: [
		{ emoji: '🔍', title: 'Title for search', desc: 'Lead with the exact phrase people type. Curiosity gaps work, but clarity gets the click.' },
		{ emoji: '⏱️', title: 'First 30 seconds', desc: 'Show the payoff early, then deliver. Retention in the opening shapes your whole reach.' },
		{ emoji: '🧩', title: 'Series over one-offs', desc: 'Group videos into a playlist series so one view turns into a binge.' }
	],
	Pinterest: [
		{ emoji: '📌', title: 'Fresh pins weekly', desc: 'New pins to old content keep you in the feed. Repurpose, restyle, repin.' },
		{ emoji: '🎨', title: 'Vertical & text-on-image', desc: '2:3 pins with a readable headline outperform plain photos every time.' },
		{ emoji: '🔑', title: 'Keyword your boards', desc: 'Treat board titles and descriptions like SEO — Pinterest is a search engine.' }
	],
	TikTok: [
		{ emoji: '🔥', title: 'Ride a trend, your way', desc: 'Use a trending sound but tie it to your niche. Familiar + fresh = discoverable.' },
		{ emoji: '🔁', title: 'Loopable endings', desc: 'End where you began so the video replays seamlessly and watch time climbs.' },
		{ emoji: '✍️', title: 'On-screen captions', desc: 'Most watch on mute. Bold captions keep silent viewers engaged.' }
	],
	Behance: [
		{ emoji: '🖼️', title: 'Lead with the hero shot', desc: 'Your cover decides the click. Make the first image your single strongest frame.' },
		{ emoji: '🧵', title: 'Show the process', desc: 'Sketches, iterations, and breakdowns build trust and keep people scrolling your case study.' },
		{ emoji: '🏷️', title: 'Tag with intent', desc: 'Specific tools and styles in tags help the right studios and clients find you.' }
	]
};

const CONTENT_TIPS = {
	'Reels & Shorts': { emoji: '⚡', title: 'Batch your shorts', desc: 'Film 5 in one sitting with the same setup. Consistency without burnout.' },
	'Long-form video': { emoji: '📝', title: 'Script the spine', desc: 'Outline beats before filming so your edit is faster and tighter.' },
	Carousels: { emoji: '➡️', title: 'One idea per slide', desc: 'Make each slide a single, swipe-worthy thought with a clear last-slide CTA.' },
	Photos: { emoji: '🌤️', title: 'Shoot in golden hour', desc: 'Soft natural light instantly lifts your photo quality with zero editing.' },
	'Blogs & Articles': { emoji: '📚', title: 'Answer one question', desc: 'Pick a real question your audience asks and own the most useful answer.' },
	'Live streams': { emoji: '🎙️', title: 'Announce, then go live', desc: 'A 24-hour heads-up post can triple your live viewers.' }
};

const CADENCE_TIPS = {
	low: { emoji: '🌱', title: 'Quality over quantity', desc: 'At a gentle pace, make each post count — go deeper, polish more, repurpose widely.' },
	mid: { emoji: '📅', title: 'Build a rhythm', desc: 'A steady, predictable schedule trains both the algorithm and your audience to expect you.' },
	high: { emoji: '🚀', title: 'Protect your energy', desc: 'Posting often? Template your formats and batch-create so volume never costs you quality.' }
};

const seedBestContent = [
	{ label: 'Top Reel', value: '“5 budgeting hacks”', meta: '48K views' },
	{ label: 'Best Carousel', value: '“Creator tax 101”', meta: '3.2K saves' },
	{ label: 'Most shared', value: '“My setup tour”', meta: '1.1K shares' },
	{ label: 'Top comment driver', value: '“Ask me anything”', meta: '420 comments' }
];

function cadenceBucket(posts) {
	if (posts <= 2) {
		return 'low';
	}
	if (posts <= 5) {
		return 'mid';
	}
	return 'high';
}

function renderSuggestions() {
	const platform = strategyForm.querySelector('[name="platform"]').value;
	const contentType = strategyForm.querySelector('[name="contentType"]').value;
	const posts = Number(postsRange.value);

	advisorContext.textContent = `${platform} • ${contentType} • ${posts} ${posts === 1 ? 'post' : 'posts'}/week`;

	const cards = [];
	const platformTips = PLATFORM_TIPS[platform] || [];
	platformTips.forEach((tip) => cards.push(tip));

	const contentTip = CONTENT_TIPS[contentType];
	if (contentTip) {
		cards.push(contentTip);
	}

	cards.push(CADENCE_TIPS[cadenceBucket(posts)]);

	suggestionGrid.innerHTML = cards
		.map(
			(tip, index) => `
				<article class="idea-card idea-card--tone-${index % 4}">
					<span class="idea-card__emoji">${tip.emoji}</span>
					<h3 class="idea-card__title">${tip.title}</h3>
					<p class="idea-card__desc">${tip.desc}</p>
				</article>
			`
		)
		.join('');
}

function renderBestContent() {
	bestContentEl.innerHTML = seedBestContent
		.map(
			(item) => `
				<div class="stat-chip">
					<span class="stat-chip__label">${item.label}</span>
					<strong class="stat-chip__value">${item.value}</strong>
					<span class="stat-chip__meta">${item.meta}</span>
				</div>
			`
		)
		.join('');
}

strategyInputs.forEach((input) => {
	if (input === postsRange) return;
	input.addEventListener('input', renderSuggestions);
	input.addEventListener('change', renderSuggestions);
});

function getPaceLabel(count) {
	if (count <= 2) return 'Light & easy';
	if (count <= 4) return 'Steady pace';
	if (count <= 6) return 'High output';
	return 'Daily grind';
}

function syncSlider() {
	const val = Number(postsRange.value);
	postsValueEl.textContent = val;
	if (postsPaceEl) postsPaceEl.textContent = getPaceLabel(val);
	const pct = ((val - 1) / 6) * 100;
	postsRange.style.setProperty('--fill', pct + '%');
	renderSuggestions();
}

postsRange.addEventListener('input', syncSlider);
syncSlider();

strategyForm.addEventListener('submit', (event) => {
	event.preventDefault();
	renderSuggestions();
});

renderSuggestions();
renderBestContent();
