import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "../CSS/chart.css";

const students = [
  // Class 10A
  { student: "Alice", class: "10A", marks: 22 },
  { student: "Bob", class: "10A", marks: 18 },
  { student: "Charlie", class: "10A", marks: 25 },
  { student: "David", class: "10A", marks: 20 },
  { student: "Eva", class: "10A", marks: 17 },
  { student: "Frank", class: "10A", marks: 21 },
  { student: "Grace", class: "10A", marks: 19 },
  { student: "Henry", class: "10A", marks: 23 },
  { student: "Ivy", class: "10A", marks: 16 },
  { student: "Jack", class: "10A", marks: 24 },
  { student: "Kate", class: "10A", marks: 18 },
  { student: "Leo", class: "10A", marks: 22 },
  { student: "Mona", class: "10A", marks: 20 },
  { student: "Nina", class: "10A", marks: 19 },
  { student: "Oscar", class: "10A", marks: 25 },
  { student: "Paul", class: "10A", marks: 17 },
  { student: "Quinn", class: "10A", marks: 21 },
  { student: "Ray", class: "10A", marks: 20 },
  { student: "Sara", class: "10A", marks: 23 },
  { student: "Tom", class: "10A", marks: 18 },
  { student: "Uma", class: "10A", marks: 19 },
  { student: "Vik", class: "10A", marks: 21 },
  { student: "Will", class: "10A", marks: 20 },
  { student: "Zara", class: "10A", marks: 22 },

  // Class 10B
  { student: "Aaron", class: "10B", marks: 23 },
  { student: "Bella", class: "10B", marks: 20 },
  { student: "Cody", class: "10B", marks: 18 },
  { student: "Daisy", class: "10B", marks: 21 },
  { student: "Ethan", class: "10B", marks: 25 },
  { student: "Fiona", class: "10B", marks: 19 },
  { student: "George", class: "10B", marks: 22 },
  { student: "Holly", class: "10B", marks: 20 },
  { student: "Ian", class: "10B", marks: 17 },
  { student: "Jade", class: "10B", marks: 23 },
  { student: "Kyle", class: "10B", marks: 21 },
  { student: "Lily", class: "10B", marks: 19 },
  { student: "Mike", class: "10B", marks: 22 },
  { student: "Nora", class: "10B", marks: 18 },
  { student: "Omar", class: "10B", marks: 20 },
  { student: "Pia", class: "10B", marks: 21 },
  { student: "Qadir", class: "10B", marks: 24 },
  { student: "Rita", class: "10B", marks: 23 },
  { student: "Sam", class: "10B", marks: 19 },
  { student: "Tina", class: "10B", marks: 20 },
  { student: "Usha", class: "10B", marks: 22 },
  { student: "Victor", class: "10B", marks: 21 },
  { student: "Wendy", class: "10B", marks: 19 },
  { student: "Xena", class: "10B", marks: 20 },

  // Class 10C
  { student: "Alan", class: "10C", marks: 21 },
  { student: "Betty", class: "10C", marks: 19 },
  { student: "Carl", class: "10C", marks: 22 },
  { student: "Derek", class: "10C", marks: 20 },
  { student: "Ella", class: "10C", marks: 18 },
  { student: "Felix", class: "10C", marks: 25 },
  { student: "Gina", class: "10C", marks: 23 },
  { student: "Hank", class: "10C", marks: 21 },
  { student: "Isla", class: "10C", marks: 19 },
  { student: "Jonas", class: "10C", marks: 22 },
  { student: "Kara", class: "10C", marks: 20 },
  { student: "Liam", class: "10C", marks: 17 },
  { student: "Maya", class: "10C", marks: 21 },
  { student: "Noah", class: "10C", marks: 24 },
  { student: "Olive", class: "10C", marks: 23 },
  { student: "Peter", class: "10C", marks: 18 },
  { student: "Queenie", class: "10C", marks: 20 },
  { student: "Ralph", class: "10C", marks: 22 },
  { student: "Sophie", class: "10C", marks: 19 },
  { student: "Theo", class: "10C", marks: 21 },
  { student: "Umar", class: "10C", marks: 25 },
  { student: "Vera", class: "10C", marks: 23 },
  { student: "Walt", class: "10C", marks: 20 },
  { student: "Yara", class: "10C", marks: 22 },

  // Class 10D
  { student: "Adam", class: "10D", marks: 20 },
  { student: "Bianca", class: "10D", marks: 18 },
  { student: "Chris", class: "10D", marks: 22 },
  { student: "Diana", class: "10D", marks: 19 },
  { student: "Eli", class: "10D", marks: 23 },
  { student: "Farah", class: "10D", marks: 20 },
  { student: "Gopal", class: "10D", marks: 24 },
  { student: "Hira", class: "10D", marks: 21 },
  { student: "Imran", class: "10D", marks: 19 },
  { student: "Jasmine", class: "10D", marks: 25 },
  { student: "Kunal", class: "10D", marks: 20 },
  { student: "Leah", class: "10D", marks: 22 },
  { student: "Milan", class: "10D", marks: 18 },
  { student: "Nadia", class: "10D", marks: 21 },
  { student: "Owen", class: "10D", marks: 20 },
  { student: "Priya", class: "10D", marks: 19 },
  { student: "Qasim", class: "10D", marks: 23 },
  { student: "Rina", class: "10D", marks: 22 },
  { student: "Steve", class: "10D", marks: 21 },
  { student: "Tara", class: "10D", marks: 18 },
  { student: "Umair", class: "10D", marks: 20 },
  { student: "Vidya", class: "10D", marks: 19 },
  { student: "Waseem", class: "10D", marks: 21 },
  { student: "Yasir", class: "10D", marks: 23 },

  // Class 10E
  { student: "Anya", class: "10E", marks: 22 },
  { student: "Bilal", class: "10E", marks: 20 },
  { student: "Clara", class: "10E", marks: 19 },
  { student: "Deepak", class: "10E", marks: 23 },
  { student: "Elena", class: "10E", marks: 25 },
  { student: "Fahad", class: "10E", marks: 18 },
  { student: "Gauri", class: "10E", marks: 21 },
  { student: "Hamza", class: "10E", marks: 20 },
  { student: "Ibrahim", class: "10E", marks: 19 },
  { student: "Jiya", class: "10E", marks: 22 },
  { student: "Karan", class: "10E", marks: 21 },
  { student: "Lara", class: "10E", marks: 20 },
  { student: "Manav", class: "10E", marks: 18 },
  { student: "Nisha", class: "10E", marks: 23 },
  { student: "Ovi", class: "10E", marks: 21 },
  { student: "Pari", class: "10E", marks: 20 },
  { student: "Qamar", class: "10E", marks: 22 },
  { student: "Rohit", class: "10E", marks: 24 },
  { student: "Sana", class: "10E", marks: 19 },
  { student: "Tanvi", class: "10E", marks: 21 },
  { student: "Udit", class: "10E", marks: 20 },
  { student: "Varun", class: "10E", marks: 22 },
  { student: "Wali", class: "10E", marks: 21 },
  { student: "Zoya", class: "10E", marks: 23 },
];

