import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialPortfolio = [
  {
    title: "Destination Wedding in Udaipur - Royal Film",
    description: "A premium cinematic highlights reel capturing a royal destination wedding at Lake Palace, Udaipur. Edited with luxury color tones and emotional sound mapping.",
    category: "Wedding Shoots",
    mediaType: "video",
    url: "https://www.youtube.com/embed/5F_C2W16JkU",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    tags: "Wedding Film, Color Grading, DaVinci Resolve",
    before: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80&sat=-50",
    after: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Jaipur Traditional Wear - Brand Shoot",
    description: "Commercial clothing brand photography for an ethnic wear collection in Hawa Mahal, Jaipur. Focus on shadow management and ambient textures.",
    category: "Brand Content",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    tags: "Jaipur Collection, Lightroom, Fashion Portrait"
  },
  {
    title: "Mumbai Café Promo - Bandra Bistro",
    description: "Punchy, fast-paced Instagram promo reel for a popular café in Bandra. High-energy pacing with close-up food details and custom transitions.",
    category: "Reels",
    mediaType: "video",
    url: "https://www.youtube.com/embed/2M-J3zCee14",
    thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    tags: "Reel Editing, Premiere Pro, Transitions"
  },
  {
    title: "Delhi Auto Vlog - Automotive Review",
    description: "YouTube review video edit for a premium sports utility vehicle. Features multi-camera overlays, speed ramps, and voiceovers.",
    category: "YouTube Editing",
    mediaType: "video",
    url: "https://www.youtube.com/embed/ScMzIvxBSi4",
    thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    tags: "Premiere Pro, YouTube Edit, Automotive"
  },
  {
    title: "Goa Monsoon - Cinematic Travel Film",
    description: "A moody, slow-paced cinematic travel diary capturing Goa's lush green monsoons. Focus on sound design and S-Log color conversion.",
    category: "Cinematic Videos",
    mediaType: "video",
    url: "https://player.vimeo.com/external/517618991.sd.mp4?s=d00cdbb1d5c2fa1296bf6d5a1b32d20387b3b646&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: "Cinematic, Color Science, Sound FX"
  },
  {
    title: "Tech Startup Launch Gala - Bengaluru",
    description: "Low-light event photography capturing startup panels, gala highlights, and corporate socials in Bengaluru.",
    category: "Events",
    mediaType: "image",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    tags: "Event Coverage, Corporate Shoot, Low Light"
  }
];

const initialServices = [
  {
    title: "Instagram Reel Editing",
    description: "High-retention vertical reels for Indian creators and influencers. Includes dynamic captions, custom transitions, sound FX, and viral hooks.",
    price: 999,
    icon: "Smartphone"
  },
  {
    title: "Wedding Highlight Editing",
    description: "Emotional, high-end wedding films capturing Indian traditions. Includes drone grading, audio matching, and cinematic pacing.",
    price: 9999,
    icon: "Film"
  },
  {
    title: "YouTube Video Editing",
    description: "Clean edits for vlogs, tech reviews, podcasts, and educational channels. Includes overlays, B-rolls, audio cleanup, and call-to-actions.",
    price: 2499,
    icon: "Tv"
  },
  {
    title: "Brand Commercial Editing",
    description: "Premium product promos, restaurant showcases, and agency-level ad reels designed to boost client acquisition and visibility.",
    price: 14999,
    icon: "Camera"
  },
  {
    title: "Advanced Color Grading",
    description: "Convert raw flat logs (Sony S-Log, DJ D-Log, RED LOG) to cinematic color spaces using custom LUTs and node setups in DaVinci Resolve.",
    price: 4999,
    icon: "Sliders"
  },
  {
    title: "Thumbnail Design",
    description: "High-CTR, attention-grabbing YouTube thumbnails custom-designed in Adobe Photoshop to drive views and subscribers.",
    price: 499,
    icon: "Layout"
  }
];

const initialTestimonials = [
  {
    name: "Rohan Mehra",
    role: "Café Owner, Bandra Bistro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "Navneet edited a promo reel for our café, and it went viral in Mumbai! We had people lining up the next weekend. The transition pacing was elite."
  },
  {
    name: "Pooja & Sameer",
    role: "Wedding Clients, Delhi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "The destination wedding video Udaipur captured our traditions beautifully. It felt like watching a Bollywood movie rather than a home clip!"
  },
  {
    name: "Kabir Dev",
    role: "Tech YouTuber (200k+ Subs)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "Outsourcing my YouTube video editing to Navneet saved me hours of work. Retention stats jumped by 25% due to punchy B-roll placements and clean audio."
  }
];

async function main() {
  console.log("Seeding SQLite database via Prisma [Indian localization]...");

  // Clear existing data
  await prisma.portfolioItem.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.inquiry.deleteMany({});

  // Seed Portfolio
  for (const item of initialPortfolio) {
    await prisma.portfolioItem.create({ data: item });
  }

  // Seed Services
  for (const service of initialServices) {
    await prisma.service.create({ data: service });
  }

  // Seed Testimonials
  for (const t of initialTestimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // Seed default inquiries with phone numbers
  await prisma.inquiry.create({
    data: {
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      email: "rahul@sharmawedding.in",
      projectType: "Wedding Film",
      budget: "₹15,000 - ₹50,000",
      message: "Hey! We are hosting a wedding in Udaipur next month and want a cinematic highlights editor to handle 3 days of footage. Let us know rates.",
      status: "unread",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  });

  await prisma.inquiry.create({
    data: {
      name: "Ananya Sen",
      phone: "+91 9999111122",
      email: "ananya@sencreations.com",
      projectType: "Instagram Reel",
      budget: "₹5,000 - ₹15,000",
      message: "Looking for an editor for a set of 10 lifestyle/fashion reels. Raw files are ready. Pacing needs to be fast and dynamic.",
      status: "read",
      date: new Date()
    }
  });

  console.log("Database seeded successfully with Indian market data!");
}

main()
  .catch((e) => {
    console.error("Seeding crashed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
