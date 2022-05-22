// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signUp">SignUp</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/join">
            <JoinMeeting />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
        <Route path="/ModeratorSpace">
          <ModeratorSpace />
        </Route>
      </div>
    </Router>
  );
}

const dashboard = '/dashboard';
const login = '/login';
const join = '/join';
const home = '/home';
const logoutCall = "server/logout";
const loginCall = "server/login";
const signUpCall = "server/signUp";
const access = "server/access";
const refresh = "server/refresh";
const accessCreate = "server/accessCreate";
const accessJoin = "server/accessJoin";
const accessAdmin = "server/accessAdmin";
const accessModeratorSet = "server/accessModeratorSet";

//const accessFailed = "server/accessFailed";
export function logout(e) {
  fetch(logoutCall, {
    method: 'get',
  }).then((response) => {
    if (response.status === 200) {
      window.location.replace(login);
    }
  });
}

export function back(e) {
  window.location.replace(home);
}

export async function callAuthGet(direction) {
  let response = await fetch(direction);
  if (response.status !== 200) {
    let secondCall = await fetch(refresh);
    if (secondCall.status !== 200) {
      return false;
    }
    let thirdCall = await fetch(direction);
    if (thirdCall.status !== 200) {
      return false;
    }
    return true;
  }
  return true;
}

