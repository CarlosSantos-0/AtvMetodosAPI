import { useState, useEffect } from 'react';
import styles from '../PaginaAdm.module.css'; 

function VisualizarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pedidos/completos');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }
        const dados = await response.json();
        setPedidos(dados);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  if (loading) return <div className={styles.dashboard}><h1>Carregando pedidos...</h1></div>;

  // Tela de erro autoexplicativa para a avaliação do projeto
  if (error) {
    return (
      <div className={styles.formContainer}>
        <h1 style={{ color: '#c62828' }}> Erro de Conexão com a API</h1>
        
        <div className={styles.card} style={{ borderLeft: '5px solid #c62828', backgroundColor: '#fff5f5', padding: '20px' }}>
          
          <p style={{ margin: '0 0 15px 0', color: '#444', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Este componente realiza uma requisição assíncrona do tipo <strong>GET</strong> para o endpoint 
            <code>/api/pedidos/completos</code>. Como o frontend está rodando no servidor do Vercel na nuvem 
            e o banco de dados (SQLite + Flask) está na máquina local, o navegador emitirá um erro de 
            <strong> net::ERR_CONNECTION_REFUSED</strong> por não encontrar a API local rodando no computador de quem visualiza.
          </p>

          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333', fontSize: '0.95rem' }}>
            Como rodar e validar este método (GET):
          </p>
          
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <li>Certifique-se de que o servidor Flask está ativo na sua máquina (<code>python app.py</code> na porta 5000).</li>
            <li>Execute o ambiente de desenvolvimento local do React (<code>npm run dev</code>).</li>
            <li>Acesse o sistema localmente pelo endereço fornecido pelo Vite (geralmente <code>http://localhost:5173</code>) para que o frontend consiga se comunicar com a API local.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <h2>Histórico de Pedidos Disponíveis</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Itens do Pedido</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id_pedido}>
              <td>#{pedido.id_pedido}</td>
              <td><strong>{pedido.nome_cliente}</strong></td>
              <td>{pedido.data}</td>
              <td>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pedido.itens && pedido.itens.map((item, index) => (
                    <li key={index} style={{ fontSize: '0.9rem', color: '#555' }}>
                      {item.qtd_pedido}x {item.nome_produto}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <span className={`${styles.badge} ${styles[pedido.status]}`}>
                  {pedido.status}
                </span>
              </td>
              <td>
                <strong>R$ {Number(pedido.total).toFixed(2)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VisualizarPedidos;