document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const [
            keywords,
            organicContent,
            leads,
            backlinks,
            directories,
            socialPosts
        ] = await Promise.all([

            apiRequest("/keywords"),

            apiRequest("/organic-traffic"),

            apiRequest("/leads"),

            apiRequest("/backlinks"),

            apiRequest("/directories"),

            apiRequest("/social")

        ]);
        const keywordData =
            keywords.data || [];


        const contentData =
            organicContent.data || [];


        const leadData =
            leads.data || [];
        const backlinkData =
            backlinks.data || [];


        const directoryData =
            directories.data || [];


        const socialData =
            socialPosts.data || [];

        // ==========================================
        // HIGH-INTENT KEYWORDS
        // ==========================================

        const highIntentKeywords =
            keywordData.filter(function(item) {

                const intent =
                    String(
                        item.search_intent || ""
                    ).toLowerCase();


                return (
                    intent === "transactional" ||
                    intent === "commercial" ||
                    intent === "local"
                );

            });


        const keywordCount =
            highIntentKeywords.length;


        // ==========================================
        // SEO CONTENT
        // ==========================================

        const contentCount =
            contentData.length;


        // ==========================================
        // ORGANIC VISITS
        // ==========================================

        let totalVisits = 0;


        contentData.forEach(function(item) {

            totalVisits +=
                Number(
                    item.organic_visits || 0
                );

        });


        // ==========================================
        // BUSINESS LEADS
        // ==========================================

        const leadCount =
            leadData.length;

        const backlinkCount =
            backlinkData.length;


        const directoryCount =
            directoryData.length;


        const socialCount =
            socialData.length;


        const publishedSocialCount =
            socialData.filter(function(item) {

                return String(
                    item.status || ""
                ).toLowerCase() === "published";

            }).length;
        // ==========================================
        // CONVERSION RATE
        // ==========================================

        let conversionRate = 0;


        if (totalVisits > 0) {

            conversionRate =
                (leadCount / totalVisits) * 100;

        }


        // ==========================================
        // MAIN KPI CARDS
        // ==========================================

        setText(
            "keywordCount",
            keywordCount
        );


        setText(
            "contentCount",
            contentCount
        );


        setText(
            "visitCount",
            totalVisits
        );


        setText(
            "leadCount",
            leadCount
        );


        // ==========================================
        // PERFORMANCE OVERVIEW
        // ==========================================

        setText(
            "performanceKeywords",
            keywordCount
        );


        setText(
            "performanceContent",
            contentCount
        );


        setText(
            "performanceVisits",
            totalVisits
        );


        setText(
            "performanceLeads",
            leadCount
        );


        setText(
            "conversionRate",
            conversionRate.toFixed(1) + "%"
        );
        setText(
            "performanceBacklinks",
            backlinkCount
        );


        setText(
            "performanceDirectories",
            directoryCount
        );


        setText(
            "performanceSocial",
            socialCount
        );


        setText(
            "performancePublishedSocial",
            publishedSocialCount
        );

        console.log(
            "Dashboard loaded successfully."
        );
        loadActivityTimeline();
    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}
async function loadActivityTimeline() {
    const timeline =
        document.getElementById("activityTimeline");

    if (!timeline) {
        return;
    }

    try {
        const [
            keywords,
            content,
            backlinks,
            directories,
            socialPosts
        ] = await Promise.all([
            apiRequest("/keywords"),
            apiRequest("/organic-traffic"),
            apiRequest("/backlinks"),
            apiRequest("/directories"),
            apiRequest("/social")
        ]);

        const activities = [];

        const keywordData =
            keywords.data || [];

        keywordData.forEach(function(item) {
            activities.push({
                type: "Keyword",
                title: "Keyword added",
                description: item.keyword || "Keyword strategy updated",
                date: item.created_at || ""
            });
        });

        const contentData =
            content.data || [];

        contentData.forEach(function(item) {
            activities.push({
                type: "Content",
                title: "SEO content created",
                description: item.title || "SEO content updated",
                date: item.created_at || ""
            });
        });

        const backlinkData =
            backlinks.data || [];

        backlinkData.forEach(function(item) {
            activities.push({
                type: "Backlink",
                title: "Backlink opportunity added",
                description: item.domain ||
                    item.url ||
                    "Backlink opportunity",
                date: item.created_at || ""
            });
        });

        const directoryData =
            directories.data || [];

        directoryData.forEach(function(item) {
            activities.push({
                type: "Directory",
                title: "Directory listing updated",
                description: item.name || "Directory listing",
                date: item.created_at || ""
            });
        });

        const socialData =
            socialPosts.data || [];

        socialData.forEach(function(item) {
            activities.push({
                type: "Social",
                title: "Social post updated",
                description: item.post_title ||
                    item.platform ||
                    "Social distribution activity",
                date: item.created_at || ""
            });
        });

        activities.sort(function(a, b) {
            return new Date(b.date) -
                new Date(a.date);
        });

        const recentActivities =
            activities.slice(0, 8);

        if (recentActivities.length === 0) {
            timeline.innerHTML =
                '<p class="activity-empty">' +
                'No SEO activity recorded yet.' +
                '</p>';

            return;
        }

        timeline.innerHTML =
            recentActivities.map(function(item) {

                return `
                    <div class="activity-item">
                        <div class="activity-dot"></div>

                        <div class="activity-content">
                            <div class="activity-top">
                                <span class="activity-type">
                                    ${item.type}
                                </span>

                                <span class="activity-date">
                                    ${formatActivityDate(item.date)}
                                </span>
                            </div>

                            <h3>
                                ${item.title}
                            </h3>

                            <p>
                                ${item.description}
                            </p>
                        </div>
                    </div>
                `;

            }).join("");

    } catch (error) {
        console.error(
            "Activity timeline error:",
            error
        );

        timeline.innerHTML =
            '<p class="activity-empty">' +
            'Unable to load SEO activity.' +
            '</p>';
    }
}

function formatActivityDate(dateValue) {
    if (!dateValue) {
        return "Recently";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleDateString(
        "en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}