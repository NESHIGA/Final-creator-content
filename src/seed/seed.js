/**
 * CreatorOS AI demo seed.
 *
 * Usage: npm run seed
 *
 * Safety: only clears the CreatorOS demo collections listed in
 * COLLECTIONS below - it never drops the database or touches
 * unrelated collections.
 */
const env = require('../config/env');
const { connectDB, disconnectDB } = require('../config/db');
const {
  User,
  Creator,
  Portfolio,
  Brief,
  Project,
  BrandMemory,
  Verification,
  QualityInspection,
  Revision,
  CreativeDirection,
  Message,
  Notification,
} = require('../models');

const COLLECTIONS = [
  { label: 'users', model: User },
  { label: 'creators', model: Creator },
  { label: 'portfolios', model: Portfolio },
  { label: 'briefs', model: Brief },
  { label: 'projects', model: Project },
  { label: 'brand memories', model: BrandMemory },
  { label: 'verifications', model: Verification },
  { label: 'quality inspections', model: QualityInspection },
  { label: 'revisions', model: Revision },
  { label: 'creative directions', model: CreativeDirection },
  { label: 'messages', model: Message },
  { label: 'notifications', model: Notification },
];

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const USERS = [
  { name: 'Aarav Sharma', email: 'aarav@creatoros.ai', password: 'Password123', role: 'brand', company: 'Aura Perfumes' },
  { name: 'Priya Reddy', email: 'priya@creatoros.ai', password: 'Password123', role: 'brand', company: 'BrewCraft Coffee' },
  { name: 'Kabir Singh', email: 'kabir@creatoros.ai', password: 'Password123', role: 'brand', company: 'Stride Streetwear' },
  { name: 'Ananya Iyer', email: 'ananya@creatoros.ai', password: 'Password123', role: 'brand', company: 'Nimbus Tech' },
  { name: 'Demo Brand', email: 'demo@creatoros.ai', password: 'Password123', role: 'brand', company: 'CreatorOS Demo Co' },
];

const INDUSTRY = {
  lux: 'luxury',
  food: 'food and beverage',
  shoe: 'fashion and footwear',
  tech: 'technology',
  anim: 'animation',
};

const PROMPT = {
  lux: 'Slow macro push-in on the hero product, rim light, black marble, cinematic color grade',
  food: 'Warm morning light on a styled table, steam and texture, appetising macro details',
  shoe: 'Low angle tracking shot, wet street reflections, punchy contrast, kinetic edit',
  tech: 'Floating glass UI panels, soft glow edges, precise grid, dark studio space',
  anim: 'Bouncy character intro, thick outlines, squash and stretch, cheerful palette',
};

const WORKFLOW = {
  lux: ['Midjourney keyframes', 'Runway image-to-video', 'Upscale', 'Color grade'],
  food: ['Midjourney stills', 'Runway motion', 'Edit', 'Sound design'],
  shoe: ['Flux stills', 'Runway motion', 'Speed ramp edit', 'Grade'],
  tech: ['Midjourney boards', 'ComfyUI passes', 'UI motion', 'Export'],
  anim: ['Character design', 'ComfyUI frames', 'Animation pass', 'VO and mix'],
};

function item(code, title, category, o = {}) {
  return {
    code,
    title,
    category,
    industry: INDUSTRY[category],
    contentType: o.contentType || 'AI Video',
    image: o.image || '',
    description: o.description || `${title} - ${INDUSTRY[category]} campaign created entirely with AI tools.`,
    tools: o.tools || [],
    prompt: o.prompt || PROMPT[category],
    workflow: o.workflow || WORKFLOW[category],
    resolution: o.resolution || '1080x1920',
    aspectRatio: o.aspectRatio || '9:16',
    commercialRights: o.commercialRights !== undefined ? o.commercialRights : true,
    completionTime: o.completionTime || '2 days',
    tags: o.tags || [INDUSTRY[category], 'AI generated'],
  };
}

