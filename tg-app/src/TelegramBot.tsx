import React, { useState } from 'react';
import axios from 'axios';

const TelegramBot: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [botInfo, setBotInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
    setBotInfo(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
      if (response.data.ok) {
        setBotInfo(response.data.result);
      } else {
        setError('Не удалось получить информацию о боте. Проверьте токен.');
      }
    } catch (err) {
      setError('Ошибка при подключении к Telegram API. Проверьте токен и подключение к интернету.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Введите токен бота:
          <input type="text" value={token} onChange={handleChange} />
        </label>
        <button type="submit">Проверить токен</button>
      </form>
      {botInfo && (
        <div>
          <h3>Информация о боте:</h3>
          <p>Имя: {botInfo.first_name}</p>
          <p>Имя пользователя: @{botInfo.username}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TelegramBot;