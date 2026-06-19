import { useState } from 'react';
import styles from '../PaginaAdm.module.css'; 

function FormProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    descricao: ''
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
      const response = await fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar produto');
      }

      setStatus('success');
      setFormData({ nome: '', tipo: '', descricao: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Cadastrar Produto (Marmita)</h1>
      
      {status === 'success' && <p style={{color: 'green'}}>Produto cadastrado com sucesso!</p>}
      {status === 'error' && <p style={{color: 'red'}}>Erro ao cadastrar. Tente novamente.</p>}

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome do Produto" className={styles.input} required />
          <input type="text" name="tipo" value={formData.tipo} onChange={handleChange} placeholder="Tipo (ex: Tradicional, Fit, Vegana)" className={styles.input} required />
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição dos ingredientes" className={styles.input} rows="4"></textarea>
          
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormProduto;