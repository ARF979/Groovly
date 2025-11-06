const Song = require('../../models/Song');
const Room = require('../../models/Room');
const User = require('../../models/User');

describe('Voting Logic Tests', () => {
  let room, user1, user2, song;

  beforeEach(async () => {
    // Create test user
    user1 = await User.create({
      name: 'Test User 1',
      email: 'test1@example.com',
      password: 'password123'
    });

    user2 = await User.create({
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123'
    });

    // Create test room
    room = await Room.create({
      name: 'Test Room',
      code: 'TEST01',
      host: user1._id,
      members: [
        { user: user1._id, role: 'host' },
        { user: user2._id, role: 'member' }
      ]
    });

    // Create test song
    song = await Song.create({
      spotifyId: 'test123',
      title: 'Test Song',
      artist: 'Test Artist',
      durationMs: 180000,
      addedBy: user1._id,
      room: room._id
    });
  });

  test('should add upvote to song', async () => {
    song.upvotes.push(user1._id);
    await song.save();

    expect(song.upvotes).toHaveLength(1);
    expect(song.upvotes[0].toString()).toBe(user1._id.toString());
  });

  test('should add downvote to song', async () => {
    song.downvotes.push(user1._id);
    await song.save();

    expect(song.downvotes).toHaveLength(1);
    expect(song.downvotes[0].toString()).toBe(user1._id.toString());
  });

  test('should calculate vote score correctly', async () => {
    song.upvotes.push(user1._id);
    song.upvotes.push(user2._id);
    song.downvotes.push(user1._id);
    await song.save();

    const updatedSong = await Song.findById(song._id);
    expect(updatedSong.voteScore).toBe(1); // 2 upvotes - 1 downvote
  });

  test('should toggle vote correctly', async () => {
    // Add upvote
    song.upvotes.push(user1._id);
    await song.save();
    expect(song.upvotes).toHaveLength(1);

    // Remove upvote (toggle)
    song.upvotes = song.upvotes.filter(id => id.toString() !== user1._id.toString());
    await song.save();
    expect(song.upvotes).toHaveLength(0);
  });

  test('should switch from upvote to downvote', async () => {
    // Add upvote
    song.upvotes.push(user1._id);
    await song.save();

    // Switch to downvote
    song.upvotes = song.upvotes.filter(id => id.toString() !== user1._id.toString());
    song.downvotes.push(user1._id);
    await song.save();

    expect(song.upvotes).toHaveLength(0);
    expect(song.downvotes).toHaveLength(1);
  });

  test('should calculate skip threshold correctly', () => {
    const totalMembers = room.members.length;
    const skipThreshold = (room.settings.skipThreshold / 100) * totalMembers;
    
    expect(skipThreshold).toBe(1); // 50% of 2 members = 1
  });
});
