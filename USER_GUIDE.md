# University of Hyderabad (UoHYD) Attendance & Academic Management Portal
## Complete User Guide & Feature Manual (Plain English)

---

> **Who is this guide for?**  
> This guide is written in everyday, non-technical language for students, faculty members (professors), and college administrators (deans/office staff). It explains **how the system works in real college life**, what every button and card does, and what happens step-by-step during a typical university day.

---

## Table of Contents
1. [The Big Picture: How the System Works in Daily College Life](#1-the-big-picture-how-the-system-works-in-daily-college-life)
2. [Login & Accessing Your Account](#2-login--accessing-your-account)
3. [The Student Portal](#3-the-student-portal)
   - [3.1 Student Dashboard](#31-student-dashboard)
   - [3.2 Lecture Check-In (QR Code & Passcode Scanner)](#32-lecture-check-in-qr-code--passcode-scanner)
   - [3.3 Attendance History & Compliance](#33-attendance-history--compliance)
   - [3.4 My Enrolled Courses & Subject Details](#34-my-enrolled-courses--subject-details)
   - [3.5 Weekly Timetable & Class Calendar](#35-weekly-timetable--class-calendar)
   - [3.6 Digital Student Smart Card & Profile](#36-digital-student-smart-card--profile)
4. [The Professor / Faculty Portal](#4-the-professor--faculty-portal)
   - [4.1 Professor Dashboard](#41-professor-dashboard)
   - [4.2 Live Classroom Session (Taking Attendance in 3 Ways)](#42-live-classroom-session-taking-attendance-in-3-ways)
   - [4.3 Auditorium Projector Mode (Big Screen)](#43-auditorium-projector-mode-big-screen)
   - [4.4 Central Course Workspace (The Professor's Command Center)](#44-central-course-workspace-the-professors-command-center)
   - [4.5 Internal Assessment Marks & Gradebook Spreadsheet](#45-internal-assessment-marks--gradebook-spreadsheet)
   - [4.6 Official A4 PDF Reports & Export Center](#46-official-a4-pdf-reports--export-center)
   - [4.7 Subject Timetable & Dynamic Schedule Editor](#47-subject-timetable--dynamic-schedule-editor)
   - [4.8 Teaching Schedule Calendar](#48-teaching-schedule-calendar)
   - [4.9 Faculty Profile & Digital Signature Stamp](#49-faculty-profile--digital-signature-stamp)
5. [The University Administrator / Dean Portal](#5-the-university-administrator--dean-portal)
   - [5.1 Dean / Admin Dashboard](#51-dean--admin-dashboard)
   - [5.2 Student Registry & Enrollment](#52-student-registry--enrollment)
   - [5.3 Faculty Directory & Appointments](#53-faculty-directory--appointments)
   - [5.4 Course Catalog & Syllabus Architecture](#54-course-catalog--syllabus-architecture)
   - [5.5 Department & Campus Controls](#55-department--campus-controls)
   - [5.6 Security & Audit Logs (Fraud Prevention)](#56-security--audit-logs-fraud-prevention)
   - [5.7 Administrator Profile & System Clearances](#57-administrator-profile--system-clearances)
6. [Frequently Asked Questions (FAQ)](#6-frequently-asked-questions-faq)

---

## 1. The Big Picture: How the System Works in Daily College Life

Imagine a normal day at the University of Hyderabad School of Life Sciences:

```
[9:55 AM] Professor arrives in Lecture Hall LH-204 -> Clicks "Start Live Class".
               │
               ▼
[10:00 AM] Professor displays the Dynamic QR Code on the Auditorium Projector.
               │
               ▼
[10:02 AM] Students enter the hall, open their phones, and scan the screen.
               │
               ▼
[10:05 AM] System instantly marks students "Present" in real time.
           Absent students are listed automatically.
               │
               ▼
[10:10 AM] Professor clicks "Lock Session" -> Attendance is finalized.
               │
               ▼
[End of Term] Professor enters Mid-Sem & Lab internal marks -> Clicks "Publish".
               │
               ▼
[Dean's Office] Official signed A4 PDF reports are generated with 1 click.
```

---

## 2. Login & Accessing Your Account

### What is this page?
The **Single Sign-On (SSO) Portal** (`/login`) is where everyone enters the university system.

### Key Elements & How They Work:
- **Role Tabs (`Student` / `Faculty` / `Administrator`)**:  
  *What it does:* Clicking a tab switches the login theme and permissions for that specific job role.
- **Institutional Email Field**:  
  *What it does:* Type your official university email (e.g. `rohit.sharma@uohyd.ac.in`).
- **Password Field & Eye Icon**:  
  *What it does:* Type your security password. Clicking the **Eye icon** reveals or hides the letters so you can check for typos.
- **"Forgot password?" Link**:  
  *What it does:* Takes you to the Password Recovery page where you can receive a 6-digit OTP code to safely reset your password.
- **"Remember this terminal" Checkbox**:  
  *What it does:* Keeps your session logged in on this specific laptop or tablet so you don't have to re-type credentials every hour.
- **"Quick 1-Click Demo Logins" Buttons (Yellow Sparkle Section)**:  
  *What it does:* For evaluation, clicking **"Student"**, **"Faculty"**, or **"Administrator"** automatically fills credentials and logs you in instantly with zero typing!

---

## 3. The Student Portal

### 3.1 Student Dashboard (`/student/dashboard`)
The student's morning homepage. It gives an immediate summary of attendance compliance and today's lectures.

#### What you see on this page:
1. **Welcome Banner**: Shows the student's name, roll number, and department.
2. **"Overall Attendance" Card (e.g. 91.3%)**:
   - **Color Meaning**: 
     - 🟢 **Green (Above 75%)**: You are in good standing and eligible to write semester exams.
     - 🟡 **Yellow (60% to 74%)**: Warning! You are close to falling below university attendance rules.
     - 🔴 **Red (Below 60%)**: Critical shortage! You are at risk of being barred from final exams.
3. **"Classes Attended" Card**: Shows total sessions attended out of total held (e.g., `42 / 46`).
4. **"Today's Active Lecture" Hero Card**:
   - Displays the class currently happening right now.
   - Shows the subject name, professor, time, and room number.
   - Has a bright **"Check-In Now"** button.
5. **Course Attendance Breakdown Table**:
   - Lists every subject individually with a progress bar showing your percentage in that specific course.

---

### 3.2 Lecture Check-In (QR Code & Passcode Scanner) (`/student/scan`)
This is the screen a student opens inside the classroom to record their presence.

#### How to use it:
- **Method 1: Camera QR Scanning (Default)**:
  - Point your phone's camera at the projector screen or professor's tablet.
  - As soon as the QR is recognized, a green checkmark appears saying **"Attendance Recorded Successfully!"**.
- **Method 2: 5-Digit Backup Code Entry**:
  - If your phone camera is damaged or lighting is poor, look at the 5-digit number on the board (e.g., `84920`).
  - Type the 5 digits into the number box and click **"Submit Attendance Code"**.
- **Security Check**:
  - The QR code changes every 15 seconds so students who are absent at home cannot use a photo sent by friends!

---

### 3.3 Attendance History & Compliance (`/student/history`)
A complete digital passbook of every single class conducted throughout the semester.

#### What you see and can do:
- **Subject Filter Dropdown**: Pick a specific subject (e.g. *Computational Genomics*) to see only classes for that course.
- **Status Filter (`All` / `Present` / `Absent` / `Late`)**: Click to inspect exactly which days you missed.
- **Detailed History Table**:
  - Shows the **Date**, **Time**, **Subject**, **Professor**, and **Status Badge**.
  - Shows the exact check-in time (e.g., *10:02 AM via QR Code*).

---

### 3.4 My Enrolled Courses & Subject Details (`/student/courses` & `/student/courses/[id]`)
Lists the full academic curriculum for the current semester.

#### Key Features:
- **Course Cards**: Display Course Code (e.g., `SCB-501`), Full Title, Credits, Faculty Name, and Room.
- **"View Syllabus & Attendance" Button**:
  - Opens the detailed subject page.
  - Shows textbook references, lecture topics, laboratory schedules, and your personal attendance percentage for that subject.

---

### 3.5 Weekly Timetable & Class Calendar (`/student/calendar`)
A clean 5-day Monday-to-Friday schedule.

#### How it works:
- Automatically reads the professor's configured timetable.
- If *Structural Biology* is theory on Monday in `LH-204` and practical lab on Friday in `Bioinformatics Lab-1`, it displays in the exact right day column with times and room tags.

---

### 3.6 Digital Student Smart Card & Profile (`/student/profile`)
The student's official digital university ID badge.

#### Features & Tabs:
- **"Academic Record" Tab**: Displays your official degree program, registration date, roll number, academic advisor, and earned credits.
- **"Contact & Emergency" Tab**:
  - Allows you to update your active phone number, campus hostel address, and parent's emergency contact.
  - Click **"Save Contact Details"** to store updates.
- **"Digital Student ID Card" Tab**:
  - Displays a gorgeous Navy & Gold university smart card badge with photo placeholder, QR verification token, and semester validity stamp.
- **"Security & Password" Tab**: Allows you to safely change your account password.

---

## 4. The Professor / Faculty Portal

### 4.1 Professor Dashboard (`/professor/dashboard`)
The professor's central command post upon starting their work day.

#### What you see on this page:
1. **"Today's Active Lecture" Banner**:
   - Detects the current hour and displays the lecture scheduled right now.
   - Shows subject code, enrolled student count, and room.
   - **"Start Live Class" Button**: Launches the interactive attendance session.
   - **"Auditorium Projector View" Button**: Opens the full-screen display for classroom projectors.
2. **Stat Cards**: Total teaching load (courses), total students across all batches, average department attendance rate, and pending marks submissions.
3. **Course Allocation Cards**: Quick-access cards for each subject taught by this professor.

---

### 4.2 Live Classroom Session (Taking Attendance in 3 Ways) (`/professor/session/[id]`)
The screen used while conducting class.

#### The 3 Attendance Modes:
1. **Mode 1: Dynamic QR Code Mode**:
   - Displays a live QR code on screen.
   - The token automatically refreshes every 15 seconds with a visual countdown timer to prevent cheating.
   - As students scan, the live counter increments (e.g. *18 / 24 Present*).
2. **Mode 2: 5-Digit Passcode Mode**:
   - Generates a short numeric code (e.g. `73912`).
   - The professor can announce this code verbally or write it on the whiteboard for quick check-in.
3. **Mode 3: Manual Roster Sheet Mode**:
   - Displays the full student list with profile photos and roll numbers.
   - Each student has 3 buttons: **Present (Green)**, **Late (Yellow)**, and **Absent (Red)**.
   - Professor can click any student's button to manually change their status in 1 second.
   - **"Mark All Present" Button**: Sets all students to green with 1 click (useful for small seminars).
   - **"Clear All" Button**: Resets the roster back to absent.

#### Finalizing the Class:
- **"Save & Lock Attendance" Button**:
  - When class ends, the professor clicks this button.
  - The session is officially closed. No student can check in afterwards.
  - The data is permanently written to the university database and student dashboards.

---

### 4.3 Auditorium Projector Mode (Big Screen) (`/professor/session/[id]/projector`)
Designed specifically to be dragged onto an external classroom TV or projector.

#### What makes it special:
- High-contrast cinema dark theme visible from the back row of large auditoriums.
- Massive QR code in the center.
- Big numeric attendance code at the bottom.
- Live ticking counter showing how many students have checked in.
- Fullscreen toggle button (`F11`).

---

### 4.4 Central Course Workspace (`/professor/courses/[id]`)
The complete management hub for a single subject. It has **6 tabs**:

#### Tab 1: Overview
- Shows course description, learning objectives, and credit hours.
- **"Subject Timetable & Varying Schedule" Card**:
  - Lists every day's class timings and rooms (e.g. *Mon 10:00 AM LH-204 Lecture*, *Fri 09:30 AM Bioinfo Lab-1 Lab*).
  - **"Edit Subject Timetable" Button**: Opens the timetable customizer modal.
- Summary of the internal marks distribution.

#### Tab 2: Attendance
- A complete spreadsheet of every student's attendance percentage in this subject.
- Flags students who are below 75% so the professor can counsel them.
- **"Export Attendance PDF" Button**: Generates an official university attendance sheet.

#### Tab 3: Internal Marks (The Gradebook)
- (See Section 4.5 below for detailed guide).

#### Tab 4: Students Roster
- Complete list of enrolled students with photos, roll numbers, institutional emails, and phone numbers.

#### Tab 5: Analytics & Charts
- Visual bar charts showing grade distributions and attendance compliance curves.

#### Tab 6: Reports & Exports
- (See Section 4.6 below for detailed guide).

---

### 4.5 Internal Assessment Marks & Gradebook Spreadsheet
Located inside Tab 3 of the Course Workspace.

#### How it works:
1. **Interactive Spreadsheet Table**:
   - Lists students row-by-row.
   - Columns represent your assessment components (e.g. *Mid-Sem (15M)*, *Lab Practical (10M)*, *Assignment (5M)*).
2. **Entering & Editing Marks**:
   - Click any score box and type the student's mark.
   - The **Total Score** and **Grade (O / A+ / A / B+ / F)** calculate automatically in real time!
3. **"Configure Assessment Scheme" Button**:
   - Allows the professor to change how marks are divided (e.g., create a new "Seminar Presentation" component worth 5 marks).
4. **Draft vs Finalized vs Published Workflow**:
   - **"Save Draft" Button**: Saves your work so you can come back tomorrow to finish grading.
   - **"Finalize Marks" Button**: Locks the sheet to prevent accidental changes.
   - **"Publish to Students" Button**: Releases the grades so students can view their official marks.
5. **Auditing Overrides**:
   - If a professor needs to change a mark *after* finalization, the system asks for an **Institutional Reason** (e.g., *Re-evaluation calculation correction*). This is recorded in the permanent university audit log for fairness and transparency.

---

### 4.6 Official A4 PDF Reports & Export Center
Located inside Tab 6 of the Course Workspace and at `/professor/reports`.

#### Available Report Types:
1. **Official Internal Assessment Award Sheet**:
   - Formatted to exact University of Hyderabad examination branch standards.
   - Contains university crest, course metadata, student marks breakdown, letter grades, statistics, and official professor signature box.
2. **Official Statutory Attendance Transcript**:
   - Formal record of conducted sessions, student percentages, and exam eligibility remarks.
3. **Combined Academic Performance Summary**:
   - Comprehensive multi-page transcript combining attendance records and marks in one document.

#### Buttons on this screen:
- **"Print Official A4" / "Download PDF" Button**: Opens the browser print dialog formatted perfectly for standard physical A4 paper or PDF export.
- **"Export CSV Data" Button**: Downloads a raw Excel-compatible `.csv` file for department records.

---

### 4.7 Subject Timetable & Dynamic Schedule Editor
Opened via the **"Edit Subject Timetable"** button on course cards or inside the course workspace.

#### Why is this useful?
In university life, subjects rarely happen at the exact same time every day. A course might have **Theory lectures on Monday & Wednesday morning** in a lecture hall, and a **2-hour Lab practical on Friday afternoon** in a computer lab.

#### What you can do in this modal:
- **Primary Default Room**: Set the general classroom (e.g. `LH-204`).
- **"Add Day Slot" Button**: Adds a new day to the schedule.
- **Day Selector**: Choose Monday, Tuesday, Wednesday, Thursday, Friday, or Saturday.
- **Start Time & End Time**: Set custom hours (e.g., `10:00 AM` to `11:30 AM`).
- **Session Type**: Choose between **Lecture (Theory)**, **Lab (Practical)**, **Tutorial**, or **Seminar**.
- **Room / Venue Override**: Type a specific room for that day (e.g. `Bioinformatics Lab-1`).
- Click **"Save Timetable Schedule"** -> Everything saves immediately to your database and updates the student calendar!

---

### 4.8 Teaching Schedule Calendar (`/professor/calendar`)
A weekly view showing all classes assigned to the professor. Each class card has a direct **"Launch Session"** button to start taking attendance immediately.

---

### 4.9 Faculty Profile & Digital Signature Stamp (`/professor/profile`)
The professor's academic credential sheet.

#### Key Elements:
- **Credentials Tab**: Shows employee code, designation (e.g. *Professor & Chair*), academic qualifications, and office hours.
- **Teaching Load Tab**: Lists all active courses assigned to this professor.
- **Authorized Digital Signature Stamp Tab**:
  - Displays a preview of the professor's authorized university seal and digital signature stamp used on official PDF reports.
- **Security Tab**: Allows changing password.

---

## 5. The University Administrator / Dean Portal

### 5.1 Dean / Admin Dashboard (`/admin/dashboard`)
Gives the Department Chair and Dean bird's-eye visibility over the whole institution.

#### What you see on this page:
- **Campus Health Cards**: Total Active Students, Appointed Faculty, Courses Offered, and Overall University Attendance Rate (e.g., `87.4%`).
- **Department Attendance Compliance Curve**: Visual chart showing which departments are performing well.
- **Quick Administration Actions**: Direct shortcuts to Enroll Students, Appoint Faculty, Create Courses, and Inspect Audit Logs.

---

### 5.2 Student Registry & Enrollment (`/admin/students`)
The official student admissions and cohort management directory.

#### What you can do on this page:
1. **Search & Filter Bar**: Find any student by typing their name or roll number, or filter by academic batch (e.g., *MSc SCB 2025–27*).
2. **"Enroll New Student" Button**:
   - Opens the Enrollment Form.
   - Enter Full Name, University Roll Number (e.g. `25MCMS17`), Institutional Email, Phone, Batch, Section (A or B), and Semester.
   - Click **"Enroll Student"** -> The student is instantly created, added to rosters, and can log in immediately.
3. **"Export Roll List (CSV)" Button**: Downloads a clean spreadsheet of all enrolled students for office filing.

---

### 5.3 Faculty Directory & Appointments (`/admin/professors`)
Manages all professors, lecturers, and department chairs.

#### What you can do on this page:
1. **Faculty Cards**: Display professor's name, employee ID, designation, email, phone, cabin room, research specialization, and total assigned courses.
2. **"Add Faculty Member" Button**:
   - Opens the Appointment Form.
   - Enter Faculty Name (e.g. *Dr. Ananya Sen*), Employee Code, Designation (*Professor & Chair*, *Associate Professor*, etc.), Email, Office Room, and Specialization.
   - Click **"Appoint Faculty"** -> Adds the professor to the directory and allows them to teach courses.

---

### 5.4 Course Catalog & Syllabus Architecture (`/admin/courses`)
The university master curriculum catalog.

#### What you can do on this page:
1. **"Create New Course" Button**:
   - Opens the Course Creator Form.
   - Enter Course Code (e.g. `SCB-505`), Course Title, Credits (e.g. 4 Credits), Semester, Assigned Faculty Instructor, Classroom Room, and Schedule Days.
   - Click **"Create Course"** -> Generates the new course workspace, adds it to the student curriculum, and links the assigned professor.
2. **"Edit Timetable" Button on Course Cards**:
   - Directly configures day-by-day lecture/lab slots for any course in the university catalog.
3. **"Workspace →" Link**: Allows the administrator to inspect any course's attendance and marks records.

---

### 5.5 Department & Campus Controls (`/admin/departments` & `/admin/settings`)
- Lists academic departments under the School of Life Sciences.
- Configures university-wide statutory thresholds (e.g. setting the minimum attendance rule to 75% and critical warning threshold to 60%).

---

### 5.6 Security & Audit Logs (Fraud Prevention) (`/admin/audit-logs`)
A tamper-evident, permanent security black-box recording every sensitive change in the university.

#### What gets recorded here:
- When a professor unlocks a past attendance session.
- When an administrator overrides a student's status.
- When a finalized internal mark is edited, including the **Actor Name**, **Exact Timestamp**, **Old Score**, **New Score**, and the **Official Reason Given**.
- **"Export Audit Trail (CSV)" Button**: Downloads the security log for university accreditation and anti-corruption committee review.

---

### 5.7 Administrator Profile & System Clearances (`/admin/profile`)
- Displays administrator credentials, office jurisdiction, and assigned security clearance privileges.
- Provides Master Key password management.

---

## 6. Frequently Asked Questions (FAQ)

### Q1: Can a student mark attendance if they are not in the classroom?
**No.** The Dynamic QR code automatically changes its security token every 15 seconds. If a student takes a photo and messages it to an absent friend, the code will have already expired by the time they try to scan it.

### Q2: What if a student's phone has no battery or broken camera?
The professor can verbally give them the **5-digit Attendance Code** displayed on the screen, or simply click the student's name on the **Manual Roster** to mark them Present in 1 second.

### Q3: What happens if our course has a lecture on Monday and a Lab on Friday in a different room?
Use the **"Edit Subject Timetable"** modal. You can create a Monday slot (e.g. 10:00 AM in LH-204 for Theory) and a Friday slot (e.g. 09:30 AM in Bioinformatics Lab-1 for Lab). Both the student and faculty weekly calendars will display them accurately on their respective days.

### Q4: Can marks be edited after being finalized?
Yes, but to maintain complete academic integrity and prevent corruption, the system prompts the instructor for an **Institutional Reason**, which is permanently recorded in the Departmental Audit Log with the professor's identity and timestamp.

### Q5: Does the system work on phones and tablets?
**Yes.** All screens are fully responsive and look like a premium mobile app on iPhones, Android devices, iPads, and desktop computers.

---

*University of Hyderabad • Department of Systems & Computational Biology • School of Life Sciences*  
*Academic Precision Attendance & Examination Management Architecture*
