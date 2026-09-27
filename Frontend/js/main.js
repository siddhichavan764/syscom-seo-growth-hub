/*
=========================================================
SYSCOM - MAIN JAVASCRIPT
=========================================================
*/


/*
=========================================================
SECURITY HELPER
=========================================================
*/

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
=========================================================
HOMEPAGE - LATEST ARTICLES
=========================================================
*/

async function loadLatestArticles() {

    const container =
        document.getElementById("latestArticles");

    if (!container) {
        return;
    }

    try {

        const response =
            await apiRequest("/articles");

        const articles =
            Array.isArray(response.data) ?
            response.data.slice(0, 3) : [];


        if (articles.length === 0) {

            container.innerHTML = `
                <article class="card">

                    <h3>
                        Resources Coming Soon
                    </h3>

                    <p>
                        New digital growth insights
                        will be published here.
                    </p>

                </article>
            `;

            return;
        }


        container.innerHTML =
            articles.map(article => `

                <article class="card">

                    <div class="card-icon">

                        ${escapeHtml(
                            article.category || "RESOURCE"
                        )}

                    </div>

                    <h3>

                        ${escapeHtml(
                            article.title
                        )}

                    </h3>

                    <p>

                        ${escapeHtml(
                            article.excerpt || ""
                        )}

                    </p>

                    <a
                        href="article.html?slug=${encodeURIComponent(
                            article.slug
                        )}"
                    >
                        Read article →
                    </a>

                </article>

            `).join("");


    } catch (error) {

        console.error(
            "Failed to load articles:",
            error
        );

        container.innerHTML = `

            <article class="card">

                <h3>
                    Resources
                </h3>

                <p>
                    Unable to load resources right now.
                </p>

            </article>

        `;
    }
}


/*
=========================================================
ARTICLE PAGE
=========================================================
*/

