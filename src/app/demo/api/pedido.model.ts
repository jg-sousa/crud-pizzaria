import { Cliente } from './cliente.model'; // Ajuste o caminho se o modelo Cliente estiver em outro diretório
import { Pizza } from './pizza.model'; // Ajuste o caminho se o modelo Pizza estiver em outro diretório

/**
 * Interface Pedido
 * Representa a estrutura de um pedido feito por um cliente.
 */
export interface Pedido {
    id?: string;          // ID opcional, gerado pelo banco de dados (ex: Firebase)
    cliente: Cliente;     // Cliente associado ao pedido
    itens: Pizza[];       // Lista de pizzas incluídas no pedido
    total: number;        // Valor total do pedido
    dataPedido: Date;     // Data em que o pedido foi realizado
}
