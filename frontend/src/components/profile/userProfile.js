import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import AboutText from "./aboutText";

const UserProfile = ({ navigate }) => {
  const [token] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
    } else {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <NavBar logout={logout} />
      <AboutText />
      {/* <div className="bg-grey-lighter h-screen font-sans">
        <div className="container mx-auto h-full flex justify-center items-center">
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="font-lobster text-blue-500 text-center text-3xl mb-12">
              About
            </h2>
            <div className="text-center">
              <p>
                Acebook stores your information on every app and extention you
                use.
              </p>
              <p>
                We know how often you use them, where you use them, and who you
                use them to interact with.
              </p>
              <p>
                That means we know who you talk to on Instagram, what countries
                you are speaking with,
              </p>
              <p>
                your relationship status, probably weight, if you're going to be
                a parent soon
              </p>
              <p>and what time you go to sleep!</p>
              <p>Sleep tight xoxo</p>
              <br></br>
              <p>- The team at Acebook.</p>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
};

export default UserProfile;
