export function safeUrl(value) {
  if (typeof value !== 'string') return null;
  try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
export function verifiedProjects(projects) {
  return projects.filter(p => p.openSourceVerified === true && p.license?.verified === true && safeUrl(p.repositoryUrl) && safeUrl(p.license.url));
}
export function filterProjects(projects, state, bookmarks) {
  const q = state.query.trim().toLocaleLowerCase();
  const results = verifiedProjects(projects).filter(p =>
    (state.category === 'all' || p.category === state.category) &&
    (!state.saved || bookmarks.has(p.id)) &&
    (!q || [p.name, p.summary, p.category, ...(p.tags || [])].join(' ').toLocaleLowerCase().includes(q))
  );
  if (state.sort === 'stars') results.sort((a,b) => (b.popularity?.githubStars ?? -1) - (a.popularity?.githubStars ?? -1));
  if (state.sort === 'name') results.sort((a,b) => a.name.localeCompare(b.name, 'en'));
  return results;
}
export function starsText(project) {
  return Number.isFinite(project.popularity?.githubStars) ? '☆ ' + project.popularity.githubStars.toLocaleString('zh-TW') : '☆ 星數未查得';
}