// The first six creators mirror the frontend demo data exactly
// (tools, categories, pricing, delivery days, trust scores, portfolios).
const CREATORS = [
  {
    name: 'Neshiga AI Studio',
    email: 'neshiga@creatoros.ai',
    location: 'Chennai',
    bio: 'AI filmmaking studio crafting cinematic product films for luxury and lifestyle brands.',
    specialization: ['AI Filmmaker', 'Cinematic Visuals', 'Product Ads'],
    contentTypes: ['AI Video', 'Image / Graphics'],
    skills: ['AI Video', 'Cinematic Visuals', 'Product Ads', 'Image Generation'],
    tools: [{ name: 'Midjourney', verified: true }, { name: 'Runway', verified: true }, { name: 'Flux', verified: true }],
    styles: ['Cinematic', 'Realistic', 'Minimal'],
    experience: 6, rating: 4.8, reviewCount: 124, projectsCompleted: 187,
    trustScore: 97, startingPrice: 22000, deliveryDays: 3, commercialReady: true,
    industries: ['Luxury', 'Fashion', 'Lifestyle'], platforms: ['Instagram', 'YouTube', 'Pinterest'], budgetMax: 88000,
    commercialExperience: '40+ paid brand films for luxury and lifestyle labels with full usage rights.',
    evidence: '4 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 96, food: 70, shoe: 60, tech: 40, anim: 30 },
    keywords: ['Luxury ads', 'Cinematic', 'Storytelling', 'Fashion'],
    workflow: ['Concept and mood board', 'Midjourney keyframes', 'Runway image-to-video', 'Upscale and color grade', 'Sound design and delivery'],
    portfolio: [
      item('P1', 'Noir Perfume Film', 'lux', { tools: ['Midjourney', 'Runway'], image: 'images/bottle.jpg' }),
      item('P2', 'Gold Watch Reel', 'lux', { tools: ['Midjourney', 'Runway'], aspectRatio: '1:1', resolution: '1080x1080' }),
      item('P3', 'Saffron Tea Ad', 'food', { tools: ['Flux', 'Runway'], image: 'images/p.jpg' }),
    ],
  },
  {
    name: 'Karthik Raja',
    email: 'karthik@creatoros.ai',
    location: 'Chennai',
    bio: 'Food and street-culture AI creator making fast, flavour-first vertical content.',
    specialization: ['AI Videographer', 'Food & Beverage', 'Social Reels'],
    contentTypes: ['AI Video', 'Social Reel'],
    skills: ['AI Video', 'Product Ads', 'Storytelling', 'Motion Graphics'],
    tools: [{ name: 'Sora', verified: true }, { name: 'ComfyUI', verified: true }, { name: 'Runway', verified: true }],
    styles: ['Playful', 'Realistic', 'Cinematic'],
    experience: 4, rating: 4.7, reviewCount: 86, projectsCompleted: 132,
    trustScore: 94, startingPrice: 15000, deliveryDays: 4, commercialReady: true,
    industries: ['Food & Beverage', 'Streetwear', 'Retail'], platforms: ['Instagram', 'TikTok', 'YouTube'], budgetMax: 60000,
    commercialExperience: 'Paid reel campaigns for cafes and D2C food brands with usage rights included.',
    evidence: '3 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 55, food: 92, shoe: 88, tech: 60, anim: 50 },
    keywords: ['Food ads', 'Streetwear', 'Reels'],
    workflow: ['Concept', 'Sora generation', 'ComfyUI style pass', 'Edit and sound', 'Delivery'],
    portfolio: [
      item('P4', 'Filter Coffee Story', 'food', { tools: ['Sora', 'ComfyUI'], image: 'images/land.jpg' }),
      item('P5', 'Street Sneaker Drop', 'shoe', { tools: ['Runway', 'Sora'], image: 'images/car.jpg' }),
      item('P6', 'Bakery Reel', 'food', { tools: ['Sora', 'ComfyUI'], contentType: 'Social Reel' }),
    ],
  },
  {
    name: 'Meera Nair',
    email: 'meera@creatoros.ai',
    location: 'Kochi',
    bio: 'Animation-led AI creator building mascots, explainers and friendly brand worlds.',
    specialization: ['AI Animator', 'Character Design', 'Explainer Videos'],
    contentTypes: ['AI Animation', 'Image / Graphics'],
    skills: ['AI Animation', 'Image Generation', 'Motion Graphics', 'Storytelling'],
    tools: [{ name: 'Midjourney', verified: true }, { name: 'ElevenLabs', verified: true }, { name: 'Claude', verified: true }],
    styles: ['Playful', '3D', 'Minimal'],
    experience: 5, rating: 4.9, reviewCount: 74, projectsCompleted: 98,
    trustScore: 94, startingPrice: 12000, deliveryDays: 5, commercialReady: true,
    industries: ['Technology', 'Education', 'Kids & Family'], platforms: ['YouTube', 'Instagram'], budgetMax: 48000,
    commercialExperience: '50+ mascot and explainer projects shipped for SaaS and consumer apps.',
    evidence: '3 samples reproduced, metadata matched, 1 near-duplicate reviewed',
    categoryScores: { lux: 60, food: 60, shoe: 40, tech: 95, anim: 90 },
    keywords: ['Mascot', 'Explainer', 'SaaS'],
    workflow: ['Script and storyboard', 'Midjourney character sheets', 'ComfyUI animation frames', 'ElevenLabs VO', 'Edit and mix'],
    portfolio: [
      item('P7', 'Mascot Explainer', 'anim', { tools: ['Midjourney', 'ElevenLabs'], image: 'images/anim.jpg', contentType: 'AI Animation' }),
      item('P8', 'SaaS Launch Film', 'tech', { tools: ['Midjourney', 'Claude'], aspectRatio: '16:9', resolution: '1920x1080' }),
      item('P9', 'Kids Brand Animation', 'anim', { tools: ['Midjourney', 'ComfyUI'], contentType: 'AI Animation' }),
    ],
  },
  {
    name: 'Dev Patel',
    email: 'devpatel@creatoros.ai',
    location: 'Ahmedabad',
    bio: 'High-end product cinematographer using Flux and ComfyUI for detail-obsessed frames.',
    specialization: ['Product Cinematographer', 'Macro Visuals', 'Fashion Films'],
    contentTypes: ['AI Video', 'Image / Graphics'],
    skills: ['AI Video', 'Cinematic Visuals', 'Image Generation', 'Product Ads'],
    tools: [{ name: 'Flux', verified: true }, { name: 'ComfyUI', verified: true }],
    styles: ['Cinematic', 'Realistic', 'Minimal'],
    experience: 7, rating: 4.8, reviewCount: 102, projectsCompleted: 164,
    trustScore: 96, startingPrice: 28000, deliveryDays: 2, commercialReady: true,
    industries: ['Fashion', 'Jewelry', 'Retail'], platforms: ['Instagram', 'YouTube', 'Pinterest'], budgetMax: 112000,
    commercialExperience: '60+ product films for sneaker, jewelry and fashion labels with full commercial rights.',
    evidence: '4 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 80, food: 50, shoe: 94, tech: 70, anim: 40 },
    keywords: ['Sneaker films', 'Macro', 'Streetwear'],
    workflow: ['Reference pack', 'Flux keyframes', 'ComfyUI upscaling', 'Motion pass', 'Grade and deliver'],
    portfolio: [
      item('P10', 'Sneaker Cinematic', 'shoe', { tools: ['Flux', 'ComfyUI'], image: 'images/car.jpg' }),
      item('P11', 'Streetwear Lookbook', 'shoe', { tools: ['Flux', 'Runway'], contentType: 'Social Reel' }),
      item('P12', 'Jewelry Macro', 'lux', { tools: ['Flux', 'ComfyUI'], aspectRatio: '1:1', resolution: '1080x1080' }),
    ],
  },
  {
    name: 'Sana Iqbal',
    email: 'sana@creatoros.ai',
    location: 'Hyderabad',
    bio: 'Speed-focused social reel creator for cafes, gadgets and everyday brands.',
    specialization: ['Social Reel Creator', 'UGC Style Ads', 'Copy-led Edits'],
    contentTypes: ['Social Reel', 'AI Video'],
    skills: ['AI Video', 'Storytelling', 'Product Ads', 'Motion Graphics'],
    tools: [{ name: 'Runway', verified: true }, { name: 'ChatGPT', verified: true }, { name: 'ElevenLabs', verified: true }],
    styles: ['Playful', 'Realistic', 'Minimal'],
    experience: 3, rating: 4.5, reviewCount: 51, projectsCompleted: 76,
    trustScore: 91, startingPrice: 9000, deliveryDays: 3, commercialReady: false,
    industries: ['Food & Beverage', 'Technology', 'Lifestyle'], platforms: ['Instagram', 'TikTok', 'YouTube'], budgetMax: 36000,
    commercialExperience: 'Organic-first UGC style reels; paid usage rights available on request.',
    evidence: '2 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 65, food: 88, shoe: 50, tech: 75, anim: 60 },
    keywords: ['Cafe reels', 'Unboxing', 'Fast delivery'],
    workflow: ['Hook writing', 'Runway clips', 'ElevenLabs VO', 'Captions and export'],
    portfolio: [
      item('P13', 'Cafe Menu Reels', 'food', { tools: ['Runway', 'ChatGPT'], contentType: 'Social Reel', commercialRights: false }),
      item('P14', 'Gadget Unboxing', 'tech', { tools: ['Runway', 'ElevenLabs'], contentType: 'Social Reel', commercialRights: false }),
    ],
  },
  {
    name: 'Rohan Das',
    email: 'rohan@creatoros.ai',
    location: 'Kolkata',
    bio: 'Tech and fintech AI storyteller producing explainers and launch teasers.',
    specialization: ['Tech Storyteller', 'Explainer Films', 'Launch Teasers'],
    contentTypes: ['AI Video', 'AI Animation'],
    skills: ['AI Video', 'AI Animation', 'Storytelling', 'Cinematic Visuals'],
    tools: [{ name: 'Sora', verified: true }, { name: 'Midjourney', verified: true }],
    styles: ['Cinematic', 'Minimal', '3D'],
    experience: 5, rating: 4.7, reviewCount: 68, projectsCompleted: 110,
    trustScore: 96, startingPrice: 18000, deliveryDays: 4, commercialReady: true,
    industries: ['Technology', 'Finance', 'SaaS'], platforms: ['YouTube', 'LinkedIn', 'Instagram'], budgetMax: 72000,
    commercialExperience: '45+ launch teasers and fintech explainers produced for funded startups.',
    evidence: '3 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 70, food: 65, shoe: 72, tech: 85, anim: 55 },
    keywords: ['Fintech', 'Explainer', 'Teaser'],
    workflow: ['Script', 'Midjourney boards', 'Sora clips', 'Sound design', 'Deliver'],
    portfolio: [
      item('P15', 'Fintech Explainer', 'tech', { tools: ['Sora', 'Midjourney'], aspectRatio: '16:9', resolution: '1920x1080' }),
      item('P16', 'Smartwatch Teaser', 'tech', { tools: ['Sora', 'Midjourney'], image: 'images/fig.jpg' }),
    ],
  },
  {
    name: 'Aisha Verma',
    email: 'aisha@creatoros.ai',
    location: 'Mumbai',
    bio: 'Beauty and lifestyle AI director blending editorial fashion with social-first edits.',
    specialization: ['Beauty Director', 'Editorial Fashion', 'Brand Films'],
    contentTypes: ['AI Video', 'AI Image', 'Social Reel'],
    skills: ['AI Video', 'Cinematic Visuals', 'Image Generation', 'Storytelling'],
    tools: [{ name: 'Runway', verified: true }, { name: 'Midjourney', verified: true }, { name: 'ChatGPT', verified: true }],
    styles: ['Cinematic', 'Minimal', 'Realistic'],
    experience: 4, rating: 4.6, reviewCount: 59, projectsCompleted: 88,
    trustScore: 93, startingPrice: 14000, deliveryDays: 4, commercialReady: true,
    industries: ['Beauty', 'Fashion', 'Lifestyle'], platforms: ['Instagram', 'YouTube', 'Pinterest'], budgetMax: 56000,
    commercialExperience: '70+ beauty and fashion brand films with editorial-grade commercial rights.',
    evidence: '3 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 88, food: 55, shoe: 78, tech: 45, anim: 35 },
    keywords: ['Beauty', 'Editorial', 'Fashion'],
    workflow: ['Mood board', 'Midjourney stills', 'Runway motion', 'Edit and grade'],
    portfolio: [
      item('P17', 'Lipstick Macro Film', 'lux', { tools: ['Runway', 'Midjourney'], image: 'images/bottle.jpg' }),
      item('P18', 'Resort Lookbook', 'shoe', { tools: ['Runway', 'ChatGPT'], contentType: 'AI Image' }),
    ],
  },
  {
    name: 'Tanmay Bose',
    email: 'tanmay@creatoros.ai',
    location: 'Pune',
    bio: 'Graphic-systems designer producing bold poster worlds and animated brand kits.',
    specialization: ['Graphic Designer', 'Brand Systems', 'Motion Kits'],
    contentTypes: ['AI Image', 'Motion Graphics', '3D'],
    skills: ['Image Generation', 'Motion Graphics', 'AI Animation', 'Storytelling'],
    tools: [{ name: 'Midjourney', verified: true }, { name: 'Flux', verified: true }, { name: 'ComfyUI', verified: true }],
    styles: ['Minimal', 'Playful', '3D'],
    experience: 3, rating: 4.4, reviewCount: 42, projectsCompleted: 64,
    trustScore: 92, startingPrice: 11000, deliveryDays: 5, commercialReady: true,
    industries: ['Technology', 'Retail', 'Entertainment'], platforms: ['Instagram', 'Behance', 'YouTube'], budgetMax: 44000,
    commercialExperience: 'Brand kits and poster systems delivered for 30+ startups and events.',
    evidence: '2 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 58, food: 62, shoe: 70, tech: 74, anim: 86 },
    keywords: ['Posters', 'Brand kits', 'Motion'],
    workflow: ['Grid system', 'Flux stills', 'ComfyUI iterations', 'Motion export'],
    portfolio: [
      item('P19', 'Festival Poster Series', 'anim', { tools: ['Midjourney', 'Flux'], contentType: 'AI Image', aspectRatio: '4:5', resolution: '1080x1350' }),
      item('P20', 'SaaS Brand Kit', 'tech', { tools: ['Midjourney', 'ComfyUI'], contentType: 'Motion Graphics' }),
    ],
  },
  {
    name: 'Rahul Menon',
    email: 'rahul@creatoros.ai',
    location: 'Bengaluru',
    bio: 'Premium AI cinematographer for automotive, tech and luxury launch films.',
    specialization: ['AI Cinematographer', 'Launch Films', 'Automotive'],
    contentTypes: ['AI Video', '3D', 'Motion Graphics'],
    skills: ['AI Video', 'Cinematic Visuals', 'Motion Graphics', 'Image Generation'],
    tools: [{ name: 'Sora', verified: true }, { name: 'Runway', verified: true }, { name: 'Flux', verified: true }],
    styles: ['Cinematic', 'Realistic', '3D'],
    experience: 8, rating: 4.9, reviewCount: 143, projectsCompleted: 210,
    trustScore: 95, startingPrice: 25000, deliveryDays: 3, commercialReady: true,
    industries: ['Automotive', 'Technology', 'Luxury'], platforms: ['YouTube', 'Instagram', 'LinkedIn'], budgetMax: 100000,
    commercialExperience: 'Premium launch films for automotive and tech brands with global usage rights.',
    evidence: '5 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 84, food: 48, shoe: 76, tech: 90, anim: 46 },
    keywords: ['Automotive', 'Launch films', 'Tech'],
    workflow: ['Previz', 'Flux keyframes', 'Sora motion', 'Grade', 'Sound and deliver'],
    portfolio: [
      item('P21', 'EV Reveal Film', 'tech', { tools: ['Sora', 'Flux'], aspectRatio: '16:9', resolution: '1920x1080' }),
      item('P22', 'EV Interior Walkthrough', 'tech', { tools: ['Runway', 'Flux'], contentType: '3D' }),
    ],
  },
  {
    name: 'Zoya Khan',
    email: 'zoya@creatoros.ai',
    location: 'Delhi',
    bio: 'Budget-friendly reel and voice specialist for cafes, D2C launches and creator brands.',
    specialization: ['Reel Specialist', 'D2C Ads', 'Voiceovers'],
    contentTypes: ['Voice', 'Social Reel', 'AI Image'],
    skills: ['AI Video', 'Storytelling', 'Image Generation', 'Product Ads'],
    tools: [{ name: 'ChatGPT', verified: true }, { name: 'Midjourney', verified: true }, { name: 'ElevenLabs', verified: true }],
    styles: ['Playful', 'Minimal', 'Realistic'],
    experience: 2, rating: 4.3, reviewCount: 37, projectsCompleted: 52,
    trustScore: 90, startingPrice: 8000, deliveryDays: 2, commercialReady: false,
    industries: ['Food & Beverage', 'Retail', 'Lifestyle'], platforms: ['Instagram', 'TikTok', 'YouTube'], budgetMax: 32000,
    commercialExperience: 'Budget reel and voiceover packages for local cafes and D2C launches; organic use only.',
    evidence: '2 samples reproduced, metadata matched, no duplicates',
    categoryScores: { lux: 52, food: 84, shoe: 66, tech: 68, anim: 58 },
    keywords: ['D2C', 'Cafe reels', 'Fast turnaround'],
    workflow: ['Hook writing', 'Midjourney stills', 'ElevenLabs VO', 'Captions and export'],
    portfolio: [
      item('P23', 'Chai Stall Diaries', 'food', { tools: ['ChatGPT', 'Runway'], contentType: 'Social Reel', commercialRights: false }),
      item('P24', 'Cafe Jingle Voiceover', 'food', { tools: ['ElevenLabs', 'ChatGPT'], contentType: 'Voice', commercialRights: false }),
    ],
  },
];

