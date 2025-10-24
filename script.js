// Глобальные переменные для текущей сцены
let currentSceneIndex = 0;
const scenes = ['intro', 'chats', 'chat', 'settings', 'channels', 'zen', 'reflection'];

// Функция для переключения сцен с плавным скроллом
function switchScene(targetId) {
    const scene = document.getElementById(targetId);
    if (scene) {
        // Скрыть текущую
        document.querySelector('.scene.active').classList.remove('active');
        // Показать новую и скроллить
        scene.classList.add('active');
        scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Инициализация и обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Intro: стартовая кнопка
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScene('chats');
    });

    // Chats: клик на чат переходит к Chat View
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            switchScene('chat');
        });
    });

    // Chat: полный экран, кнопка Далее
    document.getElementById('next-chat').addEventListener('click', () => {
        switchScene('settings');
    });

    // Settings: модальное окно
    const modal = document.getElementById('settings-modal');
    document.getElementById('settings-toggle').addEventListener('click', () => {
        modal.classList.add('show');
    });
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.remove('show');
    });

    document.getElementById('next-settings').addEventListener('click', () => {
        switchScene('channels');
    });

    // Channels: кнопка Далее
    document.getElementById('next-channels').addEventListener('click', () => {
        switchScene('zen');
    });

    // Zen: очистка интерфейса
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('clear-btn').classList.add('hidden');
        document.getElementById('zen-content').classList.remove('hidden');
        document.getElementById('next-zen').classList.remove('hidden');
    });

    document.getElementById('next-zen').addEventListener('click', () => {
        switchScene('reflection');
    });

    // Reflection: restart и share
    document.getElementById('restart-btn').addEventListener('click', () => {
        // Сброс и переход к intro
        document.querySelector('.scene.active').classList.remove('active');
        document.getElementById('intro').classList.add('active');
        // Вернуть Zen к состоянию по умолчанию
        document.getElementById('clear-btn').classList.remove('hidden');
        document.getElementById('zen-content').classList.add('hidden');
        document.getElementById('next-zen').classList.add('hidden');
    });

    // Share modal
    const shareModal = document.getElementById('share-modal');
    document.getElementById('share-btn').addEventListener('click', () => {
        shareModal.classList.add('show');
    });
    document.getElementById('close-share').addEventListener('click', () => {
        shareModal.classList.remove('show');
    });

    // Копирование цитаты
    document.querySelector('.copy-btn').addEventListener('click', () => {
        const text = document.querySelector('#share-modal p').textContent;
        navigator.clipboard.writeText(text);
        alert('Цитата скопирована!');
    });
});
