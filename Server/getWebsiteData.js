const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");
const dns = require("dns");
const { URL } = require("url");

getWebsiteData = async (url) => {
  try {
    const { data, headers } = await axios.get(url);
    const key = process.env.API_KEY;
    console.log("Main Code Execution Start");
    const { data: speedDataDesktop } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=DESKTOP&key=${key}`
    );
    console.log("First Done");
    const { data: speedDataMobile } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=MOBILE&key=${key}`
    );
    console.log("second Done");

    const { data: accessibilityMobile } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=ACCESSIBILITY&strategy=MOBILE&key=${key}`
    );
    console.log("Third Done");
    const { data: accessibilityDesktop } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=ACCESSIBILITY&strategy=DESKTOP&key=${key}`
    );

    console.log("Fourth Done");

    const { data: bestPracticesMobile } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=BEST_PRACTICES&strategy=MOBILE&key=${key}`
    );
    console.log("Fifth Done");
    const { data: bestPracticesDesktop } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=BEST_PRACTICES&strategy=DESKTOP&key=${key}`
    );
    console.log("six Done");

    const { data: seoMobile } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=SEO&strategy=MOBILE&key=${key}`
    );
    console.log("seven Done");
    const { data: seoDesktop } = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=SEO&strategy=DESKTOP&key=${key}`
    );
    console.log("Main Code Start");

    const auditsDesktop = speedDataDesktop?.lighthouseResult?.audits;
    const auditsMobile = speedDataMobile?.lighthouseResult?.audits;

    const $ = cheerio.load(data);
    const seoData = {};

    //#region TITLE TAG
    const titleText = $("Title").text();
    const titleLength = titleText?.length;
    seoData["title"] = { titleText, titleLength };
    //#endregion

    //#region Meta TAG
    seoData["metaTag"] = [];
    $("meta")?.each((_, element) => {
      const tagName =
        $(element).attr("name") ||
        $(element).attr("property") ||
        $(element).attr("charset") ||
        $(element).attr("http-equiv") ||
        "";
      const descriptionContent = $(element).attr("content") || "";

      tagName === "description" &&
        seoData["metaTag"]?.push({
          contentLength: descriptionContent?.length,
          descriptionContent,
        });
    });
    //#endregion

    //#region Hreflang Links
    const hreflangLinks = $('link[rel="alternate"][hreflang]');
    seoData["hreflang"] = [];
    hreflangLinks.each((_, element) => {
      seoData?.hreflang?.push({
        value: $(element).attr("hreflang"),
        href: $(element).attr("href"),
      });
    });
    //#endregion

    //#region  Language
    seoData["langugae"] = $("html").attr("lang") || "";
    //#endregion

    //#region  H1-H6 tag
    seoData.headings = [];
    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((item) => {
      let tagContent = [];
      $(item).each((_, element) => {
        tagContent?.push($(element).text());
      });
      seoData?.headings?.push({ tagName: item, value: $(item)?.length,content:tagContent });
    });

    // seoData?.headings?.push({ [item]: $(item)?.length })

    //#endregion5492

    //#region Keyword Consistency
    seoData.keywordConsistency = [];
    const keywords = $('meta[name="keywords"][content]')
      .attr("content")
      ?.split(",");
    keywords &&
      keywords?.forEach((item) => {
        if (item?.trim()) {
          const regExp = new RegExp(item, "gi");
          const count = ($("body").text().match(regExp) || []).length;
          seoData?.keywordConsistency?.push({ name: item, value: count });
        }
      });

    //#endregion

    //#region Image alt text
    seoData.imgAltText = [];
    $("img")?.each((_, element) => {
      seoData?.imgAltText?.push({
        altText: $(element).attr("alt"),
        imgSrc:
          $(element).attr("src") ||
          $(element).attr("source") ||
          $(element).attr("data-src") ||
          $(element).attr("srcset"),
      });
    });
    //#endregion

    //#region canonical link element
    seoData.canonicalLink = [];
    // = $("link[rel='canonical']")?.attr("href");
    $("link[rel='canonical']")?.each((_, element) => {
      seoData.canonicalLink?.push($(element)?.attr("href"));
    });
    //#endregion

    //#region Noindex tag
    seoData.NoindexTag =
      $('meta[name="robots"]').attr("content")?.includes("noindex") || false;
    //#endregion

    //#region Noindex Header
    seoData.NoindexHeader =
      (headers["x-robots-tag"] &&
        headers["x-robots-tag"].includes("noindex")) ||
      false;
    //#endregion

    //#region x-robots-tag
    seoData.xRobotsTag = headers["x-robots-tag"]
      ?.toLowerCase()
      .includes("noindex")
      ? true
      : false;
    //#endregion

    //#region SSL Enabled and HTTPS Version
    seoData.sslEnable = false;
    seoData.httpVersion = undefined;

    //#region Http2 uses
    seoData.http2Used = headers["alt-svc"]
      ? headers["alt-svc"].includes("h2")
      : false;
    //#endregion

    https
      .get(url, (res) => {
        seoData.httpVersion = res.httpVersion;
        seoData.sslEnable = res.socket.encrypted;
      })
      .on("error", (err) => {
        seoData.sslEnable = false;
        seoData.httpVersion = undefined;
        console.error("Error occurred:", err.message);
      });
    //#endregion

    //#region HTTP Redirect
    seoData.httpsRedirect = false;
    const req = https.get(url, (res) => {
      if ([301, 302].includes(res.statusCode)) {
        const redirectURL = res.headers.location;
        seoData.httpsRedirect = redirectURL.startsWith("https://");
      } else {
        seoData.httpsRedirect = false;
      }
    });
    //#endregion

    //#region  Robots text
    try {
      const robotsUrl = new URL("/robots.txt", url).href;

      const { data } = await axios.get(robotsUrl);
      seoData.robotsText = data;
    } catch (error) {
      seoData.robotsText = false;
    }
    req.on("error", (err) => {
      console.error("Error occurred:", err.message);
    });

    //#region  Friendly Links
    seoData.friendlyLinks = [];
    seoData.phoneNumber = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      href?.length > 0 && seoData?.friendlyLinks?.push(href);
      if (href?.startsWith("tel")) {
        seoData?.phoneNumber?.push(href);
      }
    });

    //#endregion

    //#region Facebook page linked
    seoData.facebookPageLink = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.includes("facebook.com")) {
        seoData.facebookPageLink?.push(href);
      }
    });
    //#endregion

    //#region Instagram linked
    seoData.insagramPageLink = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.includes("instagram.com")) {
        seoData.insagramPageLink?.push(href);
      }
    });
    //#endregion

    //#region Linkedin linked
    seoData.linkedinPageLink = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.includes("linkedin.com/company")) {
        seoData.linkedinPageLink?.push(href);
      }
    });

    //#endregion  //#region Linkedin linked
    seoData.youtubePageLink = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.includes("youtube.com/channel")) {
        seoData.youtubePageLink?.push(href);
      }
    });
    //#endregion

    //#region  FaceBook open Graph Tags
    seoData.faceBookopenGraphTags = [];
    $('meta[property^="og:"]').each((index, element) => {
      const property = $(element).attr("property")?.replace("og:", "");
      const content = $(element).attr("content");

      seoData.faceBookopenGraphTags?.push({ property, content });
    });
    //#endregion

    //#region  Twitter open Graph Tags
    seoData.twitterOpenGraphTags = [];
    $('meta[name^="twitter:"]').each((index, element) => {
      const property = $(element).attr("name");
      const content = $(element).attr("content");
      seoData.twitterOpenGraphTags?.push({ property, content });
    });
    //#endregion

    //#region  Charset
    const contentType = headers["content-type"];
    const charsetMatch = contentType.match(/charset=([^\s;]+)/i);
    if (charsetMatch) {
      const charset = charsetMatch[1];
      seoData.charset = charset;
    } else {
      console.log("Charset not specified");
    }
    //#endregion

    //#region  Web Server
    const serverType = headers["server"];
    seoData.webServer = serverType ?? undefined;
    //#endregion

    //#region  Server Ip Address
    try {
      const domain = new URL(url).hostname;
      const ipAddresses = await dns.promises.resolve4(domain);
      seoData.serverIpAddress = ipAddresses;
      seoData.dnsServer = dns.getServers();
    } catch (error) {
      console.error("Error fetching server IP address:", error.message);
    }
    //#endregion

    //#region  Page Size
    const contentLength = headers["content-length"];
    const sizeInBytes = parseInt(contentLength);
    const sizeInKb = sizeInBytes / 1024;
    seoData.pageSize = sizeInKb
      ? `${Math.round(sizeInKb * 100) / 100} MB`
      : undefined;

    const images = $("img").length;
    const html = $("html").length;
    const script = $("script").length;
    const css = $('link[rel="stylesheet"]').length;
    const totalResource = images + html + script + css;
    seoData.numberofResources = [
      { name: "Images", value: images },
      { name: "Html", value: html },
      { name: "Script", value: script },
      { name: "Css", value: css },
      { name: "Total Resource", value: totalResource },
    ];
    //#endregion

    //#region iframe elements
    seoData.iframe = $("iframe")?.length;
    //#endregion

    seoData.favIcons = [];
    $("link[rel='icon'], link[rel='shortcut icon']")?.each((_, element) => {
      seoData?.favIcons?.push($(element)?.attr("href"));
    });
    //#region flashUsed
    seoData.isFlashUsed = $("object").length > 0 || $("embed").length > 0;
    //#endregion

    //#region LegibleFontSizes:
    const textElements = $("p, span, div, td, li, a");
    let legibleCount = 0;
    textElements.each((_, element) => {
      const fontSize = parseFloat($(element).css("font-size"));
      if (!isNaN(fontSize) && fontSize >= 12) {
        legibleCount++;
      }
    });
    const hasLegibleFontSizes = legibleCount > 0;
    seoData.LegibleFontSizes = hasLegibleFontSizes;
    //#endregion

    //#region Email Privacy
    seoData.emailPrivacy = [];
    $('a[href^="mailto:"]').each((index, element) => {
      const emailAddress = $(element).attr("href").replace("mailto:", "");
      seoData.emailPrivacy?.push(emailAddress);
    });

    seoData.isEmailVisible =
      seoData?.emailPrivacy?.length > 0 ? "Visible" : "Hidden";
    //#endregion

    //#region  Javascript errors
    seoData.javascriptErrors = [];
    $("script").each((_, element) => {
      const scriptContent = $(element).text();
      if (scriptContent.includes("error")) {
        seoData.javascriptErrors?.push(scriptContent);
      }
    });
    //#endregion

    //#region optimized Images
    seoData.optimizedImages = [];
    $("img").each((_, element) => {
      const src = $(element).attr("src");
      const width = $(element).attr("width");
      const height = $(element).attr("height");
      if (src && width && height) {
        seoData?.optimizedImages.push({ src, width, height });
      }
    });
    //#endregion

    //#region Deprecated HTML

    const deprecatedElements = [
      "acronym",
      "applet",
      "basefont",
      "bgsound",
      "big",
      "blink",
      "center",
      "command",
      "content",
      "dir",
      "element",
      "font",
      "frame",
      "frameset",
      "image",
      "isindex",
      "keygen",
      "listing",
      "marquee",
      "menu",
      "multicol",
      "nextid",
      "nobr",
      "noembed",
      "noframes",
      "plaintext",
      "spacer",
      "strike",
      "tt",
      "xmp",
    ];
    const deprecatedAttributes = [
      "align",
      "alink",
      "background",
      "bgcolor",
      "border",
      "clear",
      "color",
      "compact",
      "frame",
      "frameborder",
      "hspace",
      "link",
      "marginheight",
      "marginwidth",
      "scrolling",
      "size",
      "text",
      "valign",
      "vlink",
      "vspace",
    ];

    seoData.deprecatedItems = [];
    $("*").each((_, element) => {
      const tagName = element.tagName.toLowerCase();

      if (deprecatedElements.includes(tagName)) {
        seoData.deprecatedItems?.push({ type: "element", name: tagName });
      }

      Object.keys(element.attribs).forEach((attrName) => {
        if (deprecatedAttributes.includes(attrName)) {
          seoData.deprecatedItems?.push({
            type: "attribute",
            name: attrName,
            element: tagName,
          });
        }
      });
    });

    //#endregion

    //#region  Inline style
    seoData.inlineStyles = [];
    $("[style]").each((_, element) => {
      const styleValue = $(element).attr("style");
      const styles = styleValue.split(";").map((style) => style.trim());
      styles.forEach((style) => {
        const [property, value] = style.split(":").map((part) => part.trim());
        if (property && value) {
          if (!seoData.inlineStyles[property]) {
            seoData.inlineStyles[property] = [];
          }
          seoData.inlineStyles[property].push(value);
        }
      });
    });
    //#endregion

    //#region  Top Backlinks
    seoData.topBacklinks = [];
    $('a[href^="http"]').each((_, element) => {
      const href = $(element).attr("href");
      seoData.topBacklinks?.push(href);
    });
    //#endregion

    const handleSpeedData = (objectName, data) => {
      seoData?.[objectName]?.push(
        {
          title: "Performance Score",
          value: data.lighthouseResult.categories.performance.score * 100,
        },
        {
          title: "Largest Contentful Paint (LCP)",
          value: speedDataDesktop.loadingExperience.metrics?.[
            "LARGEST_CONTENTFUL_PAINT_MS"
          ]?.percentile
            ? (
                speedDataDesktop.loadingExperience.metrics?.[
                  "LARGEST_CONTENTFUL_PAINT_MS"
                ]?.percentile / 1000
              ).toFixed(1) + " s"
            : 0,
        },
        {
          title: "Interaction to Next Paint (INP)",
          value: data.loadingExperience.metrics?.["INTERACTION_TO_NEXT_PAINT"]
            ?.percentile
            ? data.loadingExperience.metrics?.["INTERACTION_TO_NEXT_PAINT"]
                ?.percentile + "ms"
            : 0,
        },
        {
          title: "Cumulative Layout Shift (CLS)",
          value:
            data.loadingExperience.metrics?.["CUMULATIVE_LAYOUT_SHIFT_SCORE"]
              .percentile / 100 || 0,
        }
      );
    };

    setAllOverScrore = (objectKey, apiData, key) => {
      seoData[objectKey]?.push({
        title: key,
        value: apiData?.lighthouseResult?.categories?.[key]?.score * 100 || 0,
      });
    };

    //#region  Google's PageSpeed Insights - Mobile
    const speedCategory = [
      "first-contentful-paint",
      "largest-contentful-paint-element",
      "cumulative-layout-shift",
      "speed-index",
      "total-blocking-time",
    ];
    seoData.pageSpeedInsightsMobile = [];
    auditsMobile &&
      speedCategory.forEach((item) => {
        seoData.pageSpeedInsightsMobile?.push({
          title: auditsMobile?.[item]?.title,
          value: auditsMobile?.[item]?.displayValue,
        });
      });
    handleSpeedData("pageSpeedInsightsMobile", speedDataMobile);
    setAllOverScrore(
      "pageSpeedInsightsMobile",
      accessibilityMobile,
      "accessibility"
    );
    setAllOverScrore(
      "pageSpeedInsightsMobile",
      bestPracticesMobile,
      "best-practices"
    );
    setAllOverScrore("pageSpeedInsightsMobile", seoMobile, "seo");
    //#endregion

    seoData.pageSpeedInsightsDesktop = [];
    auditsDesktop &&
      speedCategory.forEach((item) => {
        seoData.pageSpeedInsightsDesktop?.push({
          title: auditsDesktop?.[item]?.title,
          value: auditsDesktop?.[item]?.displayValue,
        });
      });
    handleSpeedData("pageSpeedInsightsDesktop", speedDataDesktop);
    setAllOverScrore(
      "pageSpeedInsightsDesktop",
      bestPracticesDesktop,
      "best-practices"
    );
    setAllOverScrore(
      "pageSpeedInsightsDesktop",
      accessibilityDesktop,
      "accessibility"
    );
    setAllOverScrore("pageSpeedInsightsDesktop", seoDesktop, "seo");
    //#endregion

    // //#region Google Accelerated Mobile Pages (AMP)
    seoData.isAMPPage =
      $('meta[name="amphtml"]').length > 0 || $("html.amp").length > 0;
    // //#endregion

    //#region Schema.org Structured Data
    seoData.schemaData = undefined;
    $('script[type="application/ld+json"]').each((_, element) => {
      const scriptContent = $(element).html();
      try {
        const sanitizedContent = scriptContent.replace(
          /[\u0000-\u001F\u007F-\u009F]/g,
          ""
        );
        const structuredData = JSON.parse(sanitizedContent);
        if (structuredData["@context"] === "http://schema.org") {
          seoData.schemaData = structuredData;
        }
      } catch (error) {
        console.error("Error parsing JSON-LD:", error);
      }
    });
    //#endregion

    //#region Address
    seoData.address = undefined;
    const addressElement = $("address");
    const addressText = addressElement.text().trim();
    seoData.address = addressText.toString();
    //#endregion
    // console.log(seoData);
    return { status: true, seoData };
  } catch (error) {
    console.log(error?.message);
    return { status: false, message: error?.message };
  }
};

module.exports = getWebsiteData;
