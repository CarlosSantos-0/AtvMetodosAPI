import { useState } from 'react';
import styles from '../PaginaAdm.module.css'; 

function FormPedido() {
  const [formData, setFormData] = useState({
    id_cliente: '', 
    data: '',
    status: '',     
    total: ''
  });
  const [statusSubmit, setStatusSubmit] = useState('idle'); 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusSubmit('loading');

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar pedido');
      }

      setStatusSubmit('success');
      setFormData({ id_cliente: '', data: '', status: '', total: '' });
    } catch (error) {
      setStatusSubmit('error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Registrar Novo Pedido</h1>
      
      {statusSubmit === 'success' && <p style={{color: 'green'}}>Pedido registrado com sucesso!</p>}
      {statusSubmit === 'error' && <p style={{color: 'red'}}>Erro ao registrar. Verifique se o ID do cliente existe.</p>}

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <input type="number" name="id_cliente" value={formData.id_cliente} onChange={handleChange} placeholder="ID do Cliente (Ex: 1)" className={styles.input} required />
          
          <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', display: 'block' }}>
            *Atenção: Cadastre um cliente primeiro na aba "Usuários/Clientes". O banco de dados exigirá um ID válido (ex: 1) para manter a integridade do pedido.
          </small>

          <input type="date" name="data" value={formData.data} onChange={handleChange} className={styles.input} required />
          
          <select name="status" value={formData.status} onChange={handleChange} className={styles.input} required>
            <option value="">Selecione o Status</option>
            <option value="pendente">Pendente</option>
            <option value="preparando">Em Preparo</option>
            <option value="entregue">Entregue</option>
          </select>
          
          <input type="number" step="0.01" name="total" value={formData.total} onChange={handleChange} placeholder="Total (R$)" className={styles.input} required />
          
          <button type="submit" className={styles.button} disabled={statusSubmit === 'loading'}>
            {statusSubmit === 'loading' ? 'Registrando...' : 'Gerar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPedido;