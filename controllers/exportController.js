const path = require('path');
const fs = require('fs');
const savedReportModel = require('../models/savedReportModel');

let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.warn('Puppeteer not installed — PDF export will be unavailable.');
}

exports.exportReportsPDF = async (req, res) => {
    if (!puppeteer) {
        return res.status(503).send('PDF export is not available on this server.');
    }

    const port = process.env.PORT;
    const url = `http://localhost:${port}/reports`;
    const sessionCookie = req.headers.cookie;

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

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

        await page.waitForFunction(() => {
            const canvases = document.querySelectorAll('canvas');
            return canvases.length === 0 || Array.from(canvases).every(c => c.width > 0);
        }, { timeout: 8000 }).catch(() => {});

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        });

        // Save to disk so viewers can access it
        const filename = `report-${Date.now()}.pdf`;
        const exportsDir = path.join(__dirname, '../public/exports');
        fs.mkdirSync(exportsDir, { recursive: true });
        fs.writeFileSync(path.join(exportsDir, filename), pdf);

        // Record in DB
        savedReportModel.create(filename, req.session.user.username);

        // Stream download to the exporting user
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
