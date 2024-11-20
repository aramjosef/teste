async function consultar() {
    const Doc_cl = document.getElementById('Doc_cl').value;
    const num_q = document.getElementById('numero_quarto').value
    const status = document.getElementById('status_quarto').value;
    const dt_en = document.getElementById('data_en').value;
    const dt_sa = document.getElementById('data_sa').value;

    const queryParams = new URLSearchParams();
    if (Doc_cl) queryParams.append('Doc_cl', Doc_cl);
    if (num_q) queryParams.append('numero_quarto', num_q);
    if (status) queryParams.append('status_quarto', status);
    if (dt_en) queryParams.append('data_en', dt_en);
    if (dt_sa) queryParams.append('data_sa', dt_sa);

    // Faz a requisição para a rota de consulta
    const response = await fetch(`/consultar-alunos?${queryParams.toString()}`);

    // Verifica se a resposta foi bem sucedida
    if (!response.ok) {
        console.error('Erro ao consultar alunos:', response.statusText);
        return;
    }

    const alunos = await response.json();
    console.log('Alunos retornados:', alunos); // Adiciona log para verificar dados retornados
    const tabelaResultados = document.getElementById('resultadoConsulta');
    const tbody = tabelaResultados.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de adicionar resultados

    if (alunos.length > 0) {
        tabelaResultados.style.display = 'table';
        alunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.Doc_cl}</td>
                <td>${aluno.num_q}</td>
                <td>${aluno.status}</td>
                <td>${aluno.dt_en}</td>
                <td>${aluno.dt_sa}</td>
            `;
            tbody.appendChild(row);
        });
      alert("ok");
    } else {
        tabelaResultados.style.display = 'none';
        alert('Nenhum aluno encontrado com os critérios informados.');
    }
}

app.get('/consultar-alunos', (req, res) => {
    const { Doc_cl, num_q, status, dt_en, dt_sa } = req.query;

    let sql = "SELECT clientes.documento, quartos.numero, quartos.status AS materia, notas.nota FROM alunos LEFT JOIN notas ON alunos.cgm = notas.cgm_aluno WHERE 1=1"; // 1=1 para facilitar a construção da query
    let params = [];

    if (nome) {
        sql += " AND alunos.nome LIKE ?";
        params.push(`%${nome}%`); // Adiciona o parâmetro da busca
    }

    if (cgm) {
        sql += " AND alunos.cgm LIKE ?";
        params.push(`%${cgm}%`); // Adiciona o parâmetro da busca
    }

    if (materia) {
        sql += " AND notas.disciplina LIKE ?";
        params.push(`%${materia}%`); // Adiciona o parâmetro da busca
    }

    if (notaMin) {
        sql += " AND notas.nota >= ?";
        params.push(notaMin); // Adiciona o parâmetro da busca
    }

    if (notaMax) {
        sql += " AND notas.nota <= ?";
        params.push(notaMax); // Adiciona o parâmetro da busca
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar alunos:', err);
            return res.status(500).send('Erro ao consultar alunos.');
        }
        res.json(rows); // Retorna os alunos encontrados
    });
});
