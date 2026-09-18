import { v4 as uuidv4 } from 'uuid';
import getDb from './client';

const CREATORS = [
  {
    id: uuidv4(),
    name: 'Zara Chen',
    username: 'zarachen',
    email: 'zara@skillswap.dev',
    bio: 'Motion graphics artist and 3D animator with a passion for immersive brand storytelling. I specialize in kinetic typography, product reveals, and surreal world-building. Client roster includes adtech startups and indie game studios.',
    location: 'London, UK',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zarachen&backgroundColor=b6e3f4',
    cover_url: 'https://picsum.photos/seed/zarachen/1200/400',
    hourly_rate_equiv: 85,
    availability: 'available',
    response_time: '12h',
    completed_trades: 24,
    review_count: 18,
    average_rating: 4.9,
    skill_credits: 580,
    verified: true,
    skills: [
      { name: 'Motion Graphics', category: 'motion-graphics', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.08, is_primary: true },
      { name: '3D Animation', category: '3d-animation', proficiency_level: 'expert', years_experience: 4, scarcity_score: 0.06, is_primary: false },
      { name: 'After Effects', category: 'motion-graphics', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.12, is_primary: false },
      { name: 'Cinema 4D', category: '3d-animation', proficiency_level: 'advanced', years_experience: 3, scarcity_score: 0.07, is_primary: false },
    ],
    portfolio: [
      { title: 'Synthwave Brand Reveal', description: 'Neon-drenched 3D logo animation for a Berlin techno label. Created in Cinema 4D with After Effects compositing. Client needed a 15-second opener for their YouTube channel.', category: '3d-animation', tools_used: 'Cinema 4D, After Effects, Octane Render', client_type: 'Music label', featured: true },
      { title: 'Fintech App Onboarding Animation', description: 'Series of micro-animations explaining complex financial concepts for a UK fintech startup. 8 scenes, 30fps, delivered in WebGL and MP4.', category: 'motion-graphics', tools_used: 'After Effects, Lottie, Bodymovin', client_type: 'Startup', featured: true },
      { title: 'NFT Collection Trailer', description: 'Surreal 3D environment walkthrough for a generative art NFT drop. Full CG, 60fps, 90-second runtime.', category: '3d-animation', tools_used: 'Blender, After Effects, DaVinci Resolve', client_type: 'NFT Studio', featured: false },
    ],
  },
  {
    id: uuidv4(),
    name: 'Marcus Webb',
    username: 'marcuswebb',
    email: 'marcus@skillswap.dev',
    bio: 'UI/UX designer with brand identity chops. I design for humans first — systems that are both beautiful and brutally usable. Figma wizard, design systems architect, and occasional CSS poet.',
    location: 'New York, USA',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcuswebb&backgroundColor=d1d4f9',
    cover_url: 'https://picsum.photos/seed/marcuswebb/1200/400',
    hourly_rate_equiv: 90,
    availability: 'busy',
    response_time: '24h',
    completed_trades: 31,
    review_count: 27,
    average_rating: 4.8,
    skill_credits: 720,
    verified: true,
    skills: [
      { name: 'UI/UX Design', category: 'ui-ux-design', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.15, is_primary: true },
      { name: 'Brand Identity', category: 'brand-identity', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.12, is_primary: false },
      { name: 'Design Systems', category: 'ui-ux-design', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.10, is_primary: false },
      { name: 'Figma', category: 'ui-ux-design', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.20, is_primary: false },
    ],
    portfolio: [
      { title: 'Pulse — Health App Design System', description: 'Complete design system for a Series A health tracking app. 400+ components, light/dark tokens, accessibility-compliant. Shipped in Figma with Storybook documentation.', category: 'ui-ux-design', tools_used: 'Figma, Storybook, Zeroheight', client_type: 'Health Tech Startup', featured: true },
      { title: 'Vertex Capital Rebrand', description: 'Full visual identity overhaul for a NY-based venture capital firm. Logo, typography, color system, business stationery, and pitch deck template.', category: 'brand-identity', tools_used: 'Figma, Illustrator, InDesign', client_type: 'VC Firm', featured: true },
      { title: 'Arco — E-commerce Mobile App', description: 'End-to-end UX design for sustainable fashion marketplace. User research, wireframes, prototypes, and final UI. Achieved 92% usability score in testing.', category: 'ui-ux-design', tools_used: 'Figma, Maze, Lottie', client_type: 'Fashion E-commerce', featured: false },
    ],
  },
  {
    id: uuidv4(),
    name: 'Aisha Okonkwo',
    username: 'aishaokonkwo',
    email: 'aisha@skillswap.dev',
    bio: 'Brand voice strategist and long-form copywriter. I help startups and creators find their authentic voice — then scale it across every touchpoint. Think conversion-focused but human-first. SEO nerd by day, fiction writer by night.',
    location: 'Lagos, Nigeria',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aishaokonkwo&backgroundColor=ffd5dc',
    cover_url: 'https://picsum.photos/seed/aisha/1200/400',
    hourly_rate_equiv: 65,
    availability: 'available',
    response_time: '8h',
    completed_trades: 19,
    review_count: 16,
    average_rating: 4.95,
    skill_credits: 420,
    verified: true,
    skills: [
      { name: 'Copywriting', category: 'copywriting', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.20, is_primary: true },
      { name: 'Brand Voice Strategy', category: 'content-strategy', proficiency_level: 'expert', years_experience: 4, scarcity_score: 0.15, is_primary: false },
      { name: 'SEO Writing', category: 'copywriting', proficiency_level: 'advanced', years_experience: 4, scarcity_score: 0.22, is_primary: false },
    ],
    portfolio: [
      { title: 'Kora — Fintech App Launch Copy', description: 'Complete launch copywriting package for a pan-African payments app. Landing page, email nurture sequence (8 emails), in-app microcopy, and App Store description. Resulted in 34% higher sign-up conversion.', category: 'copywriting', tools_used: 'Notion, Hemingway, Grammarly', client_type: 'Fintech Startup', featured: true },
      { title: 'AfriStyle Brand Voice Guidelines', description: 'Comprehensive 40-page brand voice document for a Pan-African fashion platform. Tone of voice, personality pillars, dos/don\'ts, and example copy across 12 scenarios.', category: 'content-strategy', tools_used: 'Notion, Google Docs', client_type: 'Fashion Brand', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Diego Reyes',
    username: 'diegoreyes',
    email: 'diego@skillswap.dev',
    bio: 'Audio engineer and music producer with a hybrid background — I\'ve worked in professional studios and my home rig sounds just as clean. Specializing in mixing, mastering, and original soundtrack composition for short films and branded content.',
    location: 'Mexico City, Mexico',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diegoreyes&backgroundColor=c0aede',
    cover_url: 'https://picsum.photos/seed/diego/1200/400',
    hourly_rate_equiv: 75,
    availability: 'available',
    response_time: '6h',
    completed_trades: 28,
    review_count: 22,
    average_rating: 4.85,
    skill_credits: 650,
    verified: true,
    skills: [
      { name: 'Audio Engineering', category: 'audio-engineering', proficiency_level: 'expert', years_experience: 8, scarcity_score: 0.09, is_primary: true },
      { name: 'Music Production', category: 'music-production', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.10, is_primary: false },
      { name: 'Mixing & Mastering', category: 'audio-engineering', proficiency_level: 'expert', years_experience: 8, scarcity_score: 0.08, is_primary: false },
      { name: 'Sound Design', category: 'audio-engineering', proficiency_level: 'advanced', years_experience: 5, scarcity_score: 0.07, is_primary: false },
    ],
    portfolio: [
      { title: 'Liminal — Short Film Soundtrack', description: 'Original 18-track score for an award-winning Mexican short film. Orchestral + electronic hybrid. Mixed and mastered to cinema standards. Screened at 4 international festivals.', category: 'music-production', tools_used: 'Logic Pro X, Spitfire Audio, Fabfilter', client_type: 'Film', featured: true },
      { title: 'Podcast Production Suite — True Crime Series', description: 'End-to-end audio production for a 12-episode true crime podcast. EQ, compression, noise reduction, music beds, and sound design for 40-minute episodes. Reached #3 on Spotify Mexico.', category: 'audio-engineering', tools_used: 'Pro Tools, iZotope RX, Logic', client_type: 'Podcast', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Priya Sharma',
    username: 'priyasharma',
    email: 'priya@skillswap.dev',
    bio: 'Video editor with 5 years of experience across documentary, branded content, and social media. I speak the language of story — every cut has intent. Davinci Resolve power user obsessed with cinematic color grading.',
    location: 'Mumbai, India',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priyasharma&backgroundColor=ffdfbf',
    cover_url: 'https://picsum.photos/seed/priya/1200/400',
    hourly_rate_equiv: 55,
    availability: 'available',
    response_time: '4h',
    completed_trades: 22,
    review_count: 19,
    average_rating: 4.75,
    skill_credits: 380,
    verified: false,
    skills: [
      { name: 'Video Editing', category: 'video-editing', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.18, is_primary: true },
      { name: 'Color Grading', category: 'color-grading', proficiency_level: 'advanced', years_experience: 3, scarcity_score: 0.12, is_primary: false },
      { name: 'DaVinci Resolve', category: 'video-editing', proficiency_level: 'expert', years_experience: 4, scarcity_score: 0.16, is_primary: false },
    ],
    portfolio: [
      { title: 'Wanderlust — Travel Documentary', description: '22-minute documentary about solo female travelers across Southeast Asia. Shot in 4K, color graded in DaVinci Resolve, Dolby Vision delivery. Won Best Cinematography at Mumbai Short Film Fest.', category: 'video-editing', tools_used: 'DaVinci Resolve, After Effects, Audition', client_type: 'Documentary', featured: true },
      { title: 'Nykaa Campaign — 6 Video Ads', description: 'Series of 6 short-form video ads (15s, 30s, 60s) for a beauty brand campaign. Optimized for Instagram, YouTube, and Connected TV. +18% CTR vs previous campaign.', category: 'video-editing', tools_used: 'Premiere Pro, After Effects, DaVinci Resolve', client_type: 'Beauty Brand', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Liam O\'Brien',
    username: 'liamobriendev',
    email: 'liam@skillswap.dev',
    bio: 'Full-stack developer who builds fast, accessible web apps. Specializing in Next.js, TypeScript, and no-code automation via Zapier/Make. I bridge the gap between design and engineering — if you can draw it, I can ship it.',
    location: 'Dublin, Ireland',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liamobriendev&backgroundColor=b6e3f4',
    cover_url: 'https://picsum.photos/seed/liam/1200/400',
    hourly_rate_equiv: 95,
    availability: 'busy',
    response_time: '24h',
    completed_trades: 15,
    review_count: 12,
    average_rating: 4.9,
    skill_credits: 820,
    verified: true,
    skills: [
      { name: 'Full-stack Development', category: 'web-development', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.22, is_primary: true },
      { name: 'Next.js / React', category: 'web-development', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.20, is_primary: false },
      { name: 'No-code Automation', category: 'web-development', proficiency_level: 'advanced', years_experience: 3, scarcity_score: 0.18, is_primary: false },
    ],
    portfolio: [
      { title: 'Merch Drop Platform — Full Stack Build', description: 'Built a complete limited-edition merch drop platform for an Irish music collective. Next.js frontend, Stripe payments, real-time inventory, email automation. 2k concurrent users at launch, zero downtime.', category: 'web-development', tools_used: 'Next.js, TypeScript, Prisma, Stripe, Vercel', client_type: 'Music Collective', featured: true },
      { title: 'Creator Analytics Dashboard', description: 'No-code analytics dashboard integrating YouTube, Instagram, Spotify, and TikTok APIs. Built in Webflow + Zapier + Google Data Studio. Used by 40+ creators.', category: 'web-development', tools_used: 'Webflow, Zapier, Make, Google Sheets API', client_type: 'Creator Economy', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Sofia Andersen',
    username: 'sofiaandersen',
    email: 'sofia@skillswap.dev',
    bio: 'Commercial photographer and retoucher. I shoot lifestyle, food, and product — with post-processing that adds atmosphere without losing authenticity. Based in Copenhagen but have shot on every continent except Antarctica (it\'s on the list).',
    location: 'Copenhagen, Denmark',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofiaandersen&backgroundColor=d1d4f9',
    cover_url: 'https://picsum.photos/seed/sofia/1200/400',
    hourly_rate_equiv: 70,
    availability: 'available',
    response_time: '18h',
    completed_trades: 17,
    review_count: 14,
    average_rating: 4.8,
    skill_credits: 310,
    verified: false,
    skills: [
      { name: 'Photography', category: 'photography', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.25, is_primary: true },
      { name: 'Photo Editing', category: 'photo-editing', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.22, is_primary: false },
      { name: 'Lightroom / Capture One', category: 'photo-editing', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.28, is_primary: false },
    ],
    portfolio: [
      { title: 'Organic Café — Brand Photography', description: 'Full brand photography shoot for a Copenhagen organic café chain. 120 production-ready images across food, interior, and lifestyle categories. Shot with Sony A7R V, edited in Capture One.', category: 'photography', tools_used: 'Sony A7R V, Capture One, Photoshop', client_type: 'F&B Brand', featured: true },
      { title: 'Vildmarken — Outdoor Apparel Campaign', description: 'Campaign imagery for a Nordic outdoor brand. 4-day shoot across Norwegian fjords. Delivered 80 retouched finals plus raw files.', category: 'photography', tools_used: 'Phase One, Capture One, Photoshop', client_type: 'Fashion Brand', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Kai Tanaka',
    username: 'kaitanaka',
    email: 'kai@skillswap.dev',
    bio: 'Illustrator and character designer specializing in anime-influenced styles, webtoon covers, and mascot design. My characters don\'t just look good — they carry brand personality in every line.',
    location: 'Tokyo, Japan',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kaitanaka&backgroundColor=ffd5dc',
    cover_url: 'https://picsum.photos/seed/kai/1200/400',
    hourly_rate_equiv: 60,
    availability: 'available',
    response_time: '12h',
    completed_trades: 38,
    review_count: 31,
    average_rating: 4.92,
    skill_credits: 890,
    verified: true,
    skills: [
      { name: 'Illustration', category: 'illustration', proficiency_level: 'expert', years_experience: 8, scarcity_score: 0.14, is_primary: true },
      { name: 'Character Design', category: 'character-design', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.11, is_primary: false },
      { name: 'Procreate / Clip Studio', category: 'illustration', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.16, is_primary: false },
    ],
    portfolio: [
      { title: 'Sakura Finance — Mascot & Brand Character', description: 'Designed a mascot character system for a Japanese fintech brand. 1 hero character + 12 emotional states + 3 supporting characters. Used across app, web, and OOH advertising.', category: 'character-design', tools_used: 'Procreate, Clip Studio Paint, Illustrator', client_type: 'Fintech', featured: true },
      { title: 'Moonblade — Webtoon Cover Series', description: '15-chapter cover illustration series for an action fantasy webtoon. Each cover handpainted in Procreate, print-ready at 300dpi.', category: 'illustration', tools_used: 'Procreate, Photoshop', client_type: 'Webtoon Publisher', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Amara Diallo',
    username: 'amaradiallo',
    email: 'amara@skillswap.dev',
    bio: 'Social media strategist and content creator with deep expertise in building community-led brands on TikTok, Instagram, and X. I don\'t just post — I engineer virality through cultural fluency and data.',
    location: 'Dakar, Senegal',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amaradiallo&backgroundColor=c0aede',
    cover_url: 'https://picsum.photos/seed/amara/1200/400',
    hourly_rate_equiv: 50,
    availability: 'available',
    response_time: '3h',
    completed_trades: 11,
    review_count: 8,
    average_rating: 4.6,
    skill_credits: 220,
    verified: false,
    skills: [
      { name: 'Social Media Strategy', category: 'social-media', proficiency_level: 'expert', years_experience: 4, scarcity_score: 0.30, is_primary: true },
      { name: 'Content Strategy', category: 'content-strategy', proficiency_level: 'advanced', years_experience: 3, scarcity_score: 0.28, is_primary: false },
      { name: 'Community Management', category: 'social-media', proficiency_level: 'advanced', years_experience: 4, scarcity_score: 0.32, is_primary: false },
    ],
    portfolio: [
      { title: 'Afrobella — TikTok Growth Strategy', description: 'Developed and executed 90-day TikTok strategy for a beauty brand focused on the African diaspora. Grew from 3k to 89k followers. 3 videos hit 500k+ views organically.', category: 'social-media', tools_used: 'TikTok Studio, Notion, CapCut, Canva', client_type: 'Beauty Brand', featured: true },
      { title: 'Waxprint — Brand Content Calendar', description: 'Designed 6-month content strategy for an African fashion label. 12-post weekly cadence across Instagram + X + Pinterest. +220% engagement rate increase.', category: 'content-strategy', tools_used: 'Notion, Later, Canva, Hootsuite', client_type: 'Fashion Brand', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Ethan Park',
    username: 'ethanpark',
    email: 'ethan@skillswap.dev',
    bio: 'Podcast producer and voice-over artist. I\'ve worked on everything from narrative fiction podcasts to brand interview shows. My setup is broadcast-quality and my turnaround is fast. Also an ace at scriptwriting for audio.',
    location: 'Seoul, South Korea',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethanpark&backgroundColor=ffdfbf',
    cover_url: 'https://picsum.photos/seed/ethan/1200/400',
    hourly_rate_equiv: 60,
    availability: 'available',
    response_time: '6h',
    completed_trades: 26,
    review_count: 21,
    average_rating: 4.78,
    skill_credits: 490,
    verified: true,
    skills: [
      { name: 'Podcast Production', category: 'podcast-production', proficiency_level: 'expert', years_experience: 5, scarcity_score: 0.18, is_primary: true },
      { name: 'Voice Over', category: 'voice-over', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.16, is_primary: false },
      { name: 'Audio Scriptwriting', category: 'copywriting', proficiency_level: 'advanced', years_experience: 4, scarcity_score: 0.22, is_primary: false },
    ],
    portfolio: [
      { title: 'The Frequency — Music Analysis Podcast', description: '52-episode music analysis podcast produced end-to-end. Scripting, recording, editing, mix, and distribution. Peaked at #12 in K-pop/Music category globally on Apple Podcasts.', category: 'podcast-production', tools_used: 'Adobe Audition, Descript, Buzzsprout', client_type: 'Media Company', featured: true },
      { title: 'Kakao Enterprise — Corporate VO Package', description: '40-piece voice-over package for corporate e-learning modules. Bilingual English/Korean, studio-quality, delivered in 5 working days.', category: 'voice-over', tools_used: 'Pro Tools, RODE NT2-A, Source Connect', client_type: 'Enterprise', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Isabella Russo',
    username: 'isabellarusso',
    email: 'isabella@skillswap.dev',
    bio: 'Graphic designer with Italian sensibilities — I believe in restraint, craft, and the power of white space. Specializing in print, editorial design, and packaging for artisan and luxury brands.',
    location: 'Milan, Italy',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabellarusso&backgroundColor=b6e3f4',
    cover_url: 'https://picsum.photos/seed/isabella/1200/400',
    hourly_rate_equiv: 72,
    availability: 'available',
    response_time: '24h',
    completed_trades: 20,
    review_count: 16,
    average_rating: 4.82,
    skill_credits: 340,
    verified: false,
    skills: [
      { name: 'Graphic Design', category: 'graphic-design', proficiency_level: 'expert', years_experience: 7, scarcity_score: 0.22, is_primary: true },
      { name: 'Editorial Design', category: 'graphic-design', proficiency_level: 'expert', years_experience: 6, scarcity_score: 0.18, is_primary: false },
      { name: 'Packaging Design', category: 'graphic-design', proficiency_level: 'advanced', years_experience: 4, scarcity_score: 0.16, is_primary: false },
    ],
    portfolio: [
      { title: 'Terroir — Artisan Wine Packaging', description: 'Full packaging design system for a boutique Piedmontese wine producer. Label design, foil specification, carton box, and gift set. Won a Red Dot Award in Packaging Design.', category: 'graphic-design', tools_used: 'Illustrator, InDesign, Photoshop', client_type: 'Food & Beverage', featured: true },
      { title: 'Forma Magazine — Editorial Design', description: 'Art direction and layout design for 6 issues of an Italian contemporary art and architecture magazine. 80-page publication, CMYK print-ready with precision typography.', category: 'graphic-design', tools_used: 'InDesign, Illustrator, Photoshop', client_type: 'Magazine', featured: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Jordan Blake',
    username: 'jordanblake',
    email: 'jordan@skillswap.dev',
    bio: 'Short-form video creator and UGC specialist. I live on TikTok and know what makes people stop scrolling. From concept to final cut in 24 hours — my workflow is dialed in for fast-moving brand campaigns and creator collabs.',
    location: 'Atlanta, USA',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordanblake&backgroundColor=d1d4f9',
    cover_url: 'https://picsum.photos/seed/jordan/1200/400',
    hourly_rate_equiv: 45,
    availability: 'available',
    response_time: '2h',
    completed_trades: 7,
    review_count: 2,
    average_rating: 4.5,
    skill_credits: 150,
    verified: false,
    skills: [
      { name: 'Short-form Video', category: 'video-editing', proficiency_level: 'expert', years_experience: 3, scarcity_score: 0.28, is_primary: true },
      { name: 'TikTok Content', category: 'social-media', proficiency_level: 'expert', years_experience: 3, scarcity_score: 0.25, is_primary: false },
      { name: 'UGC Production', category: 'video-editing', proficiency_level: 'advanced', years_experience: 2, scarcity_score: 0.30, is_primary: false },
    ],
    portfolio: [
      { title: 'AthletiX — TikTok Campaign (12 videos)', description: '12-video TikTok campaign for a sports nutrition brand. Concept, filming, editing, captioning, and posting. Total campaign reach: 2.3M views. 3 videos featured on TikTok Discover.', category: 'video-editing', tools_used: 'CapCut, Final Cut Pro, Splice', client_type: 'Sports Brand', featured: true },
      { title: 'Urban Thrift — UGC Package', description: '20-piece UGC video package for a secondhand fashion brand. Authentic lifestyle content optimized for TikTok and Instagram Reels. Avg. 85% completion rate.', category: 'video-editing', tools_used: 'CapCut, iPhone 15 Pro, Epidemic Sound', client_type: 'Fashion Brand', featured: true },
    ],
  },
];

export async function seed() {
  const db = getDb();

  // Check if already seeded
  const existing = db.prepare('SELECT COUNT(*) as count FROM creators').get() as { count: number };
  if (existing.count > 0) {
    console.log(`Database already seeded with ${existing.count} creators.`);
    return;
  }

  console.log('Seeding database with 12 creators...');

  const insertCreator = db.prepare(`
    INSERT OR IGNORE INTO creators (id, name, username, email, bio, location, avatar_url, cover_url, hourly_rate_equiv, availability, response_time, completed_trades, review_count, average_rating, skill_credits, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSkill = db.prepare(`
    INSERT INTO skills (id, creator_id, name, category, proficiency_level, years_experience, scarcity_score, is_primary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPortfolio = db.prepare(`
    INSERT INTO portfolio_items (id, creator_id, title, description, category, tools_used, client_type, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedAll = db.transaction(() => {
    for (const creator of CREATORS) {
      insertCreator.run(
        creator.id, creator.name, creator.username, creator.email,
        creator.bio, creator.location, creator.avatar_url, creator.cover_url,
        creator.hourly_rate_equiv, creator.availability, creator.response_time,
        creator.completed_trades, creator.review_count, creator.average_rating,
        creator.skill_credits, creator.verified ? 1 : 0
      );

      for (const skill of creator.skills) {
        insertSkill.run(uuidv4(), creator.id, skill.name, skill.category, skill.proficiency_level, skill.years_experience, skill.scarcity_score, skill.is_primary ? 1 : 0);
      }

      for (const item of creator.portfolio) {
        insertPortfolio.run(uuidv4(), creator.id, item.title, item.description, item.category, item.tools_used, item.client_type, item.featured ? 1 : 0);
      }
    }
  });

  seedAll();
  console.log(`✅ Seeded ${CREATORS.length} creators successfully.`);
}

export default seed;
