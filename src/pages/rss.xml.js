import rss from '@astrojs/rss';
import { Post } from '~/models/post';
import data from '~/data/sites';

export async function GET(context) {
	const postImports = import.meta.glob('./post/*.mdx', { eager: true });
	const posts = Object.values(postImports)
		.map(post => new Post(post))
		.sort((a, b) => new Date(b.date) - new Date(a.date));
	
	return rss({
		title: `${data.siteName} - An Anarchist Validator`,
		description: data.description,
		site: context.site || data.siteUrl,
		items: posts.map((post) => ({
			title: post.title,
			pubDate: new Date(post.date),
			description: post.description,
			link: `/post/${post.slug}/`,
			categories: post.tags,
		})),
		customData: `<language>en-us</language>`,
		stylesheet: '/rss/styles.xsl'
	});
}
