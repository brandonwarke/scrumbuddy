import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Tasks.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [user] = useAuthState(auth); // Get the logged-in user

  useEffect(() => {
    if (!user) return; // Exit if user is not logged in

    console.log("User ID:", user?.uid);

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched Tasks:", tasksArray);
      setTasks(tasksArray);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  // Function to handle deletion of a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      console.log("Task successfully deleted!");
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  };

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks added yet!</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.taskName}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            <button onClick={() => deleteTask(task.id)} className="delete-task-button">
              Delete Task
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
