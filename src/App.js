/* The goal of the project is to create a ReactJS based frontend
 application which lets a user view the teachers on a map.
 jVectorMap library should be used for working with map.

*/
import { useState } from "react";
import { useEffect } from "react";
import data from "./data/teachers.json";
import GlobalMap from "./components/GlobalMap";

const App = () => {
  const [teachers, setTeachers] = useState([]);

  // filter out the teacher with country

  useEffect(() => {
    if (data) {
      setTeachers(data);
    }
  }, []);

  return (
    <div>
      <GlobalMap teachers={teachers} />
      {/* <GlobalMap teachers={teachers} /> */}
    </div>
  );
};

export default App;
