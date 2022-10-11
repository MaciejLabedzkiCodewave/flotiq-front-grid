const apiUrl = 'https://api.flotiq.com';
const apiKey = '9e322d92e2a4800d99b311fd5390216f';
const blogPostApi = `${apiUrl}/api/v1/content/blogpost`;

const DEFAULT_ORDER = 'internal.createdAt';

export function getBlogPostsUrl(
    page,
    limit,
    filters,
    direction = 'desc',
    orderBy = DEFAULT_ORDER,
    hydrate = 1,
) {
    let url =
        `${blogPostApi}
        ?page=${page}&limit=${limit}` +
        `&order_by=${orderBy}&order_direction=${direction}` +
        `&auth_token=${apiKey}`;

    if (filters !== undefined) {
        url += `&filters=${encodeURIComponent(filters)}`;
    }

    if (hydrate !== undefined) {
        url += '&hydrate=' + hydrate;
    }

    return url;
}

export async function getBlogPosts(
    page = 1,
    limit = 10,
    filters,
    direction,
    orderBy,
    hydrate,
) {
    const url = getBlogPostsUrl(
        page,
        limit,
        filters,
        direction,
        orderBy,
        hydrate,
    );
    const res = await fetch(url);
    return res.json();
}
export async function getBlogPostBySlug(slug) {
    const filters = `{"slug":{"type":"contains","filter":"${slug}"}}`;
    const url = getBlogPostsUrl(1, 1, filters);
    const res = await fetch(url);
    return res.json();
}

export async function getPreviousBlogPost(date) {
    const filters = `{"internal.createdAt":{"type":"lessThan", "filter": "${date}"}}`;
    const url = getBlogPostsUrl(1, 1, filters, 'desc', DEFAULT_ORDER, 0);
    const res = await fetch(url);
    return res.json();
}

export async function getNextBlogPost(date) {
    const filters = `{"internal.createdAt":{"type":"greaterThan","filter":"${date}"}}`;
    const url = getBlogPostsUrl(1, 4, filters, 'asc', DEFAULT_ORDER, 0);
    const res = await fetch(url);
    return res.json();
}
