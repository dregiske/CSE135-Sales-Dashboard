# CSE135 Sales Dashboard with Authentication and Authorization

A full-stack analytics platform built with Node.js, Express, EJS, and SQLite. The system collects and visualizes sales data, supports role based access control, and provides exportable reports.

## Links

- **Repository:** https://github.com/dregiske/CSE135-Sales-Dashboard
- **Deployed Site:** https://mvc.andregiske.com/


## Tech Stack

- **Backend:** Node.js, Express 5
- **Templating:** EJS
- **Database:** SQLite via `better-sqlite3`
- **Auth:** bcrypt password hashing, express-session
- **Charts:** Chart.js (CDN)
- **PDF Export:** Puppeteer (headless Chromium)


## Features

- **Authentication & Authorization** — Three role levels: superadmin, analyst, and viewer. Superadmins manage all users. Analysts are scoped to specific data sections (revenue, orders, regional). Viewers can only access saved exported reports.
- **Reports** — Three report categories (Revenue Summary, Orders Analysis, Regional Performance), each with a chart, data table, and analyst comment field. Section visibility is enforced per analyst.
- **PDF Export** — Analysts and superadmins can export the reports page as a dated PDF. Exported files are saved server-side and made available to viewers as downloadable saved reports.
- **User Management** — Superadmins can create, edit, and delete users and assign analyst sections via the admin panel.
- **Signup** — New users can self-register via a public signup form, which creates a viewer-only account by default for security.
- **Error Handling** — Custom 403 and 404 pages with role-aware back navigation.


## Use of AI

Claude was used throughout this project as a coding assistant, primarily for scaffolding views, debugging server errors, generating CSS, and populating the database tables. It was useful for accelerating these redundant boring tasks. It was a strong force multiplier for implementation speed, while still understanding what the code does and why.


## Roadmap

Given more time, I would tackle some of these ideas:

- **Pagination** on orders and customers tables for scalability
- **Date range filtering** on reports and dashboard charts
- **Email delivery** of exported PDFs via a mail service
- **Secure export URLs** — add auth checks so exported PDFs are not accessible without a valid session
	- Or make public / private report types and only let viewers access public ones
- **HTTPS session hardening** — set `cookie: { secure: true }` behind the reverse proxy
