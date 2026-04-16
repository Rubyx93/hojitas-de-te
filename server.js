const express = require('express');
const path = require('path');
const multer = require('multer'); // Nueva herramienta para fotos
const app = express();
const PORT = process.env.PORT || 10000;

// Configurar dónde se guardan las fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '/')));
app.use('/public', express.static('public')); // Para que las fotos sean visibles
app.use(express.urlencoded({ extended: true }));

// RUTA PARA SUBIR LA IMAGEN
app.post('/subir-personaje', upload.single('foto'), (req, res) => {
    if (!req.file) return res.send("Error al subir archivo");
    res.send(`<h1>✅ ¡Imagen subida!</h1><p>Se guardó como: ${req.file.filename}</p><a href="/personajes">Volver</a>`);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/personajes', (req, res) => res.sendFile(path.join(__dirname, 'personajes.html')));

app.listen(PORT, () => console.log(`🚀 Servidor con subida de fotos listo`));

let usuarios = [];

// --- 2. RUTAS ---

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login y Registro
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/registro', (req, res) => res.sendFile(path.join(__dirname, 'registro.html')));

// --- 3. LÓGICA ---

app.post('/auth/register', (req, res) => {
    usuarios.push({ email: req.body.email, password: req.body.password });
    res.send('<h1>Registro OK</h1><a href="/login">Ir al Login</a>');
});

app.post('/auth/login', (req, res) => {
    const user = usuarios.find(u => u.email === req.body.email && u.password === req.body.password);
    if (user) {
        req.session.usuarioLogueado = user.email;
        res.redirect('/');
    } else {
        res.send('Datos incorrectos. <a href="/login">Volver</a>');
    }
});

app.post('/books/upload-text', (req, res) => {
    const { title } = req.body;
    res.send(`<div style="text-align:center;"><h1>🎉 ¡"${title}" publicado!</h1><a href="/">Volver</a></div>`);
});

// --- 4. ENCENDER ---
app.listen(PORT, () => {
    console.log(`🚀 Web de Rubyx32 ONLINE en puerto ${PORT}`);
});
