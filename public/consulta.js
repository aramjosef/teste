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

    let sql = `
        SELECT 
            clientes.documento AS Doc_cl,
            quartos.numero AS num_q,
            quartos.status AS status,
            checkins.data_entrada AS dt_en,
            checkins.data_saida AS dt_sa
        FROM 
            clientes
        INNER JOIN checkins ON clientes.id = .cliente_id
        INNER JOIN checkins ON clientes.id = checkins.cliente_id
        INNER JOIN quartos ON checkins.quarto_id = quartos.id
        WHERE 1=1
    `; // 1=1 permite adicionar condições dinamicamente
    const params = [];

    if (Doc_cl) {
        sql += " AND clientes.documento LIKE ?";
        params.push(`%${Doc_cl}%`);
    }

    if (num_q) {
        sql += " AND quartos.numero = ?";
        params.push(`%${num_q}%`);
    }

    if (status) {
        sql += " AND quartos.status = ?";
        params.push(`%${status}%`);
    }

    if (dt_en) {
        sql += " AND checkins.data_entrada >= ?";
        params.push(`%${dt_en}%`);
    }

    if (dt_sa) {
        sql += " AND checkins.data_saida <= ?";
        params.push(`%${dt_sa}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar clientes:', err);
            return res.status(500).send('Erro ao consultar clientes.');
        }
        res.json(rows);
    });
});