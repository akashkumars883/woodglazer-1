import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { suggestNewBlogTopics, generateAIContent, saveBlogPost, fetchUnsplashImage } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  return handleCronRequest(request);
}

export async function POST(request: Request) {
  return handleCronRequest(request);
}

async function handleCronRequest(request: Request) {
  try {
    // 1. Verify Secret Key to Prevent Abuse
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error("CRON_SECRET environment variable is not defined");
      return NextResponse.json({ success: false, error: "Cron secret is unconfigured on the server" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get("secret");

    const authHeader = request.headers.get("authorization");
    const headerSecret = authHeader ? authHeader.replace(/^bearer\s+/i, "") : null;

    if (querySecret !== cronSecret && headerSecret !== cronSecret) {
      console.warn("Unauthorized request attempt to daily blog cron endpoint");
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    console.log("Daily blog generator cron triggered successfully. Initializing...");

    // 2. Fetch Existing Blog Titles from Supabase to Prevent Duplicates
    const { data: existingPosts, error: fetchError } = await supabase
      .from("blog_posts")
      .select("title");

    if (fetchError) {
      console.error("Failed to fetch existing blog titles:", fetchError);
      return NextResponse.json({ success: false, error: "Database read failure" }, { status: 500 });
    }

    const existingTitles = (existingPosts || []).map(p => p.title);
    console.log(`Found ${existingTitles.length} existing blog posts in database.`);

    // 3. Request 2 Fresh, Unique SEO Topic Suggestions from AI
    console.log("Asking AI to suggest 2 unique SEO topics based on current posts...");
    const topicResult = await suggestNewBlogTopics(existingTitles);

    if (!topicResult.success || !topicResult.suggestions || topicResult.suggestions.length === 0) {
      console.error("Failed to generate blog topics:", topicResult.error);
      return NextResponse.json({ success: false, error: topicResult.error || "Failed to get AI topic suggestions" }, { status: 500 });
    }

    const selectedTopic = topicResult.suggestions[0];
    console.log("AI Suggested Topic:", selectedTopic);

    // 4. Generate the Long-Form SEO-Optimized Article Content in HTML
    console.log(`Requesting AI to write 1000-1200 words long-form HTML article for: "${selectedTopic.title}"...`);
    const prompt = `Write a masterfully crafted, 1000-1200 words long, deeply detailed and search-optimized article in natural, conversational, professional human English for a blog post titled "${selectedTopic.title}" under the category "${selectedTopic.category}". 

SEO Meta Description to optimize for: "${selectedTopic.description}".

Apply these critical formatting guidelines:
1. Return ONLY pure, raw renderable HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>). Do NOT wrap output inside markdown code blocks (such as \`\`\`html).
2. Write with the voice of an elite wood polishing and carpentry expert (15+ years experience).
3. Do NOT use standard robotic AI transitions or clichés ("delve", "testament", "revolutionary", "moreover", "in conclusion", "furthermore"). Keep it natural, organic, and engaging.`;

    const articleResult = await generateAIContent(prompt, false);

    if (!articleResult.success || !articleResult.text) {
      console.error("Failed to write article body content:", articleResult.error);
      return NextResponse.json({ success: false, error: articleResult.error || "Failed to generate blog post content" }, { status: 500 });
    }

    const htmlContent = articleResult.text;
    console.log(`Generated HTML content successfully (Length: ${htmlContent.length} chars).`);

    // 5. Select Category-Specific Premium Unsplash Cover Images dynamically via API
    const image = await fetchUnsplashImage(selectedTopic.title, selectedTopic.category);

    // 6. Generate Clean Slug and Calculate Stats
    const slug = selectedTopic.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const wordCount = htmlContent.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.ceil(wordCount / 200) + " min read";

    // 7. Save to Database and Revalidate Next.js Cache Automatically
    console.log("Saving new blog post into database...");
    const saveResult = await saveBlogPost({
      title: selectedTopic.title,
      slug,
      category: selectedTopic.category,
      description: selectedTopic.description,
      content: htmlContent,
      image,
      author: "Wood Glazer Expert",
      read_time: readTime,
      featured: false
    });

    if (!saveResult.success) {
      console.error("Database save failure:", saveResult.error);
      return NextResponse.json({ success: false, error: saveResult.error || "Failed to save blog post" }, { status: 500 });
    }

    console.log(`Blog post saved and published successfully! Slug: "${slug}"`);

    // Double-force cache revalidation to guarantee instant visibility on client
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({
      success: true,
      message: "Daily blog post auto-generated and published successfully",
      blog: {
        title: selectedTopic.title,
        slug,
        category: selectedTopic.category,
        description: selectedTopic.description,
        readTime,
        image
      }
    });

  } catch (err: unknown) {
    console.error("Unexpected error in daily blog cron handler:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
