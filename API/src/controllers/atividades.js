const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const read = async (req, res) => {
  try {
    const atividades = await prisma.atividade.findMany({
      include: { turma: true },
    });
    res.status(200).json(atividades);
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    res.status(500).json({ error: "Erro ao listar atividades" });
  }
};

const create = async (req, res) => {
  const { nome, turma_id } = req.body;

  if (!nome || !turma_id) {
    return res.status(400).json({ error: "Nome e turma_id são obrigatórios" });
  }

  try {
    // Verifica se a turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: Number(turma_id) },
    });

    if (!turma) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    const novaAtividade = await prisma.atividade.create({
      data: {
        nome,
        turma_id: Number(turma_id),
      },
    });

    res.status(201).json(novaAtividade);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ error: "Erro ao criar atividade" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { nome, turma_id } = req.body;

  try {
    const atividadeExistente = await prisma.atividade.findUnique({
      where: { id: Number(id) },
    });

    if (!atividadeExistente) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id: Number(id) },
      data: {
        nome: nome || atividadeExistente.nome,
        turma_id: turma_id ? Number(turma_id) : atividadeExistente.turma_id,
      },
    });

    res.status(200).json(atividadeAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    res.status(500).json({ error: "Erro ao atualizar atividade" });
  }
};

const del = async (req, res) => {
  const { id } = req.params;

  try {
    const atividadeExistente = await prisma.atividade.findUnique({
      where: { id: Number(id) },
    });

    if (!atividadeExistente) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    await prisma.atividade.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Atividade deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar atividade:", error);
    res.status(500).json({ error: "Erro ao deletar atividade" });
  }
};

module.exports = {
  read,
  create,
  update,
  del,
};
