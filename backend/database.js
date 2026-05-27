import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const parseTags = (tags) => tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

const formatItem = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  category: item.category,
  mediaType: item.mediaType,
  url: item.url,
  thumbnail: item.thumbnail,
  tags: parseTags(item.tags),
  beforeAfter: item.before && item.after ? { before: item.before, after: item.after } : null
});

// Parse first numeric value from budget strings like "$500", "$500-$1000", "500+"
const parseBudget = (str) => {
  if (!str) return 0;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

class Database {
  async init() {
    await prisma.$connect();
    console.log('Prisma SQLite connection established.');
  }

  // --- PORTFOLIO ---
  async getPortfolio() {
    const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } });
    return items.map(formatItem);
  }

  async savePortfolioItem(item) {
    const tagsStr = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
    const before = item.beforeAfter?.before ?? item.before ?? null;
    const after = item.beforeAfter?.after ?? item.after ?? null;

    const data = {
      title: item.title,
      description: item.description,
      category: item.category,
      mediaType: item.mediaType,
      url: item.url,
      thumbnail: item.thumbnail || null,
      tags: tagsStr,
      before,
      after
    };

    const result = item.id
      ? await prisma.portfolioItem.update({ where: { id: item.id }, data })
      : await prisma.portfolioItem.create({ data });

    return formatItem(result);
  }

  async deletePortfolioItem(id) {
    try {
      await prisma.portfolioItem.delete({ where: { id } });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  }

  // --- INQUIRIES ---
  async getInquiries() {
    return prisma.inquiry.findMany({ orderBy: { date: 'desc' } });
  }

  async saveInquiry(inquiry) {
    return prisma.inquiry.create({
      data: { ...inquiry, status: 'unread' }
    });
  }

  async updateInquiryStatus(id, status) {
    try {
      await prisma.inquiry.update({ where: { id }, data: { status } });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  }

  async deleteInquiry(id) {
    try {
      await prisma.inquiry.delete({ where: { id } });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  }

  // --- SERVICES & TESTIMONIALS ---
  async getServices() {
    return prisma.service.findMany();
  }

  async getTestimonials() {
    return prisma.testimonial.findMany();
  }

  // --- STATS ---
  async getStats() {
    const [inquiries, portfolioCount] = await Promise.all([
      this.getInquiries(),
      prisma.portfolioItem.count()
    ]);

    let totalBudget = 0;
    const projectTypes = {};

    for (const inq of inquiries) {
      projectTypes[inq.projectType] = (projectTypes[inq.projectType] || 0) + 1;
      totalBudget += parseBudget(inq.budget);
    }

    const projectTypeDistribution = Object.entries(projectTypes).map(([name, value]) => ({ name, value }));

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const inquiryTrends = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const count = inquiries.filter(inq => {
        const inqDate = new Date(inq.date);
        return inqDate.getDate() === d.getDate() && inqDate.getMonth() === d.getMonth();
      }).length;
      return { day: days[d.getDay()], inquiries: count };
    });

    return {
      totalInquiries: inquiries.length,
      unreadInquiries: inquiries.filter(inq => inq.status === 'unread').length,
      totalPortfolioItems: portfolioCount,
      estimatedPipelineValue: totalBudget,
      projectTypeDistribution,
      inquiryTrends
    };
  }
}

export const db = new Database();
export { prisma };
