import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/demo/api/pedido.model';
import { Cliente } from 'src/app/demo/api/cliente.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PedidoService } from 'src/app/demo/service/pedido.service';
import { ClienteService } from 'src/app/demo/service/cliente.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Product } from 'src/app/demo/api/product';

@Component({
    templateUrl: './pedido.component.html',
    providers: [MessageService],
})
export class PedidoComponent implements OnInit {
    pedidoDialog: boolean = false;
    deletePedidoDialog: boolean = false;
    deletePedidosDialog: boolean = false;

    pedidos: Pedido[] = [];
    clientes: Cliente[] = []; // Lista de clientes
    itens: Product[] = []; // Lista de produtos

    pedido: Pedido = this.createEmptyPedido();
    selectedPedidos: Pedido[] = [];

    submitted: boolean = false;

    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private pedidoService: PedidoService,
        private clienteService: ClienteService,
        private productService: ProductService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Carrega produtos
        this.productService.getProducts().subscribe((data) => {
            this.itens = data.map((product) => ({
                ...product,
                id: product.key, // Inclui a chave gerada se necessário
            }));
            console.log('Itens carregados:', this.itens); // Debug para verificar carregamento
        });

        // Carrega clientes
        this.clienteService.getClientes().subscribe((data) => {
            this.clientes = data;
        });

        // Carrega pedidos
        this.pedidoService.getPedidos().subscribe((data) => {
            this.pedidos = data;
        });
    }

    openNew() {
        this.pedido = this.createEmptyPedido();
        this.submitted = false;
        this.pedidoDialog = true;
    }

    deleteSelectedPedidos() {
        this.deletePedidosDialog = true;
    }

    editPedido(pedido: Pedido) {
        this.pedido = { ...pedido }; // Cópia para evitar alterar diretamente os dados
        this.pedidoDialog = true;
    }

    deletePedido(pedido: Pedido) {
        this.deletePedidoDialog = true;
        this.pedido = { ...pedido };
    }

    confirmDeleteSelected() {
        this.deletePedidosDialog = false;
        this.pedidoService.deletePedido(this.pedido.id).then(() => {
            this.pedidos = this.pedidos.filter((val) => !this.selectedPedidos.includes(val));
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedidos excluídos', life: 3000 });
            this.selectedPedidos = [];
        });
    }

    confirmDelete() {
        this.deletePedidoDialog = false;
        this.pedidoService.deletePedido(this.pedido.id).then(() => {
            this.pedidos = this.pedidos.filter((val) => val.id !== this.pedido.id);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido excluído', life: 3000 });
            this.pedido = this.createEmptyPedido();
        });
    }

    hideDialog() {
        this.pedidoDialog = false;
        this.submitted = false;
    }

    savePedido() {
        this.submitted = true;

        if (this.pedido.cliente && this.pedido.itens && this.pedido.itens.length > 0) {
            // Calcula o total com base nos preços dos itens
            this.pedido.total = this.pedido.itens.reduce((sum, product) => sum + product.price, 0);

            if (this.pedido.id) {
                // Atualiza pedido existente
                this.pedidoService.updatePedido(this.pedido.id, this.pedido).then(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido atualizado', life: 3000 });
                    this.pedidos = this.pedidos.map((val) => (val.id === this.pedido.id ? this.pedido : val));
                });
            } else {
                // Cria novo pedido
                this.pedidoService.createPedido(this.pedido).then((response) => {
                    this.pedido.id = response.key; // Firebase gera a chave
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido criado', life: 3000 });
                    this.pedidos.push({ ...this.pedido });
                });
            }

            this.pedidoDialog = false;
            this.pedido = this.createEmptyPedido();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Cliente e itens são obrigatórios.',
                life: 3000,
            });
        }
    }

    createEmptyPedido(): Pedido {
        return {
            cliente: null,
            itens: null,
            total: 0,
            dataPedido: new Date(),
        };
    }

    createId(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    debugItens() {
        console.log('Available Products:', this.itens);
        console.log('Selected Itens:', this.pedido.itens);
    }
}
