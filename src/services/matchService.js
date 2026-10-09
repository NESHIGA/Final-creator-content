const WEIGHTS = {
  style: 20,
  budget: 20,
  speed: 15,
  platform: 10,
  contentType: 10,
  industry: 10,
  skills: 10,
  commercial: 5,
};

const KNOWN_TOOLS = ['midjourney', 'runway', 'sora', 'flux', 'comfyui', 'elevenlabs', 'chatgpt', 'claude'];

const CATEGORY_LABELS = {
  lux: 'luxury',
  food: 'food and beverage',
  shoe: 'fashion and footwear',
  tech: 'tech',
  anim: 'animation',
};

function lc(str) {
  return String(str == null ? '' : str).trim().toLowerCase();
}

function toToolNames(tools) {
  return (tools || [])
    .map((t) => (typeof t === 'string' ? t : (t && t.name) || ''))
    .filter(Boolean)
    .map(lc);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function styleFit(brief, creator) {
  const want = lc(brief.style);
  if (!want) return 50;
  const have = [creator.style, ...(creator.styles || [])].map(lc).filter(Boolean);
  if (have.includes(want)) return 100;
  const words = want.split(/\s+/).filter((w) => w.length > 3);
  if (words.some((w) => have.some((s) => s.includes(w)))) return 70;
  return 25;
}

function budgetFit(brief, creator) {
  const b = Number(brief.budget) || 0;
  if (!b) return 50;
  const min = Number(creator.budgetMin) || Number(creator.startingPrice) || 0;
  const max = Number(creator.budgetMax) || 0;
  if (min && b < min) return clamp(Math.round((b / min) * 100), 0, 100);
  if (max && b > max) return 90;
  return 100;
}

function speedFit(brief, creator) {
  const d = Number(brief.deadline) || 0;
  if (!d) return 50;
  const t = Number(creator.turnaroundDays) || Number(creator.deliveryDays) || 0;
  if (t <= d) return 100;
  return clamp(Math.round(100 - (t - d) * 20), 0, 100);
}

function platformFit(brief, creator) {
  const want = lc(brief.platform);
  if (!want) return 50;
  const have = (creator.platforms || []).map(lc);
  if (!have.length) return 50;
  return have.includes(want) ? 100 : 0;
}

function contentTypeFit(brief, creator) {
  const want = lc(brief.contentType);
  if (!want) return 50;
  const have = (creator.contentTypes || []).map(lc);
  return have.includes(want) ? 100 : 0;
}

function mapIndustryToKey(industry) {
  const s = lc(industry);
  if (!s) return null;
  if (/luxury|premium|jewel|watch|fragrance|perfume/.test(s)) return 'lux';
  if (/food|beverage|cafe|restaurant|drink|bakery/.test(s)) return 'food';
  if (/fashion|footwear|apparel|streetwear|sneaker|shoe/.test(s)) return 'shoe';
  if (/tech|software|saas|fintech|gadget|phone|app/.test(s)) return 'tech';
  if (/anim|cartoon|mascot/.test(s)) return 'anim';
  return null;
}

function deriveCategoryKey(brief) {
  const aiKey = brief.aiAnalysis && brief.aiAnalysis.categoryKey;
  if (aiKey && CATEGORY_LABELS[aiKey]) return aiKey;
  const fromIndustry = mapIndustryToKey(brief.industry);
  if (fromIndustry) return fromIndustry;
  const idea = lc(brief.idea);
  if (!idea) return null;
  if (/coffee|food|cafe|restaurant|tea|bakery|beverage/.test(idea)) return 'food';
  if (/perfume|luxury|premium|watch|jewel|fragrance/.test(idea)) return 'lux';
  if (/sneaker|shoe|fashion|streetwear|apparel/.test(idea)) return 'shoe';
  if (/tech|gadget|saas|phone|fintech|software/.test(idea)) return 'tech';
  if (/animat|cartoon|mascot/.test(idea)) return 'anim';
  return null;
}

function industryFit(brief, creator) {
  const key = deriveCategoryKey(brief);
  if (key) {
    const dna = creator.creativeDNA && creator.creativeDNA.categoryScores;
    const val = dna ? dna[key] : null;
    return typeof val === 'number' ? val : 50;
  }
  const want = lc(brief.industry);
  if (want) {
    const have = (creator.industries || []).map(lc);
    if (!have.length) return 50;
    return have.some((i) => i.includes(want) || want.includes(i)) ? 100 : 0;
  }
  return 50;
}

function skillsToolsFit(brief, creator) {
  const idea = lc(brief.idea);
  const recTools = ((brief.recommendations && brief.recommendations.tools) || []).map(lc);
  const mentionedSet = new Set(recTools);
  KNOWN_TOOLS.forEach((t) => {
    if (idea.includes(t)) mentionedSet.add(t);
  });
  const mentioned = Array.from(mentionedSet);
  const creatorTools = toToolNames(creator.tools);
  if (mentioned.length) {
    const hit = mentioned.filter((t) => creatorTools.includes(t)).length;
    return Math.round((hit / mentioned.length) * 100);
  }
  const briefText = [brief.idea, brief.style, brief.tone, brief.contentType, brief.platform]
    .map(lc)
    .join(' ');
  const vocab = [
    ...(creator.skills || []),
    ...(creator.specialization || []),
    ...(creator.tools || []).map((t) => (typeof t === 'string' ? t : (t && t.name) || '')),
  ]
    .map(lc)
    .filter((w) => w.length >= 4);
  const overlap = vocab.filter((w) => briefText.includes(w)).length;
  if (overlap > 0) return Math.min(100, 60 + overlap * 20);
  return 50;
}

function commercialFit(brief, creator) {
  const cu = lc(brief.commercialUse);
  if (!cu) return 50;
  const paid = cu.startsWith('paid') || cu.includes('full rights');
  const ready = creator.commercialReady === true;
  const expRights = /rights|whitelis|usage|paid/i.test(creator.commercialExperience || '');
  if (paid) {
    if (ready) return 100;
    return expRights ? 60 : 20;
  }
  return ready ? 100 : 80;
}

function buildReasons(brief, creator, fits) {
  const out = [];
  const push = (text) => {
    if (text && !out.includes(text)) out.push(text);
  };
  if (fits.style >= 85) push('Strong style match');
  if (fits.budget === 100) push('Fits the requested budget');
  if (fits.speed === 100) push('Available within the deadline');
  if (fits.platform === 100) push(`Active on ${brief.platform}`);
  if (fits.contentType === 100) push(`Experienced with ${brief.contentType}`);
  if (fits.industry >= 80) {
    const key = deriveCategoryKey(brief);
    const label = (key && CATEGORY_LABELS[key]) || brief.industry;
    if (label) push(`Strong ${label} work`);
  } else if (fits.industry >= 60) {
    const key = deriveCategoryKey(brief);
    const label = (key && CATEGORY_LABELS[key]) || brief.industry;
    if (label) push(`Solid ${label} experience`);
  }
  if (fits.skills >= 80) push('Relevant skills and tools for this brief');
  const paidUse = lc(brief.commercialUse).startsWith('paid') || lc(brief.commercialUse).includes('full rights');
  if (paidUse && fits.commercial === 100) push('Commercial rights cleared');
  if (paidUse && fits.commercial === 60) push('Commercial rights available on request');

  const facts = [];
  if (typeof creator.projectsCompleted === 'number') facts.push(`${creator.projectsCompleted} projects delivered`);
  if (creator.rating) facts.push(`Rated ${creator.rating}/5 from ${creator.reviewCount} reviews`);
  const days = Number(creator.turnaroundDays) || Number(creator.deliveryDays);
  if (days) facts.push(`Usually delivers in ${days} days`);
  if (typeof creator.experience === 'number' && creator.experience > 0) {
    facts.push(`${creator.experience}+ years of experience`);
  }
  const fallback = 'Profile data verified from MongoDB';
  let i = 0;
  while (out.length < 3 && i < facts.length) push(facts[i++]);
  while (out.length < 3) push(fallback);

  return out.slice(0, 5);
}

function scoreBrief(brief, creator) {
  const fits = {
    style: styleFit(brief, creator),
    budget: budgetFit(brief, creator),
    speed: speedFit(brief, creator),
    platform: platformFit(brief, creator),
    contentType: contentTypeFit(brief, creator),
    industry: industryFit(brief, creator),
    skills: skillsToolsFit(brief, creator),
    commercial: commercialFit(brief, creator),
  };
  let total = 0;
  Object.keys(WEIGHTS).forEach((k) => {
    total += fits[k] * WEIGHTS[k];
  });
  const matchScore = clamp(Math.round(total / 100), 0, 100);
  return { matchScore, reasons: buildReasons(brief, creator, fits) };
}

function matchBrief(brief, creators) {
  return creators
    .map((creator) => ({ creator, ...scoreBrief(brief, creator) }))
    .sort((a, b) => b.matchScore - a.matchScore || String(a.creator.name).localeCompare(String(b.creator.name)));
}

module.exports = { WEIGHTS, scoreBrief, matchBrief };
