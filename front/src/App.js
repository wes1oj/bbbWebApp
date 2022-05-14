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

export function logout(e) {
  fetch(lut, {
    method: 'get',
  }).then((response) => {
    if (response.status === 200) {
      window.location.replace('/login');
    }
  });
}


export function back(e) {
  window.location.replace('/home');
}

export async function authCall() {
  let x = await fetch(acc);
  console.log(x);
  if (x.status === 200) {
    return true;
  }
  let y = fetch(ref);
  console.log(y);
  if (y.status === 200) {
    return true;
  }
  return false;
}

export async function call(a) {
  let x = await fetch(a);
  if (x.status === 200) {
    return true;
  }
  return false;
}

export async function callPost(a, data) {
  let x = await fetch(a, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (x.status === 200) {
    return true;
  }
  return false;
}

export async function callPostUrl(a, data) {
  let x = await fetch(a, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  });
  let y = await x.json();
  console.log(y);
  return y.url;
}

const acc = '/server/acc';
const isa = '/server/isAdmin';
const ref = '/server/ref';
const lut = '/server/logout';
const lin = '/server/login';
const cre = '/server/createurl';
const aoi = '/server/join';
const sig = '/server/signUp';
const set = '/server/set';
const mod = '/server/moderator';

const das = '/dashboard';
const log = '/login';
const joi = '/join';
const hom = '/home';


