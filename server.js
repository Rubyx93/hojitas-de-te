const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 10000;

// --- 1. CONFIGURACIÓN ---
app.use(express.static(path.join(__dirname, '/')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

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