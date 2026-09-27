document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);


async function loadDashboard() {

    try {

        const [
            audits,
            keywords,
            backlinks,
            directories,
            leads
        ] = await Promise.all([

            apiRequest("/seo-audits"),

            apiRequest("/keywords"),

            apiRequest("/backlinks"),

            apiRequest("/directories"),

            apiRequest("/leads")

        ]);


        document.getElementById(
                "dashboardMessage"
            ).textContent =
            "Dashboard loaded successfully.";


        document.getElementById(
                "auditCount"
            ).textContent =
            audits.count;


        document.getElementById(
                "keywordCount"
            ).textContent =
            keywords.count;


        document.getElementById(
                "backlinkCount"
            ).textContent =
            backlinks.count;


        document.getElementById(
                "directoryCount"
            ).textContent =
            directories.count;


        document.getElementById(
                "leadCount"
            ).textContent =
            leads.count;


        renderAudits(
            audits.data
        );


        renderKeywords(
            keywords.data
        );


        renderBacklinks(
            backlinks.data
        );


        renderDirectories(
            directories.data
        );


        renderLeads(
            leads.data
        );


    } catch (error) {

        console.error(error);

        document.getElementById(
                "dashboardMessage"
            ).textContent =
            "Unable to load dashboard data.";

    }

}


function renderAudits(audits) {

    const container =
        document.getElementById(
            "auditTable"
        );


    if (!audits.length) {

        container.innerHTML =
            "<p>No SEO audits found yet.</p>";

        return;

    }


    container.innerHTML = `

        <table class="dashboard-table">

            <thead>

                <tr>

                    <th>
                        URL
                    </th>

                    <th>
                        Score
                    </th>

                    <th>
                        Title
                    </th>

                    <th>
                        Meta
                    </th>

                    <th>
                        Technical
                    </th>

                    <th>
                        Date
                    </th>

                </tr>

            </thead>

            <tbody>

                ${audits.slice(0, 10).map(
                    audit => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                audit.url
                            )}
                        </td>

                        <td>
                            <strong>
                                ${audit.score}/100
                            </strong>
                        </td>

                        <td>
                            ${audit.title_score}
                        </td>

                        <td>
                            ${audit.meta_score}
                        </td>

                        <td>
                            ${audit.technical_score}
                        </td>

                        <td>
                            ${formatDate(
                                audit.created_at
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


function renderKeywords(keywords) {

    const container =
        document.getElementById(
            "keywordTable"
        );


    if (!keywords.length) {

        container.innerHTML =
            "<p>No keywords added yet.</p>";

        return;

    }


    container.innerHTML = `

        <table class="dashboard-table">

            <thead>

                <tr>

                    <th>
                        Keyword
                    </th>

                    <th>
                        Intent
                    </th>

                    <th>
                        Priority
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Target URL
                    </th>

                </tr>

            </thead>

            <tbody>

                ${keywords.slice(0, 10).map(
                    keyword => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                keyword.keyword
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                keyword.search_intent ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                keyword.priority ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                keyword.status ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                keyword.target_url ||
                                "-"
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


function renderBacklinks(backlinks) {

    const container =
        document.getElementById(
            "backlinkTable"
        );


    if (!backlinks.length) {

        container.innerHTML =
            "<p>No backlink opportunities added yet.</p>";

        return;

    }


    container.innerHTML = `

        <table class="dashboard-table">

            <thead>

                <tr>

                    <th>
                        Domain
                    </th>

                    <th>
                        URL
                    </th>

                    <th>
                        Anchor Text
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

            </thead>

            <tbody>

                ${backlinks.slice(0, 10).map(
                    backlink => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                backlink.domain
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                backlink.url ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                backlink.anchor_text ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                backlink.status ||
                                "-"
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


function renderDirectories(directories) {

    const container =
        document.getElementById(
            "directoryTable"
        );


    if (!directories.length) {

        container.innerHTML =
            "<p>No directories added yet.</p>";

        return;

    }


    container.innerHTML = `

        <table class="dashboard-table">

            <thead>

                <tr>

                    <th>
                        Directory
                    </th>

                    <th>
                        Category
                    </th>

                    <th>
                        URL
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

            </thead>

            <tbody>

                ${directories.slice(0, 10).map(
                    directory => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                directory.name
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                directory.category ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                directory.url ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                directory.status ||
                                "-"
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


function renderLeads(leads) {

    const container =
        document.getElementById(
            "leadTable"
        );


    if (!leads.length) {

        container.innerHTML =
            "<p>No leads received yet.</p>";

        return;

    }


    container.innerHTML = `

        <table class="dashboard-table">

            <thead>

                <tr>

                    <th>
                        Name
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Service
                    </th>

                    <th>
                        Website
                    </th>

                    <th>
                        Date
                    </th>

                </tr>

            </thead>

            <tbody>

                ${leads.slice(0, 10).map(
                    lead => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                lead.name
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                lead.email
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                lead.service ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                lead.website ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                lead.created_at
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date)
        .toLocaleDateString();

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}