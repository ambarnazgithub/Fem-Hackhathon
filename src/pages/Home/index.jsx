import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Config";
import { getDatabase, ref, onValue, set, remove, push } from "firebase/database";
import TaskBoard from "../../components/TaskBoard";  // Adjust the import path as needed
import CreateTask from "../../components/CreateTask"; // Adjust the import path as needed

const Home = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Firebase (optional if you want to store them remotely)
  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, "tasks");

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTasks = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(loadedTasks);
      }
    });
  }, []);

  const handleAddTask = (newTask) => {
    const db = getDatabase();
    const tasksRef = ref(db, "tasks");

    // Save new task to Firebase
    const newTaskRef = push(tasksRef);
    set(newTaskRef, newTask);

    // Add the task to local state
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTask, id: newTaskRef.key },
    ]);

    console.log("New Task Added: ", newTask);
  };

  return (
    <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", padding: "20px" }}>
      {/* Create Task Section */}
      <CreateTask onAddTask={handleAddTask} />

      {/* Task Board */}
      <div className="container my-5" style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "30px" }}>
        <h3 
          className="text-center" 
          style={{ 
            color: "#fff", 
            fontWeight: "bold", 
            backgroundColor: "#4CAF50",  // Add background color here
            padding: "10px",  // Add padding for better spacing
            borderRadius: "5px"
          }}
        >
          Task Board
        </h3>
        <TaskBoard tasks={tasks} handleAddTask={handleAddTask} />
      </div>
    </div>
  );
};

export default Home;
