import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuDashboardService {

  constructor() { }

  /*MENU */
  home = { 'name': 'Dashboard', 'url': '/home' }
  sales = { 'name': 'Penjualan', 'url': '/dashboard-sales' }
  inventory = { 'name': 'Inventory', 'url': '/dashboard-inventory' }
  master = { 'name': 'Data Master', 'url': '/dashboard-master' }
  ledger = { 'name': 'Buku Besar', 'url': '/dashboard-ledger' }
  purchase = { 'name': 'Pembelian', 'url': '/dashboard-purchase' }
  cashBank = { 'name': 'Kas & Bank', 'url': '/dashboard-cash-bank' }
  report = { 'name': 'Laporan', 'url': '/dashboard-report' }

  /*SUB SALES */
  subSalesQuotation = { 'name': 'Penawaran Harga', 'url': '/sales-quotation' }
  subSalesOrder = { 'name': 'Pesanan Penjualan', 'url': '/sales-order' }
  subSalesDelivery = { 'name': 'Pengiriman Barang', 'url': '/delivery-order' }
  subSalesRetur = { 'name': 'Retur Penjualan', 'url': '/retur-order' }
  subSalesCancel = { 'name': 'Pembatalan Pesanan', 'url': '/cancel-order' }
  subSalesReceipt = { 'name': 'Penerimaan Barang Retur', 'url': '/return-receipt-order' }
  subSalesDeliveryReturn = { 'name': 'Pengiriman Barang Retur', 'url': '/return-goods-delivery' }
  subSalesReceivable = { 'name': 'Daftar Piutang Usaha', 'url': '#' }
  subSalesReceivablePayment = { 'name': 'Pembayaran Piutang', 'url': '#' }

  /*SUB Inventory */
  subInventoryProduct = { 'name': 'Data Produk', 'url': '/product-data' }
  subInventoryLogistic = { 'name': 'Data Logistik', 'url': '/logistics-data' }
  subInventorySummary = { 'name': 'Ringkasan Inventory', 'url': '/inventory-summary' }
  subInventoryAdjustment = { 'name': 'Penyesuaian Inventory', 'url': '/inventory-adjustment' }
  subInventoryPlanOpname = { 'name': 'Perintah Stok Opname', 'url': '/plan-stock-opname' }
  subInventoryResutlOpname = { 'name': 'Hasil Stok Opname', 'url': '/result-stock-opname' }
  subInventoryBOM = { 'name': 'Bill of Material', 'url': '/bill-of-material' }

  /*SUB MASTER */
  subMasterContact = { 'name': 'Data Kontak', 'url': '/contact/customer' }
  subMasterSupplier = { 'name': 'Data Supplier', 'url': '/contact' }
  subMasterSales = { 'name': 'Data Sales', 'url': '/contact' }
  subMasterWarehouse = { 'name': 'Data Gudang', 'url': '/warehouse-data' }
  subMasterBrand = { 'name': 'Data Brand', 'url': '/brand-data' }
  subMasterCategoryProduct = { 'name': 'Data Kategori', 'url': '/category-data' }

  /*SUB PURCHASE */
  subPurchaseQuotation = { 'name': 'Quotation Request', 'url': '#' }
  subPurchaseOrder = { 'name': 'Purchase Order', 'url': '#' }
  subPurchaseReceipt = { 'name': 'Purchase Receipt', 'url': '#' }


  public menu() {
    let lg = localStorage.getItem('language')
    let id = 0;
    let data: any = {}

    if (lg == null) {
      lg = "0"
    }
    if (lg != id.toString()) {
    } else {
      data['header'] = [
        { 'id': "1", 'active': "active", 'name': this.home['name'], 'url': this.home['url'] },
        { 'id': "2", 'active': "", 'name': this.master['name'], 'url': this.master['url'] },
        { 'id': "3", 'active': "", 'name': this.ledger['name'], 'url': this.ledger['url'] },
        { 'id': "4", 'active': "", 'name': this.sales['name'], 'url': this.sales['url'] },
        { 'id': "5", 'active': "", 'name': this.purchase['name'], 'url': this.purchase['url'] },
        { 'id': "6", 'active': "", 'name': this.cashBank['name'], 'url': this.cashBank['url'] },
        { 'id': "7", 'active': "", 'name': this.inventory['name'], 'url': this.inventory['url'] },
        { 'id': "8", 'active': "", 'name': this.report['name'], 'url': this.report['url'] },
      ]
      /*CONTACT AND BREADCRUMB */
      data['menuMaster'] = [
        {
          'id': 1, 'color': '#FF785B', 'name': this.subMasterContact['name'], 'url': this.master['url'] + this.subMasterContact['url'],
          'icon': 'assets/img/sub-menu/master/money.svg', 'desc': 'Data Kontak', 'active': 'active'
        },
        {
          'id': 2, 'color': '#FF785B', 'name': this.subMasterBrand['name'], 'url': this.master['url'] + this.subMasterBrand['url'],
          'icon': 'assets/img/sub-menu/master/bill.svg', 'desc': 'Data Brand', 'active': ''
        },
        {
          'id': 2, 'color': '#FF785B', 'name': "Satuan Pengukuran", 'url': "#",
          'icon': 'assets/img/sub-menu/master/shipping.svg', 'desc': 'Satuan Pengukuran', 'active': ''
        },
        {
          'id': 2, 'color': '#FF785B', 'name': this.subMasterCategoryProduct['name'], 'url': this.master['url'] + this.subMasterCategoryProduct['url'],
          'icon': 'assets/img/sub-menu/master/order.svg', 'desc': 'Data Kategori Produk', 'active': ''
        },
        {
          'id': 2, 'color': '#FF785B', 'name': this.subMasterWarehouse['name'], 'url': this.master['url'] + this.subMasterWarehouse['url'],
          'icon': 'assets/img/sub-menu/master/purchase.svg', 'desc': 'Data Gudang', 'active': ''
        },
      ]
      /*CONTACT */
      data['brd-customer'] = [
        { 'id': 2, 'name': this.master['name'], 'url': this.master['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subMasterContact['name'], 'url': this.master['url'] + this.subMasterContact['url'], 'active': 'true', 'img': '', 'color': '#696969' },
      ]
      data['brd-warehouse'] = [
        { 'id': 2, 'name': this.master['name'], 'url': this.master['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subMasterWarehouse['name'], 'url': this.master['url'] + this.subMasterWarehouse['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Gudang', 'url': this.master['url'] + this.subMasterWarehouse['url'] + '/create-warehouse', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-brand'] = [
        { 'id': 2, 'name': this.master['name'], 'url': this.master['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subMasterBrand['name'], 'url': this.master['url'] + this.subMasterBrand['url'], 'active': 'true', 'img': '', 'color': '#696969' },
      ]
      data['brd-category-product'] = [
        { 'id': 2, 'name': this.master['name'], 'url': this.master['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Data Kategori', 'url': this.master['url'] + this.subMasterCategoryProduct['url'], 'active': 'true', 'img': '', 'color': '#696969' },
      ]

      /*INVENTORY AND BREADCRUMB */
      data['menuInventory'] = [
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventoryProduct['name'], 'url': this.inventory['url'] + this.subInventoryProduct['url'], 'icon': 'assets/img/sub-menu/master/add.svg', 'desc': 'Data Produk', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventorySummary['name'], 'url': this.inventory['url'] + this.subInventorySummary['url'], 'icon': 'assets/img/sub-menu/master/bill.svg', 'desc': 'Ringkasan Inventory', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventoryAdjustment['name'], 'url': this.inventory['url'] + this.subInventoryAdjustment['url'], 'icon': 'assets/img/sub-menu/master/shipping.svg', 'desc': 'Penyesuaian Inventory', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventoryPlanOpname['name'], 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'], 'icon': 'assets/img/sub-menu/master/order.svg', 'desc': 'Perintah Stock Opname', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventoryResutlOpname['name'], 'url': this.inventory['url'] + this.subInventoryResutlOpname['url'], 'icon': 'assets/img/sub-menu/master/order.svg', 'desc': 'Hasil Stock Opname', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': "Pindah Gudang", 'url': "#", 'icon': 'assets/img/sub-menu/master/purchase.svg', 'desc': 'Pindah Gudang', 'active': 'active' },
        { 'id': 1, 'color': '#FF785B', 'name': this.subInventoryBOM['name'], 'url': this.inventory['url'] + this.subInventoryBOM['url'], 'icon': 'assets/img/sub-menu/master/add.svg', 'desc': this.subInventoryBOM['name'], 'active': 'active' },
      ]

      /*INVENTORY */
      data['brd-logistic'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Logistik', 'url': this.inventory['url'] + this.subInventoryLogistic['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Logistic', 'url': this.inventory['url'] + this.subInventoryLogistic['url'] + '/create-logistics', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-product'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Data Produk', 'url': this.inventory['url'] + this.subInventoryProduct['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Produk', 'url': this.inventory['url'] + this.subInventoryProduct['url'] + '/create-product', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-bom'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subInventoryBOM['name'], 'url': this.inventory['url'] + this.subInventoryBOM['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Bill Of Material', 'url': this.inventory['url'] + this.subInventoryBOM['url'] + '/create', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-summary'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Ringkasan Data Produk', 'url': this.inventory['url'] + this.subInventorySummary['url'], 'active': 'true', 'img': '', 'color': '#696969' },
      ]
      data['brd-adjustment'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Penyesuaian Barang', 'url': this.inventory['url'] + this.subInventoryAdjustment['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Penyesuaian Barang', 'url': this.inventory['url'] + this.subInventoryAdjustment['url'] + '/create-inventory-adjustment', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-detail-adjustment'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Penyesuaian Barang', 'url': this.inventory['url'] + this.subInventoryAdjustment['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Detil Penyesuaian Barang', 'url': this.inventory['url'] + this.subInventoryAdjustment['url'] + '/detail-inventory-adjustment', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-plan-opname'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'] + '/create-opname-plan', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-detil-plan-opname'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Detail Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'] + '/detail-opname-plane', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-edit-plan-opname'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Edit Perintah Stok Opname', 'url': this.inventory['url'] + this.subInventoryPlanOpname['url'] + '/edit-opname-plane', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-res-opname'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Hasil Stok Opname', 'url': this.inventory['url'] + this.subInventoryResutlOpname['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Stok Opname', 'url': this.inventory['url'] + this.subInventoryResutlOpname['url'] + '/create-stock-opname', 'active': '', 'img': '', 'color': '#696969' },
      ]
      data['brd-detil-result-opname'] = [
        { 'id': 2, 'name': this.inventory['name'], 'url': this.inventory['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Hasil Stok Opname', 'url': this.inventory['url'] + this.subInventoryResutlOpname['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Detail Hasil Stok Opname', 'url': this.inventory['url'] + this.subInventoryResutlOpname['url'] + '/detail-opname-result', 'active': '', 'img': '', 'color': '#696969' },
      ]

      /*SALES AND BREADCRUMB*/
      data['menuSales'] = [
        { 'id': 0, 'color': '#FF785B', 'name': this.subSalesQuotation['name'], 'url': this.sales['url'] + this.subSalesQuotation['url'], 'icon': 'assets/img/sub-menu/master/money.svg', 'desc': this.subSalesQuotation['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesOrder['name'], 'url': this.sales['url'] + this.subSalesOrder['url'], 'icon': 'assets/img/sub-menu/master/bill.svg', 'desc': this.subSalesOrder['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesDelivery['name'], 'url': this.sales['url'] + this.subSalesDelivery['url'], 'icon': 'assets/img/sub-menu/master/shipping.svg', 'desc': this.subSalesDelivery['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesRetur['name'], 'url': this.sales['url'] + this.subSalesRetur['url'], 'icon': 'assets/img/sub-menu/master/order.svg', 'desc': this.subSalesRetur['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesReceipt['name'], 'url': this.sales['url'] + this.subSalesReceipt['url'], 'icon': 'assets/img/sub-menu/master/purchase.svg', 'desc': this.subSalesReceipt['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesDeliveryReturn['name'], 'url': this.sales['url'] + this.subSalesDeliveryReturn['url'], 'icon': 'assets/img/sub-menu/master/list.svg', 'desc': this.subSalesDeliveryReturn['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesReceivable['name'], 'url': this.sales['url'] + this.subSalesReceivable['url'], 'icon': 'assets/img/sub-menu/master/payment.svg', 'desc': this.subSalesReceivable['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesReceivablePayment['name'], 'url': this.sales['url'] + this.subSalesReceivablePayment['url'], 'icon': 'assets/img/sub-menu/master/save-money.svg', 'desc': this.subSalesReceivablePayment['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subSalesCancel['name'], 'url': this.sales['url'] + this.subSalesCancel['url'], 'icon': 'assets/img/sub-menu/master/purchase.svg', 'desc': this.subSalesCancel['name'] },
      ]
      /*BREADCRUMB QUOTATION */
      data['brd-quotation'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Penawaran Harga', 'url': this.sales['url'] + this.subSalesQuotation['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Penawaran Harga', 'url': this.sales['url'] + this.subSalesQuotation['url'] + '/create-quotation', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB DELIVERY */
      data['brd-delivery'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Pengiriman Barang', 'url': this.sales['url'] + this.subSalesDelivery['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Pengiriman Barang', 'url': this.sales['url'] + this.subSalesDelivery['url'] + '/create-delivery', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB ORDER */
      data['brd-order'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Pesanan Penjualan', 'url': this.sales['url'] + this.subSalesOrder['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Pesanan Penjualan', 'url': this.sales['url'] + this.subSalesOrder['url'] + '/create-order', 'active': '', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Proses Pembayaran (PREVIEW)', 'url': this.sales['url'] + this.subSalesOrder['url'] + '/create-order', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB REUTUR */
      data['brd-retur'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': 'Retur Penjualan', 'url': this.sales['url'] + this.subSalesRetur['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah Retur Penjualan', 'url': this.sales['url'] + this.subSalesRetur['url'] + '/create-retur', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB CANCEL ORDER */
      data['brd-cancel-order'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subSalesCancel['name'], 'url': this.sales['url'] + this.subSalesCancel['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah ' + this.subSalesCancel['name'], 'url': this.sales['url'] + this.subSalesCancel['url'] + '/create-cancel-order', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB RECEIPT OF RETURN GOODS */
      data['brd-receipt-order'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subSalesReceipt['name'], 'url': this.sales['url'] + this.subSalesReceipt['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah ' + this.subSalesReceipt['name'], 'url': this.sales['url'] + this.subSalesReceipt['url'] + '/create-return-goods', 'active': '', 'img': '', 'color': '#696969' },
      ]
      /*BREADCRUMB RETURN GOODS DELIVERY */
      data['brd-return-delivery'] = [
        { 'id': 2, 'name': this.sales['name'], 'url': this.sales['url'], 'active': 'true', 'img': 'true', 'color': '#696969' },
        { 'id': 3, 'name': this.subSalesDeliveryReturn['name'], 'url': this.sales['url'] + this.subSalesDeliveryReturn['url'], 'active': 'true', 'img': '', 'color': '#696969' },
        { 'id': 4, 'name': 'Tambah ' + this.subSalesDeliveryReturn['name'], 'url': this.sales['url'] + this.subSalesDeliveryReturn['url'] + '/create-return-goods-delivery', 'active': '', 'img': '', 'color': '#696969' },
      ]

      /*PURCHASE AND BREADCRUMB */
      data['menuPurchase'] = [
        { 'id': 0, 'color': '#FF785B', 'name': this.subPurchaseQuotation['name'], 'url': this.purchase['url'] + this.subPurchaseQuotation['url'], 'icon': 'assets/img/sub-menu/master/money.svg', 'desc': this.subPurchaseQuotation['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subPurchaseOrder['name'], 'url': this.purchase['url'] + this.subPurchaseOrder['url'], 'icon': 'assets/img/sub-menu/master/bill.svg', 'desc': this.subPurchaseOrder['name'] },
        { 'id': 1, 'color': '#FF785B', 'name': this.subPurchaseReceipt['name'], 'url': this.purchase['url'] + this.subPurchaseReceipt['url'], 'icon': 'assets/img/sub-menu/master/shipping.svg', 'desc': this.subPurchaseReceipt['name'] },
      ]

    }
    return data
  }
}
