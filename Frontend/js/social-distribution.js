document.addEventListener("DOMContentLoaded", function() {

    const tableBody =
        document.getElementById("socialTableBody");

    const totalPostsElement =
        document.getElementById("totalPosts");

    const plannedPostsElement =
        document.getElementById("plannedPosts");

    const publishedPostsElement =
        document.getElementById("publishedPosts");

    const referralVisitsElement =
        document.getElementById("referralVisits");

    const addSocialPostBtn =
        document.getElementById("addSocialPostBtn");

    const formContainer =
        document.getElementById("socialFormContainer");

    const socialPostForm =
        document.getElementById("socialPostForm");

    const cancelSocialBtn =
        document.getElementById("cancelSocialBtn");

    const formMessage =
        document.getElementById("socialFormMessage");

    const socialSearch =
        document.getElementById("socialSearch");

    const statusFilter =
        document.getElementById("socialStatusFilter");

    let allSocialPosts = [];


    /* ==========================================
       INITIAL LOAD
    ========================================== */

    loadSocialPosts();


    /* ==========================================
       OPEN FORM
    ========================================== */

    if (addSocialPostBtn) {

        addSocialPostBtn.addEventListener(
            "click",
            function() {

                if (formContainer) {
                    formContainer.style.display = "block";

                    formContainer.scrollIntoView({
                        behavior: "smooth"
                    });
                }

            }
        );

    }


    /* ==========================================
       CLOSE FORM
    ========================================== */

    if (cancelSocialBtn) {

        cancelSocialBtn.addEventListener(
            "click",
            function() {

                if (formContainer) {
                    formContainer.style.display = "none";
                }

                if (socialPostForm) {
                    socialPostForm.reset();
                }

                if (formMessage) {
                    formMessage.textContent = "";
                }

            }
        );

    }


    /* ==========================================
       SEARCH
    ========================================== */

    if (socialSearch) {

        socialSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    /* ==========================================
       STATUS FILTER
    ========================================== */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    /* ==========================================
       CREATE SOCIAL POST
    ========================================== */

    if (socialPostForm) {

        socialPostForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();

                if (formMessage) {
                    formMessage.textContent =
                        "Saving social post...";
                }

                const platformElement =
                    document.getElementById(
                        "socialPlatform"
                    );

                const titleElement =
                    document.getElementById(
                        "socialTitle"
                    );

                const urlElement =
                    document.getElementById(
                        "socialPostUrl"
                    );

                const statusElement =
                    document.getElementById(
                        "socialStatus"
                    );

                const socialData = {
                    platform: platformElement ?
                        platformElement.value : "",

                    post_title: titleElement ?
                        titleElement.value.trim() : "",

                    post_url: urlElement ?
                        urlElement.value.trim() : "",

                    status: statusElement ?
                        statusElement.value : "planned"
                };


                if (!socialData.platform) {

                    if (formMessage) {
                        formMessage.textContent =
                            "Platform is required.";
                    }

                    return;
                }


                try {

                    const result =
                        await apiRequest(
                            "/social", {
                                method: "POST",
                                body: JSON.stringify(
                                    socialData
                                )
                            }
                        );


                    if (formMessage) {
                        formMessage.textContent =
                            result.message ||
                            "Social post created successfully.";
                    }


                    socialPostForm.reset();

                    await loadSocialPosts();


                    setTimeout(
                        function() {

                            if (formContainer) {
                                formContainer.style.display =
                                    "none";
                            }

                            if (formMessage) {
                                formMessage.textContent =
                                    "";
                            }

                        },
                        1000
                    );


                } catch (error) {

                    console.error(
                        "Social post creation error:",
                        error
                    );

                    if (formMessage) {
                        formMessage.textContent =
                            error.message ||
                            "Failed to save social post.";
                    }

                }

            }
        );

    }


    /* ==========================================
       LOAD SOCIAL POSTS
    ========================================== */

    async function loadSocialPosts() {

        try {

            const response =
                await apiRequest("/social");

            allSocialPosts =
                response.data || [];


            updateSummary(
                allSocialPosts
            );

            applyFilters();


        } catch (error) {

            console.error(
                "Failed to load social posts:",
                error
            );

            if (tableBody) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            Failed to load social posts.
                        </td>
                    </tr>
                `;

            }

        }

    }


    /* ==========================================
       UPDATE SUMMARY
    ========================================== */

    function updateSummary(posts) {

        const total =
            posts.length;


        const planned =
            posts.filter(
                function(item) {

                    return String(
                        item.status || ""
                    ).toLowerCase() === "planned";

                }
            ).length;


        const published =
            posts.filter(
                function(item) {

                    return String(
                        item.status || ""
                    ).toLowerCase() === "published";

                }
            ).length;


        let visits = 0;


        posts.forEach(
            function(item) {

                visits +=
                    Number(
                        item.referral_visits || 0
                    );

            }
        );


        if (totalPostsElement) {
            totalPostsElement.textContent =
                total;
        }

        if (plannedPostsElement) {
            plannedPostsElement.textContent =
                planned;
        }

        if (publishedPostsElement) {
            publishedPostsElement.textContent =
                published;
        }

        if (referralVisitsElement) {
            referralVisitsElement.textContent =
                visits;
        }

    }


    /* ==========================================
       SEARCH + FILTER
    ========================================== */

    function applyFilters() {

        let searchTerm = "";

        if (socialSearch) {

            searchTerm =
                String(
                    socialSearch.value || ""
                )
                .trim()
                .toLowerCase();

        }


        let selectedStatus = "all";

        if (statusFilter) {

            selectedStatus =
                String(
                    statusFilter.value || "all"
                )
                .trim()
                .toLowerCase();

        }


        const filteredPosts =
            allSocialPosts.filter(
                function(item) {

                    const platform =
                        String(
                            item.platform || ""
                        ).toLowerCase();


                    const title =
                        String(
                            item.post_title || ""
                        ).toLowerCase();


                    const status =
                        String(
                            item.status || ""
                        ).toLowerCase();


                    const matchesSearch =
                        searchTerm === "" ||
                        platform.includes(
                            searchTerm
                        ) ||
                        title.includes(
                            searchTerm
                        );


                    const matchesStatus =
                        selectedStatus === "all" ||
                        status === selectedStatus;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        renderSocialPosts(
            filteredPosts
        );

    }


    /* ==========================================
       RENDER TABLE
    ========================================== */

    function renderSocialPosts(posts) {

        if (!tableBody) {
            return;
        }


        if (posts.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No social posts found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            posts.map(
                function(item) {

                    const publishedDate =
                        item.published_at ?
                        new Date(
                            item.published_at
                        ).toLocaleDateString(
                            "en-IN"
                        ) :
                        "-";


                    const currentStatus =
                        String(
                            item.status ||
                            "planned"
                        ).toLowerCase();


                    const safePlatform =
                        escapeHTML(
                            item.platform || "-"
                        );


                    const safeTitle =
                        escapeHTML(
                            item.post_title || "-"
                        );


                    const safeUrl =
                        item.post_url ?
                        escapeHTML(
                            item.post_url
                        ) :
                        "";


                    const postLink =
                        safeUrl ?
                        `
                                <a
                                    href="${safeUrl}"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    View Post
                                </a>
                            ` :
                        "-";


                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${safePlatform}
                                </strong>
                            </td>

                            <td>
                                ${safeTitle}
                            </td>

                            <td>
                                ${postLink}
                            </td>

                            <td>

                                <select
                                    class="social-status-select"
                                    data-id="${item.id}">

                                    <option
                                        value="planned"
                                        ${
                                            currentStatus ===
                                            "planned"
                                                ? "selected"
                                                : ""
                                        }>
                                        Planned
                                    </option>

                                    <option
                                        value="published"
                                        ${
                                            currentStatus ===
                                            "published"
                                                ? "selected"
                                                : ""
                                        }>
                                        Published
                                    </option>

                                </select>

                            </td>

                            <td>
                                ${Number(
                                    item.referral_visits || 0
                                )}
                            </td>

                            <td>
                                ${publishedDate}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="secondary-btn metric-btn"
                                    data-id="${item.id}">
                                    Edit Metrics
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


        attachTableEvents();

    }


    /* ==========================================
       TABLE EVENTS
    ========================================== */

    function attachTableEvents() {

        const statusButtons =
            document.querySelectorAll(
                ".social-status-select"
            );


        statusButtons.forEach(
            function(select) {

                select.addEventListener(
                    "change",
                    updateSocialStatus
                );

            }
        );


        const metricButtons =
            document.querySelectorAll(
                ".metric-btn"
            );


        metricButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        editSocialMetrics(
                            button.dataset.id
                        );

                    }
                );

            }
        );

    }


    /* ==========================================
       UPDATE STATUS
    ========================================== */

    async function updateSocialStatus(event) {

        const select =
            event.target;


        const postId =
            select.dataset.id;


        const newStatus =
            select.value;


        const post =
            allSocialPosts.find(
                function(item) {

                    return String(item.id) ===
                        String(postId);

                }
            );


        if (!post) {
            return;
        }


        try {

            select.disabled = true;


            await apiRequest(
                "/social/" + postId, {
                    method: "PUT",

                    body: JSON.stringify({

                        status: newStatus,

                        referral_visits: Number(
                            post.referral_visits || 0
                        ),

                        published_at: newStatus ===
                            "published" ?
                            (
                                post.published_at ||
                                new Date().toISOString()
                            ) : null

                    })
                }
            );


            post.status =
                newStatus;


            if (
                newStatus ===
                "published" &&
                !post.published_at
            ) {

                post.published_at =
                    new Date().toISOString();

            }


            if (
                newStatus ===
                "planned"
            ) {

                post.published_at =
                    null;

            }


            updateSummary(
                allSocialPosts
            );

            applyFilters();


        } catch (error) {

            console.error(
                "Social status update error:",
                error
            );

            alert(
                error.message ||
                "Failed to update social post status."
            );

            await loadSocialPosts();

        }

    }


    /* ==========================================
       EDIT METRICS
    ========================================== */

    async function editSocialMetrics(
        postId
    ) {

        const post =
            allSocialPosts.find(
                function(item) {

                    return String(item.id) ===
                        String(postId);

                }
            );


        if (!post) {

            alert(
                "Social post not found."
            );

            return;
        }


        const currentVisits =
            Number(
                post.referral_visits || 0
            );


        const visitsInput =
            prompt(
                "Enter referral visits:",
                currentVisits
            );


        if (visitsInput === null) {
            return;
        }


        const referralVisits =
            Number(visitsInput);


        if (
            isNaN(referralVisits) ||
            referralVisits < 0
        ) {

            alert(
                "Please enter a valid number."
            );

            return;
        }


        const currentStatus =
            String(
                post.status ||
                "planned"
            ).toLowerCase();


        const publishChoice =
            confirm(
                "Is this social post published?\n\n" +
                "OK = Published\n" +
                "Cancel = Planned"
            );


        const newStatus =
            publishChoice ?
            "published" :
            "planned";


        let publishedAt =
            post.published_at || null;


        if (
            newStatus ===
            "published"
        ) {

            if (!publishedAt) {

                publishedAt =
                    new Date().toISOString();

            }

        } else {

            publishedAt = null;

        }


        try {

            await apiRequest(
                "/social/" + postId, {
                    method: "PUT",

                    body: JSON.stringify({

                        status: newStatus,

                        referral_visits: referralVisits,

                        published_at: publishedAt

                    })
                }
            );


            alert(
                "Social metrics updated successfully."
            );


            await loadSocialPosts();


        } catch (error) {

            console.error(
                "Social metrics update error:",
                error
            );

            alert(
                error.message ||
                "Failed to update social metrics."
            );

        }

    }


    /* ==========================================
       ESCAPE HTML
    ========================================== */

    function escapeHTML(value) {

        return String(
                value === null ||
                value === undefined ?
                "" :
                value
            )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

});