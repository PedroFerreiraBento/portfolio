import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/assets/images/external');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const files = [
    "fallback-project.jpg",
    "about-hero.jpg",
    "about-story.jpg",
    "stock-reposition.jpg",
    "client-keep.jpg",
    "client-rebuy.jpg",
    "fraud-detection-1.jpg",
    "fraud-detection-2.jpg",
    "production-req.jpg",
    "landing-saas-1.jpg",
    "portal-b2b-1.jpg",
    "portal-b2b-2.jpg",
    "app-sales-1.jpg",
    "app-sales-2.jpg",
    "backoffice-1.jpg",
    "backoffice-2.jpg",
    "marketplace-1.jpg",
    "marketplace-2.jpg",
    "dash-exec-1.jpg",
    "dash-logistics-1.jpg",
    "dash-saas-1.jpg",
    "dash-marketing-1.jpg",
    "dash-finance-1.jpg",
    "dash-finance-2.jpg"
];

// Base64 1x1 gray pixel JPG.
const base64Jpg = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
const buffer = Buffer.from(base64Jpg, 'base64');

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, buffer);
        console.log(`Created ${file}`);
    } else {
        console.log(`Skipped ${file} (exists)`);
    }
});

console.log('Done.');