const BRIEFS = [
  {
    ownerEmail: 'aarav@creatoros.ai',
    idea: 'I need a cinematic AI video for my luxury perfume brand launch on Instagram',
    budget: 20000, deadline: 5, platform: 'Instagram', tone: 'Premium',
    contentType: 'AI Video', style: 'Cinematic', aspectRatio: '9:16',
    commercialUse: 'Paid ads (full rights)',
    targetAudience: 'Fashion enthusiasts aged 25-40',
    industry: 'luxury', status: 'active', briefCompleteness: 90,
    aiAnalysis: {
      industry: 'luxury', categoryKey: 'lux', contentType: 'AI Video', style: 'Cinematic',
      briefCompleteness: 90, missingInformation: ['Shot duration'],
      aiSummary: 'Cinematic luxury perfume film for Instagram with premium macro product visuals.',
    },
    recommendations: {
      tools: ['Runway', 'Midjourney', 'Flux'],
      skills: ['Cinematic Visuals', 'Product Ads'],
      format: '9:16 vertical, 15-30 sec',
      aspectRatio: '9:16',
    },
  },
  {
    ownerEmail: 'priya@creatoros.ai',
    idea: 'A warm coffee brand story reel showing the morning ritual for our cafe chain',
    budget: 12000, deadline: 4, platform: 'Instagram', tone: 'Warm',
    contentType: 'Social Reel', style: 'Realistic', aspectRatio: '9:16',
    commercialUse: 'Organic social only',
    targetAudience: 'Young professionals who love specialty coffee',
    industry: 'food and beverage', status: 'active', briefCompleteness: 85,
    aiAnalysis: {
      industry: 'food and beverage', categoryKey: 'food', contentType: 'Social Reel', style: 'Realistic',
      briefCompleteness: 85, missingInformation: ['Number of cut-downs'],
      aiSummary: 'Warm morning-ritual reel for a specialty coffee chain, natural light and real hands.',
    },
    recommendations: {
      tools: ['Sora', 'ComfyUI', 'Runway'],
      skills: ['Product Ads', 'Storytelling'],
      format: '9:16 vertical, 15-30 sec',
      aspectRatio: '9:16',
    },
  },
  {
    ownerEmail: 'kabir@creatoros.ai',
    idea: 'High energy sneaker launch film for our streetwear drop this season',
    budget: 18000, deadline: 3, platform: 'YouTube', tone: 'Bold',
    contentType: 'AI Video', style: 'Cinematic', aspectRatio: '16:9',
    commercialUse: 'Paid ads (full rights)',
    targetAudience: 'Gen Z sneakerheads and streetwear fans',
    industry: 'fashion and footwear', status: 'active', briefCompleteness: 90,
    aiAnalysis: {
      industry: 'fashion and footwear', categoryKey: 'shoe', contentType: 'AI Video', style: 'Cinematic',
      briefCompleteness: 90, missingInformation: [],
      aiSummary: 'High-energy streetwear sneaker drop film with kinetic cuts and wet-street visuals.',
    },
    recommendations: {
      tools: ['Flux', 'Runway', 'ComfyUI'],
      skills: ['AI Video', 'Motion Graphics'],
      format: '16:9 master + 1:1 cut',
      aspectRatio: '16:9',
    },
  },
  {
    ownerEmail: 'ananya@creatoros.ai',
    idea: 'A clean explainer animation for our fintech app onboarding flow',
    budget: 15000, deadline: 6, platform: 'Website', tone: 'Premium',
    contentType: 'AI Animation', style: 'Minimal', aspectRatio: '16:9',
    commercialUse: 'Paid ads (full rights)',
    targetAudience: 'First-time investors aged 22-35',
    industry: 'technology', status: 'active', briefCompleteness: 85,
    aiAnalysis: {
      industry: 'technology', categoryKey: 'tech', contentType: 'AI Animation', style: 'Minimal',
      briefCompleteness: 85, missingInformation: ['Voiceover script'],
      aiSummary: 'Minimal explainer animation walking new users through fintech onboarding.',
    },
    recommendations: {
      tools: ['Midjourney', 'ComfyUI', 'ElevenLabs'],
      skills: ['AI Animation', 'Storytelling'],
      format: '16:9, 30-60 sec',
      aspectRatio: '16:9',
    },
  },
  {
    ownerEmail: 'demo@creatoros.ai',
    idea: 'I need a premium advertisement for my coffee brand on Instagram',
    budget: 16000, deadline: 4, platform: 'Instagram', tone: 'Premium',
    contentType: 'AI Video', style: 'Cinematic', aspectRatio: '9:16',
    commercialUse: 'Paid ads (full rights)',
    targetAudience: 'Coffee lovers aged 24-38',
    industry: 'food and beverage', status: 'draft', briefCompleteness: 80,
    aiAnalysis: {
      industry: 'food and beverage', categoryKey: 'food', contentType: 'AI Video', style: 'Cinematic',
      briefCompleteness: 80, missingInformation: ['Target audience details'],
      aiSummary: 'Premium cinematic coffee advertisement for Instagram paid ads.',
    },
    recommendations: {
      tools: ['Midjourney', 'Runway', 'Flux'],
      skills: ['Product Ads', 'Cinematic Visuals'],
      format: '9:16 vertical, 15-30 sec',
      aspectRatio: '9:16',
    },
  },
];

