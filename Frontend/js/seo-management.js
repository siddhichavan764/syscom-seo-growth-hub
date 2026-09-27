document.addEventListener("DOMContentLoaded", () => {
    loadKeywords();
    loadBacklinks();
    loadDirectories();

    loadSocialArticles();
    loadSocialPosts();

    const keywordForm = document.getElementById("keywordForm");
    const socialForm = document.getElementById("socialPostForm");
    const backlinkForm = document.getElementById("backlinkForm");
    const directoryForm = document.getElementById("directoryForm");

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    if (keywordForm) {
        keywordForm.addEventListener("submit", async(event) => {
            event.preventDefault();

            const formData = new FormData(keywordForm);
            console.log("Keyword:", formData.get("keyword"));
            console.log("Intent:", formData.get("search_intent"));
            console.log("Target URL:", formData.get("target_url"));
            console.log("Priority:", formData.get("priority"));
            try {
                await apiRequest("/keywords", {
                    method: "POST",
                    body: JSON.stringify({
                        keyword: formData.get("keyword"),
                        search_intent: formData.get("search_intent"),
                        target_url: formData.get("target_url"),
                        priority: formData.get("priority"),
                        status: "planned"
                    })
                });

                alert("Keyword added successfully!");
                keywordForm.reset();
                loadKeywords();

            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (backlinkForm) {
        backlinkForm.addEventListener("submit", async(event) => {
            event.preventDefault();

            const formData = new FormData(backlinkForm);

            try {
                await apiRequest("/backlinks", {
                    method: "POST",
                    body: JSON.stringify({
                        domain: formData.get("domain"),
                        url: formData.get("url"),
                        anchor_text: formData.get("anchor_text"),
                        status: formData.get("status")
                    })
                });

                alert("Backlink opportunity added!");
                backlinkForm.reset();
                loadBacklinks();

            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (directoryForm) {
        directoryForm.addEventListener("submit", async(event) => {
            event.preventDefault();

            const formData = new FormData(directoryForm);

            try {
                await apiRequest("/directories", {
                    method: "POST",
                    body: JSON.stringify({
                        name: formData.get("name"),
                        url: formData.get("url"),
                        category: formData.get("category"),
                        status: formData.get("status")
                    })
                });

                alert("Directory opportunity added!");
                directoryForm.reset();
                loadDirectories();

            } catch (error) {
                alert(error.message);
            }
        });
    }
    if (socialForm) {
        socialForm.addEventListener(
            "submit",
            createSocialPost
        );
    }
});


async function loadKeywords() {
    try {
        const result = await apiRequest("/keywords");

        const tbody = document.getElementById("keywordsTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        result.data.forEach((keyword) => {
            tbody.innerHTML += `
                <tr>
                    <td>${keyword.keyword}</td>
                    <td>${keyword.search_intent || "-"}</td>
                    <td>${keyword.target_url || "-"}</td>
                    <td>${keyword.priority || "-"}</td>
                    <td>${keyword.status || "-"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Failed to load keywords:", error);
    }
}


async function loadBacklinks() {
    try {
        const result = await apiRequest("/backlinks");

        const tbody = document.getElementById("backlinksTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        result.data.forEach((backlink) => {
            tbody.innerHTML += `
                <tr>
                    <td>${backlink.domain}</td>
                    <td>${backlink.url || "-"}</td>
                    <td>${backlink.anchor_text || "-"}</td>
                    <td>${backlink.status || "-"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Failed to load backlinks:", error);
    }
}


async function loadDirectories() {
    try {
        const result = await apiRequest("/directories");

        const tbody = document.getElementById("directoriesTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        result.data.forEach((directory) => {
            tbody.innerHTML += `
                <tr>
                    <td>${directory.name}</td>
                    <td>${directory.url || "-"}</td>
                    <td>${directory.category || "-"}</td>
                    <td>${directory.status || "-"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Failed to load directories:", error);
    }
}
// ===============================
// SOCIAL DISTRIBUTION
// ===============================

async function loadSocialArticles() {

    try {

        const response = await apiRequest("/articles");

        const articles = response.data || [];

        const select = document.getElementById("socialArticle");

        if (!select) return;

        select.innerHTML = `
            <option value="">
                Select article
            </option>
        `;

        articles.forEach(article => {

            const option = document.createElement("option");

            option.value = article.id;

            option.textContent = article.title;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Failed to load articles:",
            error
        );

    }
}


async function loadSocialPosts() {

    try {

        const response = await apiRequest("/social");

        const posts = response.data || [];

        const table =
            document.getElementById("socialPostsTable");

        if (!table) return;

        if (posts.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        No social posts found.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = posts.map(post => {

            const postLink = post.post_url ?
                `<a href="${post.post_url}"
                     target="_blank"
                     rel="noopener noreferrer">
                     View Post
                   </a>` :
                "—";


            const date = post.created_at ?
                new Date(post.created_at)
                .toLocaleDateString() :
                "—";


            return `
                <tr>

                    <td>
                        ${escapeHtml(
                            post.article_title || "—"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            post.platform
                        )}
                    </td>

                    <td>
                        ${postLink}
                    </td>

                    <td>
                        ${escapeHtml(
                            post.status
                        )}
                    </td>

                    <td>
                        ${Number(
                            post.referral_visits || 0
                        )}
                    </td>

                    <td>
                        ${date}
                    </td>

                </tr>
            `;

        }).join("");

    } catch (error) {

        console.error(
            "Failed to load social posts:",
            error
        );

    }
}


async function createSocialPost(event) {

    event.preventDefault();

    const message =
        document.getElementById("socialMessage");

    try {

        const articleId =
            document.getElementById(
                "socialArticle"
            ).value;


        const platform =
            document.getElementById(
                "socialPlatform"
            ).value;


        const postTitle =
            document.getElementById(
                "socialTitle"
            ).value.trim();


        const postUrl =
            document.getElementById(
                "socialUrl"
            ).value.trim();


        const status =
            document.getElementById(
                "socialStatus"
            ).value;


        const publishedAt =
            document.getElementById(
                "socialDate"
            ).value;


        const referralVisits =
            document.getElementById(
                "socialVisits"
            ).value;


        if (!platform) {

            message.textContent =
                "Please select a platform.";

            return;
        }


        await apiRequest("/social", {

            method: "POST",

            body: JSON.stringify({

                article_id: articleId || null,

                platform,

                post_title: postTitle || null,

                post_url: postUrl || null,

                status,

                published_at: publishedAt || null,

                referral_visits: Number(referralVisits) || 0

            })

        });


        message.textContent =
            "Social post added successfully.";


        document
            .getElementById("socialPostForm")
            .reset();


        await loadSocialPosts();

    } catch (error) {

        console.error(error);

        message.textContent =
            error.message ||
            "Failed to create social post.";

    }

};