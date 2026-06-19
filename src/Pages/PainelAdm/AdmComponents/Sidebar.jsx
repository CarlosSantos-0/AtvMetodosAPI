import styles from '../PaginaAdm.module.css'; 

function Sidebar({ abaAtiva, setAbaAtiva }) {
  return (
    <aside className={styles.sidebar}>
      <h2>Marmitaria Papa Da Wal</h2>

      <ul>
        <li 
          className={abaAtiva === 'clientes' ? styles.ativo : ''}
          onClick={() => setAbaAtiva('clientes')}
        >
          Cadastro de Clientes
        </li>
        <li 
          className={abaAtiva === 'produtos' ? styles.ativo : ''}
          onClick={() => setAbaAtiva('produtos')}
        >
          Cadastro de Produtos
        </li>
        <li 
          className={abaAtiva === 'pedidos' ? styles.ativo : ''}
          onClick={() => setAbaAtiva('pedidos')}
        >
          Registro de Pedidos
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;