function Home() {

  // Directions
  function openCreate(e) {
    authCall().then((res) => {
      if (!res) {
        call(lut).then(() => {
          window.location.replace(log);
        });
        return null;
      }
      call(isa).then((res) => {
        if (!res) {
          document.getElementById('inner').innerHTML = "You Not allowed to create meetings";
          return null;
        }
        window.location.replace(das);
        return null;
      });
      return null;
    });
    return null;
  }

  // Directions
  function openJoin(e) {
    authCall().then((res) => {
      if (!res) {
        call(lut).then(() => {
          window.location.replace(log);
        });
        return null;
      }
      window.location.replace(joi);
      return null;
    });
  }

  //Home page
  return (
    <>
      <section>
        <h1>Welcome!</h1>
        <div>Would you like to create a meeting?</div>
        <button onClick={(e) => openCreate(e.target.value)}>Create a meeting</button><br></br>
        <div>Would you like to join to an existing meeting?</div>
        <button onClick={(e) => openJoin(e.target.value)}>Join</button><br></br>
        <div>Would you like to logout?</div>
        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
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

    authCall().then((res) => {
      if (!res) {
        call(lut).then(() => {
          window.location.replace(log);
        });
        return null;
      }
      call(isa).then((res) => {
        if (!res) {
          document.getElementById('inner').innerHTML = "You Not allowed to create meetings";
          return null;
        }
        document.getElementById('inner').innerHTML = "Loading...";
        callPostUrl(cre, info).then((res) => {
          console.log(res);
          if (res === "false") {
            document.getElementById('inner').innerHTML = "Error!";
            return null;
          }
          window.location.replace(joi);
        });
      });
    }).catch(err => {
      console.log(err);
      document.getElementById('inner').innerHTML = "Error";
    });
  }

  // Create Page
  return (
    <>
      <section>
        <form>
          <div>Would you like to create a meeting?</div>
          <div>Required settings</div>
          <label>Name for the meeting:</label><br></br>
          <input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="MeetingNname"
            onChange={(e) => setMeetingName(e.target.value)}
            value={meetingName}
          /><br></br>
          <label>Attendee password:</label><br></br>
          <input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="AttendeePassword"
            onChange={(e) => setAttendeePassword(e.target.value)}
            value={attendeePassword}
          /><br></br>
          <label>Moderator password:</label><br></br>
          <input
            autoComplete="off"
            className="input"
            type="text"
            placeholder="ModeratorPassword"
            onChange={(e) => setModeratorPassword(e.target.value)}
            value={moderatorPassword}
          /><br></br>
        </form>
        <button onClick={(e) => getData(e.target.value)}>Create meeting</button><br></br>
        <div>Would you like to logout?</div>
        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div></div>
        <div id="inner"></div>
        <button onClick={(e) => back(e.target.value)}>Back</button><br></br>
        <div>Optional settings</div>
        <button onClick={(e) => enable(e.target.value)}>Enable optional settings</button>
        <fieldset id="Optional" disabled>
          <div>
            <form>
              <label>Welcome message:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="WelcomeMessage"
                onChange={(e) => setWelcomeMessage(e.target.value)}
                value={welcomeMessage}
              /><br></br>
              <label>Maximum number of participants:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="120"
                onChange={(e) => setMaxParticipants(e.target.value)}
                value={maxParticipants}
              /><br></br>
              <label>Record:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="Record"
                onChange={(e) => setRecord(e.target.checked)}
                value={record}
              /><br></br>
              <label>The maximum length (in minutes) for the meeting:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="60"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
              /><br></br>
              <label>Display a message to all moderators in the public chat:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="ModeratorOnlyMessage"
                onChange={(e) => setModeratorOnlyMessage(e.target.value)}
                value={moderatorOnlyMessage}
              /><br></br>
              <label>Automatically start recording when first user joins:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AutoStartRecording"
                onChange={(e) => setAutoStartRecording(e.target.checked)}
                value={autoStartRecording}
              /><br></br>
              <label>Allow the user to start/stop recording:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AllowStartStopRecording"
                defaultChecked={"checked"}
                onChange={(e) => setAllowStartStopRecording(e.target.checked)}
                value={allowStartStopRecording}
              /><br></br>
              <label>Webcams only for moderator:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="WebcamsOnlyForModerator"
                onChange={(e) => setWebcamsOnlyForModerator(e.target.checked)}
                value={webcamsOnlyForModerator}
              /><br></br>
            </form>
            <form>
              <label>Set the banner text:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="BannerText"
                onChange={(e) => setBannerText(e.target.value)}
                value={bannerText}
              /><br></br>
              <label>Mute on start:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="MuteOnStart"
                onChange={(e) => setMuteOnStart(e.target.checked)}
                value={muteOnStart}
              /><br></br>
              <label>Allow moderator to unmute users:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="AllowModsToUnmuteUsers"
                onChange={(e) => setAllowModsToUnmuteUsers(e.target.checked)}
                value={allowModsToUnmuteUsers}
              /><br></br>
              <label>Prevent users from sharing their camera:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableCam"
                onChange={(e) => setLockSettingsDisableCam(e.target.checked)}
                value={lockSettingsDisableCam}
              /><br></br>
              <label>Listen only users:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableMic"
                onChange={(e) => setLockSettingsDisableMic(e.target.checked)}
                value={lockSettingsDisableMic}
              /><br></br>
              <label>Disable private chats in the meeting:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisablePrivateChat"
                onChange={(e) => setLockSettingsDisablePrivateChat(e.target.checked)}
                value={lockSettingsDisablePrivateChat}
              /><br></br>
              <label>Disable public chat in the meeting:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisablePublicChat"
                onChange={(e) => setLockSettingsDisablePublicChat(e.target.checked)}
                value={lockSettingsDisablePublicChat}
              /><br></br>
              <label>Disable notes in the meeting:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsDisableNote"
                onChange={(e) => setLockSettingsDisableNote(e.target.checked)}
                value={lockSettingsDisableNote}
              /><br></br>
              <label>Lock the layout in the meeting:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LockSettingsLockedLayout"
                onChange={(e) => setLockSettingsLockedLayout(e.target.checked)}
                value={lockSettingsLockedLayout}
              /><br></br>
              <label>Guest policy:</label><br></br>
              <select id="GuestPolicy" value={guestPolicy} onChange={(e) => setGuestPolicy(e.target.value)}>
                <option value="ALWAYS_ACCEPT">ALWAYS_ACCEPT</option>
                <option value="ALWAYS_DENY">ALWAYS_DENY</option>
                <option value="ASK_MODERATOR">ASK_MODERATOR</option>
              </select><br></br>
              <label>If this is true BigBlueButton saves meeting events even if the meeting is not recorded:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="MeetingKeepEvents"
                onChange={(e) => setMeetingKeepEvents(e.target.checked)}
                value={meetingKeepEvents}
              /><br></br>
              <label>End when moderator leaves:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="EndWhenNoModerator"
                onChange={(e) => setEndWhenNoModerator(e.target.checked)}
                value={endWhenNoModerator}
              /><br></br>
              <label>End when moderator leaves delay in minutes:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="3"
                onChange={(e) => setEndWhenNoModeratorDelayInMinutes(e.target.value)}
                value={endWhenNoModeratorDelayInMinutes}
              /><br></br>
              <label>Meeting layout:</label><br></br>
              <select id="setMeetingLayout" value={meetingLayout} onChange={(e) => setMeetingLayout(e.target.value)}>
                <option value="CUSTOM_LAYOUT">CUSTOM_LAYOUT</option>
                <option value="SMART_LAYOUT">SMART_LAYOUT</option>
                <option value="PRESENTATION_FOCUS">PRESENTATION_FOCUS</option>
                <option value="VIDEO_FOCUS">VIDEO_FOCUS</option>
              </select><br></br>
              <label>Learning dashboard enabled:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="checkbox"
                placeholder="LearningDashboardEnabled"
                defaultChecked={"checked"}
                onChange={(e) => setLearningDashboardEnabled(e.target.checked)}
                value={learningDashboardEnabled}
              /><br></br>
              <label>Learning dashboard cleanup delay in minutes:</label><br></br>
              <input
                autoComplete="off"
                className="input"
                type="text"
                placeholder="20"
                onChange={(e) => setLearningDashboardCleanupDelayInMinutes(e.target.value)}
                value={learningDashboardCleanupDelayInMinutes}
              /><br></br>
            </form>
          </div>
        </fieldset>
      </section>
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
    callPost(lin, loginData).then((res) => {
      if (!res) {
        document.getElementById('inner').innerHTML = "Incorrect credentials!";
        return null;
      }
      window.location.replace(hom);
    }).catch(err => {
      console.log(err);
    });
  }

  // Login Page
  return (
    <>
      <section>
        <form onSubmit={login}>
          <label>Enter your email:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label><br></br>
          <label>Enter your password:
            <input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label><br></br>
          <input type="submit" />
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
    // Send Input
    callPost(sig, signUpData).then((res) => { // ToDo ez ide nem lesz jó nem json jön vissza, csak egy sima call lenne de az még nincs implementálva
      if (!res) {
        document.getElementById('inner').innerHTML = "Account already exists please login!";
        return null;
      }
      window.location.replace(log);
    }).catch(err => {
      console.eroor(err);
    });
  }

  // Sign Up Page
  return (
    <>
      <section>
        <form onSubmit={signUp}>
          <label>Enter your first name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="first name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </label><br></br>
          <label>Enter your last name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="last name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </label><br></br>
          <label>Enter your email:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label><br></br>
          <label>Enter your password:
            <input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label><br></br>
          <input type="submit" />
        </form>
        <div></div>
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

    authCall().then((res) => {
      if (!res) {
        call(lut).then(() => {
          window.location.replace(log);
        });
        return null;
      }
      callPostUrl(aoi, joinData).then((res) => {
        console.log(res);
        if (res === "false") {
          document.getElementById('inner').innerHTML = "Incorrect credentials!";
          return null;
        }
        window.location.replace(res);
        return null;
      });
    });

  }

  // Join meeting page
  return (
    <>
      <section>
        <form onSubmit={join}>
          <label>Meeting name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Meeting Name"
              onChange={(e) => setmeetingName(e.target.value)}
              value={meetingName}
            />
          </label><br></br>
          <label>Meeting id (optional):
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="44c1c8fb5f7...3e1f3e9"
              onChange={(e) => setmeetingId(e.target.value)}
              value={meetingId}
            />
          </label><br></br>
          <label>Full name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="Jhon Doe"
              onChange={(e) => setfullName(e.target.value)}
              value={fullName}
            />
          </label><br></br>
          <label>Password:
            <input
              autoComplete="off"
              className="input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label><br></br>
          <input type="submit" />
        </form>
        <div>Would you like to logout?</div>
        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div></div>
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
    const asd = { ID };
    document.getElementById('inner').innerHTML = "";
    authCall().then((res) => {
      console.log(res);
      if (!res) {
        call(lut).then(() => {
          window.location.replace(log);
        });
        return null;
      }
      call(mod).then((res) => {
        if (!res) {
          call(lut).then(() => {
            window.location.replace(log);
          });
          return null;
        }
        callPost(set, asd).then((res) => {
          if (res) {
            document.getElementById('inner').innerHTML = "Ok!";
          }
        });
      });
    });
  }


  return (
    <>
      <section>
        <form onSubmit={safe}>
          <label>ID:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="ID"
              onChange={(e) => setID(e.target.value)}
              value={ID}
            />
          </label><br></br>
          <input type="submit" />
        </form>

        <button onClick={(e) => logout(e.target.value)}>Logout</button><br></br>
        <div id="inner"></div>
      </section>
    </>

  );

}