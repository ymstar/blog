import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: '阿呆 · ymstar',
    description: '一个不务正业的程序员，不愿躺平的年轻人。分享 Java、分布式系统、Docker 等技术笔记。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || post.data.title,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>zh-CN</language>`,
  });
}
