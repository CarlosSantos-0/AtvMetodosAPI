import { useState } from 'react';
import styles from '../PaginaAdm.module.css'; 

function FormCliente() {
    // Criando o formato do arquivo para enviar
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    senha: ''
  });
  const [status, setStatus] = useState('idle');

  //Atualizando o form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  //Atualizando o form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    //Fetch da API
    try {
        //Não lembro exatamente mais acho que é aqui que a gente define aquela parte de URL
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
            //Enviando qual o formato
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar cliente');
      }

      setStatus('success');
      setFormData({ nome: '', email: '', telefone: '', endereco: '', senha: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Cadastrar Cliente</h1>
      
      {status === 'success' && <p style={{color: 'green'}}>Cliente cadastrado com sucesso!</p>}
      {status === 'error' && <p style={{color: 'red'}}>Erro ao cadastrar. Tente novamente.</p>}

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" className={styles.input} required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={styles.input} required />
          <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" className={styles.input} />
          <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" className={styles.input} />
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" className={styles.input} required />
          
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormCliente;