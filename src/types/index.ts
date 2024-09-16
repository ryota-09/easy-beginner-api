// -タスクのプロパティ
// id
// userId
// title
// description
// completed
// dueDate
// priority
// createdAt
// updatedAt

// -ユーザーのプロパティ
// id
// userName
// email
// password

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
}

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}