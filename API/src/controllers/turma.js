const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const read = async (req, res) => {
    try {
        const turmas = await prisma.turma.findMany();
        res.json(turmas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
}

const create = async (req, res) => {
    const { nome } = req.body;
        if (!nome) {
    return res.status(400).json({ error: 'Campo "nome" é obrigatório' });
    }

    try {
        const novoturma = await prisma.turma.create({
            data: { nome }
        });
        res.status(201).json(novoturma);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar turma' });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    try {
        const turma = await prisma.turma.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.status(202).json(turma);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar turma' });
    }
}

const del = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.turma.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar turma:", error);

    if (error.code === 'P2003') {
      // Violação de chave estrangeira
      return res.status(400).json({ error: 'Não é possível deletar: há atividades associadas a essa turma.' });
    }

    res.status(500).json({ error: 'Erro ao deletar turma' });
  }
};

module.exports = {
    read,
    create,
    update,
    del

};