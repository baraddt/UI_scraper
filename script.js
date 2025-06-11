// const baseUrl = 'http://192.168.100.161:8000';
const baseUrl = 'http://0.0.0.0:8000';
// const baseUrl = 'https://scraperwithplaywright-production.up.railway.app';

const spinner = document.getElementById('spinner');
let lastDownloadUrl = null;

function showSpinner(show) {
    spinner.classList.toggle('hidden', !show);
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');

    if (fileInput.files.length === 0) {
        status.textContent = 'Silakan pilih file Excel terlebih dahulu.';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        showSpinner(true);
        status.textContent = 'Memproses...';

        const response = await fetch(`${baseUrl}/scrape`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Gagal menjalankan scraper');
        }

        lastDownloadUrl = `${baseUrl}${result.download_url}`;
        status.textContent = result.message || 'Scraping selesai. Klik download.';
    } catch (error) {
        console.error(error);
        status.textContent = 'Error: ' + error.message;
        lastDownloadUrl = null;
    } finally {
        showSpinner(false);
    }
}

function downloadFile() {
    const status = document.getElementById('status');

    if (!lastDownloadUrl) {
        status.textContent = 'Tidak ada file untuk diunduh. Silakan proses dulu.';
        return;
    }

    status.textContent = 'Mengunduh hasil...';

    const a = document.createElement('a');
    a.href = lastDownloadUrl;
    a.download = 'hasil.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();

    status.textContent = 'Download selesai.';
    lastDownloadUrl = null;
}
