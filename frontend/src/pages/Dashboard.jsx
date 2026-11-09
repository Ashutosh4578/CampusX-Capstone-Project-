
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, ArrowUpRight, Bell, BookOpen, Calendar, Check,
  ChevronRight, Clock, Code2, Database, GraduationCap, Home,
  LogOut, Menu, Play, Plus, RefreshCw, Search, Send, Shield,
  Trophy, Users, X, Zap, Wifi
} from "lucide-react";

import {
  getContests, createContest, joinContest, submitSolution,
  getMySubmissions, getLeaderboard, getMyAnalytics
} from "../services/api";

const videos = [
  {
    title: "SQL Joins Visualized",
    subject: "DBMS",
    duration: "12 min",
    url: "https://www.youtube.com/embed/9yeOJ0ZMUYw",
    description: "Understand SQL joins visually."
  },
  {
    title: "How the Internet Works",
    subject: "Computer Networks",
    duration: "16 min",
    url: "https://www.youtube.com/embed/7_LPdttKXPc",
    description: "DNS, packets, routing and networking."
  },
  {
    title: "JavaScript in 100 Seconds",
    subject: "Full Stack",
    duration: "2 min",
    url: "https://www.youtube.com/embed/DHjqpvDnNGE",
    description: "A quick JavaScript introduction."
  }
];

const subjects = ["All", "DSA", "FSD", "DBMS", "CN", "CC"];

const initialAnalytics = {
  totalSubmissions: 0,
  averageScore: 0,
  totalPoints: 0,
  subjects: {}
};

function formatDate(value) {
  if (!value) return "Schedule to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule to be announced";
  return date.toLocaleString();
}

function statusClass(status) {
  return String(status || "UPCOMING").toLowerCase();
}

