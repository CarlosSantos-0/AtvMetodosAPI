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
  if (error) return <div className={styles.dashboard}><h1 style={{ color: 'red' }}>Erro ao carregar pedidos.</h1></div>;

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