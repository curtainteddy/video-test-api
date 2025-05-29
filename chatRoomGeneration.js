const fs = require('fs');

// Sample data for generating realistic content
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

// Generate messages for a chat
function generateMessages(chatId, messageCount = 500) {
    const messages = [];
    const messageStatuses = ['sent', 'delivered', 'seen'];

    for (let i = 0; i < messageCount; i++) {
        const messageId = generateId();
        const daysAgo = randomInt(0, 7);
        const hoursAgo = randomInt(0, 23);
        const shouldReply = Math.random() < 0.2 && messages.length > 0; // 20% chance to reply
        const shouldEdit = Math.random() < 0.1; // 10% chance to be edited
        const sentByYou = Math.random() < 0.4; // 40% chance it's sent by you

        // Generate realistic status based on message age and sender
        let status;
        if (sentByYou) {
            // Your messages: older messages more likely to be seen, newer ones might still be sent/delivered
            if (daysAgo > 1) {
                status = randomChoice(['delivered', 'seen']); // Older messages likely seen or delivered
            } else if (hoursAgo > 2) {
                status = randomChoice(['sent', 'delivered', 'seen']);
            } else {
                status = randomChoice(['sent', 'delivered']); // Very recent messages might not be seen yet
            }
        } else {
            // Others' messages: they're always seen by you (since you're reading them)
            status = 'seen';
        }

        const message = {
            id: messageId,
            message: randomChoice(sampleMessages),
            sentByYou: sentByYou,
            sentAt: generateTimestamp(daysAgo, hoursAgo),
            status: status,
            ...(shouldEdit && { isEdited: true }),
            ...(shouldReply && { replyMessageId: randomChoice(messages).id })
        };

        messages.push(message);
    }

    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

    return messages;
}

// Generate chat data
function generateChat(roomId) {
    return {
        id: roomId,
        messages: generateMessages(roomId)
    };
}

// Generate room data
function generateRoom(userId) {
    const roomId = generateId();
    const user = generateUser(userId);
    const messages = generateMessages(roomId);
    const lastMessage = messages[messages.length - 1];
    const unreadCount = Math.random() < 0.7 ? randomInt(1, 15) : undefined; // 70% chance to have unread messages

    return {
        room: {
            id: roomId,
            ...(unreadCount && { unreadCount }),
            user: user,
            lastMessage: lastMessage
        },
        chat: {
            id: roomId,
            messages: messages
        }
    };
}

// Generate the complete dataset
function generateChatData(roomCount = 15) {
    const chatRooms = [];
    const chatMessages = [];

    for (let i = 1; i <= roomCount; i++) {
        const { room, chat } = generateRoom(i);
        chatRooms.push(room);
        chatMessages.push(chat);
    }

    return {
        chatRooms,
        chatMessages
    };
}

// Generate and save the data
const chatData = generateChatData(100); // Generate 12 chat rooms

// Write to file
fs.writeFileSync('chat-data.json', JSON.stringify(chatData, null, 2));

console.log('✅ Chat data generated successfully!');
console.log(`📊 Generated ${chatData.chatRooms.length} chat rooms with matching message threads`);
console.log('📁 Data saved to: chat-data.json');

