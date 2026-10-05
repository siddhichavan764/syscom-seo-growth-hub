document.addEventListener("DOMContentLoaded", () => {

            const tableBody =
                document.getElementById("backlinkTableBody");

            const totalBacklinks =
                document.getElementById("totalBacklinks");

            const potentialBacklinks =
                document.getElementById("potentialBacklinks");

            const outreachBacklinks =
                document.getElementById("outreachBacklinks");

            const verifiedBacklinks =
                document.getElementById("verifiedBacklinks");

            const addBacklinkBtn =
                document.getElementById("addBacklinkBtn");

            const formContainer =
                document.getElementById("backlinkFormContainer");

            const backlinkForm =
                document.getElementById("backlinkForm");

            const cancelBacklinkBtn =
                document.getElementById("cancelBacklinkBtn");

            const formMessage =
                document.getElementById("backlinkFormMessage");

            const backlinkSearch =
                document.getElementById("backlinkSearch");

            const statusFilter =
                document.getElementById("backlinkStatusFilter");


            // Store all backlinks
            let allBacklinks = [];


            // Load backlinks when page opens
            loadBacklinks();


            // ==========================================
            // OPEN ADD BACKLINK FORM
            // ==========================================

            addBacklinkBtn.addEventListener("click", () => {

                formContainer.style.display = "block";

                formContainer.scrollIntoView({
                    behavior: "smooth"
                });

            });


            // ==========================================
            // CLOSE ADD BACKLINK FORM
            // ==========================================

            cancelBacklinkBtn.addEventListener("click", () => {

                formContainer.style.display = "none";

                backlinkForm.reset();

                formMessage.textContent = "";

            });


            // ==========================================
            // SEARCH FILTER
            // ==========================================

            if (backlinkSearch) {

                backlinkSearch.addEventListener(
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
            // ADD BACKLINK
            // ==========================================

            backlinkForm.addEventListener(
                "submit",
                async(event) => {

                    event.preventDefault();

                    formMessage.textContent =
                        "Saving backlink...";


                    const backlinkData = {

                        domain: document
                            .getElementById("domain")
                            .value
                            .trim(),

                        url: document
                            .getElementById("backlinkUrl")
                            .value
                            .trim(),

                        anchor_text: document
                            .getElementById("anchorText")
                            .value
                            .trim(),

                        status: document
                            .getElementById("backlinkStatus")
                            .value

                    };


                    // Validate domain

                    if (!backlinkData.domain) {

                        formMessage.textContent =
                            "Domain is required.";

                        return;

                    }


                    try {

                        const result =
                            await apiRequest(
                                "/backlinks", {
                                    method: "POST",

                                    body: JSON.stringify(
                                        backlinkData
                                    )
                                }
                            );


                        formMessage.textContent =
                            result.message ||
                            "Backlink added successfully.";


                        backlinkForm.reset();


                        // Reload data

                        await loadBacklinks();


                        // Close form

                        setTimeout(() => {

                            formContainer.style.display =
                                "none";

                            formMessage.textContent =
                                "";

                        }, 1000);


                    } catch (error) {

                        console.error(
                            "Backlink creation error:",
                            error
                        );

                        formMessage.textContent =
                            error.message ||
                            "Failed to save backlink.";

                    }

                }
            );


            // ==========================================
            // LOAD BACKLINKS
            // ==========================================

            async function loadBacklinks() {

                try {

                    const result =
                        await apiRequest("/backlinks");


                    allBacklinks =
                        result.data || [];


                    // Update summary cards

                    updateSummary(allBacklinks);


                    // Render table

                    renderBacklinks(allBacklinks);


                } catch (error) {

                    console.error(
                        "Backlink loading error:",
                        error
                    );


                    tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load backlinks.
                    </td>
                </tr>
            `;

                }

            }


            // ==========================================
            // UPDATE SUMMARY
            // ==========================================

            function updateSummary(backlinks) {

                totalBacklinks.textContent =
                    backlinks.length;


                potentialBacklinks.textContent =
                    backlinks.filter(item =>
                        String(item.status || "")
                        .toLowerCase() === "potential"
                    ).length;


                outreachBacklinks.textContent =
                    backlinks.filter(item =>
                        String(item.status || "")
                        .toLowerCase() === "outreach"
                    ).length;


                verifiedBacklinks.textContent =
                    backlinks.filter(item =>
                        String(item.status || "")
                        .toLowerCase() === "verified"
                    ).length;

            }


            // ==========================================
            // APPLY SEARCH + STATUS FILTER
            // ==========================================

            function applyFilters() {

                const searchTerm =
                    backlinkSearch ?
                    String(backlinkSearch.value || "")
                    .trim()
                    .toLowerCase() :
                    "";


                const selectedStatus =
                    statusFilter ?
                    String(statusFilter.value || "all")
                    .trim()
                    .toLowerCase() :
                    "all";


                const filteredBacklinks =
                    allBacklinks.filter(item => {

                        const domain =
                            String(
                                item.domain || ""
                            )
                            .toLowerCase();


                        const url =
                            String(
                                item.url || ""
                            )
                            .toLowerCase();


                        const anchorText =
                            String(
                                item.anchor_text || ""
                            )
                            .toLowerCase();


                        const status =
                            String(
                                item.status || ""
                            )
                            .toLowerCase();


                        // Search domain, URL or anchor text

                        const matchesSearch = !searchTerm ||
                            domain.includes(searchTerm) ||
                            url.includes(searchTerm) ||
                            anchorText.includes(searchTerm);


                        // Status filter

                        const matchesStatus =
                            selectedStatus === "all" ||
                            status === selectedStatus;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    });


                renderBacklinks(filteredBacklinks);

            }


            // ==========================================
            // RENDER BACKLINK TABLE
            // ==========================================

            function renderBacklinks(backlinks) {

                if (backlinks.length === 0) {

                    tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No matching backlinks found.
                    </td>
                </tr>
            `;

                    return;

                }


                tableBody.innerHTML =
                    backlinks.map(item => {

                            const createdDate =
                                item.created_at ?
                                new Date(
                                    item.created_at
                                ).toLocaleDateString() :
                                "-";


                            const currentStatus =
                                String(
                                    item.status || "potential"
                                ).toLowerCase();


                            return `
                    <tr>

                        <!-- DOMAIN -->

                        <td>

                            <strong>
                                ${escapeHTML(
                                    item.domain
                                )}
                            </strong>

                        </td>


                        <!-- URL -->

                        <td>

                            ${
                                item.url
                                ? `
                                    <a
                                        href="${escapeHTML(item.url)}"
                                        target="_blank"
                                        rel="noopener noreferrer">

                                        View Link

                                    </a>
                                  `
                                : "-"
                            }

                        </td>


                        <!-- ANCHOR TEXT -->

                        <td>

                            ${escapeHTML(
                                item.anchor_text || "-"
                            )}

                        </td>


                        <!-- STATUS -->

                        <td>

                            <select
                                class="backlink-status-select"
                                data-id="${item.id}">

                                <option
                                    value="potential"
                                    ${currentStatus === "potential"
                                        ? "selected"
                                        : ""}>

                                    Potential

                                </option>


                                <option
                                    value="outreach"
                                    ${currentStatus === "outreach"
                                        ? "selected"
                                        : ""}>

                                    Outreach

                                </option>


                                <option
                                    value="placed"
                                    ${currentStatus === "placed"
                                        ? "selected"
                                        : ""}>

                                    Placed

                                </option>


                                <option
                                    value="verified"
                                    ${currentStatus === "verified"
                                        ? "selected"
                                        : ""}>

                                    Verified

                                </option>

                            </select>

                        </td>


                        <!-- CREATED DATE -->

                        <td>

                            ${createdDate}

                        </td>

                    </tr>
                `;

            }).join("");


        // Add status-change event listeners

        document
            .querySelectorAll(
                ".backlink-status-select"
            )
            .forEach(select => {

                select.addEventListener(
                    "change",
                    updateBacklinkStatus
                );

            });

    }


    // ==========================================
    // UPDATE BACKLINK STATUS
    // ==========================================

    async function updateBacklinkStatus(event) {

        const select =
            event.target;


        const backlinkId =
            select.dataset.id;


        const newStatus =
            select.value;


        try {

            select.disabled = true;


            await apiRequest(
                `/backlinks/${backlinkId}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            // Update local data

            const backlink =
                allBacklinks.find(
                    item =>
                        String(item.id) ===
                        String(backlinkId)
                );


            if (backlink) {

                backlink.status =
                    newStatus;

            }


            // Update summary

            updateSummary(allBacklinks);


            // Reapply filters

            applyFilters();


        } catch (error) {

            console.error(
                "Backlink status update error:",
                error
            );


            alert(
                error.message ||
                "Failed to update backlink status."
            );


            // Reload original data

            await loadBacklinks();

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