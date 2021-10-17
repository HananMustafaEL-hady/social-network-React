import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from "./Card";
import Container from "./Container";
function Users() {
  useEffect(() => {
    async function getuser() {
      try {
        const res = await axios.get("https://randomuser.me/api?results=6");
        console.log(res.data.results);
        setUsers(res.data.results);
      } catch (err) {
        console.log(err);
      }
    }
    getuser();
  }, []);
  const [users, setUsers] = useState();

  console.log(users);

  return (
    <div>
      {users?.map((item) => (
        <Card
          key={item.id}
          name={item.name.first + " " + item.name.last}
          imgsrc={item.picture.large}
          city={item.location.city}
          country={item.location.country}
        />
      ))}
    </div>
  );
}

export default Users;
