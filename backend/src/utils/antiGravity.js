function calculateAntiGravityScore(upvotes, downvotes, createdAt, engagementScore = 0) {
  const score = (upvotes - downvotes) + engagementScore;
  const timeSincePostInHours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);

  // Boosts new posts and prevents dominance of already popular posts by using an exponential decay denominator
  const antiGravity = score / Math.pow(timeSincePostInHours + 2, 1.5);
  return antiGravity;
}

module.exports = { calculateAntiGravityScore };
