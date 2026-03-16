# Grader Guide

This is my Authentication + Authorization implementation bolted onto the MVC app of a Sales Dashboard. I aimed to implement authorization / authentication following MVC code guidelines for scalability and readability.


## Credentials

| Role							Username			Password
|--------------------------------------------------------------------|
| Super Admin  					`superadmin`		`super123`		 |
| Analyst (revenue + orders) 	`sam`				`sam123`		 |
| Analyst (revenue + regional)	`sally`				`sally123`		 |
| Viewer 						`viewer`			`viewer123`		 |

> New viewer accounts can also be created via the **Sign Up** link on the login page. Self registered accounts are restricted to viewer access only and won't be able to see the dashboards, only public reports.


## Walkthrough

### Step 1 — Super Admin
1. Go to https://mvc.andregiske.com/ and log in as username: `superadmin` password: `super123`
2. You are redirected to the **Admin panel**, a user management table listing all accounts with their roles and assigned sections
3. Click **Edit** on `sam`, notice his sections are `revenue` and `orders`
4. Click **Edit** on `sally`, her sections are `revenue` and `regional`
5. Click **+ New User** and create a test analyst with any combination of sections, then delete them

### Step 2 — Analyst
1. Log out and sign in as username: `sam` password: `sam123`
2. Notice the navbar shows Dashboard, Orders, Customers, Reports
3. Navigate to **Reports**, sam sees only the **Revenue Summary** and **Orders Analysis** sections (not Regional, since he isn't assigned to it)
4. Add an analyst comment to one of the sections and click **Save Comment**
5. Click **Export PDF** in the top right, a dated PDF downloads and is saved server-side
6. Log out and sign in as username: `sally` password: `sally123`
7. Navigate to **Reports** — sally sees **Revenue Summary** and **Regional Performance** (not Orders)

### Step 3 — Viewer
1. Log out and sign in as username: `viewer` password: `viewer`
2. You are redirected directly to **Reports** — the only page viewers can access
3. The page shows a table of previously exported PDFs with download links
4. Confirm that attempting to navigate to `/dashboard` or `/orders` results in a **403 Access Denied** page with a role appropriate back link
5. Click a **Download PDF** link to verify a saved report opens correctly

### Step 4 — Sign Up Flow
1. Log out and click **Sign up** on the login page
2. Create a new account with any username and password
3. Confirm you are logged in and redirected to the Reports (viewer) page
4. Confirm the new account cannot access `/dashboard`


## Known Bugs & Architectural Concerns

These are disclosed upfront in the spirit of accountability:

- **PDF charts may occasionally render blank** — Puppeteer uses a timed wait for Chart.js to finish rendering. Under server load this timeout may not be sufficient, resulting in a PDF with empty chart canvases. But redoing the export usually resolves it.

- **Exported PDFs are publicly accessible by URL** — Files saved to `/public/exports/` are served as static assets with no auth check. Anyone who knows or guesses a filename can download it. Filenames are timestamp-based (`report-<epoch>.pdf`) which makes guessing difficult but not impossible. A proper fix would gate the route behind `isAuthenticated`.

- **`cookie: { secure: false }`** — The session cookie is not set to secure-only. Since the site runs over HTTPS this should be `true` in production. It was left `false` to avoid issues during development.

- **No pagination on tables** — The orders and customers views fetch and render all rows. This is fine for the current dataset size but would degrade with large volumes of data with tens of thousands of data entries.

- **Chart.js** - Using a third party charting tool is quick and easy, but creating your own has customizable and performance benefits as discussed in class. Protocol > Platform!
