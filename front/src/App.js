// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';



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
              <Link to="/singup">SingUp</Link>
            </li>
            {/*<li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/join">JoinMeeting</Link>
            </li>}*/}
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
        <Route path="/">
            <Home />
          </Route>
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/singUp">
            <SingUp />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/join">
            <JoinMeeting />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
function Dashboard() {

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


  //buttons disabel
  async function enable(e) {
    if (document.getElementById("Optional").disabled === true) {
      document.getElementById("Optional").disabled = false;
    } else {
      document.getElementById("Optional").disabled = true;
    }
  }

  //read from form;
  async function getData(e) {
    try {
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
      fetch('/createurl', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(info)
      }).then(function (response) {
        return response.text();
      }).then(function (data) {
        if (data === "Name alredy exists") {
          document.getElementById('inner').innerHTML = data;
        } else {
          //document.getElementById('inner').innerHTML = "fetch=>" + data;
          fetch(data, {
            method: 'post',
          }).then(() => {
            window.location.replace('/join');
          });
        }
      });

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      <section>
        <form>

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
        <h1 id="inner"></h1>
        <h2>Optional settings</h2>
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

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };
      fetch('/login', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(loginData)
      }).then((data) => {
        if (data.status === 200) {
          window.location.replace("/dashboard");
        } else {
          window.location.replace("/login");
        }
      });

    } catch (err) {
      console.log(err.data);
    }
  }

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

      </section>
    </>
  );
}

function SingUp() {

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function singUp(e) {
    e.preventDefault();
    try {
      const singUpData = {
        first_name,
        last_name,
        email,
        password,
      };
      fetch('/singUp', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(singUpData)
      }).then((data) => {
        if (data.status === 200) {
          window.location.replace("/login");
        } else {
          window.location.replace("/singUp");
        }
      })

    } catch (err) {
      console.log(err.data);
    }
  }

  return (
    <>
      <section>
        <form onSubmit={singUp}>
          <label>Enter your first name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="first name"
              onChange={(e) => setFirst_name(e.target.value)}
              value={first_name}
            />
          </label><br></br>
          <label>Enter your last name:
            <input
              autoComplete="off"
              className="input"
              type="text"
              placeholder="last name"
              onChange={(e) => setLast_name(e.target.value)}
              value={last_name}
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
      </section>
    </>
  );
}

function JoinMeeting() {

  const [meetingName, setmeetingName] = useState("");
  const [meetingId, setmeetingId] = useState("");
  const [fullName, setfullName] = useState("");
  const [password, setPassword] = useState("");

  async function join(e) {
    e.preventDefault();
    try {
      const joinData = {
        meetingName,
        meetingId,
        fullName,
        password,
      };
      if (meetingName === "" || fullName === "" || password === "") {
        document.getElementById('inner').innerHTML = "Please fill out all the non optional fields!";
      } else {
        fetch('/join', {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(joinData)
        }).then(function (response) {
          return response.text();
        }).then(function (data) {
          if (data[0] === "I") {//incorrect
            document.getElementById('inner').innerHTML = data;
          } else {
            window.location.replace(data);
            //document.getElementById('inner').innerHTML = "fetch=>" + data;
            //fetch(data, {
            // method: 'get',
            //}).then(() => {
            //window.location.replace("/join");
            // });
            //window.location.replace("/join");
          }
        });
      }
    } catch (err) {
      console.log(err.data);
    }
  }

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
        <h1 id="inner"></h1>
      </section>
    </>
  );
}