import { useState } from 'react';
import styles from '../PaginaAdm.module.css'; 

function FormPedido() {
  const [formData, setFormData] = useState({
    data: '',
    statusPedido: '',
    total: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar pedido');
      }

      setStatus('success');
      setFormData({ data: '', statusPedido: '', total: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Registrar Novo Pedido</h1>
      
      {status === 'success' && <p style={{color: 'green'}}>Pedido registrado com sucesso!</p>}
      {status === 'error' && <p style={{color: 'red'}}>Erro ao registrar. Tente novamente.</p>}

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="date" name="data" value={formData.data} onChange={handleChange} className={styles.input} required />
          
          <select name="statusPedido" value={formData.statusPedido} onChange={handleChange} className={styles.input} required>
            <option value="">Selecione o Status</option>
            <option value="pendente">Pendente</option>
            <option value="preparando">Em Preparo</option>
            <option value="entregue">Entregue</option>
          </select>
          
          <input type="number" step="0.01" name="total" value={formData.total} onChange={handleChange} placeholder="Total (R$)" className={styles.input} required />
          
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? 'Registrando...' : 'Gerar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPedido;