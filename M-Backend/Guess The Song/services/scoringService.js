/**
 * Scoring Service for Guess the Song Game
 * Multiple Choice Mode Scoring:
 * - 0-5 seconds: 100 points
 * - 5-10 seconds: 75 points
 * - 10-15 seconds: 50 points
 * - 15+ seconds: 25 points
 * - Wrong answer: 0 points
 */

class ScoringService {
  /**
   * Calculate points based on answer time for Multiple Choice mode
   * @param {boolean} isCorrect - Whether the answer is correct
   * @param {number} timeElapsed - Time in seconds
   * @returns {number} Points awarded
   */
  calculateMultipleChoicePoints(isCorrect, timeElapsed) {
    if (!isCorrect) {
      return 0;
    }

    if (timeElapsed <= 5) {
      return 100;
    } else if (timeElapsed <= 10) {
      return 75;
    } else if (timeElapsed <= 15) {
      return 50;
    } else {
      return 25;
    }
  }

  /**
   * Validate answer timing
   * @param {Date} roundStartTime - When the round started
   * @param {number} questionTime - Maximum time allowed in seconds
   * @returns {Object} { isValid: boolean, timeElapsed: number }
   */
  validateAnswerTiming(roundStartTime, questionTime = 20) {
    const now = new Date();
    const timeElapsed = (now - roundStartTime) / 1000; // Convert to seconds

    return {
      isValid: timeElapsed <= questionTime,
      timeElapsed: Math.round(timeElapsed * 10) / 10, // Round to 1 decimal
    };
  }

  /**
   * Calculate game statistics
   * @param {Array} players - Array of player objects with scores
   * @returns {Object} Game statistics
   */
  calculateGameStats(players) {
    if (!players || players.length === 0) {
      return {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalPlayers: 0,
      };
    }

    const scores = players.map((p) => p.score);
    const total = scores.reduce((sum, score) => sum + score, 0);

    return {
      averageScore: Math.round(total / players.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalPlayers: players.length,
    };
  }

  /**
   * Determine winner(s)
   * @param {Array} players - Array of player objects with scores
   * @returns {Array} Array of winner objects (can be multiple in case of tie)
   */
  determineWinners(players) {
    if (!players || players.length === 0) {
      return [];
    }

    const highestScore = Math.max(...players.map((p) => p.score));
    return players.filter((p) => p.score === highestScore);
  }

  /**
   * Generate leaderboard with rankings
   * @param {Array} players - Array of player objects
   * @returns {Array} Sorted leaderboard with rankings
   */
  generateLeaderboard(players) {
    if (!players || players.length === 0) {
      return [];
    }

    // Sort by score descending
    const sorted = [...players].sort((a, b) => b.score - a.score);

    // Add rankings (handle ties)
    let currentRank = 1;
    let previousScore = sorted[0]?.score;

    return sorted.map((player, index) => {
      if (player.score < previousScore) {
        currentRank = index + 1;
      }
      previousScore = player.score;

      return {
        rank: currentRank,
        userId: player.user,
        nickname: player.nickname,
        score: player.score,
      };
    });
  }

  /**
   * Calculate accuracy percentage for a player
   * @param {number} correctAnswers - Number of correct answers
   * @param {number} totalQuestions - Total questions answered
   * @returns {number} Accuracy percentage (0-100)
   */
  calculateAccuracy(correctAnswers, totalQuestions) {
    if (totalQuestions === 0) {
      return 0;
    }
    return Math.round((correctAnswers / totalQuestions) * 100);
  }
}

module.exports = new ScoringService();
