import { db } from "@/lib/prisma/db";

type Post = {
	title: string;
	content: string;
	authorId: string;
};

function randomPostGenerator<Post>() {
	const titles = [
		"Exploring the Cosmos",
		"The Art of Cooking",
		"Understanding Quantum Physics",
		"A Journey Through History",
		"The Future of Technology",
		"Gardening for Beginners",
		"Traveling the World",
		"The Beauty of Nature",
		"Learning a New Language",
		"The Power of Meditation",
		"The Impact of Climate Change",
		"The Evolution of Art",
		"The Science of Happiness",
		"The Secrets of the Ocean",
		"The Wonders of Space Exploration",
		"The History of Civilizations",
		"The Role of Artificial Intelligence",
		"The Importance of Mental Health",
		"The Basics of Personal Finance",
		"The Influence of Music on Culture",
		"The Future of Renewable Energy",
	];

	const contents = [
		"This post discusses the wonders of the universe and our place in it.",
		"A guide to cooking delicious meals with simple ingredients.",
		"An introduction to the principles of quantum mechanics.",
		"A look back at significant events that shaped our world.",
		"Exploring emerging technologies and their impact on society.",
		"Tips and tricks for starting your own garden.",
		"Sharing experiences from travels around the globe.",
		"An appreciation of nature's beauty and its importance.",
		"Resources and tips for learning a new language effectively.",
		"The benefits of meditation for mental health and well-being.",
		"Discussing the effects of climate change on our planet.",
		"A journey through the evolution of art across different cultures.",
		"Exploring what makes us happy and how to achieve it.",
		"An exploration of the mysteries of the ocean and its ecosystems.",
		"The latest advancements in space exploration and what they mean for humanity.",
		"A historical overview of major civilizations and their contributions.",
		"Understanding how AI is transforming various industries.",
		"The significance of mental health awareness in today's world.",
	];

	return {
		title: titles[Math.floor(Math.random() * titles.length)],
		content: contents[Math.floor(Math.random() * contents.length)],
	} as Post;
}

const posts: Post[] = Array.from({ length: 120 }, () =>
	randomPostGenerator<Post>()
);

db.post
	.createMany({
		data: posts.map((post) => ({
			title: post.title,
			content: post.content,
			authorId: "1NC5sMj8NmHfRdkULSM7UueW99okLN6L", // Replace with a valid author ID
		})),
		skipDuplicates: true,
	})
	.then(() => {
		console.log("Posts seeded successfully");
	})
	.catch((error) => {
		console.error("Error seeding posts:", error);
	});