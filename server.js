const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// Crear carpeta de subidas si no existe
const uploadDir = './public/uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para guardar fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '/')));
app.use('/public', express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

// --- RUTAS ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/personajes', (req, res) => res.sendFile(path.join(__dirname, 'personajes.html')));

// RUTA PARA RECIBIR LA FOTO
app.post('/subir-personaje', upload.single('foto'), (req, res) => {
    if (!req.file) return res.send("No se seleccionó ninguna imagen.");
    res.send(`
        <div style="text-align:center; font-family:sans-serif; padding:50px;">
            <h1>💖 ¡Imagen subida con éxito!</h1>
            <p>Tu personaje ya está en el servidor.</p>
            <a href="/personajes" style="background:#ffb7c5; padding:10px; color:white; text-decoration:none; border-radius:10px;">Volver a la galería</a>
        </div>
    `);
});

app.listen(PORT, () => console.log(`🚀 Web lista con subida de archivos`));
