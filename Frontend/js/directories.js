document.addEventListener("DOMContentLoaded", () => {

            const tableBody =
                document.getElementById("directoryTableBody");

            const totalDirectories =
                document.getElementById("totalDirectories");

            const potentialDirectories =
                document.getElementById("potentialDirectories");

            const submittedDirectories =
                document.getElementById("submittedDirectories");

            const listedDirectories =
                document.getElementById("listedDirectories");

            const addDirectoryBtn =
                document.getElementById("addDirectoryBtn");

            const formContainer =
                document.getElementById("directoryFormContainer");

            const directoryForm =
                document.getElementById("directoryForm");

            const cancelDirectoryBtn =
                document.getElementById("cancelDirectoryBtn");

            const formMessage =
                document.getElementById("directoryFormMessage");

            const directorySearch =
                document.getElementById("directorySearch");

            const statusFilter =
                document.getElementById("directoryStatusFilter");


            // Store all directories
            let allDirectories = [];


            // Load directories
            loadDirectories();


            // ==========================================
            // OPEN FORM
            // ==========================================

            addDirectoryBtn.addEventListener("click", () => {

                formContainer.style.display = "block";

                formContainer.scrollIntoView({
                    behavior: "smooth"
                });

            });


            // ==========================================
            // CLOSE FORM
            // ==========================================

            cancelDirectoryBtn.addEventListener("click", () => {

                formContainer.style.display = "none";

                directoryForm.reset();

                formMessage.textContent = "";

            });


            // ==========================================
            // SEARCH
            // ==========================================

            if (directorySearch) {

                directorySearch.addEventListener(
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
            // CREATE DIRECTORY
            // ==========================================

            directoryForm.addEventListener(
                "submit",
                async(event) => {

                    event.preventDefault();

                    formMessage.textContent =
                        "Saving directory...";


                    const directoryData = {

                        name: document
                            .getElementById("directoryName")
                            .value
                            .trim(),

                        url: document
                            .getElementById("directoryUrl")
                            .value
                            .trim(),

                        category: document
                            .getElementById("directoryCategory")
                            .value
                            .trim(),

                        status: document
                            .getElementById("directoryStatus")
                            .value

                    };


                    if (!directoryData.name) {

                        formMessage.textContent =
                            "Directory name is required.";

                        return;

                    }


                    try {

                        const result =
                            await apiRequest(
                                "/directories", {
                                    method: "POST",

                                    body: JSON.stringify(
                                        directoryData
                                    )
                                }
                            );


                        formMessage.textContent =
                            result.message ||
                            "Directory added successfully.";


                        directoryForm.reset();


                        await loadDirectories();


                        setTimeout(() => {

                            formContainer.style.display =
                                "none";

                            formMessage.textContent =
                                "";

                        }, 1000);


                    } catch (error) {

                        console.error(
                            "Directory creation error:",
                            error
                        );

                        formMessage.textContent =
                            error.message ||
                            "Failed to save directory.";

                    }

                }
            );


            // ==========================================
            // LOAD DIRECTORIES
            // ==========================================

            async function loadDirectories() {

                try {

                    const result =
                        await apiRequest("/directories");


                    allDirectories =
                        result.data || [];


                    updateSummary(
                        allDirectories
                    );


                    renderDirectories(
                        allDirectories
                    );


                } catch (error) {

                    console.error(
                        "Directory loading error:",
                        error
                    );


                    tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load directories.
                    </td>
                </tr>
            `;

                }

            }


            // ==========================================
            // UPDATE SUMMARY
            // ==========================================

            function updateSummary(directories) {

                totalDirectories.textContent =
                    directories.length;


                potentialDirectories.textContent =
                    directories.filter(item => {

                        return String(
                                item.status || ""
                            )
                            .toLowerCase() === "potential";

                    }).length;


                submittedDirectories.textContent =
                    directories.filter(item => {

                        return String(
                                item.status || ""
                            )
                            .toLowerCase() === "submitted";

                    }).length;


                listedDirectories.textContent =
                    directories.filter(item => {

                        return String(
                                item.status || ""
                            )
                            .toLowerCase() === "listed";

                    }).length;

            }


            // ==========================================
            // SEARCH + STATUS FILTER
            // ==========================================

            function applyFilters() {

                let searchTerm = "";

                if (directorySearch) {

                    searchTerm =
                        String(
                            directorySearch.value || ""
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


                const filteredDirectories =
                    allDirectories.filter(item => {

                        const name =
                            String(
                                item.name || ""
                            )
                            .toLowerCase();


                        const url =
                            String(
                                item.url || ""
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
                            name.includes(searchTerm) ||
                            url.includes(searchTerm) ||
                            category.includes(searchTerm);


                        const matchesStatus =
                            selectedStatus === "all" ||
                            status === selectedStatus;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    });


                renderDirectories(
                    filteredDirectories
                );

            }


            // ==========================================
            // RENDER TABLE
            // ==========================================

            function renderDirectories(directories) {

                if (directories.length === 0) {

                    tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No matching directories found.
                    </td>
                </tr>
            `;

                    return;

                }


                tableBody.innerHTML =
                    directories.map(item => {

                            const createdDate =
                                item.created_at ?
                                new Date(
                                    item.created_at
                                ).toLocaleDateString() :
                                "-";


                            const currentStatus =
                                String(
                                    item.status || "potential"
                                )
                                .toLowerCase();


                            return `
                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                        </td>


                        <td>

                            ${
                                item.url
                                ? `
                                    <a
                                        href="${escapeHTML(item.url)}"
                                        target="_blank"
                                        rel="noopener noreferrer">

                                        View Directory

                                    </a>
                                `
                                : "-"
                            }

                        </td>


                        <td>

                            ${escapeHTML(
                                item.category || "-"
                            )}

                        </td>


                        <td>

                            <select
                                class="directory-status-select"
                                data-id="${item.id}">

                                <option
                                    value="potential"
                                    ${currentStatus === "potential"
                                        ? "selected"
                                        : ""}>

                                    Potential

                                </option>


                                <option
                                    value="submitted"
                                    ${currentStatus === "submitted"
                                        ? "selected"
                                        : ""}>

                                    Submitted

                                </option>


                                <option
                                    value="listed"
                                    ${currentStatus === "listed"
                                        ? "selected"
                                        : ""}>

                                    Listed

                                </option>


                                <option
                                    value="rejected"
                                    ${currentStatus === "rejected"
                                        ? "selected"
                                        : ""}>

                                    Rejected

                                </option>

                            </select>

                        </td>


                        <td>

                            ${createdDate}

                        </td>

                    </tr>
                `;

            }).join("");


        // Add status update listeners

        document
            .querySelectorAll(
                ".directory-status-select"
            )
            .forEach(select => {

                select.addEventListener(
                    "change",
                    updateDirectoryStatus
                );

            });

    }


    // ==========================================
    // UPDATE DIRECTORY STATUS
    // ==========================================

    async function updateDirectoryStatus(event) {

        const select =
            event.target;


        const directoryId =
            select.dataset.id;


        const newStatus =
            select.value;


        try {

            select.disabled = true;


            await apiRequest(
                `/directories/${directoryId}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            // Update local data

            const directory =
                allDirectories.find(item => {

                    return String(item.id) ===
                        String(directoryId);

                });


            if (directory) {

                directory.status =
                    newStatus;

            }


            updateSummary(
                allDirectories
            );


            applyFilters();


        } catch (error) {

            console.error(
                "Directory status update error:",
                error
            );


            alert(
                error.message ||
                "Failed to update directory status."
            );


            await loadDirectories();

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