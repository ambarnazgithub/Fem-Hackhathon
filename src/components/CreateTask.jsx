import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { getDatabase, ref, set, push } from "firebase/database";
import { db } from "../Config";

const CreateTask = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation to ensure title and assignedTo are filled
    if (title.trim() === "" || assignedTo.trim() === "") {
      setError("Title aur Assigned To fill karna zaroori hai!");
      return;
    }

    // Create a new task object
    const newTask = {
      title,
      description,
      assignedTo,
      status: "inprogress", // Set initial status to "In Progress"
      createdAt: new Date().toISOString(),
    };

    console.log("New Task: ", newTask); // Log the task to check

    // Save the new task to Firebase Realtime Database
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    set(newTaskRef, newTask)
      .then(() => {
        // Add the task to local state and reset form
        onAddTask({ ...newTask, id: newTaskRef.key });
        setError(""); // Clear error on successful form submission

        // Reset form after adding
        setTitle("");
        setDescription("");
        setAssignedTo("");
      })
      .catch((err) => {
        setError("Error adding task to Firebase: " + err.message);
      });
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={6} sm={12}>
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Create New Task</h2>

            {/* Display error message if any */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Task Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Assign To (Name or Email)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                Add Task
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTask;