const PROJECTS = [
  { ownerEmail: 'aarav@creatoros.ai', creatorName: 'Neshiga AI Studio', briefIndex: 0, name: 'Aura Perfume Launch Film', status: 'concept', progress: 30, deadline: 5, budget: 22000, risk: 'low' },
  { ownerEmail: 'priya@creatoros.ai', creatorName: 'Karthik Raja', briefIndex: 1, name: 'BrewCraft Morning Ritual Reels', status: 'generation', progress: 55, deadline: 4, budget: 15000, risk: 'low' },
  { ownerEmail: 'kabir@creatoros.ai', creatorName: 'Dev Patel', briefIndex: 2, name: 'Stride Season Drop Film', status: 'review', progress: 70, deadline: 3, budget: 28000, risk: 'low' },
  { ownerEmail: 'ananya@creatoros.ai', creatorName: 'Meera Nair', briefIndex: 3, name: 'Nimbus Onboarding Explainer', status: 'revision', progress: 45, deadline: 6, budget: 12000, risk: 'medium' },
  { ownerEmail: 'demo@creatoros.ai', creatorName: 'Sana Iqbal', briefIndex: 4, name: 'Demo Coffee Campaign', status: 'brief-approved', progress: 10, deadline: 4, budget: 9000, risk: 'low' },
];

