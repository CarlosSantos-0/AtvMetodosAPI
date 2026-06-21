import { useState } from 'react';
import styles from '../PaginaAdm.module.css'; 
import Sidebar from "../AdmComponents/Sidebar";
import FormCliente from "../AdmComponents/FormCliente";
import FormProduto from "../AdmComponents/FormProduto";
import FormPedido from "../AdmComponents/FormPedido";
import VisualizarPedidos from "../AdmComponents/VisualizarPedidos"; 

function PaginaAdm() {
  const [abaAtiva, setAbaAtiva] = useState('clientes');

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'clientes':
        return <FormCliente />;
      case 'produtos':
        return <FormProduto />;
      case 'pedidos':
        return <FormPedido />;
      case 'listar_pedidos': 
        return <VisualizarPedidos />;
      default:
        return <FormCliente />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />
      <main className={styles.dashboard}>
        {renderizarConteudo()}
      </main>
    </div>
  );
}

export default PaginaAdm;