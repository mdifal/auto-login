import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const port = 3001;

// Menggunakan CORS untuk mengizinkan permintaan dari frontend
app.use(cors({
    origin: 'http://localhost:3002', // Sesuaikan dengan origin frontend
    credentials: true // Izinkan pengiriman cookie
}));
app.use(express.json()); // Untuk parsing JSON

app.get('/start-login', async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        // Menghapus executablePath, Puppeteer akan mencari browser yang terpasang
    });

    const page = await browser.newPage();

    // Buka halaman login
    await page.goto('http://127.0.0.1:8088/superset/welcome/', { waitUntil: 'networkidle2' });

    // Tunggu dan isi username dan password
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', 'mdifa');  // Ganti dengan username kamu
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', 'mdifa');  // Ganti dengan password kamu

    // Tunggu tombol dan klik
    await page.waitForSelector('input[type="submit"]');
    await Promise.all([
        page.waitForNavigation({ timeout: 60000 }),
        page.click('input[type="submit"]'),
    ]);

    // Ambil cookies dari Puppeteer
    const cookies = await page.cookies();

    // Tutup browser setelah mengirim cookies
    await browser.close();

    // Set setiap cookie dari Puppeteer sebagai cookie di response Express
    const sessionValue = await cookies.find(cookie => cookie.name === 'session').value;

    res.cookie('session', sessionValue, {
        httpOnly: true,
        secure: false, // Set true jika menggunakan HTTPS
        sameSite: 'Lax',
        path: '/', // Path di mana cookie tersedia
    });

    // Kirim respon bahwa cookies telah diset
    res.json({ sessionValue });
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