const BRAND_MEMORIES = [
  {
    email: 'aarav@creatoros.ai',
    brandColors: ['#0B0B0F', '#C9A227', '#F5EFE0'],
    fonts: ['Playfair Display', 'Montserrat'],
    logoPosition: 'Top Right',
    visualStyle: ['Premium', 'Cinematic', 'Minimal'],
    toneOfVoice: 'Premium and trustworthy',
    targetAudience: 'Luxury shoppers',
    preferredTools: ['Runway', 'Midjourney'],
    contentRules: ['Use brand colors', 'Keep logo visible', 'No stock music'],
  },
  {
    email: 'priya@creatoros.ai',
    brandColors: ['#5A3E2B', '#E9D8B6', '#2E5E3A'],
    fonts: ['DM Sans'],
    logoPosition: 'Bottom Left',
    visualStyle: ['Warm', 'Realistic', 'Playful'],
    toneOfVoice: 'Warm, friendly and honest',
    targetAudience: 'Young professionals who love specialty coffee',
    preferredTools: ['Sora', 'ComfyUI'],
    contentRules: ['Show real hands', 'Warm grade only', 'Show the cup within 3 seconds'],
  },
  {
    email: 'kabir@creatoros.ai',
    brandColors: ['#111111', '#FF4F9A', '#7BE0FF'],
    fonts: ['Bricolage Grotesque'],
    logoPosition: 'Center',
    visualStyle: ['Bold', 'Cinematic', '3D'],
    toneOfVoice: 'Bold and loud',
    targetAudience: 'Gen Z streetwear fans',
    preferredTools: ['Flux', 'Runway'],
    contentRules: ['Fast cuts only', 'Bass-heavy sound', 'Never crop the logo'],
  },
  {
    email: 'ananya@creatoros.ai',
    brandColors: ['#0E1030', '#6D5CFF', '#3ED8A8'],
    fonts: ['Inter', 'Montserrat'],
    logoPosition: 'Top Left',
    visualStyle: ['Minimal', '3D', 'Premium'],
    toneOfVoice: 'Clear, confident and simple',
    targetAudience: 'First-time investors aged 22-35',
    preferredTools: ['Midjourney', 'ComfyUI'],
    contentRules: ['Explain one feature per scene', 'Use brand icons', 'No jargon'],
  },
  {
    email: 'demo@creatoros.ai',
    brandColors: ['#2a2470', '#f5a623', '#6a4fd0'],
    fonts: ['Montserrat'],
    logoPosition: 'Top Right',
    visualStyle: ['Premium', 'Minimal', 'Cinematic'],
    toneOfVoice: 'Premium, Elegant and Trustworthy',
    targetAudience: 'Luxury shoppers',
    preferredTools: ['Runway', 'Midjourney'],
    contentRules: ['Use brand colors', 'Keep logo visible'],
  },
];

