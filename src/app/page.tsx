"use client"

import { useState } from "react";

const Page = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const task = {
      userId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      completed,
    };

    try {
      const res = await fetch('/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task }),
      });

      if (!res.ok) {
        throw new Error('タスクの作成に失敗しました');
      }

      await res.json();
      // フォームをクリア
      setUserId('');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority(1);
      setCompleted(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Todoリスト</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">ユーザーID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="title">タスク名:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">詳細:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dueDate">期限日:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="priority">優先度:</label>
          <input
            type="number"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            完了済み
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '送信中...' : 'タスクを作成'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
export default Page