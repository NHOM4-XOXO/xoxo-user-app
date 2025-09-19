export function pickTopicFromLikes(likes = []) {
    const order = ["esport", "basketball", "tech"];
    const likeSet = new Set(likes.map((s) => s.toLowerCase()));
    for (const t of order) if (likeSet.has(t)) return t;
    return "tech";
}
