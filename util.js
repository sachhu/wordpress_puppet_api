const puppeteer = require('puppeteer');

// Function to make API requests via Puppeteer
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    const url = process.env.URL + endpoint;
    try {
        const encodedCredentials = Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString('base64');
        const authHeader = `Basic ${encodedCredentials}`;
        console.log(url)
        const response = await page.evaluate(async (url, method, data, authHeader) => {
            const fetchOptions = {
                method,
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                }
            };
            if (data) fetchOptions.body = JSON.stringify(data);

            const fetchResponse = await fetch(url, fetchOptions);
            if (fetchResponse.ok) {
                return await fetchResponse.json();
            } else {
                return {
                    error: true,
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    body: await fetchResponse.text()
                };
            }
        }, url, method, data, authHeader);
        if (response.error) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.error(`Response Body: ${response.body}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Function to check if category exists, else create it
async function getOrCreateCategory(categoryName) {
    try {
        // Check if category exists
        const existingCategories = await makeApiRequest(`/wp-json/wp/v2/categories?search=${encodeURIComponent(categoryName)}`);
        if (existingCategories.length > 0) {
            return existingCategories[0].id;  // Return existing category ID
        }

        // Create new category
        const newCategory = await makeApiRequest(`/wp-json/wp/v2/categories`, 'POST', { name: categoryName });
        return newCategory.id;  // Return new category ID
    } catch (error) {
        console.error(`Error with category "${categoryName}":`, error);
        return null;
    }
}

// Function to check if tag exists, else create it
async function getOrCreateTag(tagName) {
    try {
        // Check if tag exists
        const existingTags = await makeApiRequest(`/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`);
        if (existingTags.length > 0) {
            return existingTags[0].id;  // Return existing tag ID
        }

        // Create new tag
        const newTag = await makeApiRequest(`/wp-json/wp/v2/tags`, 'POST', { name: tagName });
        return newTag.id;  // Return new tag ID
    } catch (error) {
        console.error(`Error with tag "${tagName}":`, error);
        return null;
    }
}

// Function to create a blog post
let browser
let page
async function createBlogPost(title, content, categories, tags, status = "draft") {
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        page = await browser.newPage();
        await page.goto(process.env.URL);
        // Resolve category and tag IDs
        let tagIds = [];
        for (let i = 0; i < tags.length; i++) {
            tagIds[i] = await getOrCreateTag(tags[i])
        }
        let categoryIds = [];
        for (let i = 0; i < categories.length; i++) {
            categoryIds[i] = await getOrCreateCategory(categories[i])
        }

        // Filter out any null values
        const validCategoryIds = categoryIds.filter(id => id !== null);
        const validTagIds = tagIds.filter(id => id !== null);

        // Create blog post
        const postData = {
            title,
            content,
            status,
            categories: validCategoryIds,
            tags: validTagIds
        };

        const newPost = await makeApiRequest(`/wp-json/wp/v2/posts`, 'POST', postData);
        console.log("✅ Blog Post Created:", newPost.link);
        await browser?.close()
    } catch (error) {
        console.error("❌ Error Creating Post:", error);
        await browser?.close()
        throw error
    }
}


module.exports = {
    createBlogPost
}