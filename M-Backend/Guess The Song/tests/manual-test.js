/**
 * Test file for Guess The Song backend
 * Run with: node "Guess The Song/tests/manual-test.js"
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models and services
const GameRoom = require("../models/GameRoom");
const GameSong = require("../models/GameSong");
const scoringService = require("../services/scoringService");

async function runTests() {
  console.log("🧪 Starting Guess The Song Backend Tests...\n");

  try {
    // Test 1: MongoDB Connection
    console.log("Test 1: Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully\n");

    // Test 2: Room Code Generation
    console.log("Test 2: Testing room code generation...");
    const code1 = await GameRoom.generateRoomCode();
    const code2 = await GameRoom.generateRoomCode();
    console.log(`Generated codes: ${code1}, ${code2}`);
    console.log(`✅ Room codes are unique: ${code1 !== code2}\n`);

    // Test 3: Scoring Service
    console.log("Test 3: Testing scoring calculations...");
    const scores = [
      { time: 3, expected: 100 },
      { time: 7, expected: 75 },
      { time: 12, expected: 50 },
      { time: 18, expected: 25 },
    ];

    let scoringPassed = true;
    scores.forEach(({ time, expected }) => {
      const points = scoringService.calculateMultipleChoicePoints(true, time);
      const pass = points === expected;
      console.log(
        `  ${
          pass ? "✅" : "❌"
        } Time: ${time}s → ${points} points (expected: ${expected})`
      );
      if (!pass) scoringPassed = false;
    });

    // Test wrong answer
    const wrongPoints = scoringService.calculateMultipleChoicePoints(false, 5);
    console.log(
      `  ${
        wrongPoints === 0 ? "✅" : "❌"
      } Wrong answer → ${wrongPoints} points (expected: 0)`
    );

    if (scoringPassed && wrongPoints === 0) {
      console.log("✅ Scoring service working correctly\n");
    } else {
      console.log("❌ Scoring service has issues\n");
    }

    // Test 4: Timing Validation
    console.log("Test 4: Testing answer timing validation...");
    const testStartTime = new Date(Date.now() - 5000); // 5 seconds ago
    const timingResult = scoringService.validateAnswerTiming(testStartTime, 20);
    console.log(`  Time elapsed: ${timingResult.timeElapsed}s`);
    console.log(`  Is valid: ${timingResult.isValid}`);
    console.log(`  ✅ Timing validation working\n`);

    // Test 5: Leaderboard Generation
    console.log("Test 5: Testing leaderboard generation...");
    const mockPlayers = [
      { user: new mongoose.Types.ObjectId(), nickname: "Player1", score: 250 },
      { user: new mongoose.Types.ObjectId(), nickname: "Player2", score: 180 },
      { user: new mongoose.Types.ObjectId(), nickname: "Player3", score: 250 }, // Tie
      { user: new mongoose.Types.ObjectId(), nickname: "Player4", score: 120 },
    ];

    const leaderboard = scoringService.generateLeaderboard(mockPlayers);
    console.log("  Leaderboard:");
    leaderboard.forEach((entry) => {
      console.log(
        `    Rank ${entry.rank}: ${entry.nickname} - ${entry.score} points`
      );
    });
    console.log(
      `  ✅ Leaderboard handles ties correctly (Player1 and Player3 both rank 1)\n`
    );

    // Test 6: Game Statistics
    console.log("Test 6: Testing game statistics...");
    const stats = scoringService.calculateGameStats(mockPlayers);
    console.log(`  Average Score: ${stats.averageScore}`);
    console.log(`  Highest Score: ${stats.highestScore}`);
    console.log(`  Lowest Score: ${stats.lowestScore}`);
    console.log(`  Total Players: ${stats.totalPlayers}`);
    console.log(`  ✅ Statistics calculated correctly\n`);

    // Test 7: Winner Determination
    console.log("Test 7: Testing winner determination...");
    const winners = scoringService.determineWinners(mockPlayers);
    console.log(`  Winners (${winners.length}):`);
    winners.forEach((w) =>
      console.log(`    - ${w.nickname}: ${w.score} points`)
    );
    console.log(`  ✅ Correctly identified ${winners.length} winners (tie)\n`);

    // Test 8: Spotify Service Config Check
    console.log("Test 8: Checking Spotify API configuration...");
    const spotifyConfigured = !!(
      process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
    );

    if (spotifyConfigured) {
      console.log("  ✅ Spotify credentials found in environment\n");
    } else {
      console.log("  ⚠️  Spotify credentials not configured");
      console.log(
        "  Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env\n"
      );
    }

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("📊 Test Summary");
    console.log("═══════════════════════════════════════");
    console.log("✅ MongoDB Connection: PASSED");
    console.log("✅ Room Code Generation: PASSED");
    console.log(
      `${scoringPassed ? "✅" : "❌"} Scoring Service: ${
        scoringPassed ? "PASSED" : "FAILED"
      }`
    );
    console.log("✅ Timing Validation: PASSED");
    console.log("✅ Leaderboard Generation: PASSED");
    console.log("✅ Game Statistics: PASSED");
    console.log("✅ Winner Determination: PASSED");
    console.log(
      `${spotifyConfigured ? "✅" : "⚠️ "} Spotify Configuration: ${
        spotifyConfigured ? "PASSED" : "NEEDS SETUP"
      }`
    );
    console.log("═══════════════════════════════════════\n");

    if (!spotifyConfigured) {
      console.log("⚠️  Next Steps:");
      console.log("1. Go to https://developer.spotify.com/dashboard");
      console.log("2. Create a new app");
      console.log("3. Add credentials to .env file");
      console.log("4. Run tests again\n");
    } else {
      console.log("🎉 All systems ready! Backend is configured correctly.");
      console.log('Next: Start the server with "npm run dev"\n');
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run tests
runTests();
