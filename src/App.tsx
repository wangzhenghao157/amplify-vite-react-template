import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

// async function getCurrentUserEmail() {
//   try {
//     const user = await Auth.currentAuthenticatedUser();
//     const email = user.attributes.email; // 获取用户的邮箱
//     console.log('User email:', email);
//     return email;
//   } catch (error) {
//     console.error('Error fetching user email:', error);
//     return null;
//   }
// }
// getCurrentUserEmail()

console.log(getCurrentUser());

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  //获取输入的内容
  const inputElement = document.getElementById("myInput") as HTMLInputElement;

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const inputValue = inputElement.value;
    const userEmail = "获取到的email"
    client.models.Todo.create({ content: inputValue ,email: userEmail});
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>Chat Room </h1>
      <ul>
        {todos.map((todo) => (
          <li  onClick={() => deleteTodo(todo.id)} 
          key={todo.id}>{todo.content}<br/>
          {todo.createdAt}<br/>
          {todo.email}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <input type="text" id="myInput" placeholder="input something"/>
      <button onClick={createTodo}>Send</button>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
