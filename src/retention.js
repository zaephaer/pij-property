// PDPA retention: enquiries older than RETENTION_MONTHS lose their personal data.
// Rows stay (date + project) so Dashboard statistics keep working. Not reversible.
const { run } = require('./db');

const RETENTION_MONTHS = 12;

function anonymiseExpired() {
  return run(
    `UPDATE enquiries
        SET name = '(dianonimkan)', phone = '', email = '', message = '', anonymised_at = datetime('now')
      WHERE anonymised_at IS NULL AND created_at < datetime('now', ?)`,
    `-${RETENTION_MONTHS} months`,
  ).changes;
}

module.exports = { anonymiseExpired, RETENTION_MONTHS };
