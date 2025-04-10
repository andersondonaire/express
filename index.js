//importa a biblioteca express para iniciar a api
const express = require("express");
//importa biblioteca fs para interagir com arquivos do computdor
const fs = require("fs");
// é utilizado para atualizar registros de forma parcial, informando ao servidor quais propriedades foram alterada
const path = require("path");

//inicia express
const app = express();

//atualiza para portugues
app.use((req, res, next) => {
  res.header("Content-Language", "pt-BR");
  next();
});

// define a porta
const port = 3000;

//cria o primento end-point
app.get("/", (req, res) => res.send("Olá Mundo!"));


// Função auxiliar para ler o arquivo JSON
const lerArquivoJSON = (callback) => {
  fs.readFile("escola.json", "utf8", (err, data) => {
      if (err) {
          callback(err, null);
          return;
      }

      try {
          const jsonData = JSON.parse(data); // Converte JSON para objeto
          callback(null, jsonData);
      } catch (parseError) {
          callback(parseError, null);
      }
  });
};

// Endpoint para listar todos os alunos
app.get("/alunos", (req, res) => {
  lerArquivoJSON((err, jsonData) => {
      if (err) {
          return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
      }
      res.json(jsonData.alunos);
  });
});

// Endpoint para buscar aluno por ID
app.get("/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id); // Converte o ID para número

  lerArquivoJSON((err, jsonData) => {
      if (err) {
          return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
      }

      const aluno = jsonData.alunos.find(a => a.id === id);
      if (!aluno) {
          return res.status(404).json({ error: "Aluno não encontrado" });
      }

      res.json(aluno);
  });
});

// Endpoint para buscar aluno por nome (case insensitive)
app.get("/alunos/nome/:nome", (req, res) => {
  const nomeBuscado = req.params.nome.toLowerCase(); // Converte para minúsculas

  lerArquivoJSON((err, jsonData) => {
      if (err) {
          return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
      }

      const aluno = jsonData.alunos.find(a => a.nome.toLowerCase() === nomeBuscado);
      if (!aluno) {
          return res.status(404).json({ error: "Aluno não encontrado" });
      }

      res.json(aluno);
  });
});



// app.get("/:endpoint", (req, res) => {
//   const endpoint = req.params.endpoint;
//   const nome = req.query.nome;
//   const filePath = path.join(__dirname, "escola.json");
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       res.status(500).send("Error reading file");
//       return;
//     }
//     try {
//       const jsonData = JSON.parse(data);

//       if (jsonData[endpoint]) {
//         if (nome) {       
//           const a = jsonData[endpoint].filter((aluno) =>
//             aluno.nome.toLowerCase().includes(nome.toLowerCase())
//           );
//           console.log(a);
//           if (a) {
//             return res.json(a);
//           } else {
//             res.status(404).send("Aluno não encontrado");
//           }
//         }

//         return res.json(jsonData[endpoint]);
//       } else {
//         res.status(404).send("Endpoint não existe");
//       }
//     } catch (parseErr) {
//       res.status(500).send("Error parsing JSON");
//     }
//   });
// });

// app.get("/:endpoint/:id", (req, res) => {
//   const endpoint = req.params.endpoint;
//   const id = req.params.id;
//   const filePath = path.join(__dirname, "escola.json");
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       res.status(500).send("Error reading file");
//       return;
//     }
//     try {
//       const jsonData = JSON.parse(data);
//       if (jsonData[endpoint]) {
//         const a = jsonData[endpoint].find((aluno) => aluno.id == id);
//         console.log(a);
//         if (a) {
//           res.json(a);
//         } else {
//           res.status(404).send("Aluno não encontrado");
//         }

//         // res.json(jsonData[endpoint]);
//       } else {
//         res.status(404).send("Endpoint não existe");
//       }
//     } catch (parseErr) {
//       res.status(500).send("Error parsing JSON");
//     }
//   });
// });



//inicia o servidor de aplicação



app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);