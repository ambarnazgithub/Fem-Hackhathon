import React from "react";
import { Droppable, Draggable } from '@hello-pangea/dnd';

const TaskColumn = ({ columnId, title, tasks, moveTask }) => {
  return (
    <div className="col">
      <h4 className="text-center">{title}</h4>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            className="p-3 bg-light rounded"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ minHeight: "300px" }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className="card p-2 mb-2"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <h6>{task.title}</h6>
                    <small>Assigned: {task.assignedTo}</small>

                    <div className="mt-2">
                      {columnId === "todo" && (
                        <button
                          className="btn btn-sm btn-primary w-100"
                          onClick={() => moveTask(task.id, "inprogress")}
                        >
                          Move to In Progress
                        </button>
                      )}
                      {columnId === "inprogress" && (
                        <button
                          className="btn btn-sm btn-success w-100"
                          onClick={() => moveTask(task.id, "done")}
                        >
                          Move to Done
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