/* ------------------------------------------------------------------ */
/* Seed                                                                */
/* ------------------------------------------------------------------ */

function milestonesFor(progress, deadlineDays) {
  return [
    { title: 'Brief approved', day: 'Day 0', completed: progress >= 10 },
    { title: 'Concept and mood board', day: 'Day 1', completed: progress >= 30 },
    { title: 'First draft', day: `Day ${Math.max(1, deadlineDays - 1)}`, completed: progress >= 60 },
    { title: 'Final delivery', day: `Day ${deadlineDays}`, completed: progress >= 100 },
  ];
}

async function main() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not set. Fill it in backend/.env (see backend/.env.example).');
  }

  console.log('Connecting to MongoDB...');
  await connectDB(env.mongoUri);
  console.log('Clearing CreatorOS demo collections...');

  for (const c of COLLECTIONS) {
    await c.model.deleteMany({});
  }

  // 1. Users (brand accounts - passwords are hashed by the User model)
  const users = [];
  for (const seed of USERS) {
    users.push(await User.create(seed));
  }
  const userByEmail = new Map(users.map((u) => [u.email, u]));

  // 2. Creators + verifications + portfolio
  const creators = [];
  for (const seed of CREATORS) {
    const creator = await Creator.create({
      name: seed.name,
      email: seed.email,
      bio: seed.bio,
      location: seed.location,
      specialization: seed.specialization,
      contentTypes: seed.contentTypes,
      skills: seed.skills,
      tools: seed.tools,
      styles: seed.styles,
      style: seed.style || (seed.styles && seed.styles[0]) || '',
      industries: seed.industries || [],
      platforms: seed.platforms || [],
      experience: seed.experience,
      rating: seed.rating,
      reviewCount: seed.reviewCount,
      projectsCompleted: seed.projectsCompleted,
      trustScore: seed.trustScore,
      startingPrice: seed.startingPrice,
      budgetMin: seed.startingPrice,
      budgetMax: seed.budgetMax || seed.startingPrice * 4,
      deliveryDays: seed.deliveryDays,
      turnaroundDays: seed.deliveryDays,
      commercialReady: seed.commercialReady,
      commercialExperience: seed.commercialExperience || '',
      verificationStatus: 'verified',
      creativeDNA: {
        categoryScores: seed.categoryScores,
        keywords: seed.keywords,
        strengths: seed.skills,
      },
      workflow: seed.workflow,
      portfolio: [],
      availability: { status: 'available', message: 'Open for new projects' },
    });

    const verification = await Verification.create({
      creatorId: creator._id,
      portfolioVerified: true,
      toolVerified: true,
      workflowVerified: true,
      commercialRightsVerified: seed.commercialReady,
      clientReviewsVerified: true,
      portfolioAuthenticityScore: seed.trustScore,
      toolExpertiseScore: Math.max(0, seed.trustScore - 1),
      workflowVerificationScore: seed.trustScore,
      commercialRightsScore: seed.commercialReady ? seed.trustScore : 55,
      clientReviewsScore: Math.min(100, Math.round(seed.rating * 20)),
      overallTrustScore: seed.trustScore,
      evidence: seed.evidence,
    });

    const portfolioDocs = await Portfolio.insertMany(
      seed.portfolio.map((p) => ({ ...p, creatorId: creator._id }))
    );

    creator.verification = verification._id;
    creator.portfolio = portfolioDocs.map((p) => p._id);
    await creator.save();

    creators.push(creator);
  }
  const creatorByName = new Map(creators.map((c) => [c.name, c]));

  // 3. Briefs
  const briefs = [];
  for (const seed of BRIEFS) {
    const owner = userByEmail.get(seed.ownerEmail);
    if (!owner) throw new Error(`User not found for brief: ${seed.ownerEmail}`);
    const { ownerEmail, aiAnalysis, recommendations, ...fields } = seed;
    briefs.push(
      await Brief.create({
        ...fields,
        userId: owner._id,
        aiAnalysis,
        recommendations,
      })
    );
  }

  // 4. Projects
  const projects = [];
  for (const seed of PROJECTS) {
    const owner = userByEmail.get(seed.ownerEmail);
    const creator = creatorByName.get(seed.creatorName);
    if (!owner || !creator) throw new Error(`Project reference missing: ${seed.name}`);

    const milestones = milestonesFor(seed.progress, seed.deadline);
    const completed = milestones.filter((m) => m.completed).length;

    projects.push(
      await Project.create({
        brandId: owner._id,
        creatorId: creator._id,
        briefId: briefs[seed.briefIndex] ? briefs[seed.briefIndex]._id : null,
        name: seed.name,
        description: `${seed.name} - AI campaign managed inside CreatorOS AI.`,
        status: seed.status,
        progress: seed.progress,
        deadline: seed.deadline,
        budget: seed.budget,
        milestones,
        deliverables: [
          { name: 'Hero cut (primary aspect ratio)', status: seed.progress >= 60 ? 'in-progress' : 'pending' },
          { name: 'Square 1:1 cut-down', status: 'pending' },
        ],
        revisionCount: seed.status === 'revision' ? 1 : 0,
        deadlineRisk: seed.risk,
        aiHealth: {
          score: Math.min(100, Math.round(seed.progress * 0.6 + (seed.risk === 'low' ? 40 : 25))),
          status: seed.risk === 'low' ? 'On track' : 'Watch deadline',
          completedMilestones: completed,
          totalMilestones: milestones.length,
        },
        aiPrediction: {
          onTimeProbability: seed.risk === 'low' ? 92 : 68,
          riskFactors: seed.risk === 'low' ? [] : ['Revision round may push delivery'],
          suggestedAction: seed.risk === 'low' ? 'Keep current pace' : 'Fast-track concept approval',
        },
      })
    );
  }

  // 5. Brand memories
  for (const seed of BRAND_MEMORIES) {
    const owner = userByEmail.get(seed.email);
    if (!owner) continue;
    const { email, ...fields } = seed;
    await BrandMemory.create({ ...fields, userId: owner._id });
  }

  console.log('\nSeed complete:');
  for (const c of COLLECTIONS) {
    const count = await c.model.countDocuments();
    console.log(`  - ${c.label}: ${count}`);
  }

  await disconnectDB();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\nSeed failed:', err.message);
  if (err.name === 'ValidationError') {
    Object.values(err.errors || {}).forEach((e) => console.error(`  - ${e.message}`));
  }
  try {
    await disconnectDB();
  } catch (e) {
    // ignore
  }
  process.exit(1);
});
