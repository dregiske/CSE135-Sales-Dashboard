const puppeteer = require('puppeteer');

exports.exportReportsPDF = async (req, res) => {
    const port = process.env.PORT;
    const url = `http://localhost:${port}/reports`;

    // Grab the session cookie from the incoming request so puppeteer
    // renders the page as the currently logged-in user
    const sessionCookie = req.headers.cookie;

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Forward the session cookie so the reports page is authenticated
        if (sessionCookie) {
            const cookies = sessionCookie.split(';').map(pair => {
                const [name, ...rest] = pair.trim().split('=');
                return {
                    name: name.trim(),
                    value: rest.join('=').trim(),
                    domain: 'localhost',
                };
            });
            await page.setCookie(...cookies);
        }

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

        // Wait for Chart.js canvases to finish rendering
        await page.waitForFunction(() => {
            const canvases = document.querySelectorAll('canvas');
            return canvases.length === 0 || Array.from(canvases).every(c => c.width > 0);
        }, { timeout: 8000 }).catch(() => {});

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="sales-report-${new Date().toISOString().slice(0,10)}.pdf"`,
            'Content-Length': pdf.length,
        });
        res.end(pdf);

    } catch (err) {
        console.error('PDF export error:', err);
        res.status(500).send('Failed to generate PDF. Please try again.');
    } finally {
        if (browser) await browser.close();
    }
};
