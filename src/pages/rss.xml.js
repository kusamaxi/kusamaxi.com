import rss from '@astrojs/rss';
import { Post } from '~/models/post';
import data from '~/data/sites';

export async function GET(context) {
	const posts = await Post.fromGlob(import.meta.glob('./post/*.mdx'));
	
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
