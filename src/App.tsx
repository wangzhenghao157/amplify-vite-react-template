import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

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
    // client.models.Todo.create({ content: window.prompt("Todo content") });
    client.models.Todo.create({ content: inputValue });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>All Messages</h1>
      <ul>
        {todos.map((todo) => (
          <li  onClick={() => deleteTodo(todo.id)} 
          key={todo.id}>{todo.content}<br/>{todo.createdAt}</li>
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
