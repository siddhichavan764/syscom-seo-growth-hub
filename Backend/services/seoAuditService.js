const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("dns").promises;
const net = require("net");

function isPrivateIPv4(ip) {
    const parts = ip.split(".").map(Number);

    if (parts.length !== 4 || parts.some(Number.isNaN)) {
        return false;
    }

    return (
        parts[0] === 10 ||
        parts[0] === 127 ||
        (parts[0] === 172 &&
            parts[1] >= 16 &&
            parts[1] <= 31) ||
        (parts[0] === 192 &&
            parts[1] === 168)
    );
}

async function validatePublicUrl(inputUrl) {
    let parsedUrl;

    try {
        parsedUrl = new URL(inputUrl);
    } catch {
        throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are supported");
    }

    const hostname = parsedUrl.hostname;

    if (hostname === "localhost" || net.isIP(hostname)) {
        if (hostname === "localhost" || isPrivateIPv4(hostname)) {
            throw new Error("Private or local URLs are not allowed");
        }
    }

    try {
        const addresses = await dns.lookup(hostname, {
            all: true
        });

        for (const address of addresses) {
            if (
                address.family === 4 &&
                isPrivateIPv4(address.address)
            ) {
                throw new Error(
                    "Private network URLs are not allowed"
                );
            }
        }
    } catch (error) {
        if (error.message.includes("Private")) {
            throw error;
        }

        throw new Error("Unable to resolve the target domain");
    }

    return parsedUrl;
}

async function runSeoAudit(inputUrl) {
    const parsedUrl = await validatePublicUrl(inputUrl);

    const response = await axios.get(
        parsedUrl.toString(), {
            timeout: 10000,
            maxRedirects: 5,
            responseType: "text",
            headers: {
                "User-Agent": "Syscom-SEO-Audit-Bot/1.0"
            }
        }
    );

    const html = response.data;
    const $ = cheerio.load(html);

    /*
     * TITLE
     */
    const title = $("title").first().text().trim();

    const titleScore =
        title.length >= 30 && title.length <= 60 ?
        100 :
        title.length > 0 ?
        60 :
        0;

    /*
     * META DESCRIPTION
     */
    const metaDescriptionElement =
        $('meta[name="description"]').first();

    const metaDescription =
        metaDescriptionElement.attr("content") || "";

    const metaScore =
        metaDescription.length >= 120 &&
        metaDescription.length <= 160 ?
        100 :
        metaDescription.length > 0 ?
        60 :
        0;

    /*
     * H1
     */
    const h1Count = $("h1").length;

    const headingScore =
        h1Count === 1 ?
        100 :
        h1Count > 1 ?
        60 :
        0;

    /*
     * IMAGES
     */
    const images = $("img");

    let imagesWithAlt = 0;

    images.each((index, element) => {
        const alt = $(element).attr("alt");

        if (
            typeof alt === "string" &&
            alt.trim().length > 0
        ) {
            imagesWithAlt++;
        }
    });

    const imageScore =
        images.length === 0 ?
        100 :
        Math.round(
            (imagesWithAlt / images.length) * 100
        );

    /*
     * CANONICAL
     */
    const canonicalElement =
        $('link[rel="canonical"]').first();

    const canonical =
        canonicalElement.attr("href") || "";

    /*
     * ROBOTS
     */
    const robotsElement =
        $('meta[name="robots"]').first();

    const robots =
        robotsElement.attr("content") || "";

    /*
     * INTERNAL LINKS
     */
    const links = $("a[href]");
    let internalLinks = 0;

    links.each((index, element) => {
        const href = $(element).attr("href");

        if (!href) {
            return;
        }

        try {
            const linkUrl = new URL(
                href,
                parsedUrl.toString()
            );

            if (
                linkUrl.hostname ===
                parsedUrl.hostname
            ) {
                internalLinks++;
            }
        } catch {
            // Ignore malformed links
        }
    });

    const internalLinkScore =
        internalLinks >= 5 ?
        100 :
        internalLinks > 0 ?
        60 :
        0;

    /*
     * TECHNICAL SEO
     */
    const hasHttps =
        parsedUrl.protocol === "https:";

    const hasViewport =
        $('meta[name="viewport"]').length > 0;

    const technicalChecks = [
        hasHttps,
        hasViewport,
        Boolean(canonical),
        Boolean(robots)
    ];

    const technicalScore = Math.round(
        (
            technicalChecks.filter(Boolean).length /
            technicalChecks.length
        ) * 100
    );

    /*
     * OVERALL SCORE
     */
    const score = Math.round(
        (
            titleScore +
            metaScore +
            headingScore +
            imageScore +
            technicalScore +
            internalLinkScore
        ) / 6
    );

    /*
     * ISSUES
     */
    const issues = [];

    if (!title) {
        issues.push({
            type: "error",
            category: "Title",
            message: "Page is missing a title tag."
        });
    } else if (title.length < 30 || title.length > 60) {
        issues.push({
            type: "warning",
            category: "Title",
            message: "Title length is outside the recommended range."
        });
    }

    if (!metaDescription) {
        issues.push({
            type: "error",
            category: "Meta Description",
            message: "Page is missing a meta description."
        });
    } else if (
        metaDescription.length < 120 ||
        metaDescription.length > 160
    ) {
        issues.push({
            type: "warning",
            category: "Meta Description",
            message: "Meta description length is outside the recommended range."
        });
    }

    if (h1Count === 0) {
        issues.push({
            type: "error",
            category: "Headings",
            message: "No H1 heading was found."
        });
    }

    if (h1Count > 1) {
        issues.push({
            type: "warning",
            category: "Headings",
            message: "Multiple H1 headings were found."
        });
    }

    if (images.length > imagesWithAlt) {
        issues.push({
            type: "warning",
            category: "Images",
            message: `${images.length - imagesWithAlt} image(s) are missing alt text.`
        });
    }

    if (!canonical) {
        issues.push({
            type: "warning",
            category: "Canonical",
            message: "No canonical URL was found."
        });
    }

    if (!hasHttps) {
        issues.push({
            type: "error",
            category: "HTTPS",
            message: "The page is not using HTTPS."
        });
    }

    if (internalLinks === 0) {
        issues.push({
            type: "warning",
            category: "Internal Links",
            message: "No internal links were detected."
        });
    }

    return {
        url: parsedUrl.toString(),
        score,
        metrics: {
            title: {
                score: titleScore,
                value: title
            },
            meta: {
                score: metaScore,
                value: metaDescription
            },
            heading: {
                score: headingScore,
                h1Count
            },
            images: {
                score: imageScore,
                total: images.length,
                withAlt: imagesWithAlt
            },
            technical: {
                score: technicalScore,
                https: hasHttps,
                viewport: hasViewport,
                canonical: Boolean(canonical),
                robots: Boolean(robots)
            },
            internalLinks: {
                score: internalLinkScore,
                count: internalLinks
            }
        },
        issues
    };
}

module.exports = {
    runSeoAudit
};