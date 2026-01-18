function calculateTrustScore(identity, social, consistency, documents) {
  return (
    0.4 * identity +
    0.3 * social +
    0.2 * consistency +
    0.1 * documents
  );
}

module.exports = { calculateTrustScore };

