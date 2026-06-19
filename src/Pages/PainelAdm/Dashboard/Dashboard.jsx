import styles from '../PaginaAdm.module.css'; 

import StatCard from "../AdmComponents/StatCard";
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";

function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <h1>Dashboard</h1>

      <div className={styles.cards}>
        <StatCard
          titulo="Usuários"
          valor="30"
          icon={<FaUsers />}
        />

        <StatCard
          titulo="Pedidos"
          valor="50"
          icon={<FaShoppingCart />}
        />

        <StatCard
          titulo="Produtos"
          valor="15"
          icon={<FaBox />}
        />

        <StatCard
          titulo="Vendas"
          valor="R$ 1.800"
          icon={<FaDollarSign />}
        />
      </div>
    </main>
  );
}

export default Dashboard;