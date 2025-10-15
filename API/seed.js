const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function readCSV(fileName) {
  const filePath = path.join(__dirname, fileName);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const delimiter = fileContent.includes(";") ? ";" : ",";

  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter,
    trim: true,
  });
}

async function main() {
  console.log("📥 Lendo arquivos CSV...");

  const perfis = readCSV("perfil.csv");
  const usuarios = readCSV("usuario.csv");
  const turmas = readCSV("turma.csv");
  const atividades = readCSV("atividades.csv");

  console.log("🚀 Populando tabelas...");

  // ===== PERFIS =====
  for (const p of perfis) {
    const id = Number(p.id);
    if (!id || !p.perfil) {
      console.warn("⚠️ Linha inválida em perfil.csv:", p);
      continue;
    }

    await prisma.perfil.upsert({
      where: { id },
      update: {},
      create: { id, perfil: p.perfil },
    });
  }

  // ===== USUÁRIOS =====
  for (const u of usuarios) {
    const id = Number(u.id);
    const perfilId = Number(u.perfilId || u.perfil); // 👈 aceita 'perfil' ou 'perfilId'
    if (!id || !u.email || !u.senha || !perfilId) {
      console.warn("⚠️ Linha inválida em usuario.csv:", u);
      continue;
    }

    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id,
        email: u.email,
        senha: Number(u.senha),
        perfilId,
      },
    });
  }

  // ===== TURMAS =====
  for (const t of turmas) {
    const id = Number(t.id);
    if (!id || !t.nome) {
      console.warn("⚠️ Linha inválida em turma.csv:", t);
      continue;
    }

    await prisma.turma.upsert({
      where: { id },
      update: {},
      create: { id, nome: t.nome },
    });
  }

  for (const a of atividades) {
  const id = Number(a.id);
  const turma_id = Number(a.turma_id);

  if (!id || !a.nome || !turma_id) {
    console.warn("⚠️ Linha inválida em atividade.csv:", a);
    continue;
  }

    await prisma.atividade.upsert({
    where: { id },
    update: {},
    create: {
      id,
      nome: a.nome,
      turma_id,
      },
    });
  }

  console.log("✅ Banco populado com sucesso a partir dos CSVs!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao popular o banco:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