async function loadArticle() {

    const articleContainer =
        document.getElementById("articleContent");

    /*
    If we are not on the article page,
    simply stop.
    */

    if (!articleContainer) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const slug =
        params.get("slug");


    /*
    No article slug
    */

    if (!slug) {

        articleContainer.innerHTML = `

            <div class="card">

                <h2>
                    Article Not Found
                </h2>

                <p>
                    No article was specified.
                </p>

                <a href="blog.html">
                    Back to Resources
                </a>

            </div>

        `;

        return;
    }


    try {

        const response =
            await apiRequest(
                `/articles/${encodeURIComponent(slug)}`
            );

        const article =
            response.data;


        /*
        =================================================
        PAGE TITLE
        =================================================
        */

        document.title =
            article.meta_title ||
            `${article.title} | Syscom`;


        /*
        =================================================
        META DESCRIPTION
        =================================================
        */

        const description =
            article.meta_description ||
            article.excerpt ||
            "";


        const descriptionTag =
            document.querySelector(
                'meta[name="description"]'
            );


        if (descriptionTag) {

            descriptionTag.setAttribute(
                "content",
                description
            );

        }


        /*
        =================================================
        CANONICAL URL
        =================================================
        */

        const canonicalUrl =
            `https://www.syscom.co.in/article.html?slug=${encodeURIComponent(
                article.slug
            )}`;


        const canonical =
            document.querySelector(
                'link[rel="canonical"]'
            );


        if (canonical) {

            canonical.setAttribute(
                "href",
                canonicalUrl
            );

        }


        /*
        =================================================
        OPEN GRAPH
        =================================================
        */

        const ogTitle =
            document.querySelector(
                'meta[property="og:title"]'
            );


        if (ogTitle) {

            ogTitle.setAttribute(
                "content",
                article.meta_title ||
                article.title
            );

        }


        const ogDescription =
            document.querySelector(
                'meta[property="og:description"]'
            );


        if (ogDescription) {

            ogDescription.setAttribute(
                "content",
                description
            );

        }


        const ogUrl =
            document.querySelector(
                'meta[property="og:url"]'
            );


        if (ogUrl) {

            ogUrl.setAttribute(
                "content",
                canonicalUrl
            );

        }


        /*
        =================================================
        TWITTER
        =================================================
        */

        const twitterTitle =
            document.querySelector(
                'meta[name="twitter:title"]'
            );


        if (twitterTitle) {

            twitterTitle.setAttribute(
                "content",
                article.meta_title ||
                article.title
            );

        }


        const twitterDescription =
            document.querySelector(
                'meta[name="twitter:description"]'
            );


        if (twitterDescription) {

            twitterDescription.setAttribute(
                "content",
                description
            );

        }


        /*
        =================================================
        ARTICLE STRUCTURED DATA
        =================================================
        */

        const articleSchema = {

            "@context": "https://schema.org",

            "@type": "Article",

            "headline": article.title,

            "description": description,

            "url": canonicalUrl,

            "datePublished": article.created_at,

            "dateModified": article.updated_at ||
                article.created_at,

            "author": {

                "@type": "Organization",

                "name": "Syscom"

            },

            "publisher": {

                "@type": "Organization",

                "name": "Syscom",

                "url": "https://www.syscom.co.in/"

            }

        };


        const articleSchemaElement =
            document.getElementById(
                "articleSchema"
            );


        if (articleSchemaElement) {

            articleSchemaElement.textContent =
                JSON.stringify(
                    articleSchema
                );

        }


        /*
        =================================================
        BREADCRUMB STRUCTURED DATA
        =================================================
        */

        const breadcrumbSchema = {

            "@context": "https://schema.org",

            "@type": "BreadcrumbList",

            "itemListElement": [

                {

                    "@type": "ListItem",

                    "position": 1,

                    "name": "Home",

                    "item": "https://www.syscom.co.in/"

                },

                {

                    "@type": "ListItem",

                    "position": 2,

                    "name": "Resources",

                    "item": "https://www.syscom.co.in/blog.html"

                },

                {

                    "@type": "ListItem",

                    "position": 3,

                    "name": article.title,

                    "item": canonicalUrl

                }

            ]

        };


        const breadcrumbSchemaElement =
            document.getElementById(
                "breadcrumbSchema"
            );


        if (breadcrumbSchemaElement) {

            breadcrumbSchemaElement.textContent =
                JSON.stringify(
                    breadcrumbSchema
                );

        }


        /*
        =================================================
        UPDATE BREADCRUMB TEXT
        =================================================
        */

        const breadcrumbTitle =
            document.getElementById(
                "breadcrumbArticleTitle"
            );


        if (breadcrumbTitle) {

            breadcrumbTitle.textContent =
                article.title;

        }


        /*
        =================================================
        ARTICLE CONTENT
        =================================================
        */

        articleContainer.innerHTML = `

            <article class="article-content">

                <p class="eyebrow">

                    ${escapeHtml(
                        article.category ||
                        "RESOURCE"
                    )}

                </p>


                <h1>

                    ${escapeHtml(
                        article.title
                    )}

                </h1>


                ${
                    article.excerpt
                        ? `

                            <p class="hero-text">

                                ${escapeHtml(
                                    article.excerpt
                                )}

                            </p>

                        `
                        : ""
                }


                <div class="article-body">

                    ${
                        article.content ||
                        "<p>No article content available.</p>"
                    }

                </div>


                <br>


                <a
                    href="blog.html"
                    class="button secondary"
                >
                    ← Back to Resources
                </a>

            </article>

        `;


    } catch (error) {

        console.error(
            "Failed to load article:",
            error
        );


        articleContainer.innerHTML = `

            <div class="card">

                <h2>
                    Unable to Load Article
                </h2>

                <p>
                    The requested article could not
                    be loaded right now.
                </p>

                <a href="blog.html">
                    Back to Resources
                </a>

            </div>

        `;

    }

}


/*
=========================================================
INITIALIZE
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLatestArticles();

        loadArticle();

    }
);