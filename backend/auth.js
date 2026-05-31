const USUARIOS = [
  { id: 1, usuario: 'teruo', senha: 'senha123' },
  { id: 2, usuario: 'davi', senha: 'senha456' }
];

export function login(req, res) {
  const { usuario, senha } = req.body;
  const user = USUARIOS.find(u => u.usuario === usuario && u.senha === senha);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos' });
  }
  res.json({ success: true, usuario: user.usuario });
}