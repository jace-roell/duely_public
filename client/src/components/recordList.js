import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import "./recordList.css";
import { NavLink } from "react-router-dom";

const Task = (props) => {
  const [completed, setCompleted] = useState(props.task.completed);

  async function toggleCompleted() {
    const updatedTask = { ...props.task, completed: !completed };
    setCompleted(!completed);
    // Update completed status on server
    await fetch(`http://localhost:5000/task/update/${props.task._id}`, {
      method: "POST",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    props.updateTaskList();
  }

  function getBackgroundColor(urgency) {
    switch (urgency) {
      case 1:
        return "table-success"; // Green for urgency 1
      case 2:
        return "table-info"; // Orange for urgency 2
      case 3:
        return "table-warning"; // Yellow for urgency 3
      case 4:
        return "table-primary"; // Red for urgency 4
      case 5:
        return "table-danger"; // Darker red for urgency 5
      default:
        return "";
    }
  }

  const urgencyClass = getBackgroundColor(props.task.urgency);

  return (
    <tr className={urgencyClass}>
      <td>{props.task.name}</td>
      <td>{props.task.description}</td>
      <td>{props.task.dueDate}</td>
      <td>{props.task.urgency}</td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
  <div className="form-check form-switch d-flex justify-content-center align-items-center">
    <input
      type="checkbox"
      className="form-check-input checkbox-lg"
      id={`completedCheckbox-${props.task._id}`}
      checked={completed}
      onChange={toggleCompleted}
    />
  </div>
</td>

      <td className="button-cell" style={{ verticalAlign: "middle", textAlign: "center" }}>
        <button
          className="btn btn-danger"
          onClick={() => {
            props.deleteTask(props.task._id);
          }}
          style={{ margin: "auto" }}
        >
          Delete
        </button>
      </td>
      <td className="button-cell" style={{ verticalAlign: "middle", textAlign: "center" }}>
        <Link
          className="btn btn-primary"
          to={`/edit/${props.task._id}`}
          style={{ margin: "auto" }}
        >
          Edit
        </Link>
      </td>
    </tr>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true); // State to control showing completed tasks

  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:5000/task/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const tasks = await response.json();
      setTasks(tasks);
    }

    getTasks();

    // Add event listener for table sorting and filtering when component mounts
    $(document).ready(function () {
      $("#searcher").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#recordTable tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });

      $("th").click(function () {
        var columnIndex = $(this).index();
        var table = $(this).parents("table").eq(0);

        // Check if sorting is allowed for the clicked column
        if (!isSortingAllowed(columnIndex)) {
          return; // Do nothing if sorting is not allowed
        }

        var rows = table.find("tr:gt(0)").toArray().sort(comparer(columnIndex));
        this.asc = !this.asc;
        if (!this.asc) {
          rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++) {
          table.append(rows[i]);
        }
        $("th").find("span").remove();
        var arrow = this.asc ? " ↗" : " ↘";
        $(this).append("<span>" + arrow + "</span>");
      });

      function comparer(index) {
        return function (a, b) {
          var valA = getCellValue(a, index),
            valB = getCellValue(b, index);
          if (valA === null) {
            return -1;
          }
          return $.isNumeric(valA) && $.isNumeric(valB)
            ? valA - valB
            : valA.toString().localeCompare(valB);
        };
      }

      function getCellValue(row, index) {
        return $(row).children("td").eq(index).text();
      }

      // Function to check if sorting is allowed for the column
      function isSortingAllowed(columnIndex) {
        // Allow sorting for all columns except the last three
        return columnIndex < $("th").length - 3;
      }
    });

    // Clean up function to remove event listeners when component unmounts
    return () => {
      $(document).off();
    };
  }, []);

  async function deleteTask(id) {
    await fetch(`http://localhost:5000/task/delete/${id}`, {
      method: "DELETE",
    });

    const newTasks = tasks.filter((task) => task._id !== id);
    setTasks(newTasks);
  }

  async function updateTaskList() {
    const response = await fetch(`http://localhost:5000/task/`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const tasks = await response.json();
    setTasks(tasks);
  }
  function taskList() {
    return tasks.map((task) => {
      // If showCompleted is false and task is completed, don't render it
      if (!showCompleted && task.completed) {
        return null;
      }
      return <Task task={task} deleteTask={deleteTask} key={task._id} updateTaskList={updateTaskList} />;
    });
  }

  return (
    <div className="table-container">
      <div className="table-controls">
        <div>
        <div>
      <Link to="/create" className="btn btn-primary">Create Task</Link>
    </div>
        </div>
        <div className="search-container">
          <span>
            <strong>Search:{'\u00A0'}</strong>
          </span>
          <input
            id="searcher"
            className="form-control"
            style={{ width: "200px"}}
          />
        </div>
        <div className="form-check show-completed-container">
  <input
    type="checkbox"
    className="form-check-input custom-checkbox"
    id="showCompleted"
    checked={showCompleted}
    onChange={() => setShowCompleted(!showCompleted)}
  />
  <label className="form-check-label" htmlFor="showCompleted">
    Show Completed Tasks
  </label>
</div>


      </div>
      <table
        id="recordTable"
        className="table table-bordered table-striped"
        style={{ marginTop: 20, margin: "0 auto" }}
      >
        <thead>
          <tr>
            <th className="non-selectable">Name</th>
            <th className="non-selectable">Description</th>
            <th className="non-selectable">Due Date</th>
            <th className="non-selectable">Urgency</th>
            <th className="non-selectable">Completed</th>
            <th className="non-selectable"></th>
            <th className="non-selectable"></th>
          </tr>
        </thead>
        <tbody>{taskList()}</tbody>
      </table>
    </div>
  );
}
