// FILE: src/utils/imageSources.js

export function coverFromSeed(id, w = 800, h = 600) {
    const seed = String(id ?? 'xoxo-default');
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function bannerForTopic(topic = 'tech') {
    return [
        `https://picsum.photos/seed/${encodeURIComponent(topic)}-1/1600/600`,
        `https://picsum.photos/seed/${encodeURIComponent(topic)}-2/1600/600`,
    ];
}

export function coverForEvent(evt, w = 800, h = 600) {
    const url = (evt?.cover || "").trim();
    if (url && /^https?:\/\//i.test(url)) return url;

    const cat = (evt?.category || "general").toLowerCase();
    const seed = `${cat}-${evt?.id ?? "xoxo"}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