export async function callAuthPostUrl(direction, data) {
  let response = await fetch(direction, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (response.status !== 200) {
    let secondCall = await fetch(refresh);
    if (secondCall.status !== 200) {
      return "false";
    }
    let thirdCall = await fetch(direction, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (thirdCall.status !== 200) {
      return "false";
    }
    let result = await thirdCall.json();
    return result.url;
  }
  let result = await response.json();
  return result.url;
}

export async function callAuthPost(direction, data) {
  let response = await fetch(direction, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (response.status !== 200) {
    if (response.status !== 409) {
      let secondCall = await fetch(refresh);
      if (secondCall.status !== 200) {
        return false;
      }
      let thirdCall = await fetch(direction, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (thirdCall.status !== 200) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
  return true;
}

export async function authCall() {
  let x = await fetch(access);
  if (x.status === 200) {
    return true;
  }
  let y = fetch(refresh);
  if (y.status === 200) {
    return true;
  }
  return false;
}

function Home() {

  // Directions
  function openCreate(e) {
    callAuthGet(accessAdmin).then((response) => {
      console.log(response);
      if (!response) {
        document.getElementById('inner').innerHTML = "You Not allowed to create meetings";
        return null;
      }
      window.location.replace(dashboard);
    });
  }

  // Directions
  function openJoin(e) {
    authCall().then((response) => {
      console.log(response);
      if (!response) {
        logout();
        return null;
      }
      window.location.replace(join);
      return null;
    });
  }

  //Home page
  return (
    <>
      <section>
        <h1>Welcome!</h1>
        <h3>Would you like to create a meeting?</h3>
        <button onClick={(e) => openCreate(e.target.value)}>Create a meeting</button><br></br>
        <h3>Would you like to join to an existing meeting?</h3>
        <button onClick={(e) => openJoin(e.target.value)}>Join</button><br></br>
        <h3>Would you like to logout?</h3>
        <button id="button" onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div id="inner"></div>
      </section>
    </>
  );
}

function Dashboard() {
  // Prepare BBB default params
  const [meetingName, setMeetingName] = useState("");
  const [attendeePassword, setAttendeePassword] = useState("");
  const [moderatorPassword, setModeratorPassword] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("welcome");
  const [maxParticipants, setMaxParticipants] = useState(120);
  const [record, setRecord] = useState(false);
  const [duration, setDuration] = useState(60);
  const [moderatorOnlyMessage, setModeratorOnlyMessage] = useState("Moderator Only Massage");
  const [autoStartRecording, setAutoStartRecording] = useState(false);
  const [allowStartStopRecording, setAllowStartStopRecording] = useState(true);
  const [webcamsOnlyForModerator, setWebcamsOnlyForModerator] = useState(false);
  const [bannerText, setBannerText] = useState("Banner Text");
  const [muteOnStart, setMuteOnStart] = useState(false);
  const [allowModsToUnmuteUsers, setAllowModsToUnmuteUsers] = useState(false);
  const [lockSettingsDisableCam, setLockSettingsDisableCam] = useState(false);
  const [lockSettingsDisableMic, setLockSettingsDisableMic] = useState(false);
  const [lockSettingsDisablePrivateChat, setLockSettingsDisablePrivateChat] = useState(false);
  const [lockSettingsDisablePublicChat, setLockSettingsDisablePublicChat] = useState(false);
  const [lockSettingsDisableNote, setLockSettingsDisableNote] = useState(false);
  const [lockSettingsLockedLayout, setLockSettingsLockedLayout] = useState(false);
  const [guestPolicy, setGuestPolicy] = useState("ALWAYS_ACCEPT");
  const [meetingKeepEvents, setMeetingKeepEvents] = useState(false);
  const [endWhenNoModerator, setEndWhenNoModerator] = useState(false);
  const [endWhenNoModeratorDelayInMinutes, setEndWhenNoModeratorDelayInMinutes] = useState(3);
  const [meetingLayout, setMeetingLayout] = useState("CUSTOM_LAYOUT");
  const [learningDashboardEnabled, setLearningDashboardEnabled] = useState(true);
  const [learningDashboardCleanupDelayInMinutes, setLearningDashboardCleanupDelayInMinutes] = useState(20);

  // Disable Optional settings on display
  function enable(e) {
    if (document.getElementById("Optional").disabled === true) {
      document.getElementById("Optional").disabled = false;
    } else {
      document.getElementById("Optional").disabled = true;
    }
  }

  // CreateURL
  function getData(e) {
    const basicInfo = (document.getElementById("Optional").disabled === true);
    const info = {
      basicInfo,
      meetingName,
      attendeePassword,
      moderatorPassword,
      welcomeMessage,
      maxParticipants,
      record,
      duration,
      moderatorOnlyMessage,
      autoStartRecording,
      allowStartStopRecording,
      webcamsOnlyForModerator,
      bannerText,
      muteOnStart,
      allowModsToUnmuteUsers,
      lockSettingsDisableCam,
      lockSettingsDisableMic,
      lockSettingsDisablePrivateChat,
      lockSettingsDisablePublicChat,
      lockSettingsDisableNote,
      lockSettingsLockedLayout,
      guestPolicy,
      meetingKeepEvents,
      endWhenNoModerator,
      endWhenNoModeratorDelayInMinutes,
      meetingLayout,
      learningDashboardEnabled,
      learningDashboardCleanupDelayInMinutes
    };

    if (meetingName === "" || attendeePassword === "" || moderatorPassword === "") {
      document.getElementById('inner').innerHTML = "Please fill out the required fields!";
      return null;
    }
    document.getElementById('inner').innerHTML = "Loading...";
    callAuthPost(accessCreate, info).then((response) => {
      console.log(response);
      if (!response) {
        document.getElementById('inner').innerHTML = "You Not allowed to create meetings";
        return null;
      }
      window.location.replace(join);
    });
  }

  // Create Page
  return (
    <>
      <section>
        <form>
          <h1>Would you like to create a meeting?</h1>
          <h2>Required settings:</h2>
          <label>Name for the meeting:</label><br></br>
          <div><input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="MeetingNname"
            onChange={(e) => setMeetingName(e.target.value)}
            value={meetingName}
          /><br></br></div>
          <label>Attendee password:</label><br></br>
          <div><input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="AttendeePassword"
            onChange={(e) => setAttendeePassword(e.target.value)}
            value={attendeePassword}
          /><br></br></div>
          <label>Moderator password:</label><br></br>
          <div><input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="ModeratorPassword"
            onChange={(e) => setModeratorPassword(e.target.value)}
            value={moderatorPassword}
          /><br></br></div>
        </form>
        <div id="inner"></div>
        <button onClick={(e) => getData(e.target.value)}>Create meeting</button><br></br>
        <h2>Optional settings:</h2>
        <button onClick={(e) => enable(e.target.value)}>Enable optional settings</button>
        <fieldset id="Optional" disabled>
          <div>
            <form>
              <label>Welcome message:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="WelcomeMessage"
                onChange={(e) => setWelcomeMessage(e.target.value)}
                value={welcomeMessage}
              /><br></br></div>
              <label>Maximum number of participants:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="120"
                onChange={(e) => setMaxParticipants(e.target.value)}
                value={maxParticipants}
              /><br></br></div>
              <label>Record:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="Record"
                onChange={(e) => setRecord(e.target.checked)}
                value={record}
              /><br></br></div>
              <label>The maximum length (in minutes) for the meeting:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="60"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
              /><br></br></div>
              <label>Display a message to all moderators in the public chat:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="ModeratorOnlyMessage"
                onChange={(e) => setModeratorOnlyMessage(e.target.value)}
                value={moderatorOnlyMessage}
              /><br></br></div>
              <label>Automatically start recording when first user joins:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AutoStartRecording"
                onChange={(e) => setAutoStartRecording(e.target.checked)}
                value={autoStartRecording}
              /><br></br></div>
              <label>Allow the user to start/stop recording:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AllowStartStopRecording"
                defaultChecked={"checked"}
                onChange={(e) => setAllowStartStopRecording(e.target.checked)}
                value={allowStartStopRecording}
              /><br></br></div>
              <label>Webcams only for moderator:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="WebcamsOnlyForModerator"
                onChange={(e) => setWebcamsOnlyForModerator(e.target.checked)}
                value={webcamsOnlyForModerator}
              /><br></br></div>
            </form>
            <form>
              <label>Set the banner text:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="BannerText"
                onChange={(e) => setBannerText(e.target.value)}
                value={bannerText}
              /><br></br></div>
              <label>Mute on start:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="MuteOnStart"
                onChange={(e) => setMuteOnStart(e.target.checked)}
                value={muteOnStart}
              /><br></br></div>
              <label>Allow moderator to unmute users:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AllowModsToUnmuteUsers"
                onChange={(e) => setAllowModsToUnmuteUsers(e.target.checked)}
                value={allowModsToUnmuteUsers}
              /><br></br></div>
              <label>Prevent users from sharing their camera:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableCam"
                onChange={(e) => setLockSettingsDisableCam(e.target.checked)}
                value={lockSettingsDisableCam}
              /><br></br></div>
              <label>Listen only users:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableMic"
                onChange={(e) => setLockSettingsDisableMic(e.target.checked)}
                value={lockSettingsDisableMic}
              /><br></br></div>
              <label>Disable private chats in the meeting:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisablePrivateChat"
                onChange={(e) => setLockSettingsDisablePrivateChat(e.target.checked)}
                value={lockSettingsDisablePrivateChat}
              /><br></br></div>
              <label>Disable public chat in the meeting:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisablePublicChat"
                onChange={(e) => setLockSettingsDisablePublicChat(e.target.checked)}
                value={lockSettingsDisablePublicChat}
              /><br></br></div>
              <label>Disable notes in the meeting:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableNote"
                onChange={(e) => setLockSettingsDisableNote(e.target.checked)}
                value={lockSettingsDisableNote}
              /><br></br></div>
              <label>Lock the layout in the meeting:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsLockedLayout"
                onChange={(e) => setLockSettingsLockedLayout(e.target.checked)}
                value={lockSettingsLockedLayout}
              /><br></br></div>
              <label>Guest policy:</label><br></br>
              <div><select id="GuestPolicy" value={guestPolicy} onChange={(e) => setGuestPolicy(e.target.value)}>
                <option value="ALWAYS_ACCEPT">ALWAYS_ACCEPT</option>
                <option value="ALWAYS_DENY">ALWAYS_DENY</option>
                <option value="ASK_MODERATOR">ASK_MODERATOR</option>
              </select><br></br></div>
              <label>If this is true BigBlueButton saves meeting events even if the meeting is not recorded:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="MeetingKeepEvents"
                onChange={(e) => setMeetingKeepEvents(e.target.checked)}
                value={meetingKeepEvents}
              /><br></br></div>
              <label>End when moderator leaves:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="EndWhenNoModerator"
                onChange={(e) => setEndWhenNoModerator(e.target.checked)}
                value={endWhenNoModerator}
              /><br></br></div>
              <label>End when moderator leaves delay in minutes:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="3"
                onChange={(e) => setEndWhenNoModeratorDelayInMinutes(e.target.value)}
                value={endWhenNoModeratorDelayInMinutes}
              /><br></br></div>
              <label>Meeting layout:</label><br></br>
              <div><select id="setMeetingLayout" value={meetingLayout} onChange={(e) => setMeetingLayout(e.target.value)}>
                <option value="CUSTOM_LAYOUT">CUSTOM_LAYOUT</option>
                <option value="SMART_LAYOUT">SMART_LAYOUT</option>
                <option value="PRESENTATION_FOCUS">PRESENTATION_FOCUS</option>
                <option value="VIDEO_FOCUS">VIDEO_FOCUS</option>
              </select><br></br></div>
              <label>Learning dashboard enabled:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LearningDashboardEnabled"
                defaultChecked={"checked"}
                onChange={(e) => setLearningDashboardEnabled(e.target.checked)}
                value={learningDashboardEnabled}
              /><br></br></div>
              <label>Learning dashboard cleanup delay in minutes:</label><br></br>
              <div><input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="20"
                onChange={(e) => setLearningDashboardCleanupDelayInMinutes(e.target.value)}
                value={learningDashboardCleanupDelayInMinutes}
              /><br></br></div>
            </form>
          </div>
        </fieldset>
      </section >
      <div>Would you like to logout?</div>
      <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
      <div></div>
      <button onClick={(e) => back(e.target.value)}>Back</button><br></br>
    </>
  );
}

// Login Page
function Login() {

  // Set defaults
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login function
  function login(e) {
    e.preventDefault();

    // Create object
    const loginData = {
      email,
      password,
    };

    // Send Login Data
    callAuthPost(loginCall, loginData).then((response) => {
      console.log(response + "A");
      if (!response) {
        document.getElementById('inner').innerHTML = "Incorrect credentials!";
        return null;
      }
      window.location.replace(home);
    });
  }

  // Login Page
  return (
    <>
      <section>
        <form onSubmit={login}>
          <label>Enter your email:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            /></div>
          </label><br></br>
          <label>Enter your password:
            <div><input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            /></div>
          </label><br></br>
          <input value="Login" id="button" type="submit" />
        </form>
        <div id="inner"></div>
      </section>
    </>
  );
}

// Sign Up
function SignUp() {

  // Set defaults
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up functions
  function signUp(e) {
    e.preventDefault();
    // Create object
    const signUpData = {
      firstName,
      lastName,
      email,
      password,
    };
    // Check Input
    if (firstName === "" || lastName === "" || email === "" || password === "") {
      document.getElementById('inner').innerHTML = "Please fill out all fields!";
      return null;
    }
    callAuthPost(signUpCall, signUpData).then((response) => {
      console.log(response);
      if (!response) {
        document.getElementById('inner').innerHTML = "Account already exists please login!";
        return null;
      }
      window.location.replace(login);
    });
  }

  // Sign Up Page
  return (
    <>
      <section>
        <form onSubmit={signUp}>
          <label>Enter your first name:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="first name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            /></div>
          </label><br></br>
          <label>Enter your last name:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="last name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            /></div>
          </label><br></br>
          <label>Enter your email:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            /></div>
          </label><br></br>
          <label>Enter your password:
            <div><input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            /></div>
          </label><br></br>
          <input value="SignUp" id="button" type="submit" />
        </form>
        <div id="inner"></div>
      </section>
    </>
  );
}

// Join to the meeting
function JoinMeeting() {

  // Create an object
  const [meetingName, setmeetingName] = useState("");
  const [meetingId, setmeetingId] = useState("");
  const [fullName, setfullName] = useState("");
  const [password, setPassword] = useState("");

  // Join meeting function
  function join(e) {
    e.preventDefault();
    // Create Object
    const joinData = {
      meetingName,
      meetingId,
      fullName,
      password,
    };
    // Check Input
    if (meetingName === "" || fullName === "" || password === "") {
      document.getElementById('inner').innerHTML = "Please fill out all the non optional fields!";
      return null;
    }

    callAuthPostUrl(accessJoin, joinData).then((response) => {
      console.log(response);
      if (response === "false") {
        document.getElementById('inner').innerHTML = "Incorrect credentials!";
        return null;
      }
      console.log(response);
      window.location.replace(response);
    });
  }

  // Join meeting page
  return (
    <>
      <section>
        <form onSubmit={join}>
          <label>Meeting name:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Meeting Name"
              onChange={(e) => setmeetingName(e.target.value)}
              value={meetingName}
            /></div>
          </label><br></br>
          <label>Meeting id (optional):
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="44c1c8fb5f7...3e1f3e9"
              onChange={(e) => setmeetingId(e.target.value)}
              value={meetingId}
            /></div>
          </label><br></br>
          <label>Full name:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Jhon Doe"
              onChange={(e) => setfullName(e.target.value)}
              value={fullName}
            /></div>
          </label><br></br>
          <label>Password:
            <div><input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            /></div>
          </label><br></br>
          <input value="Join" id="button" type="submit" />
        </form>
        <div>Would you like to logout?</div>
        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div id="inner"></div>
        <button onClick={(e) => back(e.target.value)}>Back</button><br></br>
      </section>
    </>
  );
}

function ModeratorSpace() {

  const [ID, setID] = useState("");

  function safe(e) {
    e.preventDefault();
    const Id = { ID };
    callAuthPost(accessModeratorSet, Id).then((response) => {
      console.log(response);
      if (response === null) {
        window.location.replace(login);
        return null;
      }
      document.getElementById('inner').innerHTML = "Ok!";
    });
  }

  return (
    <>
      <section>
        <form onSubmit={safe}>
          <label>ID:
            <div><input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="ID"
              onChange={(e) => setID(e.target.value)}
              value={ID}
            /></div>
          </label><br></br>
          <input value="Set" id="button" type="submit" />
          <div></div>
        </form>
        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div id="inner"></div>
      </section>
    </>
  );
}