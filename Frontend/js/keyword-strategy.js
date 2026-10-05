document.addEventListener("DOMContentLoaded", () => {

    const tableBody =
        document.getElementById("keywordTableBody");

    const totalKeywords =
        document.getElementById("totalKeywords");

    const highPriority =
        document.getElementById("highPriority");

    const transactionalKeywords =
        document.getElementById("transactionalKeywords");

    const plannedKeywords =
        document.getElementById("plannedKeywords");

    const addKeywordBtn =
        document.getElementById("addKeywordBtn");

    const formContainer =
        document.getElementById("keywordFormContainer");

    const keywordForm =
        document.getElementById("keywordForm");

    const cancelKeywordBtn =
        document.getElementById("cancelKeywordBtn");

    const formMessage =
        document.getElementById("keywordFormMessage");

    const keywordSearch =
        document.getElementById("keywordSearch");

    const intentFilter =
        document.getElementById("intentFilter");


    // Store all keywords
    let allKeywords = [];


    // Load keywords when page opens
    loadKeywords();


    // -----------------------------
    // OPEN ADD KEYWORD FORM
    // -----------------------------

    addKeywordBtn.addEventListener("click", () => {

        formContainer.style.display = "block";

        formContainer.scrollIntoView({
            behavior: "smooth"
        });

    });


    // -----------------------------
    // CLOSE ADD KEYWORD FORM
    // -----------------------------

    cancelKeywordBtn.addEventListener("click", () => {

        formContainer.style.display = "none";

        keywordForm.reset();

        formMessage.textContent = "";

    });


    // -----------------------------
    // SEARCH FILTER
    // -----------------------------

    if (keywordSearch) {

        keywordSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    // -----------------------------
    // INTENT FILTER
    // -----------------------------

    if (intentFilter) {

        intentFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // -----------------------------
    // ADD KEYWORD
    // -----------------------------

    keywordForm.addEventListener(
        "submit",
        async(event) => {

            event.preventDefault();

            formMessage.textContent =
                "Saving keyword...";


            const keywordData = {

                keyword: document
                    .getElementById("keyword")
                    .value
                    .trim(),

                search_intent: document
                    .getElementById("searchIntent")
                    .value,

                location: document
                    .getElementById("location")
                    .value
                    .trim(),

                search_volume: Number(
                    document
                    .getElementById("searchVolume")
                    .value
                ) || 0,

                competition: document
                    .getElementById("competition")
                    .value,

                target_url: document
                    .getElementById("targetUrl")
                    .value
                    .trim(),

                priority: document
                    .getElementById("priority")
                    .value,

                status: document
                    .getElementById("status")
                    .value

            };


            try {

                const result =
                    await apiRequest(
                        "/keywords", {
                            method: "POST",

                            body: JSON.stringify(
                                keywordData
                            )
                        }
                    );


                formMessage.textContent =
                    result.message ||
                    "Keyword saved successfully.";


                keywordForm.reset();


                await loadKeywords();


                setTimeout(() => {

                    formContainer.style.display =
                        "none";

                    formMessage.textContent =
                        "";

                }, 1000);


            } catch (error) {

                console.error(
                    "Keyword creation error:",
                    error
                );

                formMessage.textContent =
                    error.message ||
                    "Failed to save keyword.";

            }

        }
    );


    // -----------------------------
    // LOAD KEYWORDS
    // -----------------------------

    async function loadKeywords() {

        try {

            const result =
                await apiRequest("/keywords");


            allKeywords =
                result.data || [];


            // Update summary cards
            updateSummary(allKeywords);


            // Display keywords
            renderKeywords(allKeywords);


        } catch (error) {

            console.error(
                "Keyword loading error:",
                error
            );


            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Failed to load keywords.
                    </td>
                </tr>
            `;

        }

    }


    // -----------------------------
    // UPDATE SUMMARY
    // -----------------------------

    function updateSummary(keywords) {

        totalKeywords.textContent =
            keywords.length;


        highPriority.textContent =
            keywords.filter(item =>
                String(item.priority)
                .toLowerCase() === "high"
            ).length;


        transactionalKeywords.textContent =
            keywords.filter(item =>
                String(item.search_intent)
                .toLowerCase() === "transactional"
            ).length;


        plannedKeywords.textContent =
            keywords.filter(item =>
                String(item.status)
                .toLowerCase() === "planned"
            ).length;

    }


    // -----------------------------
    // APPLY SEARCH + INTENT FILTER
    // -----------------------------

    function applyFilters() {

        const searchTerm =
            String(
                keywordSearch ? keywordSearch.value : ""
            )
            .trim()
            .toLowerCase();

        const selectedIntent =
            String(
                intentFilter ? intentFilter.value : "all"
            )
            .toLowerCase();


        const filteredKeywords =
            allKeywords.filter(item => {

                const keywordText =
                    String(
                        item.keyword || ""
                    )
                    .toLowerCase();


                const intent =
                    String(
                        item.search_intent || ""
                    )
                    .toLowerCase();


                const matchesSearch = !searchTerm ||
                    keywordText.includes(
                        searchTerm
                    );


                const matchesIntent =
                    selectedIntent === "all" ||
                    intent === selectedIntent;


                return (
                    matchesSearch &&
                    matchesIntent
                );

            });


        renderKeywords(filteredKeywords);

    }


    // -----------------------------
    // RENDER KEYWORDS
    // -----------------------------

    function renderKeywords(keywords) {

        if (keywords.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No matching keywords found.
                    </td>
                </tr>
            `;

            return;

        }


        tableBody.innerHTML =
            keywords.map(keyword => {

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    keyword.keyword
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                keyword.search_intent || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                keyword.location || "-"
                            )}
                        </td>

                        <td>
                            ${keyword.search_volume || 0}
                        </td>

                        <td>
                            ${escapeHTML(
                                keyword.competition || "-"
                            )}
                        </td>

                        <td>
                            <span class="priority-badge ${getPriorityClass(
                                keyword.priority
                            )}">
                                ${escapeHTML(
                                    keyword.priority || "-"
                                )}
                            </span>
                        </td>

                        <td>
                            <span class="status-badge">
                                ${escapeHTML(
                                    keyword.status || "-"
                                )}
                            </span>
                        </td>

                    </tr>
                `;

            }).join("");

    }

});


// -----------------------------
// PRIORITY CLASS
// -----------------------------

function getPriorityClass(priority) {

    const value =
        String(priority || "")
        .toLowerCase();


    if (value === "high") {

        return "priority-high";

    }


    if (value === "medium") {

        return "priority-medium";

    }


    return "priority-low";

}


// -----------------------------
// HTML SECURITY
// -----------------------------

function escapeHTML(value) {

    return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}