import { useEffect, useState, useRef } from "react";

const phrases = [
  "¡Cada día es una nueva oportunidad!",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No te rindas, lo mejor está por venir.",
  "La disciplina es el puente entre metas y logros.",
  "Haz hoy lo que otros no harán, para tener mañana lo que otros no tendrán.",
];

function Carousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <div className="carousel">
      <p key={index} className="carousel-phrase fade-in">
        {phrases[index]}
      </p>
    </div>
  );
}

//No esta quedando esto
const API_URL = "https://pwabackend-ebd8eefghwhyhkcj.canadacentral-01.azurewebsites.net/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (input.trim() === "") return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setInput("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main>
      <h1>Lista de Tareas</h1>

      {/* Carrusel independiente arriba */}
      <Carousel />

      <div className="task-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.text}
            <button onClick={() => deleteTask(t.id)} style={{ marginLeft: "1rem" }}>
              🗑️ Eliminar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
