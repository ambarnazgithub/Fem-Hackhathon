// src/Components/TaskBoard.jsx

import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { ref, set, push, get } from "firebase/database";
import { db } from "../Config";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from Firebase on component mount
    const tasksRef = ref(db, "tasks");
    get(tasksRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const tasksData = snapshot.val();
          const taskList = Object.keys(tasksData).map((key) => ({
            id: key,
            ...tasksData[key],
          }));
          setTasks(taskList);
        } else {
          console.log("No tasks found");
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks: ", error);
      });
  }, []);

  const handleAddTask = (newTask) => {
    // Adding a task with "inprogress" status
    const taskWithId = { ...newTask, status: "inprogress", id: Date.now().toString() };
    
    // Update local state immediately with the new task
    setTasks([...tasks, taskWithId]);

    // Save new task to Firebase Realtime Database with "inprogress" status
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    set(newTaskRef, taskWithId)
      .then(() => {
        // Task has been added to Firebase, now update local state
        setTasks([...tasks, { ...taskWithId, id: newTaskRef.key }]);
      })
      .catch((err) => {
        console.error("Error adding task to Firebase: ", err);
      });
  };

  const moveTask = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    // Update task status in Firebase
    const taskRef = ref(db, `tasks/${taskId}`);
    set(taskRef, { ...updatedTasks.find((task) => task.id === taskId), status: newStatus });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        const newStatus = destination.droppableId;
        task.status = newStatus;

        // Update task in Firebase
        const taskRef = ref(db, `tasks/${task.id}`);
        set(taskRef, { ...task, status: newStatus });

        return task;
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // Filter tasks based on their status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          <TaskColumn
            columnId="inprogress"
            title="In Progress"
            tasks={inProgressTasks}
            moveTask={moveTask}
          />
          <TaskColumn
            columnId="todo"
            title="To Do"
            tasks={todoTasks}
            moveTask={moveTask}
          />
          <TaskColumn
            columnId="done"
            title="Done"
            tasks={doneTasks}
            moveTask={moveTask}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