const COLORS = ["#7C3AED", "#4ADE80", "#FACC15", "#F43F5E"];

// ✅ Aggregate data by class
const getClassStats = (data) => {
  const stats = data.reduce((acc, s) => {
    if (!acc[s.class]) {
      acc[s.class] = { class: s.class, total: 0, count: 0, highest: s.marks };
    }
    acc[s.class].total += s.marks;
    acc[s.class].count++;
    acc[s.class].highest = Math.max(acc[s.class].highest, s.marks);
    return acc;
  }, {});
  return Object.values(stats).map((c) => ({
    class: c.class,
    avg: (c.total / c.count).toFixed(2),
    highest: c.highest,
    count: c.count,
  }));
};

export default function VivaAnalytics() {
  const [selectedClass, setSelectedClass] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState("high"); // high | low
  const [searchTerm, setSearchTerm] = useState("");

  const classStats = getClassStats(students);

  // ✅ Filtering
  let filteredStudents =
    selectedClass === "All"
      ? students
      : students.filter((s) => s.class === selectedClass);

  // ✅ Searching
  filteredStudents = filteredStudents.filter((s) =>
    s.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Sorting
  filteredStudents.sort((a, b) =>
    sortOrder === "high" ? b.marks - a.marks : a.marks - b.marks
  );

  // Overall stats
  const avgMarks = (
    students.reduce((acc, s) => acc + s.marks, 0) / students.length
  ).toFixed(2);

  const topper = students.reduce(
    (max, s) => (s.marks > max.marks ? s : max),
    students[0]
  );

  const passCount = students.filter((s) => s.marks >= 18).length;
  const passPercent = ((passCount / students.length) * 100).toFixed(1);
  const visibleStudents = showAll
    ? filteredStudents
    : filteredStudents.slice(0, 10);
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📊 Viva Results Analytics</h1>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">👩‍🎓 Total Students: {students.length}</div>
        <div className="stat-card">📈 Avg Marks: {avgMarks}</div>
        <div className="stat-card">
          🏆 Topper: {topper.student} ({topper.marks})
        </div>
        <div className="stat-card">✅ Pass %: {passPercent}%</div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Class Average Marks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Highest Marks per Class</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="highest" fill="#4ADE80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h2>Class Size Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classStats}
                dataKey="count"
                nameKey="class"
                outerRadius={100}
                label
              >
                {classStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}

      {/* Table */}
      <div className="analytics-header1">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="All">All Classes</option>
          {classStats.map((c, i) => (
            <option key={i} value={c.class}>
              {c.class}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="high">High → Low</option>
          <option value="low">Low → High</option>
        </select>
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-card">
        <h2>
          Student Results (
          {selectedClass === "All" ? "All Classes" : selectedClass})
        </h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((s, i) => (
              <tr key={i}>
                <td>{s.student}</td>
                <td>{s.class}</td>
                <td>{s.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ See More button */}
        {filteredStudents.length > 10 && (
          <button className="see-more-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "See Less" : "See More"}
          </button>
        )}
      </div>
    </div>
  );
}