export default function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Student";
  const role = (localStorage.getItem("role") || "STUDENT").toUpperCase();
  const isStaff = role === "FACULTY" || role === "ADMIN";

  const [page, setPage] = useState("overview");
  const [contests, setContests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(initialAnalytics);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");

  const [selectedContest, setSelectedContest] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [createForm, setCreateForm] = useState({
    title: "",
    subject: "DSA",
    description: "",
    level: "Intermediate",
    durationMinutes: 60,
    startTime: ""
  });

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);

    const results = await Promise.allSettled([
      getContests(),
      getLeaderboard(),
      getMyAnalytics(),
      getMySubmissions()
    ]);

    const failures = [];

    if (results[0].status === "fulfilled") {
      setContests(Array.isArray(results[0].value) ? results[0].value : []);
    } else failures.push("Contests");

    if (results[1].status === "fulfilled") {
      setLeaderboard(Array.isArray(results[1].value) ? results[1].value : []);
    } else failures.push("Leaderboard");

    if (results[2].status === "fulfilled") {
      setAnalytics(results[2].value || initialAnalytics);
    } else failures.push("Analytics");

    if (results[3].status === "fulfilled") {
      setSubmissions(Array.isArray(results[3].value) ? results[3].value : []);
    } else failures.push("Submissions");

    setError(
      failures.length
        ? `Some sections could not load: ${failures.join(", ")}.`
        : ""
    );

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();

    const timer = setInterval(() => refresh(true), 15000);

    return () => clearInterval(timer);
  }, [refresh]);

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchesSubject =
        subject === "All" || contest.subject === subject;

      const text = `${contest.title || ""} ${
        contest.subject || ""
      } ${contest.description || ""}`.toLowerCase();

      return matchesSubject && text.includes(query.toLowerCase());
    });
  }, [contests, subject, query]);

  const logout = () => {
    ["token", "role", "username"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/login", { replace: true });
  };

  const join = async (contest) => {
    setBusy(true);
    setMessage("");

    try {
      await joinContest(contest.id);
      setMessage("Successfully joined the contest!");
      await refresh(true);
    } catch (e) {
      setMessage(e.message || "Could not join contest.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!selectedContest || !sourceCode.trim()) {
      setMessage("Please enter your source code.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const result = await submitSolution(selectedContest.id, {
        sourceCode,
        language
      });

      setMessage(
        `Submission evaluated! Score: ${result.score}/100 · ${result.status}`
      );

      setSourceCode("");
      await refresh(true);
    } catch (e) {
      setMessage(e.message || "Submission failed.");
    } finally {
      setBusy(false);
    }
  };

  const create = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      await createContest({
        ...createForm,
        durationMinutes: Number(createForm.durationMinutes),
        startTime: createForm.startTime || null
      });

      setShowCreate(false);
      setCreateForm({
        title: "",
        subject: "DSA",
        description: "",
        level: "Intermediate",
        durationMinutes: 60,
        startTime: ""
      });

      await refresh(true);
      setMessage("Contest created successfully!");
    } catch (e) {
      setMessage(e.message || "Could not create contest.");
    } finally {
      setBusy(false);
    }
  };

  const openSubmission = (contest) => {
    setSelectedContest(contest);
    setShowSubmission(true);
    setMessage("");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "contests", label: "Contests", icon: Trophy },
    { id: "leaderboard", label: "Leaderboard", icon: Users },
    { id: "submissions", label: "My submissions", icon: Code2 },
    { id: "learning", label: "Learning studio", icon: BookOpen },
    { id: "analytics", label: "My progress", icon: Activity }
  ];

  return (
    <div className="cx-app">
      <aside className="cx-sidebar">
        <div className="cx-brand">
          <div className="cx-brand-icon"><GraduationCap size={25} /></div>
          <div>
            <h2>CAMPUS<span>X</span></h2>
            <small>LEARN · COMPETE · EXCEL</small>
          </div>
        </div>

        <div className="cx-nav-label">WORKSPACE</div>

        <nav className="cx-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                onClick={() => setPage(item.id)}
              >
                <Icon size={18} />
                {item.label}
                {item.id === "contests" && (
                  <span className="cx-nav-count">{contests.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="cx-sidebar-bottom">
          <div className="cx-role-card">
            <Shield size={18} />
            <div>
              <strong>{role}</strong>
              <small>Authenticated workspace</small>
            </div>
          </div>

          <div className="cx-profile">
            <div className="cx-avatar">{username.slice(0, 2).toUpperCase()}</div>
            <div className="cx-profile-info">
              <strong>{username}</strong>
              <small>{role}</small>
            </div>
            <button title="Logout" onClick={logout}><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="cx-main">
        <header className="cx-topbar">
          <div>
            <div className="cx-breadcrumb">CampusX / {navItems.find(n => n.id === page)?.label}</div>
            <h3>{page === "overview" ? "Your workspace" : navItems.find(n => n.id === page)?.label}</h3>
          </div>

          <div className="cx-top-actions">
            <span className="cx-live"><i /> LIVE CAMPUS</span>
            <button className="cx-icon-btn" onClick={() => refresh()}>
              <RefreshCw size={17} className={refreshing ? "cx-spin" : ""} />
            </button>
            <div className="cx-avatar">{username.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <div className="cx-content">
          {error && (
            <div className="cx-alert">
              <Wifi size={18} />
              <span>{error}</span>
              <button onClick={() => refresh()}>Retry</button>
            </div>
          )}

          {message && (
            <div className="cx-message">
              <span>{message}</span>
              <button onClick={() => setMessage("")}><X size={16} /></button>
            </div>
          )}

          {loading ? (
            <div className="cx-loading">
              <RefreshCw className="cx-spin" size={28} />
              <h3>Loading your workspace</h3>
              <p>Connecting contests, submissions and rankings...</p>
            </div>
          ) : (
            <>
              {page === "overview" && (
                <>
                  <section className="cx-welcome">
                    <div>
                      <span className="cx-kicker"><Zap size={14} /> YOUR CAMPUS. YOUR COMPETITION.</span>
                      <h1>Welcome back, <span>{username}</span></h1>
                      <p>Learn consistently. Compete fearlessly. Build your rank.</p>
                      <button className="cx-primary" onClick={() => setPage("contests")}>
                        Explore contests <ArrowUpRight size={17} />
                      </button>
                    </div>
                    <div className="cx-hero-art">
                      <div className="cx-hero-circle"><Trophy size={76} /></div>
                      <span className="cx-float cx-float-one">🏆 Top performers</span>
                      <span className="cx-float cx-float-two">⚡ Keep improving</span>
                    </div>
                  </section>

                  <section className="cx-stats">
                    <Stat icon={<Trophy />} label="Total points" value={analytics.totalPoints ?? 0} />
                    <Stat icon={<Code2 />} label="Submissions" value={analytics.totalSubmissions ?? 0} />
                    <Stat icon={<Activity />} label="Average score" value={`${analytics.averageScore ?? 0}%`} />
                    <Stat icon={<Users />} label="Active contests" value={contests.length} />
                  </section>

                  <div className="cx-section-head">
                    <div><span className="cx-kicker">YOUR NEXT MOVE</span><h2>Explore the campus</h2></div>
                    <button className="cx-link" onClick={() => setPage("contests")}>All contests <ChevronRight size={16} /></button>
                  </div>

                  <div className="cx-contest-grid">
                    {contests.slice(0, 3).map((contest) => (
                      <ContestCard
                        key={contest.id}
                        contest={contest}
                        onJoin={join}
                        onSubmit={openSubmission}
                        busy={busy}
                      />
                    ))}
                    {contests.length === 0 && <Empty text="No contests available yet." />}
                  </div>

                  <div className="cx-two-col">
                    <section className="cx-panel">
                      <PanelTitle title="Recent submissions" action={() => setPage("submissions")} />
                      {submissions.slice(0, 4).map((s) => (
                        <div className="cx-submission-row" key={s.id}>
                          <div className="cx-mini-icon"><Code2 size={17} /></div>
                          <div className="cx-grow"><strong>{s.contestTitle}</strong><small>{s.language} · {formatDate(s.submittedAt)}</small></div>
                          <b>{s.score}/100</b>
                        </div>
                      ))}
                      {submissions.length === 0 && <Empty text="Your submissions will appear here." />}
                    </section>

                    <section className="cx-panel">
                      <PanelTitle title="Top performers" action={() => setPage("leaderboard")} />
                      {leaderboard.slice(0, 5).map((person, index) => (
                        <div className="cx-submission-row" key={person.username}>
                          <div className="cx-rank">#{index + 1}</div>
                          <div className="cx-grow"><strong>{person.username}</strong><small>{person.submissions} submissions</small></div>
                          <b>{person.points} pts</b>
                        </div>
                      ))}
                      {leaderboard.length === 0 && <Empty text="Leaderboard will update after submissions." />}
                    </section>
                  </div>
                </>
              )}

              {page === "contests" && (
                <>
                  <PageHeading
                    kicker="COMPETE & WIN"
                    title="Campus contests"
                    desc="Choose a challenge, submit your solution and climb the leaderboard."
                    action={isStaff ? <button className="cx-primary" onClick={() => setShowCreate(true)}><Plus size={17} /> Create contest</button> : null}
                  />

                  <div className="cx-toolbar">
                    <div className="cx-search"><Search size={17} /><input placeholder="Search contests..." value={query} onChange={e => setQuery(e.target.value)} /></div>
                    <select value={subject} onChange={e => setSubject(e.target.value)}>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="cx-contest-grid">
                    {filteredContests.map(contest => (
                      <ContestCard key={contest.id} contest={contest} onJoin={join} onSubmit={openSubmission} busy={busy} />
                    ))}
                    {filteredContests.length === 0 && <Empty text="No matching contests found." />}
                  </div>
                </>
              )}

              {page === "leaderboard" && (
                <>
                  <PageHeading kicker="CAMPUS RANKINGS" title="Leaderboard" desc="Rankings are refreshed automatically every 15 seconds." />
                  <section className="cx-panel">
                    <div className="cx-leader-head"><span>RANK / STUDENT</span><span>SUBMISSIONS</span><span>POINTS</span></div>
                    {leaderboard.map((person, index) => (
                      <div className="cx-leader-row" key={person.username}>
                        <div className="cx-leader-user">
                          <div className={`cx-rank rank-${index + 1}`}>{index + 1}</div>
                          <div className="cx-avatar">{person.username?.slice(0, 2).toUpperCase()}</div>
                          <strong>{person.username}</strong>
                        </div>
                        <span>{person.submissions}</span>
                        <b>{person.points} pts</b>
                      </div>
                    ))}
                    {leaderboard.length === 0 && <Empty text="No ranked submissions yet. Be the first!" />}
                  </section>
                </>
              )}

              {page === "submissions" && (
                <>
                  <PageHeading kicker="YOUR WORK" title="My submissions" desc="Review your contest attempts and evaluation scores." />
                  <section className="cx-panel">
                    {submissions.map((s) => (
                      <div className="cx-submission-row" key={s.id}>
                        <div className="cx-mini-icon"><Code2 size={18} /></div>
                        <div className="cx-grow"><strong>{s.contestTitle}</strong><small>{s.language} · {formatDate(s.submittedAt)}</small><small>{s.feedback}</small></div>
                        <b>{s.score}/100</b>
                      </div>
                    ))}
                    {submissions.length === 0 && <Empty text="You have not submitted any solutions yet." />}
                  </section>
                </>
              )}

              {page === "learning" && (
                <>
                  <PageHeading kicker="LEARN SOMETHING NEW" title="Learning studio" desc="Short video lessons to strengthen your technical foundations." />
                  <div className="cx-video-grid">
                    {videos.map((video) => (
                      <article className="cx-video-card" key={video.title}>
                        <div className="cx-video-thumb">
                          <BookOpen size={45} />
                          <button onClick={() => setSelectedVideo(video)}><Play size={22} fill="currentColor" /></button>
                          <span>{video.duration}</span>
                        </div>
                        <div className="cx-video-body">
                          <span>{video.subject}</span>
                          <h3>{video.title}</h3>
                          <p>{video.description}</p>
                          <button className="cx-link" onClick={() => setSelectedVideo(video)}>Watch lesson <ArrowUpRight size={16} /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {page === "analytics" && (
                <>
                  <PageHeading kicker="YOUR PERFORMANCE" title="My progress" desc="Track your average score and subject-wise performance." />
                  <section className="cx-stats">
                    <Stat icon={<Trophy />} label="Total points" value={analytics.totalPoints ?? 0} />
                    <Stat icon={<Code2 />} label="Submissions" value={analytics.totalSubmissions ?? 0} />
                    <Stat icon={<Activity />} label="Average score" value={`${analytics.averageScore ?? 0}%`} />
                  </section>
                  <section className="cx-panel">
                    <h3>Subject performance</h3>
                    {subjects.filter(s => s !== "All").map(s => {
                      const score = Number(analytics.subjects?.[s] ?? 0);
                      return (
                        <div className="cx-progress-row" key={s}>
                          <div><strong>{s}</strong><span>{score}%</span></div>
                          <div className="cx-progress"><i style={{ width: `${Math.max(0, Math.min(100, score))}%` }} /></div>
                        </div>
                      );
                    })}
                  </section>
                </>
              )}
            </>
          )}
        </div>

        <footer className="cx-footer">
          <span>© CampusX · Learn · Compete · Excel</span>
          <span><i /> Connected to campus server</span>
        </footer>
      </main>

      {showSubmission && selectedContest && (
        <div className="cx-overlay" onMouseDown={e => e.target === e.currentTarget && setShowSubmission(false)}>
          <form className="cx-modal" onSubmit={submit}>
            <div className="cx-modal-head">
              <div><span className="cx-kicker">CONTEST SUBMISSION</span><h2>{selectedContest.title}</h2></div>
              <button type="button" className="cx-icon-btn" onClick={() => setShowSubmission(false)}><X /></button>
            </div>
            <label>Programming language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </select>
            <label>Your source code</label>
            <textarea required maxLength={20000} rows={12} value={sourceCode} onChange={e => setSourceCode(e.target.value)} placeholder="// Paste your solution here..." />
            <small className="cx-muted">Maximum 20,000 characters. The current backend uses a classroom rubric, not a code execution judge.</small>
            <button className="cx-primary" disabled={busy}><Send size={17} /> {busy ? "Submitting..." : "Submit solution"}</button>
          </form>
        </div>
      )}

      {showCreate && (
        <div className="cx-overlay" onMouseDown={e => e.target === e.currentTarget && setShowCreate(false)}>
          <form className="cx-modal" onSubmit={create}>
            <div className="cx-modal-head">
              <div><span className="cx-kicker">STAFF WORKSPACE</span><h2>Create a contest</h2></div>
              <button type="button" className="cx-icon-btn" onClick={() => setShowCreate(false)}><X /></button>
            </div>
            <label>Contest title</label>
            <input required value={createForm.title} onChange={e => setCreateForm({...createForm, title:e.target.value})} />
            <label>Subject</label>
            <select value={createForm.subject} onChange={e => setCreateForm({...createForm, subject:e.target.value})}>
              {subjects.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
            </select>
            <label>Description</label>
            <textarea rows={3} value={createForm.description} onChange={e => setCreateForm({...createForm, description:e.target.value})} />
            <div className="cx-form-row">
              <div><label>Difficulty</label><select value={createForm.level} onChange={e => setCreateForm({...createForm, level:e.target.value})}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
              <div><label>Duration (minutes)</label><input type="number" min="10" value={createForm.durationMinutes} onChange={e => setCreateForm({...createForm, durationMinutes:e.target.value})} /></div>
            </div>
            <label>Start time</label>
            <input type="datetime-local" value={createForm.startTime} onChange={e => setCreateForm({...createForm, startTime:e.target.value})} />
            <button className="cx-primary" disabled={busy}><Plus size={17} /> {busy ? "Creating..." : "Create contest"}</button>
          </form>
        </div>
      )}

      {selectedVideo && (
        <div className="cx-overlay" onMouseDown={e => e.target === e.currentTarget && setSelectedVideo(null)}>
          <div className="cx-video-modal">
            <div className="cx-modal-head">
              <div><span className="cx-kicker">{selectedVideo.subject}</span><h2>{selectedVideo.title}</h2></div>
              <button className="cx-icon-btn" onClick={() => setSelectedVideo(null)}><X /></button>
            </div>
            <div className="cx-iframe-wrap">
              <iframe src={selectedVideo.url} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="cx-stat">
      <div className="cx-stat-top"><span>{label}</span><div>{icon}</div></div>
      <strong>{value}</strong>
    </div>
  );
}

function PageHeading({ kicker, title, desc, action }) {
  return (
    <div className="cx-page-heading">
      <div><span className="cx-kicker">{kicker}</span><h1>{title}</h1><p>{desc}</p></div>
      {action}
    </div>
  );
}

function PanelTitle({ title, action }) {
  return (
    <div className="cx-panel-title">
      <h3>{title}</h3>
      <button onClick={action}>View all <ChevronRight size={15} /></button>
    </div>
  );
}

function Empty({ text }) {
  return <div className="cx-empty">{text}</div>;
}

function ContestCard({ contest, onJoin, onSubmit, busy }) {
  const joined = Boolean(contest.joined);
  const closed = contest.status === "CLOSED";
  return (
    <article className="cx-contest-card">
      <div className={`cx-contest-art ${contest.subject || "DSA"}`}>
        <div className="cx-contest-symbol">
          {contest.subject === "DBMS" ? <Database size={35} /> : contest.subject === "CN" ? <Wifi size={35} /> : contest.subject === "CC" ? <Zap size={35} /> : <Code2 size={35} />}
        </div>
        <span className={`cx-status ${statusClass(contest.status)}`}>{contest.status || "UPCOMING"}</span>
      </div>
      <div className="cx-contest-body">
        <div className="cx-contest-meta"><span>{contest.subject}</span><span>{contest.level || "Intermediate"}</span></div>
        <h3>{contest.title}</h3>
        <p>{contest.description}</p>
        <div className="cx-contest-details">
          <span><Clock size={14} /> {contest.durationMinutes || 60} min</span>
          <span><Users size={14} /> {contest.participants || 0} joined</span>
        </div>
        <small className="cx-contest-date"><Calendar size={13} /> {formatDate(contest.startTime)}</small>
        <div className="cx-contest-actions">
          {joined ? (
            <button className="cx-primary" onClick={() => onSubmit(contest)}>Submit solution <ArrowUpRight size={15} /></button>
          ) : (
            <button className="cx-primary" disabled={busy || closed} onClick={() => onJoin(contest)}>
              {closed ? "Closed" : busy ? "Please wait..." : "Join contest"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
