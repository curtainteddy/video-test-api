const fs = require('fs');

const names = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt',
  'Fiona Green', 'George Wilson', 'Hannah Davis', 'Ian Cooper', 'Julia Roberts',
  'Kevin Miller', 'Laura Adams', 'Mike Taylor', 'Nina Patel', 'Oscar Lee'
];

const avatarUrls = [
  'https://images.unsplash.com/photo-1494790108755-2616b5e1e2e9?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
];

const sampleMessages = [
  "Hey, how's it going?",
  "Did you see the game last night?",
  "I'll be there in 10 minutes",
  "Thanks for your help earlier!",
  "What time works for you?",
  "That's hilarious! 😂",
  "Can we reschedule for tomorrow?",
  "Just finished my workout",
  "Have a great weekend!",
  "The weather is beautiful today",
  "I'm running a bit late",
  "Let's grab coffee sometime",
  "Hope you're doing well",
  "Thanks for the recommendation",
  "Looking forward to it!",
  "That sounds like a great plan",
  "I'll send you the details",
  "How was your vacation?",
  "Good morning! ☀️",
  "Take care and stay safe"
];

const userStatuses = ['active', 'offline', 'away'];

// Utility functions
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateTimestamp(daysAgo = 0, hoursAgo = 0) {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  return now.toISOString();
}

// Generate users
function generateUser(id) {
  return {
    id: id,
    name: randomChoice(names),
    avatarURL: randomChoice(avatarUrls),
    status: randomChoice(userStatuses)
  };
}

// Generate messages for a chat room
function generateMessages(roomId, messageCount = randomInt(15, 40)) {
  const messages = [];
  const messageStatuses = ['sent', 'delivered', 'seen'];
  
  for (let i = 0; i < messageCount; i++) {
    const messageId = generateId();
    const daysAgo = randomInt(0, 7);
    const hoursAgo = randomInt(0, 23);
    const shouldReply = Math.random() < 0.2 && messages.length > 0;
    const shouldEdit = Math.random() < 0.1;
    const sentByYou = Math.random() < 0.4;
    
    // Generate realistic status based on message age and sender
    let status;
    if (sentByYou) {
      if (daysAgo > 1) {
        status = randomChoice(['delivered', 'seen']);
      } else if (hoursAgo > 2) {
        status = randomChoice(['sent', 'delivered', 'seen']);
      } else {
        status = randomChoice(['sent', 'delivered']);
      }
    } else {
      status = 'seen';
    }


    const message = {
      id: messageId,
      message: randomChoice(sampleMessages),
      sentByYou: sentByYou,
      sentAt: generateTimestamp(daysAgo, hoursAgo),
      status: status,
      roomId: roomId,
      ...(shouldEdit && { isEdited: true }),
      ...(shouldReply && { replyMessage: randomChoice(messages) })
    };
    
    messages.push(message);
  }
  
  // Sort messages by timestamp
  messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  
  return messages;
}

// Generate room data
function generateRoom(userId) {
  const roomId = generateId();
  const user = generateUser(userId);
  const messages = generateMessages(roomId);
  const lastMessage = messages[messages.length - 1];
  const unreadCount = Math.random() < 0.7 ? randomInt(1, 15) : undefined;
  
  return {
    room: {
      id: roomId,
      ...(unreadCount && { unreadCount }),
      user: user,
      lastMessage: lastMessage
    },
    messages: messages
  };
}

// Generate the complete dataset
function generateChatData(roomCount = 500) {
  const chatRooms = [];
  const messages = []; // All messages in a flat array for pagination
  
  for (let i = 1; i <= roomCount; i++) {
    const { room, messages: roomMessages } = generateRoom(i);
    chatRooms.push(room);
    messages.push(...roomMessages); // Flatten all messages into one array
  }
  
  return {
    chatRooms,
    messages // Single flat array of all messages with roomId field
  };
}

// Generate and save the data
const chatData = generateChatData(100);

// Write to file
fs.writeFileSync('chat-data.json', JSON.stringify(chatData, null, 2));

console.log('✅ Chat data generated successfully!');
console.log(`📊 Generated ${chatData.chatRooms.length} chat rooms`);
console.log(`💬 Generated ${chatData.messages.length} total messages`);
console.log('📁 Data saved to: chat-data.json');

console.log('\n🔧 API Usage Examples:');
console.log('• Get all chat rooms: GET /chatRooms');
console.log('• Get paginated messages: GET /messages?_page=1&_limit=20');
console.log('• Get messages for specific room: GET /messages?roomId=ROOM_ID&_page=1&_limit=20');
console.log('• Get messages sorted by date: GET /messages?_sort=sentAt&_order=desc&_page=1&_limit=20');

// Log some sample data for verification
console.log('\n📋 Sample Room:');
console.log(JSON.stringify(chatData.chatRooms[0], null, 2));

console.log('\n💬 Sample Messages (first 3):');
console.log(JSON.stringify(chatData.messages.slice(0, 3), null, 2));