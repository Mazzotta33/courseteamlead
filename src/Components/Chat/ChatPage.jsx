import React, {useState, useEffect} from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import styles from './ChatPage.module.css';
import TopNavbar from "../Layout/TopNavbar.jsx";

const currentUser = {id: 'user-me', name: 'Вы'};

const placeholderUsers = {
    teacher: [
        {id: 'teacher-1', name: 'Иван Петрович (Преподаватель)'},
    ],
    admin: [
        {id: 'admin-1', name: 'Елена Иванова (Администрация)'},
        {id: 'admin-support', name: 'Тех. Поддержка'},
    ],
    peers: [
        {id: 'peer-1', name: 'Алексей Смирнов'},
        {id: 'peer-2', name: 'Мария Кузнецова'},
        {id: 'user-me', name: 'Вы (Тест)'},
    ]
};

const placeholderMessages = {
    'teacher-1': [
        {id: 'm1', senderId: 'teacher-1', text: 'Здравствуйте! Чем могу помочь?', timestamp: '10:30'},
        {id: 'm2', senderId: currentUser.id, text: 'Добрый день! У меня вопрос по ДЗ.', timestamp: '10:31'},
    ],
    'admin-support': [
        {id: 'm3', senderId: 'admin-support', text: 'Служба поддержки на связи.', timestamp: '11:00'},
    ],
    'peer-1': [
        {id: 'm4', senderId: 'peer-1', text: 'Привет! Ты сделал 3 задание?', timestamp: '12:05'},
        {id: 'm5', senderId: currentUser.id, text: 'Привет, еще нет, разбираюсь.', timestamp: '12:06'},
        {id: 'm6', senderId: 'peer-1', text: 'Сложно?', timestamp: '12:06'},
    ],
};

const ChatPage = (props) => {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState(placeholderUsers);

    const {userRole} = props; // Получаем роль пользователя из пропсов

    useEffect(() => {
        if (selectedChatId) {
            console.log(`Loading messages for chat: ${selectedChatId}`);
            // Simulate fetching messages
            setMessages(placeholderMessages[selectedChatId] || []);
        } else {
            setMessages([]);
        }
    }, [selectedChatId]);

    const handleSelectChat = (userId) => {
        console.log("Selected chat:", userId);
        setSelectedChatId(userId);
    };

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedChatId) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: text,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        if (selectedChatId !== 'admin-support' && selectedChatId !== currentUser.id) {
            setTimeout(() => {
                const replyText = `Автоответ на ваше сообщение: "${text.substring(0, 20)}..."`;
                const replyMessage = {
                    id: `msg-${Date.now() + 1}`,
                    senderId: selectedChatId,
                    text: replyText,
                    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                };
                if (document.getElementById(`chat-window-${selectedChatId}`)) {
                    setMessages(prevMessages => [...prevMessages, replyMessage]);
                }
            }, 1500);
        }
    };

    const selectedChatName = selectedChatId
        ? Object.values(chatUsers).flat().find(u => u.id === selectedChatId)?.name
        : null;


    return (
        <div>
            {userRole === 'student' ? (
                <div className={styles.navbar}>
                    <TopNavbar/>
                </div>
            ) : null}

            <div className={styles.chatPageContainer}>
                <ChatSidebar
                    users={chatUsers}
                    selectedChatId={selectedChatId}
                    onSelectChat={handleSelectChat}
                    currentUser={currentUser}
                />
                <ChatWindow
                    key={selectedChatId}
                    chatId={selectedChatId}
                    chatName={selectedChatName}
                    messages={messages}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default ChatPage;