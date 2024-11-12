import { useEffect, useState } from "react";
import "./style.css";
import UserProfile from "./UserProfile.jsx";
import Quests from "./Quests.jsx";
import UserName from "./UserName.jsx";

  //-- TODO:
  //  - [x] check if a user object exists within local storage
  //  - [x] if a user does _not_ exist, create a new one and store it
  //  - [x] if a user _does_ exist, use the object that is returned for our current user
  //  - [x] pass new user object into relevent components
  //  - [x] prompt for user to select their own name
  //  - [x] stores quest and abandon counts locally?
  //  - [ ] change empty quest board to appropriate message, if quests have been completed or not
  //  - [ ]

export default function App() {
  const [view, setView] = useState("quests");
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [newName, setNewName] = useState("");
  const [nameFormVisibility, setNameFormVisibility] = useState(true);

  const [newDailyQuestsCompletedCount, setNewDailyQuestsCompletedCount] = useState();
  const [newQuestCompletedCount, setNewQuestCompletedCount] = useState();
  const [newAbandonedQuestCount, setNewAbandonedQuestCount] = useState();
  const [newAbandonedDailyQuestCount, setNewAbandonedDailyQuestCount] = useState();

  const [buttonVisibility, setButtonVisibility] = useState(true);


  const viewChange = (newView) => {
    setView(newView);
    console.log("viewchange");
  };

  useEffect(() => {
    if (view === "userName")
      setNameFormVisibility(true);
    if (view === "user")
      setNameFormVisibility(false);
    if (view === "quests")
      setNameFormVisibility(false);
  },[view]);
    
    
useEffect(() => {
  if (view === "userName")
    setButtonVisibility(false);
  if (view === "user")
    setButtonVisibility(true);
},[view]);


  useEffect(() => {
    if (!user) return;

    setNewDailyQuestsCompletedCount(user.dailyQuestsCompleted);
    setNewQuestCompletedCount(user.questCompleted);
    setNewAbandonedQuestCount(user.abandonedQuests);
    setNewAbandonedDailyQuestCount(user.abandonedQuests);
  }, [user]);

  useEffect(() => {
    const userExists = localStorage.getItem("user");

    if (!userExists) {
      const newUserObject = {
        id: crypto.randomUUID(),
        name: "",
        level: 0,
        questCompleted: 0,
        abandonedQuests: 0,
        dailyQuestsCompleted: 0,
        abandonedDailyQuests: 0,
      };

      localStorage.setItem("user", JSON.stringify(newUserObject));

      setUser(localStorage.getItem("user"));
      return viewChange("userName");
    }
    setUser(JSON.parse(localStorage.getItem("user")));

    return;
  }, [refreshKey]);

  useEffect(() => {
    if (!user) {
        setView("userName") 
        return;
    }

    setView("quests") ;
}, [user]);

  /*
    if (myVar && (myVar2.type === "shoot" || myVar2.type === "shoot location")) {
      ...
    }
  */

  useEffect(() => {
    if (!user) return;

    //-- const user = localStorage.getItem("user");
    //-- user.dailyQuestsCompleted = newDailyQuestsCompletedCount
    //-- user.questsCompleted = newQuestsCompletedCount
    //-- localStorage.setItem("user", user);

    /*
     prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        dailyQuestsCompleted: newDailyQuestsCompletedCount,
        questsCompleted: newQuestsCompletedCount,
      }
     })
    */

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user, //-- spread over our existing user object so we retain any unchanged values...

        //-- ...conditionally update values if they've changed.
        ...(user.dailyQuestsCompleted !== newDailyQuestsCompletedCount
          ? { dailyQuestsCompleted: newDailyQuestsCompletedCount }
          : {}),
        ...(user.questCompleted !== newQuestCompletedCount
          ? { questCompleted: newQuestCompletedCount }
          : {}),
      })
    );
  }, [newDailyQuestsCompletedCount][newQuestCompletedCount]);


  useEffect(() => {
    if (!user) return;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user, 
        ...(user.abandonedQuests !== newAbandonedQuestCount
          ? { abandonedQuests: newAbandonedQuestCount }
          : {})
      })
    );
  }, [newAbandonedQuestCount]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user, 
        ...(user.abandonedDailyQuests !== newAbandonedDailyQuestCount
          ? { abandonedDailyQuests: newAbandonedDailyQuestCount }
          : {})
      })
    );
  }, [newAbandonedDailyQuestCount]);
  

  function handleOnChange(value) {
    setNewName(value);
  }

  const handleSubmit = (value) => {
    localStorage.setItem("user", JSON.stringify({ ...user, name: newName }));
    viewChange("user");
    setRefreshKey((prev) => prev + 1);
    console.log("User information updated!");
  };

  return (
    <div className="bodywrapper">
      <header>battle-cat-quests</header>
      {buttonVisibility && (<div className="userBtn">
        <button className="menuBtn" onClick={() => viewChange("quests")}>
          Quests
        </button>
        <button className="menuBtn" onClick={() => viewChange("user")}>
          User Profile
        </button>
      </div>)}
      <div>
        {view ==="userName" && !!user && <UserName user={user} />}
        {view === "user" && !!user && <UserProfile user={user} />}
        {view === "quests" && !!user && (
          <Quests
            user={user}
            newDailyQuestsCompletedCount={newDailyQuestsCompletedCount}
            setNewDailyQuestsCompletedCount={setNewDailyQuestsCompletedCount}
            newQuestCompletedCount={newQuestCompletedCount}
            setNewQuestCompletedCount={setNewQuestCompletedCount}
            newAbandonedQuestCount={newAbandonedQuestCount}
            setNewAbandonedQuestCount={setNewAbandonedQuestCount}
            newAbandonedDailyQuestCount={newAbandonedDailyQuestCount}
            setNewAbandonedDailyQuestCount={setNewAbandonedDailyQuestCount}
          />
        )}
      </div>
      {nameFormVisibility && (<form
        className="nameInput"
        onSubmit={(e) => {
          //-- prevent default behavior of the event. in this case, stop the form submission
          //-- from refreshing the page.
          e.preventDefault();

          handleSubmit(newName);
        }}
      >
        <label htmlFor="nameInputBar">NAME</label>
        <input
          value={newName}
          type="text"
          onChange={(event) => handleOnChange(event.target.value)}
          id="nameInputBar"
        />
        <button className="nameInput">submit</button>
      </form>)}
    </div>
  );
}
