document.addEventListener("DOMContentLoaded", () => {

    const tableBody =
        document.getElementById("contentTableBody");

    const totalContent =
        document.getElementById("totalContent");

    const publishedContent =
        document.getElementById("publishedContent");

    const organicVisits =
        document.getElementById("organicVisits");

    const leadsGenerated =
        document.getElementById("leadsGenerated");

    const addContentBtn =
        document.getElementById("addContentBtn");

    const formContainer =
        document.getElementById("contentFormContainer");

    const contentForm =
        document.getElementById("contentForm");

    const cancelContentBtn =
        document.getElementById("cancelContentBtn");

    const formMessage =
        document.getElementById("contentFormMessage");

    const contentSearch =
        document.getElementById("contentSearch");

    const statusFilter =
        document.getElementById("contentStatusFilter");


    let allContent = [];


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadContent();


    // ==========================================
    // OPEN FORM
    // ==========================================

    if (addContentBtn) {

        addContentBtn.addEventListener(
            "click",
            () => {

                formContainer.style.display =
                    "block";

                formContainer.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    }


    // ==========================================
    // CLOSE FORM
    // ==========================================

    if (cancelContentBtn) {

        cancelContentBtn.addEventListener(
            "click",
            () => {

                formContainer.style.display =
                    "none";

                contentForm.reset();

                formMessage.textContent = "";

            }
        );

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (contentSearch) {

        contentSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // ==========================================
    // CREATE SEO CONTENT
    // ==========================================

    if (contentForm) {

        contentForm.addEventListener(
            "submit",
            async(event) => {

                event.preventDefault();

                formMessage.textContent =
                    "Saving SEO content...";


                const contentData = {

                    title: document
                        .getElementById("contentTitle")
                        .value
                        .trim(),

                    slug: document
                        .getElementById("contentSlug")
                        .value
                        .trim(),

                    target_keyword: document
                        .getElementById("targetKeyword")
                        .value
                        .trim(),

                    search_intent: document
                        .getElementById("searchIntent")
                        .value,

                    target_url: document
                        .getElementById("targetUrl")
                        .value
                        .trim(),

                    category: document
                        .getElementById("contentCategory")
                        .value
                        .trim(),

                    status: document
                        .getElementById("contentStatus")
                        .value

                };


                if (!contentData.title) {

                    formMessage.textContent =
                        "Article title is required.";

                    return;

                }


                if (!contentData.slug) {

                    formMessage.textContent =
                        "Article slug is required.";

                    return;

                }


                try {

                    const result =
                        await apiRequest(
                            "/organic-traffic", {
                                method: "POST",

                                body: JSON.stringify(
                                    contentData
                                )
                            }
                        );


                    formMessage.textContent =
                        result.message ||
                        "SEO content created successfully.";


                    contentForm.reset();


                    await loadContent();


                    setTimeout(() => {

                        formContainer.style.display =
                            "none";

                        formMessage.textContent =
                            "";

                    }, 1000);


                } catch (error) {

                    console.error(
                        "SEO content creation error:",
                        error
                    );

                    formMessage.textContent =
                        error.message ||
                        "Failed to save SEO content.";

                }

            }
        );

    }


    // ==========================================
    // LOAD CONTENT
    // ==========================================

    async function loadContent() {

        try {

            const result =
                await apiRequest(
                    "/organic-traffic"
                );


            allContent =
                result.data || [];


            updateSummary(
                allContent
            );


            renderContent(
                allContent
            );


        } catch (error) {

            console.error(
                "Organic content loading error:",
                error
            );


            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        Failed to load content.
                    </td>
                </tr>
            `;

        }

    }


    // ==========================================
    // UPDATE SUMMARY
    // ==========================================

    function updateSummary(content) {

        totalContent.textContent =
            content.length;


        publishedContent.textContent =
            content.filter(item => {

                return String(
                        item.status || ""
                    )
                    .toLowerCase() === "published";

            }).length;


        let totalVisits = 0;

        let totalLeads = 0;


        content.forEach(item => {

            totalVisits +=
                Number(
                    item.organic_visits || 0
                );


            totalLeads +=
                Number(
                    item.leads_generated || 0
                );

        });


        organicVisits.textContent =
            totalVisits;


        leadsGenerated.textContent =
            totalLeads;

    }


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    function applyFilters() {

        let searchTerm = "";


        if (contentSearch) {

            searchTerm =
                String(
                    contentSearch.value || ""
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


        const filteredContent =
            allContent.filter(item => {

                const title =
                    String(
                        item.title || ""
                    )
                    .toLowerCase();


                const keyword =
                    String(
                        item.target_keyword || ""
                    )
                    .toLowerCase();


                const category =
                    String(
                        item.category || ""
                    )
                    .toLowerCase();


                const status =
                    String(
                        item.status || ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    searchTerm === "" ||
                    title.includes(searchTerm) ||
                    keyword.includes(searchTerm) ||
                    category.includes(searchTerm);


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            });


        renderContent(
            filteredContent
        );

    }


    // ==========================================
    // RENDER TABLE
    // ==========================================

    function renderContent(content) {

        if (content.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No content found.
                    </td>
                </tr>
            `;

            return;

        }


        tableBody.innerHTML =
            content.map(item => {

                const publishedDate =
                    item.published_at ?
                    new Date(
                        item.published_at
                    ).toLocaleDateString() :
                    "-";


                const status =
                    String(
                        item.status || "draft"
                    ).toLowerCase();


                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    item.title
                                )}
                            </strong>
                        </td>


                        <td>
                            ${escapeHTML(
                                item.target_keyword || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                item.search_intent || "-"
                            )}
                        </td>


                        <td>

                            <select
                                class="content-status-select"
                                data-id="${item.id}">

                                <option
                                    value="draft"
                                    ${status === "draft"
                                        ? "selected"
                                        : ""}>
                                    Draft
                                </option>


                                <option
                                    value="published"
                                    ${status === "published"
                                        ? "selected"
                                        : ""}>
                                    Published
                                </option>

                            </select>

                        </td>


                        <td>
                            ${Number(
                                item.organic_visits || 0
                            )}
                        </td>


                        <td>
                            ${Number(
                                item.leads_generated || 0
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

            }).join("");


        // ==========================================
        // STATUS BUTTON EVENTS
        // ==========================================

        document
            .querySelectorAll(
                ".content-status-select"
            )
            .forEach(select => {

                select.addEventListener(
                    "change",
                    updateContentStatus
                );

            });


        // ==========================================
        // EDIT METRICS BUTTON EVENTS
        // ==========================================

        document
            .querySelectorAll(
                ".metric-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    editMetrics
                );

            });

    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    async function updateContentStatus(event) {

        const select =
            event.target;


        const contentId =
            select.dataset.id;


        const newStatus =
            select.value;


        try {

            select.disabled = true;


            const content =
                allContent.find(item => {

                    return String(item.id) ===
                        String(contentId);

                });


            if (content) {

                content.status =
                    newStatus;


                if (
                    newStatus === "published" &&
                    !content.published_at
                ) {

                    content.published_at =
                        new Date().toISOString();

                }


                if (
                    newStatus === "draft"
                ) {

                    content.published_at =
                        null;

                }

            }


            updateSummary(
                allContent
            );


            applyFilters();


        } catch (error) {

            console.error(
                "Content status update error:",
                error
            );

        } finally {

            select.disabled = false;

        }

    }


    // ==========================================
    // EDIT ORGANIC METRICS
    // ==========================================

    async function editMetrics(event) {

        const button =
            event.target;


        const articleId =
            button.dataset.id;


        const article =
            allContent.find(item => {

                return String(item.id) ===
                    String(articleId);

            });


        if (!article) {

            alert(
                "Article not found."
            );

            return;

        }


        const visits =
            prompt(
                "Enter organic visits:",
                article.organic_visits || 0
            );


        if (visits === null) {

            return;

        }


        const leads =
            prompt(
                "Enter leads generated:",
                article.leads_generated || 0
            );


        if (leads === null) {

            return;

        }


        const visitNumber =
            Number(visits);


        const leadNumber =
            Number(leads);


        if (
            isNaN(visitNumber) ||
            isNaN(leadNumber) ||
            visitNumber < 0 ||
            leadNumber < 0
        ) {

            alert(
                "Please enter valid numbers."
            );

            return;

        }


        try {

            button.disabled = true;

            button.textContent =
                "Saving...";


            await apiRequest(
                "/organic-traffic/" +
                articleId +
                "/metrics", {
                    method: "PUT",

                    body: JSON.stringify({
                        organic_visits: visitNumber,

                        leads_generated: leadNumber
                    })
                }
            );


            await loadContent();


        } catch (error) {

            console.error(
                "Metric update error:",
                error
            );


            alert(
                error.message ||
                "Failed to update metrics."
            );


        } finally {

            button.disabled = false;

            button.textContent =
                "Edit Metrics";

        }

    }

});


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)

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