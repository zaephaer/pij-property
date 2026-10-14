// Which optional menu items have something to show. Evaluated per request, so an item
// appears as soon as the first record is added in admin and disappears when none are left.
const { get } = require('./db');

const has = (sql, ...args) => get(sql, ...args).n > 0;

module.exports = function menuFlags() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    news: has('SELECT COUNT(*) n FROM news'),
    tenders: has('SELECT COUNT(*) n FROM tenders'), // closed tenders count: results stay public
    careers: has("SELECT COUNT(*) n FROM careers WHERE COALESCE(closing_date,'') = '' OR closing_date >= ?", today), // expired postings don't
    downloads: has('SELECT COUNT(*) n FROM downloads'),
  };
};
