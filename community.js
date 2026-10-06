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

const creatorSearch = document.querySelector('[data-creator-search]');
const creatorGrid = document.querySelector('[data-creator-grid]');
const creatorEmpty = document.querySelector('[data-creator-empty]');
const collabGrid = document.querySelector('[data-collab-grid]');
const trendingList = document.querySelector('[data-trending-list]');

const creators = [
	{ name: 'Aanya Kapoor', platform: 'Instagram', followers: 24500, accent: '#7c9e8a' },
	{ name: 'Rohan Mehta', platform: 'YouTube', followers: 18200, accent: '#d4a5a5' },
	{ name: 'Sara Iyer', platform: 'Pinterest', followers: 9800, accent: '#b9c6a8' },
	{ name: 'Dev Sharma', platform: 'TikTok', followers: 41300, accent: '#c9a9c4' },
	{ name: 'Meera Nair', platform: 'Behance', followers: 6400, accent: '#e0b894' },
	{ name: 'Karan Singh', platform: 'YouTube', followers: 15700, accent: '#8fb3a6' },
	{ name: 'Priya Das', platform: 'Instagram', followers: 32100, accent: '#9aa8c9' },
	{ name: 'Aditya Rao', platform: 'Pinterest', followers: 5200, accent: '#d4a5a5' }
];

const collabs = [
	{ name: 'Sara Iyer', platform: 'Pinterest', tag: 'Photography', text: 'Looking for a foodie creator to shoot a cozy cafe series in Pune. Split the reels?' },
	{ name: 'Rohan Mehta', platform: 'YouTube', tag: 'Tech', text: 'Planning a “student setup tour” collab. Need 3 creators with different budgets — DM your desk!' },
	{ name: 'Dev Sharma', platform: 'TikTok', tag: 'Dance', text: 'Starting a campus dance trend. Want co-creators to make it go viral across colleges.' },
	{ name: 'Meera Nair', platform: 'Behance', tag: 'Design', text: 'Designing a free poster kit for student creators. Looking for an illustrator to team up.' },
	{ name: 'Priya Das', platform: 'Instagram', tag: 'Lifestyle', text: 'Hosting a “day in my life” swap week. Let\'s feature each other\'s routines!' }
];

const trending = [
	{ tag: '#StudentCreators', posts: '2.4K posts' },
	{ tag: '#ReelsThatTeach', posts: '1.8K posts' },
	{ tag: '#CampusCollab', posts: '1.2K posts' },
	{ tag: '#CreatorBudgeting', posts: '960 posts' },
	{ tag: '#GoldenHour', posts: '870 posts' },
	{ tag: '#FirstBrandDeal', posts: '540 posts' }
];

const followerFormatter = new Intl.NumberFormat('en-IN');

function initials(name) {
	const parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return '';
	}
	const value = parts.length === 1
		? parts[0].slice(0, 2)
		: parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
	return value.toUpperCase();
}

function formatFollowers(count) {
	if (count >= 1000) {
		return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K followers`;
	}
	return `${followerFormatter.format(count)} followers`;
}

function renderCreators(query = '') {
	const term = query.trim().toLowerCase();
	const filtered = creators.filter(
		(creator) =>
			creator.name.toLowerCase().includes(term) ||
			creator.platform.toLowerCase().includes(term)
	);

	if (filtered.length === 0) {
		creatorGrid.innerHTML = '';
		creatorEmpty.hidden = false;
		return;
	}

	creatorEmpty.hidden = true;
	creatorGrid.innerHTML = filtered
		.map(
			(creator) => `
				<article class="creator-card">
					<div class="creator-card__avatar" style="background:${creator.accent}">${initials(creator.name)}</div>
					<h3 class="creator-card__name">${creator.name}</h3>
					<span class="creator-card__platform">${creator.platform}</span>
					<span class="creator-card__followers">${formatFollowers(creator.followers)}</span>
					<button class="connect-button" type="button" data-connect>Connect</button>
				</article>
			`
		)
		.join('');
}

function renderCollabs() {
	collabGrid.innerHTML = collabs
		.map(
			(item, index) => `
				<article class="collab-card collab-card--tone-${index % 4}">
					<div class="collab-card__top">
						<span class="collab-card__avatar">${initials(item.name)}</span>
						<div>
							<span class="collab-card__name">${item.name}</span>
							<span class="collab-card__platform">${item.platform}</span>
						</div>
					</div>
					<p class="collab-card__text">${item.text}</p>
					<div class="collab-card__foot">
						<span class="collab-card__tag">${item.tag}</span>
						<button class="ghost-button" type="button">Join collab</button>
					</div>
				</article>
			`
		)
		.join('');
}

function renderTrending() {
	trendingList.innerHTML = trending
		.map(
			(item) => `
				<li class="trending-item">
					<span class="trending-item__tag">${item.tag}</span>
					<span class="trending-item__posts">${item.posts}</span>
				</li>
			`
		)
		.join('');
}

creatorGrid.addEventListener('click', (event) => {
	const button = event.target.closest('[data-connect]');
	if (!button) {
		return;
	}
	const connected = button.classList.toggle('is-connected');
	button.textContent = connected ? 'Connected ✓' : 'Connect';
});

if (creatorSearch) {
	creatorSearch.addEventListener('input', () => renderCreators(creatorSearch.value));
}

renderCreators();
renderCollabs();
renderTrending();
