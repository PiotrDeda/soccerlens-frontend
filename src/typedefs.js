/**
 * @typedef {Object} Team
 * @property {number} teamId
 * @property {string} teamName
 */

/**
 * @typedef {Object} Player
 * @property {number} playerId
 * @property {string} playerName
 * @property {Team} team
 */

/**
 * @typedef {Object} Match
 * @property {number} matchId
 * @property {Team} homeTeam
 * @property {Team} awayTeam
 * @property {timestamp} startTime
 * @property {timestamp} endTime
 */

/**
 * @typedef {Object} MatchEvent
 * @property {number} matchEventId
 * @property {Match} match
 * @property {Player} player
 * @property {Player} secondPlayer
 * @property {string} eventType
 * @property {number} minute
 */

/**
 * @typedef {Object} Comment
 * @property {number} commentId
 * @property {number} matchId
 * @property {User} user
 * @property {string} commentText
 * @property {timestamp} timestamp
 */

/**
 * @typedef {Object} User
 * @property {number} userId
 * @property {string} username
 * @property {string} role
 */