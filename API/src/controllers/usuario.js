const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    try {
        // Verifique se o email e a senha estão sendo passados corretamente
        console.log('Buscando usuário com o e-mail:', email);

        const usuario = await prisma.usuario.findFirst({
            where: { 
                email,
                senha: parseInt(senha)  // Se você estiver armazenando a senha como número
            },
            select: {
                id: true,
                email: true,
                
            }
        });

        if (!usuario) {
            return res.status(401).json({ message: "E-mail ou senha incorretos" });
        }

        res.status(200).json({
            ...usuario,
            message: "Login bem-sucedido"
        });
    } catch (error) {
        // Adicionar mais detalhes sobre o erro
        console.error("Erro no login:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          
            return res.status(400).json({
                message: 'Erro na consulta ao banco de dados',
                details: error.message
            });
        }

        res.status(500).json({
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
};

module.exports = { login };
