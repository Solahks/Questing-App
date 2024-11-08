import { useState } from "react";

export default function Quests(props) {
  const [newQuest, setNewQuest] = useState("");
  const [newDaily, setNewDaily] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dailies, setDailies] = useState([]);

  console.log("Quests -- props.user: ", props.user)

  //FUNCTIONS FOR ONE TIME QUESTS(TASKS)//
  function handleSubmit(e) {
    e.preventDefault();

    setTasks((currentTasks) => {
      return [
        ...currentTasks,
        { id: crypto.randomUUID(), title: newQuest, completed: false },
      ];
    });

    setNewQuest("");
  }

  function deleteTask(id) {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => task.id !== id);
    });
  }

  function completeTask(id) {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => task.id !== id);
    });
  }

  //FUNCTIONS FOR DAILY QUESTS//
  function handleDailySubmit(e) {
    e.preventDefault();

    setDailies((currentDailies) => {
      return [
        ...currentDailies,
        { id: crypto.randomUUID(), title: newDaily, completed: false },
      ];
    });

    setNewDaily("");
  }

  const toggleDaily = (id, completed) => {
    setDailies((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: completed } : d))
    );
    completed ? props.setNewDailyQuestsCompletedCount(prev => prev + 1) : null;
  };

  const resetAllDailies = (id, completed) => {
    const resetDailies = dailies.map((d) =>
      d.id === id ? { ...d, completed: completed } : { ...d, completed: false }
    );
    setDailies(resetDailies);
  };

  function deleteDaily(id) {
    setDailies((currentDailies) => {
      return currentDailies.filter((daily) => daily.id !== id);
    });
  }

  return (
    <div className="bodywrapper">
      <h1 className="questHeader">{props.user.name}'s Quest Log</h1>
      <form onSubmit={handleSubmit} className="new-quest-form">
        <div className="form-row">
          <label htmlFor="quest">Add A New One Time Quest Here!</label>
          <input
            value={newQuest}
            onChange={(e) => setNewQuest(e.target.value)}
            type="text"
            id="quest"
          ></input>
        </div>
        <button className="btn">ACCEPT</button>
      </form>
      <div id="completeQuest">Completed- {props.user.questsCompleted} </div>
      <ul className="list">
        {tasks.length === 0 && "All Quests Completed!"}
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              <label>{task.title}</label>
              <button
                onClick={() => {
                  completeTask(task.id);
                  props.user.questsCompleted++;
                }}
                className="btn btn-yay"
              >
                Complete
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id);
                  props.user.abandonedQuests++;
                }}
                className="btn btn-danger"
              >
                Abandon
              </button>
            </li>
          );
        })}
      </ul>
      <div className="divider">__________</div>
      <form onSubmit={handleDailySubmit} className="new-daily-form">
        <div className="daily-form-row">
          <label htmlFor="daily">Add A New Daily Quest Here!</label>
          <input
            value={newDaily}
            onChange={(e) => setNewDaily(e.target.value)}
            type="text"
            id="daily"
          ></input>
        </div>
        <button className="btn dailyBtn">ACCEPT</button>
      </form>
      <div id="completeDaily">
        Completed Daily- {props.newDailyQuestsCompletedCount}{" "}
      </div>
      <ul className="dailyList">
        {dailies.length === 0 && "No Set Daily Quests."}
        {dailies.map((daily) => {
          console.log("daily id: ", daily.id);
          return (
            <li key={daily.id}>
              <label>
                <input
                  type="checkbox"
                  checked={daily.completed}
                  onChange={(e) => toggleDaily(daily.id, e.target.checked)}
                />
                {daily.title}
              </label>

              <button
                onClick={() => {
                  deleteDaily(daily.id);
                  props.user.abaondonedDailyQuests++;
                }}
                className="btn btn-danger"
              >
                Abandon
              </button>
            </li>
          );
        })}
      </ul>
      <button onClick={resetAllDailies} className="foot" id="clearBtn">
        CLEAR COMPLETED
      </button>
    </div>
  );
}