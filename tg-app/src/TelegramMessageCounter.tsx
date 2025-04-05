import React, { useState, useEffect } from 'react';

// Определение типов для ответа API
interface TelegramUpdate {
  message?: {
    chat: {
      type: 'private' | 'group'
    }
  };
}

const TelegramMessageCounter: React.FC = () => {
   const [status, setStatus] = useState<string>('');

  const token: string = '7860280378:AAE12iDkjYJTy2gpG8RpPoiJDV9wRN6CdJc'; // Замените на ваш токен

  // Асинхронная функция для получения обновлений
  const getUpdates = async (token:string): Promise<TelegramUpdate[]> => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching updates:', error);
      return [];
    }
  };

  // Функция для подсчета сообщений
  const countMessages = (updates: TelegramUpdate[]): number => {
    let count = 0;
    updates.forEach(update => {
      if (update.message && (update.message.chat.type === 'private' || update.message.chat.type === 'group')) {
        count++;
      }
    });
    return count;
  };
  // Функция, вызываемая при изменении видимости элемента
  const handleVisibilityChange = async () => {
    setStatus('Подсчет сообщений');
    const updates = await getUpdates(token);
    const count = countMessages(updates);
    setStatus(`Число сообщений: ${count}`);
   };

   

  // Использование IntersectionObserver для отслеживания видимости элемента 'chat'
  useEffect(() => {
    const chatElement = document.getElementById('chat');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          handleVisibilityChange();
        }
      });
    });

    if (chatElement) {
      observer.observe(chatElement);
    }

    return () => {
      if (chatElement) {
        observer.unobserve(chatElement);
      }
    };
  }, []);

  return (
    <div>
       <div id="chat" style={{ height: '200px', overflow: 'auto' }}>
        {/* Чат-контент */}
      </div>
      <div>
          {status} 
      </div>
    </div>
  );
};

export default TelegramMessageCounter;
